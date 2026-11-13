/**
 * 全池缩略图管线（Gallery 3.1，用户裁决：R2 除公益「带上她的眼睛」外全部
 * 图片皆可作画廊素材）：R2 原图 → 长边 960 WebP q82 → R2
 * `thumbs/<原 key 去扩展名>.webp` 镜像（gallery/Feiyu.jpg → thumbs/gallery/Feiyu.webp，
 * activities/2026-01/01.webp → thumbs/activities/2026-01/01.webp）。
 * 档案馆网格用缩略图，原图只进灯箱——2100+ 张 2560px 原图直进格子是
 * 「一次几十 MB 的加载」，不是展览级体验。
 *
 * 池范围与 src/data/gallery.ts 的 ARCHIVE_POOL 保持一致：
 * - gallery/*.jpg（问卷精选 33）
 * - activities/**（活动期数 + 追光之旅；剔除画幅 ≥3 或 ≤1/3 的长卷条幅）
 * - 不含 welfare/**（公益「带上她的眼睛」素材，用户明令排除）
 *
 * 用法：
 *   node scripts/make-gallery-thumbs.mjs            # 下载原图 → .gallery-thumbs-stage/
 *   node scripts/make-gallery-thumbs.mjs --upload   # 生成后逐个上传 R2
 *
 * ⚠️ R2 immutable 缓存坑：同 key 重传后 CDN 可能仍返旧内容。本管线只写
 * 首次 key；若改参数重新生成，请换目录（如 thumbs-v2/）勿原地覆盖。
 *
 * 上传命令（与 AGENTS.md 约定一致）：
 *   wrangler r2 object put seeker-homepage-assets/thumbs/<key>.webp \
 *     --file <f> --remote --content-type image/webp \
 *     --cache-control "public, max-age=31536000, immutable"
 */
import { exec as execCb } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const R2 = 'https://r2.xn--seeker-ng2jm403afb4a.club';
const BUCKET = 'seeker-homepage-assets';
const STAGE = path.resolve('.gallery-thumbs-stage');
const LONG_EDGE = 960;
const WEBP_QUALITY = 82;
const UPLOAD = process.argv.includes('--upload');

/** 池清单：[R2 key, ...]——gallery.ts 问卷层 + activity-image-meta 活动层（剔条幅） */
const keys = [
  // 问卷精选 33：src/data/gallery.ts 内 /gallery/<名>.jpg
  ...(await readFile('src/data/gallery.ts', 'utf8').then(t =>
    [...t.matchAll(/\/gallery\/([^"`]+?)\.jpg/g)].map(m => `gallery/${m[1]}.jpg`),
  )),
  // 活动层：activity-image-meta.ts 全 key，剔画幅 ≥3 或 ≤1/3 长卷
  ...(await readFile('src/lib/activity-image-meta.ts', 'utf8').then(t =>
    [...t.matchAll(/'(activities\/[^']+)': \{ w: (\d+), h: (\d+) \}/g)]
      .filter(([, , w, h]) => {
        const ar = Number(w) / Number(h);
        return ar < 3 && ar > 1 / 3;
      })
      .map(([, k]) => k),
  )),
];

const unique = [...new Set(keys)];
if (unique.length < 2000) {
  throw new Error(`池解析异常：仅 ${unique.length} 项（预期 ~2150）——检查正则与数据文件`);
}
console.log(`全池 ${unique.length} 张（thumbs/<key>.webp 镜像）`);

await mkdir(STAGE, { recursive: true });

/** 简易并发池（上传 20 / 生成 8 worker），任一失败即抛出 */
async function pool(items, worker, width = 8) {
  let i = 0;
  let ok = 0;
  const run = async () => {
    while (i < items.length) {
      const item = items[i++];
      await worker(item);
      ok++;
      if (ok % 100 === 0 || ok === items.length) {
        console.log(`[${ok}/${items.length}]`);
      }
    }
  };
  await Promise.all(Array.from({ length: width }, run));
}

const thumbPathOf = key => key.replace(/\.(jpg|jpeg|png)$/i, '.webp');

console.log('生成缩略图…');
await pool(unique, async key => {
  const outFile = path.join(STAGE, thumbPathOf(key));
  try {
    await writeFile(outFile, await readFile(outFile));
    return; // 断点续跑
  } catch {
    /* 首次生成 */
  }
  await mkdir(path.dirname(outFile), { recursive: true });
  const res = await fetch(`${R2}/${key.split('/').map(encodeURIComponent).join('/')}`);
  if (!res.ok) {
    throw new Error(`原图拉取失败 ${res.status}：${key}`);
  }
  const webp = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(LONG_EDGE, LONG_EDGE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  await writeFile(outFile, webp);
});

if (!UPLOAD) {
  console.log(`\n已生成 ${unique.length} 张 → ${STAGE}/（未上传，加 --upload 上传 R2）`);
  process.exit(0);
}

console.log(`\n开始上传 ${unique.length} 张到 ${BUCKET}/thumbs/ …`);
// ⚠️ 必须用异步 exec（execSync 会阻塞事件循环把并发池退化成串行，实测教训）。
// npx wrangler 每次 spawn ~2.5s，20 真并发 ≈ 8/s。单个失败不炸全局：
// 记入 failed，结尾汇总（重跑幂等续传）
const exec = promisify(execCb);
const failed = [];
await pool(
  unique,
  async key => {
    const local = path.join(STAGE, thumbPathOf(key));
    const thumbKey = `thumbs/${thumbPathOf(key)}`;
    try {
      await exec(
        `npx wrangler r2 object put ${BUCKET}/${thumbKey} --file "${local}" --remote ` +
          `--content-type image/webp --cache-control "public, max-age=31536000, immutable"`,
      );
    } catch {
      failed.push(key);
    }
  },
  20,
);
if (failed.length > 0) {
  console.error(`\n${failed.length} 张上传失败（重跑本命令幂等续传）：`, failed.slice(0, 10));
  process.exit(1);
}
console.log('\n上传完成——thumbOf() 镜像规则即刻全池生效。');
