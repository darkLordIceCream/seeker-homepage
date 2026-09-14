/**
 * 生成「Seeker 七周年」占位水印模板（1440×1920 WebP，照片区域透明）。
 *
 * 用法：node scripts/make-placeholder-template.mjs
 *
 * 注意：
 * - 所有坐标必须与 src/lib/watermark/template.ts 中的 SEEKER_7TH_TEMPLATE 严格一致；
 *   更换真实模板（PSD 导出）后本脚本与产物仅作占位留档。
 * - 真实模板导出要求：照片区域挖空保持透明（PNG/WebP 带 alpha 通道），
 *   否则 Canvas 合成时模板会盖住用户照片。
 * - AGENTS.md 约定单文件 >500KB 不入 git，脚本末尾会校验产物体积。
 */
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1440;
const HEIGHT = 1920;
const PHOTO_AREA = { x: 120, y: 280, width: 1200, height: 1200, radius: 28 };

const OUT = 'public/templates/seeker-7th-placeholder.webp';
const PREVIEW = '/tmp/seeker-7th-placeholder-preview.png';

// Catppuccin Latte 品牌色：Teal #179299 → Red #d20f39
const INK = '#3b3a36';
const MUTED = '#6b6557';
const FAINT = '#a89f8c';
const HAIRLINE = '#e6ddc9';

const FONT = `'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif`;

/** 取景器四角括号（照片框外沿，摄影机取景框意象） */
function cornerBrackets() {
  const o = 16; // 括号相对照片框的外扩距离
  const len = 72; // 臂长
  const { x, y, width: w, height: h } = PHOTO_AREA;
  const corners = [
    // 左上
    `M ${x - o} ${y - o + len} L ${x - o} ${y - o} L ${x - o + len} ${y - o}`,
    // 右上
    `M ${x + w + o - len} ${y - o} L ${x + w + o} ${y - o} L ${x + w + o} ${y - o + len}`,
    // 左下
    `M ${x - o} ${y + h + o - len} L ${x - o} ${y + h + o} L ${x - o + len} ${y + h + o}`,
    // 右下
    `M ${x + w + o - len} ${y + h + o} L ${x + w + o} ${y + h + o} L ${x + w + o} ${y + h + o - len}`,
  ];
  return corners.map((d) => `<path d="${d}" fill="none" stroke="#179299" stroke-width="8" stroke-linecap="round"/>`).join('\n');
}

/** 居中分隔线：渐变细线 + 中央菱形 */
function divider(cx, y, halfWidth) {
  return `
  <line x1="${cx - halfWidth}" y1="${y}" x2="${cx - 26}" y2="${y}" stroke="url(#grad)" stroke-width="3" stroke-linecap="round"/>
  <line x1="${cx + 26}" y1="${y}" x2="${cx + halfWidth}" y2="${y}" stroke="url(#grad)" stroke-width="3" stroke-linecap="round"/>
  <rect x="${cx - 8}" y="${y - 8}" width="16" height="16" fill="url(#grad)" transform="rotate(45 ${cx} ${y})"/>`;
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#179299"/>
      <stop offset="1" stop-color="#d20f39"/>
    </linearGradient>
  </defs>

  <!--
    相纸底色：用 evenodd 在照片窗口处挖出透明洞（洞内不能有任何像素，
    否则 Canvas 合成时模板会盖住用户照片）。
  -->
  <path
    fill="#f7f2e8"
    fill-rule="evenodd"
    d="M0 0 H${WIDTH} V${HEIGHT} H0 Z
       M${PHOTO_AREA.x + PHOTO_AREA.radius} ${PHOTO_AREA.y}
       h${PHOTO_AREA.width - PHOTO_AREA.radius * 2}
       a${PHOTO_AREA.radius} ${PHOTO_AREA.radius} 0 0 1 ${PHOTO_AREA.radius} ${PHOTO_AREA.radius}
       v${PHOTO_AREA.height - PHOTO_AREA.radius * 2}
       a${PHOTO_AREA.radius} ${PHOTO_AREA.radius} 0 0 1 -${PHOTO_AREA.radius} ${PHOTO_AREA.radius}
       h-${PHOTO_AREA.width - PHOTO_AREA.radius * 2}
       a${PHOTO_AREA.radius} ${PHOTO_AREA.radius} 0 0 1 -${PHOTO_AREA.radius} -${PHOTO_AREA.radius}
       v-${PHOTO_AREA.height - PHOTO_AREA.radius * 2}
       a${PHOTO_AREA.radius} ${PHOTO_AREA.radius} 0 0 1 ${PHOTO_AREA.radius} -${PHOTO_AREA.radius} Z"/>
  <rect x="44" y="44" width="${WIDTH - 88}" height="${HEIGHT - 88}" fill="none" stroke="${HAIRLINE}" stroke-width="2" rx="12"/>

  <!-- 顶部品牌区 -->
  <text x="${WIDTH / 2}" y="112" text-anchor="middle" font-family=${JSON.stringify(FONT)}
        font-size="28" letter-spacing="12" fill="${FAINT}">SEEKER · 追 光 者</text>
  <text x="${WIDTH / 2}" y="208" text-anchor="middle" font-family=${JSON.stringify(FONT)}
        font-size="76" font-weight="600" fill="${INK}">七周年纪念海报</text>
  ${divider(WIDTH / 2, 248, 180)}

  <!-- 照片框（窗口内部保持透明，用户照片从下层透出） -->
  <rect x="${PHOTO_AREA.x}" y="${PHOTO_AREA.y}" width="${PHOTO_AREA.width}" height="${PHOTO_AREA.height}"
        rx="${PHOTO_AREA.radius}" fill="none" stroke="${INK}" stroke-width="5"/>
  ${cornerBrackets()}

  <!-- 底部文字区 -->
  <text x="${WIDTH / 2}" y="1584" text-anchor="middle" font-family=${JSON.stringify(FONT)}
        font-size="42" letter-spacing="4" fill="${MUTED}">拍一张照片，交一个朋友</text>
  ${divider(WIDTH / 2, 1656, 150)}
  <!-- @昵称（动态文字，由 Canvas 绘制，模板在此留白） -->
  <text x="${WIDTH / 2}" y="1868" text-anchor="middle" font-family=${JSON.stringify(FONT)}
        font-size="24" letter-spacing="8" fill="${FAINT}">7TH ANNIVERSARY · 2019 → 2026</text>
</svg>`;

await mkdir(path.dirname(OUT), { recursive: true });
const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(PREVIEW, png);
await sharp(png).webp({ quality: 88, alphaQuality: 90 }).toFile(OUT);

const { size } = await stat(OUT);
const kb = (size / 1024).toFixed(1);
if (size > 500 * 1024) {
  throw new Error(`占位模板 ${kb}KB 超过 500KB 入库上限，请降低 quality 或简化设计`);
}

// 校验照片窗口完全透明：任一像素不透明都会导致合成时盖住用户照片
const { data, info } = await sharp(OUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const idx =
  (Math.floor(PHOTO_AREA.y + PHOTO_AREA.height / 2) * info.width +
    Math.floor(PHOTO_AREA.x + PHOTO_AREA.width / 2)) *
  info.channels;
if (data[idx + 3] !== 0) {
  throw new Error(
    `照片窗口中心 alpha=${data[idx + 3]}，应为 0（窗口必须完全透明，见文件头导出说明）`,
  );
}
console.log(`✅ ${OUT} (${kb}KB)，窗口透明校验通过，预览图：${PREVIEW}`);
