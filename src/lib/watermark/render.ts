/**
 * 水印海报渲染管线：照片/模板加载、基准适配与变换钳制、Canvas 合成、导出。
 * 全部函数为纯浏览器端实现，用户照片不经过任何网络请求。
 *
 * 注意：本文件刻意避免多行函数参数列表 —— 仓库里 prettier（trailingComma: es5）
 * 与 eslint（comma-dangle: always-multiline）对参数列表尾逗号的要求互相矛盾，
 * 多行参数列表会在提交钩子与 lint 之间来回翻转；复杂参数一律收敛为单个
 * options 对象（对象字面量的尾逗号两边规则一致）。
 */
import type { OutputSpec, PhotoArea, WatermarkTemplate, WebFont } from './template';

/** 照片尺寸（仅宽高） */
export interface PhotoSize {
  readonly width: number;
  readonly height: number;
}

/**
 * 用户调整状态（模板 px）：
 * - `scale` 相对基准适配（fit）的放大倍数，≥ 1；
 * - `x` 相对「左右居中」锚点的位移；
 * - `y` 相对纵向锚点（fit.anchorY：'center' 居中 / 'bottom' 底对齐）的位移。
 */
export interface PhotoTransform {
  scale: number;
  x: number;
  y: number;
}

export function initialTransform(): PhotoTransform {
  return { scale: 1, x: 0, y: 0 };
}

export interface LoadedPhoto {
  source: CanvasImageSource;
  width: number;
  height: number;
  close(): void;
}

/** 照片无法在浏览器解码（如非 Safari 浏览器读 iPhone HEIC） */
export class PhotoDecodeError extends Error {
  constructor(message = '照片解码失败') {
    super(message);
    this.name = 'PhotoDecodeError';
  }
}

/**
 * 加载用户本地照片，按 EXIF 信息修正方向。
 * 优先 createImageBitmap（不占 DOM、性能好），旧浏览器退回 <img> 解码。
 */
export async function loadPhoto(file: File): Promise<LoadedPhoto> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
    };
  } catch {
    // 退路：用 <img> 解码（现代浏览器对 <img> 默认应用 EXIF 方向）
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = 'async';
      await new Promise<void>((resolve, reject) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => reject(new PhotoDecodeError()), { once: true });
        img.src = url;
      });
      return {
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        close: () => URL.revokeObjectURL(url),
      };
    } catch {
      URL.revokeObjectURL(url);
      throw new PhotoDecodeError();
    }
  }
}

/** 加载模板图。fetch + createImageBitmap 不污染画布，可安全 toBlob 导出。 */
export async function loadTemplate(src: string): Promise<ImageBitmap> {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`模板加载失败：HTTP ${response.status}`);
  }
  return createImageBitmap(await response.blob());
}

