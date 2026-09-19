/**
 * 从设计师的 PSD 导出 PNG（透明底）生成网站叠加层资产（WebP）。
 *
 * 用法：node scripts/make-watermark-overlays.mjs
 *
 * 源图：scripts/assets/watermark/seeker-7th-*-src.png
 * —— 设计师从 PSD 导出的「隐藏黑色背景层」透明 PNG（含 alpha 通道）。
 *
 * 2026-09-19 起：二维码/公众号信息与水印主体分离——
 * 1. 主模板（*-frame.webp）：白卡+公众号文字区域 alpha 清零（挖孔），
 *    水印主体（幽灵字/手写/装饰）可在画布内平移而二维码钉死右下角；
 * 2. 二维码卡（*-qr.webp）：从成品海报 JPG（flatSrc）裁出白卡区域，
 *    不透明白底保证任意照片上可扫，渲染期按 template.qr 坐标原位绘制。
 * 历史的「白卡贴回主模板」逻辑已移除（旧 seeker-7th-*.webp 不再生成）。
 *
 * 若设计师更新导出图：覆盖 -src.png 后重跑本脚本即可。
 * 注意：导出时请隐藏「昵称」图层，否则依赖 eraseRects 的擦除坐标。
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
    frameOut: `${OUT_DIR}/seeker-7th-portrait-frame.webp`,
    qrOut: `${OUT_DIR}/seeker-7th-portrait-qr.webp`,
    /**
     * 擦除区域（若导出图烙入了昵称层则在此配置，alpha 清零）。
     * 当前导出已在 PS 里隐藏昵称图层，无需擦除；留空数组保留机制。
     */
    eraseRects: [],
    /** 白卡扫描窗口（需覆盖整张白卡、避开下方文字）与静区行的最小连续白段 */
    cardWindow: { x0: 1550, x1: 2050, y0: 3300, y1: 3660 },
    minRun: 170,
    /**
     * 主模板挖孔区：白卡边界 + 下方公众号文字。x0/x1 取卡片左右外扩
     * （覆盖文字与卡片中心差），y1 延到窗口底（公众号文字行）。
     */
    holePad: { left: 60, right: 30, top: 8, bottom: 70 },
  },
  {
    name: '横版',
    src: 'scripts/assets/watermark/seeker-7th-landscape-src.png',
    flatSrc: 'scripts/assets/watermark/seeker-7th-landscape.jpg',
    frameOut: `${OUT_DIR}/seeker-7th-landscape-frame.webp`,
    qrOut: `${OUT_DIR}/seeker-7th-landscape-qr.webp`,
    /**
     * 2026-09-17 晚间版导出：设计师已删除昵称图层（经像素级 diff 验证，
     * 与上一版唯一差异即「@肖默」文字区 598px），擦除步骤置空保留机制。
     */
    eraseRects: [],
    cardWindow: { x0: 2050, x1: 2499, y0: 1280, y1: 1558 },
    minRun: 100,
    holePad: { left: 60, right: 30, top: 8, bottom: 70 },
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

  // 白卡精确边界（自校准）
  const card = scanCardBounds(flat, job.cardWindow, job.minRun);
  console.log(`${job.name} 白卡边界: x${card.x} y${card.y} ${card.w}×${card.h}`);

  // —— 1) 二维码卡资产：成品 JPG 裁白卡（原样不透明，保证可扫） ——
  const qrRect = { x: card.x, y: card.y, width: card.w, height: card.h };
  await sharp(job.flatSrc)
    .extract({ left: qrRect.x, top: qrRect.y, width: qrRect.width, height: qrRect.height })
    .toColourspace('srgb')
    .flatten({ background: '#ffffff' })
    .webp({ lossless: true })
    .toFile(job.qrOut);
  console.log(`${job.name} 二维码卡: ${qrRect.width}×${qrRect.height} → ${job.qrOut}`);
  console.log(`   >>> template.qr = { src: '${job.qrOut.replace('public', '')}', x: ${qrRect.x}, y: ${qrRect.y}, w: ${qrRect.width}, h: ${qrRect.height} }`);

  // —— 2) 主模板挖孔：白卡 + 公众号文字区域 alpha 清零 ——
  const hole = {
    x: Math.max(0, card.x - job.holePad.left),
    y: Math.max(0, card.y - job.holePad.top),
    width: Math.min(width, card.x + card.w + job.holePad.right) - Math.max(0, card.x - job.holePad.left),
    height: Math.min(height, card.y + card.h + job.holePad.bottom) - Math.max(0, card.y - job.holePad.top),
  };
  console.log(`${job.name} 挖孔区: x${hole.x} y${hole.y} ${hole.width}×${hole.height}`);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (job.eraseRects.some((r) => inRect(x, y, r)) || inRect(x, y, hole)) {
        out[i + 3] = 0;
      }
    }
  }

  // 无损 WebP：笔触边缘零损耗
  await sharp(out, { raw: { width, height, channels: 4 } })
    .webp({ lossless: true, alphaQuality: 100 })
    .toFile(job.frameOut);

  const { size } = await stat(job.frameOut);
  const kb = (size / 1024).toFixed(1);
  if (size > 500 * 1024) {
    throw new Error(`${job.frameOut} ${kb}KB 超过 500KB 入库上限`);
  }

  // 校验：背景透明、挖孔区干净、挖孔区外白卡位置不再有不透明像素
  const check = await sharp(job.frameOut).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => {
    const { data: d, info: inf } = check;
    return d[(y * inf.width + x) * inf.channels + 3];
  };
  if (alphaAt(10, 10) !== 0) {
    throw new Error(`${job.frameOut} 背景未透明`);
  }
  if (alphaAt(card.x + (card.w >> 1), card.y + (card.h >> 1)) !== 0) {
    throw new Error(`${job.frameOut} 二维码挖孔区未清空`);
  }
  console.log(`✅ ${job.name} ${job.frameOut} (${kb}KB, 无损, 已挖孔)`);
}
