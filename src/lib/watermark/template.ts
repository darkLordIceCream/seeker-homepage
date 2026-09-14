/**
 * Seeker 七周年水印海报模板配置（竖版 / 横版）。
 *
 * 照片角色：用户照片做**全幅背景**（cover 铺满整张海报），
 * 白色模板元素（SEEKER 幽灵字母、手写体、小字、二维码）叠加其上，
 * 动态昵称由 Canvas 绘制。
 *
 * 叠加层资产：`public/templates/seeker-7th-{portrait,landscape}.webp`
 * （白色元素 + alpha 透明底；二维码卡片区域保持不透明保证可扫）。
 * 当前版本由 scripts/make-watermark-overlays.mjs 从海报 JPG 重建；
 * 设计师从 PSD 导出「隐藏黑底层 + 昵称层」的透明 PNG 后直接覆盖同名文件。
 *
 * 更换 / 新增模板只需改本文件：src、尺寸、photoArea、nickname 坐标
 * （单位一律为模板原始像素）。
 */

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface PhotoArea extends Rect {
  /** 照片窗口圆角半径（全幅背景为 0） */
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
  /** 昵称前缀（竖版设计稿为「©」，横版为「@」） */
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

/** 昵称动态文字的系统字体栈（跨设备接近；精确字体待设计提供 webfont） */
const NICKNAME_FONT_STACK =
  "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif";

const OUTPUT: OutputSpec = {
  mimeType: 'image/jpeg',
  quality: 0.92,
  fileNamePrefix: 'Seeker七周年',
  extension: '.jpg',
};

/** 竖版 9:16 —— 昵称「© 肖 默」实测 bbox x[1338,1455] y[1662,1692] */
export const SEEKER_7TH_PORTRAIT: WatermarkTemplate = {
  id: 'seeker-7th-portrait',
  name: 'Seeker 七周年纪念海报 · 竖版',
  src: '/templates/seeker-7th-portrait.webp',
  width: 2084,
  height: 3705,
  photoArea: { x: 0, y: 0, width: 2084, height: 3705, radius: 0 },
  nickname: {
    x: 1396,
    y: 1688,
    fontSize: 31,
    fontWeight: '300',
    fontFamily: NICKNAME_FONT_STACK,
    color: '#ffffff',
    letterSpacing: 16,
    align: 'center',
    prefix: '©',
    maxLength: 20,
  },
  output: OUTPUT,
  fonts: [],
};

/** 横版 16:10 —— 昵称「@肖默」实测 bbox x[848,938] y[985,1012] */
export const SEEKER_7TH_LANDSCAPE: WatermarkTemplate = {
  id: 'seeker-7th-landscape',
  name: 'Seeker 七周年纪念海报 · 横版',
  src: '/templates/seeker-7th-landscape.webp',
  width: 2500,
  height: 1559,
  photoArea: { x: 0, y: 0, width: 2500, height: 1559, radius: 0 },
  nickname: {
    x: 893,
    y: 1008,
    fontSize: 27,
    fontWeight: '300',
    fontFamily: NICKNAME_FONT_STACK,
    color: '#ffffff',
    letterSpacing: 5,
    align: 'center',
    prefix: '@',
    maxLength: 20,
  },
  output: OUTPUT,
  fonts: [],
};

export const WATERMARK_TEMPLATES: readonly WatermarkTemplate[] = [
  SEEKER_7TH_PORTRAIT,
  SEEKER_7TH_LANDSCAPE,
];

export const DEFAULT_WATERMARK_TEMPLATE: WatermarkTemplate = SEEKER_7TH_PORTRAIT;

/** 昵称输入框长度上限（各模板取最大值） */
export const NICKNAME_MAX_LENGTH = Math.max(...WATERMARK_TEMPLATES.map(t => t.nickname.maxLength));
