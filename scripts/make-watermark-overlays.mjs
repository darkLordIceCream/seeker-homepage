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
 * 2. 二维码区域透明程度不一致（白卡/白码点与背景层编组）→ pasteRects
 *    区域整块替换为成品海报 JPG（flatSrc）的像素并强制不透明，
 *    保证码与白边完美贴合、任意照片上可扫。
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
    /** 成品海报 JPG（flatten 后的真实外观，二维码白卡在此完全可见） */
    flatSrc: 'scripts/assets/watermark/seeker-7th-portrait.jpg',
    out: `${OUT_DIR}/seeker-7th-portrait.webp`,
    /** 擦除区域（烙入的昵称），alpha 清零 */
    eraseRects: [{ x: 1320, y: 1650, width: 142, height: 52 }],
    /** 白卡扫描窗口（需覆盖整张白卡、避开下方文字）与静区行的最小连续白段 */
    cardWindow: { x0: 1550, x1: 2050, y0: 3300, y1: 3660 },
    minRun: 170,
  },
  {
    name: '横版',
    src: 'scripts/assets/watermark/seeker-7th-landscape-src.png',
    flatSrc: 'scripts/assets/watermark/seeker-7th-landscape.jpg',
    out: `${OUT_DIR}/seeker-7th-landscape.webp`,
    eraseRects: [{ x: 832, y: 970, width: 118, height: 52 }],
    cardWindow: { x0: 2050, x1: 2499, y0: 1280, y1: 1558 },
    minRun: 100,
  },
];

function inRect(x, y, r) {
  return x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height;
}

/**
 * 在成品 JPG 上扫描二维码白卡精确边界：
 * 白卡上下静区行存在「长度 ≥ minRun 的连续不透明白段」，而文字/幽灵字/振铃
 * 都构不成这种长段；这些行的行范围与白段的列范围即白卡边界。
 * （注意：源 JPG 是 4 通道 CMYK 标记 + alpha，必须先归一化 sRGB 再按 RGBA 读。）
 */
function scanCardBounds(flat, win, minRun) {
  const { data, info } = flat;
  const ch = info.channels;
  const isOpaqueWhite = (x, y) => {
    const i = (y * info.width + x) * ch;
    return (
      data[i + 3] > 200 && data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200
    );
  };
  let y0 = null;
  let y1 = null;
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  for (let y = win.y0; y <= win.y1; y++) {
    let best = 0;
    let bestStart = 0;
    let run = 0;
    let runStart = 0;
    for (let x = win.x0; x <= win.x1; x++) {
      if (isOpaqueWhite(x, y)) {
        if (run === 0) {
          runStart = x;
        }
        run++;
        if (run > best) {
          best = run;
          bestStart = runStart;
        }
      } else {
        run = 0;
      }
    }
    if (best >= minRun) {
      if (y0 === null) {
        y0 = y;
      }
      y1 = y;
      minX = Math.min(minX, bestStart);
      maxX = Math.max(maxX, bestStart + best - 1);
    }
  }
  if (y0 === null) {
    throw new Error('未能扫描到二维码白卡边界，请检查 cardWindow / minRun');
  }
  return { x: minX, y: y0, w: maxX - minX + 1, h: y1 - y0 + 1 };
}

for (const job of SOURCES) {
  const { data, info } = await sharp(job.src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.from(data); // 直通 alpha（straight），只修补目标区域

  // 成品 JPG 归一化为 sRGB RGBA（微信导出的 JPG 是 4 通道 CMYK 标记 + alpha）
  const flat = await sharp(job.flatSrc).toColourspace('srgb').ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // 白卡精确边界（自校准），四周内缩 2px 避免把贴着黑底的抗锯齿边带进照片
  const card = scanCardBounds(flat, job.cardWindow, job.minRun);
  const pasteRect = {
    x: card.x + 2,
    y: card.y + 2,
    width: card.w - 4,
    height: card.h - 4,
  };
  console.log(`${job.name} 白卡边界: x${card.x} y${card.y} ${card.w}×${card.h} → 贴入 ${pasteRect.width}×${pasteRect.height}`);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (job.eraseRects.some((r) => inRect(x, y, r))) {
        out[i + 3] = 0;
      } else if (inRect(x, y, pasteRect)) {
        // 二维码白卡区域：整块替换为成品图像素，强制不透明
        const fi = (y * flat.info.width + x) * flat.info.channels;
        out[i] = flat.data[fi];
        out[i + 1] = flat.data[fi + 1];
        out[i + 2] = flat.data[fi + 2];
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

  // 校验：背景透明、昵称区已清空、二维码区域不透明
  const check = await sharp(job.out).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => {
    const { data: d, info: inf } = check;
    return d[(y * inf.width + x) * inf.channels + 3];
  };
  if (alphaAt(10, 10) !== 0) {
    throw new Error(`${job.out} 背景未透明`);
  }
  for (const r of job.eraseRects) {
    let visible = 0;
    for (let {y} = r; y < r.y + r.height; y++) {
      for (let {x} = r; x < r.x + r.width; x++) {
        if (alphaAt(x, y) > 0) {
          visible++;
        }
      }
    }
    if (visible > 0) {
      throw new Error(`${job.out} 昵称擦除区仍有 ${visible} 个可见像素`);
    }
  }
  if (alphaAt(pasteRect.x + (pasteRect.width >> 1), pasteRect.y + (pasteRect.height >> 1)) !== 255) {
    throw new Error(`${job.out} 二维码区域未保持不透明`);
  }
  console.log(`✅ ${job.name} ${job.out} (${kb}KB, 无损)`);
}
