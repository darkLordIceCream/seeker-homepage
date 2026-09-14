/**
 * 从设计师的 PSD 导出 PNG（透明底）生成网站叠加层资产（WebP）。
 *
 * 用法：node scripts/make-watermark-overlays.mjs
 *
 * 源图：scripts/assets/watermark/seeker-7th-*-src.png
 * —— 设计师从 PSD 导出的「隐藏黑色背景层」透明 PNG（含 alpha 通道）。
 *
 * 导出图有两处需要程序修补（PSD 图层结构导致，设计本身无此意图）：
 * 1. 昵称层被烙进导出图（「© 肖默 / @肖默」）→ 在 eraseRects 内整体擦除，
 *    该位置由网站 Canvas 绘制用户输入的动态昵称；
 * 2. 二维码白色卡片是透明的（白卡与背景层编组）→ backingRects 区域
 *    垫白并强制不透明，保证黑码白底浮于任意照片上可扫。
 *
 * 若设计师更新导出图：覆盖 -src.png 后重跑本脚本即可。
 * 注意：导出时请隐藏「昵称」图层，否则依赖本脚本的擦除坐标。
 */
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const OUT_DIR = 'public/templates';

const SOURCES = [
  {
    name: '竖版',
    src: 'scripts/assets/watermark/seeker-7th-portrait-src.png',
    out: `${OUT_DIR}/seeker-7th-portrait.webp`,
    /** 擦除区域（烙入的昵称），alpha 清零 */
    eraseRects: [{ x: 1320, y: 1650, width: 142, height: 52 }],
    /** 垫白区域（二维码白卡），强制不透明白底 */
    backingRects: [{ x: 1698, y: 3398, width: 208, height: 193 }],
  },
  {
    name: '横版',
    src: 'scripts/assets/watermark/seeker-7th-landscape-src.png',
    out: `${OUT_DIR}/seeker-7th-landscape.webp`,
    eraseRects: [{ x: 832, y: 970, width: 118, height: 52 }],
    backingRects: [{ x: 2237, y: 1367, width: 136, height: 136 }],
  },
];

function inRect(x, y, r) {
  return x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height;
}

for (const job of SOURCES) {
  const { data, info } = await sharp(job.src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.from(data); // 直通 alpha（straight），只修补目标区域

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (job.eraseRects.some((r) => inRect(x, y, r))) {
        out[i + 3] = 0;
      } else if (job.backingRects.some((r) => inRect(x, y, r))) {
        // 垫白：透明/半透明像素取纯白，全部强制不透明（黑码与蓝标原样保留）
        if (data[i + 3] < 250) {
          out[i] = 255;
          out[i + 1] = 255;
          out[i + 2] = 255;
        }
        out[i + 3] = 255;
      }
    }
  }

  // 无损 WebP：二维码模块边缘零损耗，保证可扫
  await sharp(out, { raw: { width, height, channels: 4 } })
    .webp({ lossless: true, alphaQuality: 100 })
    .toFile(job.out);

  const { size } = await stat(job.out);
  const kb = (size / 1024).toFixed(1);
  if (size > 500 * 1024) {
    throw new Error(`${job.out} ${kb}KB 超过 500KB 入库上限`);
  }

  // 校验：背景透明、昵称区已清空、二维码不透明
  const check = await sharp(job.out).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => {
    const { data: d, info: inf } = check;
    return d[(y * inf.width + x) * inf.channels + 3];
  };
  if (alphaAt(10, 10) !== 0) {throw new Error(`${job.out} 背景未透明`);}
  for (const r of job.eraseRects) {
    let visible = 0;
    for (let {y} = r; y < r.y + r.height; y++) {
      for (let {x} = r; x < r.x + r.width; x++) {
        if (alphaAt(x, y) > 0) {
          visible++;
        }
      }
    }
    if (visible > 0) {throw new Error(`${job.out} 昵称擦除区仍有 ${visible} 个可见像素`);}
  }
  for (const r of job.backingRects) {
    if (alphaAt(r.x + (r.width >> 1), r.y + (r.height >> 1)) !== 255) {
      throw new Error(`${job.out} 二维码区域未保持不透明`);
    }
  }
  console.log(`✅ ${job.name} ${job.out} (${kb}KB, 无损)`);
}
