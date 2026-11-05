/**
 * 档案馆缩略图管线（Gallery 3.0 /gallery，GalleryArtCritic P1-6）：
 * R2 原图（gallery/<名>.jpg，长边 2560 JPEG）→ 长边 960 WebP q82 →
 * R2 `gallery/thumbs/<名>.webp`。档案馆网格用缩略图，原图只进灯箱——
 * 33 张 2560px 原图直进几百像素的格子 ≈ 一次 20MB 的加载，不是展览级体验。
 *
 * 用法：
 *   node scripts/make-gallery-thumbs.mjs            # 下载原图 → 生成 .gallery-thumbs-stage/
 *   node scripts/make-gallery-thumbs.mjs --upload   # 生成后逐个上传 R2
 *
 * ⚠️ R2 immutable 缓存坑（见 memory）：同 key 重传后 CDN 可能仍返旧内容。
 * 本脚本只写新 key（gallery/thumbs/ 首次生成安全）；若改参数重新生成并
 * 上传，请换目录（如 gallery/thumbs-v2/）或改文件名，勿原地覆盖。
 *
 * 上传命令（与 AGENTS.md 约定一致）：
 *   wrangler r2 object put seeker-homepage-assets/gallery/thumbs/<名>.webp \
 *     --file <f> --remote --content-type image/webp \
 *     --cache-control "public, max-age=31536000, immutable"
 */
import { execSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const R2 = 'https://r2.xn--seeker-ng2jm403afb4a.club';
const BUCKET = 'seeker-homepage-assets';
const STAGE = path.resolve('.gallery-thumbs-stage');
const LONG_EDGE = 960;
const WEBP_QUALITY = 82;
const UPLOAD = process.argv.includes('--upload');

/** 从 src/data/gallery.ts 抽全部作品文件名（不含扩展名） */
const names = await readFile('src/data/gallery.ts', 'utf8').then(t => [
  ...new Set([...t.matchAll(/\/gallery\/([^"`]+?)\.jpg/g)].map(m => decodeURIComponent(m[1]))),
]);
if (names.length === 0) {
  throw new Error('未从 gallery.ts 解析到任何作品——检查正则与数据文件');
}
console.log(`共 ${names.length} 件作品`);

await mkdir(STAGE, { recursive: true });

let done = 0;
for (const name of names) {
  const outFile = path.join(STAGE, `${name}.webp`);
  try {
    await writeFile(outFile, await readFile(outFile));
    done++;
    continue; // 已生成过（断点续跑）
  } catch {
    /* 首次生成 */
  }
  const url = `${R2}/gallery/${encodeURIComponent(name)}.jpg`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`原图拉取失败 ${res.status}：${url}`);
  }
  const webp = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(LONG_EDGE, LONG_EDGE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  await writeFile(outFile, webp);
  done++;
  const kb = Math.round(webp.byteLength / 102.4) / 10;
  console.log(`[${done}/${names.length}] ${name}.webp ${kb}KB`);
}

if (!UPLOAD) {
  console.log(`\n已生成 ${done} 张 → ${STAGE}/（未上传，加 --upload 上传 R2）`);
  process.exit(0);
}

const files = (await readdir(STAGE)).filter(f => f.endsWith('.webp'));
console.log(`\n开始上传 ${files.length} 张到 ${BUCKET}/gallery/thumbs/ ...`);
for (const f of files) {
  const key = `gallery/thumbs/${f}`;
  execSync(
    `npx wrangler r2 object put ${BUCKET}/${key} --file "${path.join(STAGE, f)}" --remote ` +
      `--content-type image/webp --cache-control "public, max-age=31536000, immutable"`,
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  console.log(`uploaded ${key}`);
}
console.log('\n上传完成——gallery.ts 的 thumbOf() 即刻生效。');
