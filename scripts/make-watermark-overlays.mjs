/**
 * 从七周年海报 JPG 源图重建「白色叠加层」（透明底 WebP）。
 *
 * 用法：node scripts/make-watermark-overlays.mjs
 *
 * 原理：海报是纯黑底 + 纯白元素的二值图形，逐像素做
 *   alpha = max(R,G,B)（抗锯齿灰度自然保留为半透明），RGB = 白；
 *   黑色 → 全透明。二维码卡片区域例外：保留原始像素并强制不透明
 *   （黑码白底蓝标浮在照片上，保证任何背景下可扫）。
 *
 * ⚠️ 真实资产替换路径：设计师从 PSD 导出「隐藏黑色背景层 + @昵称层」的
 * 透明 PNG 后，直接覆盖 public/templates/ 下同名文件即可（二维码卡片
 * 需保留白色底或由我们后期在该区域垫白）。本脚本产物为 PSD 导出前的
 * 高保真临时层。
 *
 * 源图：scripts/assets/watermark/*.jpg（微信导出的成品海报 JPG，
 * 超过 500KB 入库线的已用 mozjpeg 重压缩，黑白图形无损观感）。
 */
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const OUT_DIR = 'public/templates';
const ALPHA_NOISE_FLOOR = 14; // JPEG 黑区噪声阈值

const SOURCES = [
  {
    name: '竖版',
    src: 'scripts/assets/watermark/seeker-7th-portrait.jpg',
    out: `${OUT_DIR}/seeker-7th-portrait.webp`,
    // 二维码白卡内缩区域（保留原始像素、强制不透明）
    opaqueRects: [{ x: 1701, y: 3401, width: 201, height: 184 }],
  },
  {
    name: '横版',
    src: 'scripts/assets/watermark/seeker-7th-landscape.jpg',
    out: `${OUT_DIR}/seeker-7th-landscape.webp`,
    opaqueRects: [{ x: 2240, y: 1370, width: 129, height: 129 }],
  },
];

for (const job of SOURCES) {
  const { data, info } = await sharp(job.src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  const inRect = (x, y) =>
    job.opaqueRects.some(
      (r) => x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height,
    );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const o = (y * width + x) * 4;
      if (inRect(x, y)) {
        // 二维码区域：原样保留（白底黑码蓝标），强制不透明
        out[o] = data[i];
        out[o + 1] = data[i + 1];
        out[o + 2] = data[i + 2];
        out[o + 3] = 255;
      } else {
        // 白色元素 → 白色 + 亮度 alpha；黑色 → 透明
        const a = Math.max(data[i], data[i + 1], data[i + 2]);
        const clean = a < ALPHA_NOISE_FLOOR ? 0 : a;
        out[o] = 255;
        out[o + 1] = 255;
        out[o + 2] = 255;
        out[o + 3] = clean;
      }
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 95 })
    .toFile(job.out);

  const { size } = await stat(job.out);
  const kb = (size / 1024).toFixed(1);
  if (size > 500 * 1024) {
    throw new Error(`${job.out} ${kb}KB 超过 500KB 入库上限`);
  }

  // 校验：左上角透明、二维码中心不透明
  const check = await sharp(job.out).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => {
    const { data: d, info: inf } = check;
    return d[(y * inf.width + x) * inf.channels + 3];
  };
  if (alphaAt(10, 10) !== 0) {throw new Error(`${job.out} 背景未透明`);}
  const qr = job.opaqueRects[0];
  if (alphaAt(qr.x + (qr.width >> 1), qr.y + (qr.height >> 1)) !== 255) {
    throw new Error(`${job.out} 二维码区域未保持不透明`);
  }
  console.log(`✅ ${job.name} ${job.out} (${kb}KB)`);
}
