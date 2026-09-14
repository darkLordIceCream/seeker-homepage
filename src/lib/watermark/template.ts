/**
 * Seeker 七周年水印海报模板配置（竖版 / 横版）。
 *
 * 照片角色：用户照片做海报背景，白色模板元素（SEEKER 幽灵字母、手写体、
 * 小字、二维码）叠加其上，动态昵称由 Canvas 绘制。
 *
 * 照片适配规则（用户约定）：
 * - 竖版：照片与模板**上下对齐、左右居中**（高度铺满，宽度过宽裁两侧、
 *   过窄时两侧留黑边居中）；
 * - 横版：照片与模板**底部和左右对齐**（宽度铺满，高度过高裁顶部、
 *   过矮时顶部留黑边、底边对齐）。
 * 用户可在基准适配之上拖动 / 缩放微调。
 *
 * 叠加层资产：`public/templates/seeker-7th-{portrait,landscape}.webp`
 * （设计师 PSD 导出的透明 PNG 经 scripts/make-watermark-overlays.mjs
 * 修补昵称擦除 + 二维码垫白后无损转换）。
 *
 * 更换 / 新增模板只需改本文件：src、尺寸、photoArea、fit、nickname 坐标
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

/**
 * 照片基准适配模式：
 * - `base: 'height'` 照片高度对齐区域高度（竖版，anchorY = 'center'）；
 * - `base: 'width'` 照片宽度对齐区域宽度（横版，anchorY = 'bottom'）。
 * anchorY 是放大后纵向拖动的锚定语义：'center' 上下对称裁切，
 * 'bottom' 底边始终对齐、只裁/补顶部。
 */
export interface FitSpec {
  readonly base: 'height' | 'width';
  readonly anchorY: 'center' | 'bottom';
}

export interface NicknameStyle {
  /**
   * 文字锚点 x（配合 align）。两版均用 'right'：锚在书法尾笔左侧的安全线上，
   * 长 ID 向左伸展（左侧为空黑区），永不与手写体重叠。
   */
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
  /** 昵称（含前缀）的最大绘制宽度，超出时自动缩小字号 */
  readonly maxWidth: number;
  /** 自动缩字的下限字号 */
  readonly minFontSize: number;
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
  readonly extension: string;
}

export interface WatermarkTemplate {
  readonly id: string;
  readonly name: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly photoArea: PhotoArea;
  readonly fit: FitSpec;
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
  extension: '.jpg',
};

/** 竖版 9:16 —— 照片上下对齐、左右居中；昵称「© 肖 默」实测 bbox x[1338,1455] y[1662,1692]，右锚 1458 避开「方」字尾笔（x≈1470） */
export const SEEKER_7TH_PORTRAIT: WatermarkTemplate = {
  id: 'seeker-7th-portrait',
  name: 'Seeker 七周年纪念海报 · 竖版',
  src: '/templates/seeker-7th-portrait.webp',
  width: 2084,
  height: 3705,
  photoArea: { x: 0, y: 0, width: 2084, height: 3705, radius: 0 },
  fit: { base: 'height', anchorY: 'center' },
  nickname: {
    x: 1458,
    y: 1688,
    fontSize: 31,
    fontWeight: '300',
    fontFamily: NICKNAME_FONT_STACK,
    color: '#ffffff',
    letterSpacing: 16,
    align: 'right',
    prefix: '©',
    maxLength: 20,
    maxWidth: 560,
    minFontSize: 18,
  },
  output: OUTPUT,
  fonts: [],
};

/** 横版 16:10 —— 照片底部和左右对齐；昵称「@肖默」实测 bbox x[848,938] y[985,1012]，右锚 936 避开「方」字尾笔（x≈950） */
export const SEEKER_7TH_LANDSCAPE: WatermarkTemplate = {
  id: 'seeker-7th-landscape',
  name: 'Seeker 七周年纪念海报 · 横版',
  src: '/templates/seeker-7th-landscape.webp',
  width: 2500,
  height: 1559,
  photoArea: { x: 0, y: 0, width: 2500, height: 1559, radius: 0 },
  fit: { base: 'width', anchorY: 'bottom' },
  nickname: {
    x: 936,
    y: 1008,
    fontSize: 27,
    fontWeight: '300',
    fontFamily: NICKNAME_FONT_STACK,
    color: '#ffffff',
    letterSpacing: 5,
    align: 'right',
    prefix: '@',
    maxLength: 20,
    maxWidth: 580,
    minFontSize: 18,
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
