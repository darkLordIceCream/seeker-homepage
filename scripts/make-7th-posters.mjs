/**
 * 七周年「留光成物」成员巨片管线：去重 → WebP → 生成 manifest。
 *
 * 用法：node scripts/make-7th-posters.mjs [源目录]
 * 默认源目录：桌面「附件下载_七周年海报收集」。
 *
 * 源文件名约定：`作者昵称_时间_原图名_序号.扩展名`（成员用暗房工具制作的水印海报，
 * 部分中段带 `_seeker_7th_watermark`）。作者 = 首个 `_` 之前的内容（trim 后展示用）。
 *
 * 步骤：
 * 1. 扫描图片（jpg/jpeg/png/webp，按内容识别格式），MD5 去重（微信重复下载）
 * 2. sharp 转 WebP（q82 smartSubsample、按 EXIF 转正后剥离）——源已长约 2500px，
 *    不做缩放；画幅 ≥3 的全景按约定保留原分辨率
 * 3. 档案编号 NNN.webp 按作者名排序赋号，输出到 .posters-stage/（gitignore）
 * 4. 生成 src/data/anniversary/posters.ts：确定性 seeded 洗牌的展示顺序，
 *    首帧取洗牌后第一张竖幅（featured，与入场构图最匹配）
 *
 * 上传（成功后手动执行）：
 *   wrangler r2 object put seeker-homepage-assets/activities/7th-anniversary/posters/NNN.webp \
 *     --file .posters-stage/NNN.webp --remote --content-type image/webp \
 *     --cache-control "public, max-age=31536000, immutable"
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const DEFAULT_SRC = '/Users/donghanyuan/desktop/附件下载_七周年海报收集';
const STAGE_DIR = resolve('.posters-stage');
const MANIFEST_OUT = resolve('src/data/anniversary/posters.ts');
const R2_BASE = 'https://r2.xn--seeker-ng2jm403afb4a.club';
const R2_PREFIX = 'activities/7th-anniversary/posters';
/** 洗牌种子：七周年日 2026-09-19；展示顺序稳定，不随刷新变化 */
const SEED = 20260919;

const srcDir = resolve(process.argv[2] ?? DEFAULT_SRC);

/** mulberry32 小型确定性 PRNG */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad3 = n => String(n).padStart(3, '0');

const files = (await readdir(srcDir)).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();

console.log(`源目录：${srcDir}（${files.length} 个文件）`);

// 1. MD5 去重
const seen = new Map();
const unique = [];
let dupCount = 0;
for (const file of files) {
  const buf = await sharp(join(srcDir, file)).keepExif().toBuffer(); // 仅读取原字节流做哈希，不转码
  const hash = createHash('md5').update(buf).digest('hex');
  const prev = seen.get(hash);
  if (prev) {
    dupCount++;
    console.log(`  重复（同 MD5）跳过：${file} == ${prev}`);
    continue;
  }
  seen.set(hash, file);
  unique.push(file);
}
console.log(`去重后 ${unique.length} 张（跳过 ${dupCount} 张重复）`);

// 2. 按作者名排序赋档案编号并转 WebP（尺寸不动，EXIF 转正后剥离）
await mkdir(STAGE_DIR, { recursive: true });

const byAuthor = [...unique].sort((a, b) =>
  (a.split('_')[0] ?? '').localeCompare(b.split('_')[0] ?? '', 'zh-Hans'),
);

const posters = [];
for (let i = 0; i < byAuthor.length; i++) {
  const file = byAuthor[i];
  const no = i + 1;
  const outName = `${pad3(no)}.webp`;
  const pipe = sharp(join(srcDir, file)).rotate(); // 按 EXIF 转正（输出默认剥离元数据）
  const info = await pipe
    .webp({ quality: 82, smartSubsample: true })
    .toFile(join(STAGE_DIR, outName));
  posters.push({
    no,
    author: (file.split('_')[0] ?? '').trim(),
    src: `${R2_BASE}/${R2_PREFIX}/${outName}`,
    w: info.width,
    h: info.height,
  });
  if (no % 20 === 0) {
    console.log(`  已转换 ${no}/${byAuthor.length}`);
  }
}
console.log(`WebP 转换完成：${posters.length} 张 → ${STAGE_DIR}`);

// 3. 确定性洗牌（展示顺序）；首帧取第一张竖幅
const rand = mulberry32(SEED);
for (let i = posters.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [posters[i], posters[j]] = [posters[j], posters[i]];
}
const firstPortrait = posters.findIndex(p => p.h > p.w);
if (firstPortrait > 0) {
  const [featured] = posters.splice(firstPortrait, 1);
  posters.unshift(featured);
}

// 4. 生成 manifest（TS），展示顺序即数组顺序
const tsString = s => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const lines = posters.map(
  p => `  { src: '${p.src}', no: ${p.no}, w: ${p.w}, h: ${p.h}, author: ${tsString(p.author)} },`,
);
const authors = new Set(posters.map(p => p.author)).size;
const manifest = `/**
 * 【06 留光成物 · 成员巨片墙】七周年水印海报档案（成员用暗房工具自制）。
 * 由 scripts/make-7th-posters.mjs 生成——勿手改；重跑脚本即重建。
 * 源：${srcDir}（MD5 去重后 ${posters.length} 张 / ${authors} 位成员）。
 * 数组顺序 = 幻灯片展示顺序（seed ${SEED} 确定性洗牌，首帧为竖幅精选）；
 * no = 档案编号（R2 文件序号，按作者名排序赋号）。
 */
export interface Poster {
  /** R2 展示图（自定义域） */
  src: string;
  /** 档案编号 */
  no: number;
  w: number;
  h: number;
  /** 成员昵称（源文件名首段） */
  author: string;
}

export const POSTERS: Poster[] = [
${lines.join('\n')}
];
`;
await writeFile(MANIFEST_OUT, manifest, 'utf8');
console.log(`manifest 已生成：${MANIFEST_OUT}（${posters.length} 张 / ${authors} 位成员）`);
console.log(
  `首帧：NO.${pad3(posters[0]?.no ?? 0)} @${posters[0]?.author}（${posters[0]?.w}x${posters[0]?.h}）`,
);
console.log('下一步：wrangler 上传 .posters-stage/*.webp → R2，再逐张 curl 验证。');
