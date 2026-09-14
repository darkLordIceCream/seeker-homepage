/**
 * Seeker 七周年水印海报模板配置。
 *
 * 更换 / 新增模板只需要改这个文件：
 * - `src`：模板图地址。要求照片区域挖空保持透明（带 alpha 通道），
 *   否则 Canvas 合成时模板会盖住用户照片；参见
 *   scripts/make-placeholder-template.mjs 头部的真实模板导出说明。
 * - `photoArea` / `nickname`：与 PSD 设计稿对齐的坐标（单位一律为模板原始像素，
 *   预览与导出时按比例映射）。
 * - `fonts`：`@昵称` 动态文字的 webfont 清单（FontFace API 加载）。
 *   为空数组时回退 `fontFamily` 里的系统字体栈；字体文件到位后
 *   放入 `public/fonts/` 并在此登记即可全设备渲染一致。
 */

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface PhotoArea extends Rect {
  /** 照片窗口圆角半径（需与模板图相框圆角一致） */
  readonly radius: number;
}

export interface NicknameStyle {
  /** 文字锚点 x（配合 align） */
  readonly x: number;
  /** 文字基线 y */
  readonly y: number;
  readonly fontSize: number;
  readonly fontWeight: string;
  /** 含回退栈的完整 font-family */
  readonly fontFamily: string;
  readonly color: string;
  /** 字距（px），0 表示不启用 */
  readonly letterSpacing: number;
  readonly align: CanvasTextAlign;
  /** 昵称前缀，如 "@" */
  readonly prefix: string;
  readonly maxLength: number;
}

export interface WebFont {
  readonly family: string;
  readonly url: string;
  readonly weight?: string;
  readonly style?: string;
}

export interface OutputSpec {
  readonly mimeType: 'image/jpeg';
  readonly quality: number;
  readonly fileNamePrefix: string;
  readonly extension: string;
}

export interface WatermarkTemplate {
  readonly id: string;
  readonly name: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly photoArea: PhotoArea;
  readonly nickname: NicknameStyle;
  readonly output: OutputSpec;
  readonly fonts: readonly WebFont[];
}

export const SEEKER_7TH_TEMPLATE: WatermarkTemplate = {
  id: 'seeker-7th',
  name: 'Seeker 七周年纪念海报',
  src: '/templates/seeker-7th-placeholder.webp',
  width: 1440,
  height: 1920,
  photoArea: { x: 120, y: 280, width: 1200, height: 1200, radius: 28 },
  nickname: {
    x: 720,
    y: 1760,
    fontSize: 64,
    fontWeight: '600',
    fontFamily:
      "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif",
    color: '#3b3a36',
    letterSpacing: 2,
    align: 'center',
    prefix: '@',
    maxLength: 20,
  },
  output: {
    mimeType: 'image/jpeg',
    quality: 0.92,
    fileNamePrefix: 'Seeker七周年',
    extension: '.jpg',
  },
  fonts: [],
};