/** 加载配置中的 webfont；单个字体失败不阻塞（回退 fontFamily 中的系统字体栈） */
export async function ensureFonts(fonts: readonly WebFont[]): Promise<void> {
  if (!('FontFace' in window)) {
    return;
  }
  const loads = fonts.map(async font => {
    try {
      const face = new FontFace(font.family, `url(${font.url})`, {
        weight: font.weight,
        style: font.style,
      });
      await face.load();
      document.fonts.add(face);
    } catch {
      console.warn(`水印字体加载失败，回退系统字体：${font.family}`);
    }
  });
  await Promise.all(loads);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 动态画布尺寸（模板参考系）：画布比例严格等于照片比例，海报贴合照片 */
export interface CanvasSize {
  w: number;
  h: number;
}

/**
 * 按照片推导画布尺寸：
 * - 横版（frameAxis 'y'）：水印宽度钉住照片左右两端 → 画布宽 = 模板参考宽；
 * - 竖版（frameAxis 'x'）：水印高度钉住照片上下两端 → 画布高 = 模板参考高。
 */
export function canvasSizeFor(
  template: WatermarkTemplate,
  photo: PhotoSize,
): CanvasSize {
  return template.frameAxis === 'y'
    ? { w: template.width, h: Math.round((template.width * photo.height) / photo.width) }
    : { w: Math.round((template.height * photo.width) / photo.height), h: template.height };
}

/** 水印帧贴合缩放：横版按宽度贴齐画布、竖版按高度贴齐画布 */
export function frameScaleFor(template: WatermarkTemplate, canvas: CanvasSize): number {
  return template.frameAxis === 'y' ? canvas.w / template.width : canvas.h / template.height;
}

type Rect2D = Pick<PhotoArea, 'x' | 'y' | 'width' | 'height'>;

interface DrawnSize {
  w: number;
  h: number;
}

/** 当前变换下照片的绘制尺寸（画布 px）：contain 相对画布，scale ≥ 1 放大裁切 */
function drawnSize(canvas: CanvasSize, photo: PhotoSize, scale: number): DrawnSize {
  const s = Math.min(canvas.w / photo.width, canvas.h / photo.height) * scale;
  return { w: photo.width * s, h: photo.height * s };
}

/** 钳制变换的输入：动态画布、照片尺寸与用户变换 */
export interface ClampSpec {
  canvas: CanvasSize;
  photo: PhotoSize;
  transform: PhotoTransform;
}

/**
 * 钳制用户变换（相对画布）：
 * - scale ≥ 1（画布与照片同比，scale 1 即满幅无裁切无黑边）；
 * - 放大后溢出轴可对称平移，未溢出轴锁 0。
 */
export function clampTransform(spec: ClampSpec): PhotoTransform {
  const { canvas, photo, transform: t } = spec;
  const { w: drawW, h: drawH } = drawnSize(canvas, photo, t.scale);
  const rangeX = Math.max(0, (drawW - canvas.w) / 2);
  const rangeY = Math.max(0, (drawH - canvas.h) / 2);
  return {
    scale: Math.max(1, t.scale),
    x: clamp(t.x, -rangeX, rangeX),
    y: clamp(t.y, -rangeY, rangeY),
  };
}

/** 绕点缩放的输入（photo 允许为 null——未选照片时原样返回当前变换） */
export interface ZoomAtSpec {
  canvas: CanvasSize;
  photo: PhotoSize | null;
  transform: PhotoTransform;
  px: number;
  py: number;
  factor: number;
  minScale: number;
  maxScale: number;
}

/** 围绕画布坐标 (px, py) 缩放 factor 倍：保持该点下的照片内容不动（锚点=画布中心） */
export function zoomAtTransform(spec: ZoomAtSpec): PhotoTransform {
  const { canvas, photo, transform: t, px, py, factor, minScale, maxScale } = spec;
  if (!photo) {
    return t;
  }
  const scale = clamp(t.scale * factor, minScale, maxScale);
  if (scale === t.scale) {
    return t;
  }
  const k = scale / t.scale;
  const xRef = canvas.w / 2;
  const yRef = canvas.h / 2;
  return clampTransform({
    canvas,
    photo,
    transform: {
      scale,
      x: (px - xRef) * (1 - k) + t.x * k,
      y: (py - yRef) * (1 - k) + t.y * k,
    },
  });
}

function roundedRectPath(ctx: CanvasRenderingContext2D, area: Rect2D, radius: number): void {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(area.x, area.y, area.width, area.height, radius);
    return;
  }
  const r = Math.min(radius, area.width / 2, area.height / 2);
  const { x, y, width: w, height: h } = area;
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface DrawPhotoSpec {
  canvas: CanvasSize;
  photo: LoadedPhoto;
  transform: PhotoTransform;
}

/** 满幅绘制用户照片（画布=照片比例，scale 1 零黑边零裁切；圆角裁剪） */
function drawPhoto(ctx: CanvasRenderingContext2D, spec: DrawPhotoSpec): void {
  const { canvas, photo, transform } = spec;
  const { w: drawW, h: drawH } = drawnSize(canvas, photo, transform.scale);
  const dx = canvas.w / 2 + transform.x - drawW / 2;
  const dy = canvas.h / 2 + transform.y - drawH / 2;

  ctx.save();
  roundedRectPath(ctx, { x: 0, y: 0, width: canvas.w, height: canvas.h }, 0);
  ctx.clip();
  // 底色垫底，避免亚像素缝隙透出画布底（七周年海报为黑底）
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.w, canvas.h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(photo.source, dx, dy, drawW, drawH);
  ctx.restore();
}

/** 带字距文字的绘制参数 */
export interface SpacedTextSpec {
  text: string;
  x: number;
  y: number;
  spacing: number;
  align: CanvasTextAlign;
}

/** 带字距的文字绘制（ctx.letterSpacing 兼容性不足，手动逐字排布），支持 center/left/right */
function fillTextSpaced(ctx: CanvasRenderingContext2D, spec: SpacedTextSpec): void {
  const { text, x, y, spacing, align } = spec;
  const chars = Array.from(text);
  const widths = chars.map(ch => ctx.measureText(ch).width);
  const total = widths.reduce((sum, w) => sum + w, 0) + spacing * (chars.length - 1);
  let cursor = x;
  if (align === 'center') {
    cursor = x - total / 2;
  } else if (align === 'right') {
    cursor = x - total;
  }
  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cursor, y);
    cursor += (widths[i] ?? 0) + spacing;
  });
  ctx.textAlign = prevAlign;
}

/** 按当前 font 设置测量「带字距文本」的总宽度 */
function measureSpaced(ctx: CanvasRenderingContext2D, text: string, spacing: number): number {
  const chars = Array.from(text);
  const total = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0);
  return total + spacing * (chars.length - 1);
}

/** 动态昵称绘制的输入 */
export interface NicknameDrawSpec {
  template: WatermarkTemplate;
  /** 用户输入的昵称（不含前缀） */
  nickname: string;
  /** 水印帧缩放（昵称字号/字距随帧等比） */
  frameScale: number;
  /** 水印帧在画布内的平移偏移（画布 px） */
  frameDx: number;
  frameDy: number;
}

