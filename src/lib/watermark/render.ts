/**
 * 水印海报渲染管线：照片/模板加载、cover 适配与变换钳制、Canvas 合成、导出。
 * 全部函数为纯浏览器端实现，用户照片不经过任何网络请求。
 */
import type { OutputSpec, PhotoArea, WatermarkTemplate, WebFont } from './template';

/** 用户调整状态：offset 为相对「照片区域中心」的位移（模板 px） */
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
  await Promise.all(
    fonts.map(async font => {
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
    })
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** cover 基准缩放：照片刚好铺满照片区域所需的比例 */
export function coverScale(area: Rect2D, photo: { width: number; height: number }): number {
  return Math.max(area.width / photo.width, area.height / photo.height);
}

type Rect2D = Pick<PhotoArea, 'x' | 'y' | 'width' | 'height'>;

/**
 * 钳制用户变换：scale ≥ 1（cover 已铺满），位移保证照片永不露出区域边缘。
 */
export function clampTransform(
  template: WatermarkTemplate,
  photo: { width: number; height: number },
  t: PhotoTransform
): PhotoTransform {
  const area = template.photoArea;
  const drawW = photo.width * coverScale(area, photo) * t.scale;
  const drawH = photo.height * coverScale(area, photo) * t.scale;
  const maxX = Math.max(0, (drawW - area.width) / 2);
  const maxY = Math.max(0, (drawH - area.height) / 2);
  return {
    scale: Math.max(1, t.scale),
    x: clamp(t.x, -maxX, maxX),
    y: clamp(t.y, -maxY, maxY),
  };
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

/** 在照片区域内绘制用户照片（cover + 用户位移/缩放，圆角裁剪） */
function drawPhoto(
  ctx: CanvasRenderingContext2D,
  template: WatermarkTemplate,
  photo: LoadedPhoto,
  transform: PhotoTransform
): void {
  const area = template.photoArea;
  const scale = coverScale(area, photo) * transform.scale;
  const drawW = photo.width * scale;
  const drawH = photo.height * scale;
  const dx = area.x + area.width / 2 + transform.x - drawW / 2;
  const dy = area.y + area.height / 2 + transform.y - drawH / 2;

  ctx.save();
  roundedRectPath(ctx, area, area.radius);
  ctx.clip();
  // 底色垫底，避免亚像素缝隙透出画布底
  ctx.fillStyle = '#e9e2d2';
  ctx.fillRect(area.x, area.y, area.width, area.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(photo.source, dx, dy, drawW, drawH);
  ctx.restore();
}

/** 带字距的文字绘制（ctx.letterSpacing 兼容性不足，手动逐字排布），支持 center/left/right */
function fillTextSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: CanvasTextAlign
): void {
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

/** 绘制动态昵称（前缀 + 用户输入）；输入为空时跳过 */
function drawNickname(
  ctx: CanvasRenderingContext2D,
  template: WatermarkTemplate,
  nickname: string
): void {
  const text = nickname.trim();
  if (!text) {
    return;
  }
  const style = template.nickname;
  ctx.save();
  ctx.fillStyle = style.color;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
  const content = style.prefix + text;
  if (style.letterSpacing > 0) {
    fillTextSpaced(ctx, content, style.x, style.y, style.letterSpacing, style.align);
  } else {
    ctx.textAlign = style.align;
    ctx.fillText(content, style.x, style.y);
  }
  ctx.restore();
}

export interface CompositionInput {
  template: WatermarkTemplate;
  templateImage: CanvasImageSource;
  photo: LoadedPhoto | null;
  transform: PhotoTransform;
  /** 用户输入的昵称（不含前缀） */
  nickname: string;
  /** 渲染比例：1 = 模板原始尺寸（导出用），<1 = 预览降采样 */
  scale?: number;
}

/** 完整合成管线：清空 → 照片（裁剪）→ 模板 → 昵称。坐标一律为模板 px。 */
export function renderComposition(canvas: HTMLCanvasElement, input: CompositionInput): void {
  const { template, templateImage, photo, transform, nickname, scale = 1 } = input;
  canvas.width = Math.round(template.width * scale);
  canvas.height = Math.round(template.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建 Canvas 2D 上下文');
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, template.width, template.height);
  if (photo) {
    drawPhoto(ctx, template, photo, transform);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(templateImage, 0, 0, template.width, template.height);
  drawNickname(ctx, template, nickname);
}

/** 按输出配置导出画布为 Blob */
export function exportImage(canvas: HTMLCanvasElement, output: OutputSpec): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('图片导出失败'))),
      output.mimeType,
      output.quality
    );
  });
}

/** 生成下载文件名：前缀_@昵称.ext，过滤文件系统非法字符 */
export function buildFileName(output: OutputSpec, nickname: string): string {
  const cleaned = nickname
    .trim()
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '')
    .slice(0, 40);
  const name = cleaned || 'Seeker';
  return `${output.fileNamePrefix}_@${name}${output.extension}`;
}