/**
 * 绘制动态昵称（前缀 + 用户输入）；输入为空时跳过。
 * 超过 maxWidth 时自动缩小字号（字距随之等比收缩）至 minFontSize 下限，
 * 保证长 ID 不与模板手写体等固定元素重叠。坐标加 frame 偏移随水印移动。
 */
function drawNickname(ctx: CanvasRenderingContext2D, spec: NicknameDrawSpec): void {
  const { template, nickname, frameScale, frameDx, frameDy } = spec;
  const text = nickname.trim();
  if (!text) {
    return;
  }
  const style = template.nickname;
  const content = style.prefix + text;
  let size = style.fontSize;
  let spacing = style.letterSpacing;
  ctx.save();
  // 帧坐标系：整体缩放 + 平移，昵称随水印主体移动
  ctx.translate(frameDx, frameDy);
  ctx.scale(frameScale, frameScale);
  ctx.fillStyle = style.color;
  ctx.textBaseline = 'alphabetic';
  const setFont = (s: number) => {
    ctx.font = `${style.fontWeight} ${s}px ${style.fontFamily}`;
  };
  setFont(size);
  for (let i = 0; i < 3; i++) {
    const width = measureSpaced(ctx, content, spacing);
    if (width <= style.maxWidth || size <= style.minFontSize) {
      break;
    }
    size = Math.max(style.minFontSize, (size * style.maxWidth) / width);
    spacing = style.letterSpacing * (size / style.fontSize);
    setFont(size);
  }
  if (spacing > 0) {
    fillTextSpaced(ctx, { text: content, x: style.x, y: style.y, spacing, align: style.align });
  } else {
    ctx.textAlign = style.align;
    ctx.fillText(content, style.x, style.y);
  }
  ctx.restore();
}

/** 水印帧在画布内的平移偏移（画布 px）：主体 + 昵称整体移动，二维码钉角不动 */
export interface FrameOffset {
  dx: number;
  dy: number;
}

export interface CompositionInput {
  template: WatermarkTemplate;
  templateImage: CanvasImageSource;
  /** 二维码白卡位图（独立资产，钉死画布右下角，不随水印平移） */
  qrImage: CanvasImageSource | null;
  photo: LoadedPhoto | null;
  transform: PhotoTransform;
  /** 动态画布尺寸（照片比例决定；海报贴合照片） */
  canvas: CanvasSize;
  frame: FrameOffset;
  /** 用户输入的昵称（不含前缀） */
  nickname: string;
  /** 渲染比例：1 = 画布原始尺寸（导出用），<1 = 预览降采样 */
  scale?: number;
}

/**
 * 完整合成管线：清空 → 照片（满幅）→ 水印主体（贴合照片可平移）→
 * 二维码（钉画布右下角，随画布等比）→ 昵称（随帧缩放平移）。
 */
export function renderComposition(canvas: HTMLCanvasElement, input: CompositionInput): void {
  const { template, templateImage, qrImage, photo, transform, frame, nickname, scale = 1 } = input;
  const dims = input.canvas;
  canvas.width = Math.round(dims.w * scale);
  canvas.height = Math.round(dims.h * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建 Canvas 2D 上下文');
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, dims.w, dims.h);
  if (photo) {
    drawPhoto(ctx, { canvas: dims, photo, transform });
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  // 水印主体：frameScale 贴合画布（横版钉宽/竖版钉高）+ 帧平移
  const fs = frameScaleFor(template, dims);
  ctx.drawImage(templateImage, frame.dx, frame.dy, template.width * fs, template.height * fs);
  // 二维码白卡：钉死画布右下角（留边距随帧缩放，保持与设计稿同比例）
  if (qrImage) {
    const q = template.qr;
    const padR = (template.width - q.x - q.width) * fs;
    const padB = (template.height - q.y - q.height) * fs;
    ctx.drawImage(
      qrImage,
      dims.w - q.width * fs - padR,
      dims.h - q.height * fs - padB,
      q.width * fs,
      q.height * fs,
    );
  }
  drawNickname(ctx, { template, nickname, frameScale: fs, frameDx: frame.dx, frameDy: frame.dy });
}

/** 按输出配置导出画布为 Blob */
export function exportImage(canvas: HTMLCanvasElement, output: OutputSpec): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const onDone = (blob: Blob | null) =>
      blob ? resolve(blob) : reject(new Error('图片导出失败'));
    canvas.toBlob(onDone, output.mimeType, output.quality);
  });
}

/** 生成下载文件名：原文件名_seeker_7th_watermark.ext（去扩展名与非法字符） */
export function buildFileName(output: OutputSpec, originalName: string): string {
  const base = originalName
    .replace(/\.[^.]+$/, '')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '')
    .trim()
    .slice(0, 80);
  return `${base || 'Seeker'}_seeker_7th_watermark${output.extension}`;
}
