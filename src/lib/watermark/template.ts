/**
 * Seeker 七周年水印海报模板配置（竖版 / 横版）。
 *
 * 照片角色：用户照片做海报背景，白色模板元素（SEEKER 幽灵字母、手写体、
 * 小字、二维码）叠加其上，动态昵称由 Canvas 绘制。
 *
 * 照片适配规则（2026-09-19 用户约定：严格保持照片比例）：
 * - contain 完整显示：照片按「宽高比中较小者」等比缩放，完整落在画布内
 *   居中，不足处自然留黑边（黑底 underlay），默认零裁切；
 * - 用户可放大（1–4×）微调构图，放大后可拖动。
 *
 * 水印分层（2026-09-19）：二维码/公众号与水印主体分离——
 * - `src`（*-frame.webp）：挖孔后的水印主体，可整体平移（frameAxis 轴向）；
 * - `qr`（*-qr.webp）：二维码白卡，渲染期钉死模板右下角原位，不随平移。
 *
 * 更换 / 新增模板只需改本文件：src、尺寸、photoArea、fit、nickname、qr
 * 坐标（单位一律为模板原始像素）。
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

/** 二维码白卡：独立资产 + 模板像素坐标（渲染期钉死右下角，不随水印平移） */
export interface QrSpec extends Rect {
  readonly src: string;
}

/**
 * 照片基准适配模式：contain——照片完整显示（min(宽比, 高比) 等比缩放），
 * 居中锚定；黑底打底，不足侧自然留黑边。scale ≥ 1 可放大裁切微调。
 */
export interface FitSpec {
  readonly base: 'contain';
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
  /** 水印主体（挖孔版，二维码已分离） */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly photoArea: PhotoArea;
  readonly fit: FitSpec;
  /** 水印主体可平移轴向：竖版 'x'（左右）、横版 'y'（上下） */
  readonly frameAxis: 'x' | 'y';
  /** 二维码白卡（钉死右下角原位，不随水印平移） */
  readonly qr: QrSpec;
  readonly nickname: NicknameStyle;
  readonly output: OutputSpec;
  readonly fonts: readonly WebFont[];
}

/**
 * 昵称动态文字字体栈：
 * - 'DengXian'（等线，设计稿原字体）：Windows/Office 设备本地已有，零下载精确匹配；
 * - 'NotoSansSCSub'：思源黑体 Light 的 GB2312 一级字子集 webfont
 *   （public/fonts/noto-sans-sc-300-subset.woff2，466KB，OFL 授权可自由内嵌），
 *   由本文件 fonts[] 经 FontFace 注册，覆盖其余所有设备；
 * - 其余为系统回退栈。
 */
const NICKNAME_FONT_STACK =
  "'DengXian', 'DengXian Light', 'NotoSansSCSub', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";

const OUTPUT: OutputSpec = {
  mimeType: 'image/jpeg',
  quality: 0.92,
  extension: '.jpg',
};

/** 竖版 9:16 —— 昵称「© 肖 默」实测 bbox x[1338,1455] y[1662,1692]，右锚 1458 避开「方」字尾笔（x≈1470） */
export const SEEKER_7TH_PORTRAIT: WatermarkTemplate = {
  id: 'seeker-7th-portrait',
  name: 'Seeker 七周年纪念海报 · 竖版',
  src: '/templates/seeker-7th-portrait-frame.webp',
  width: 2084,
  height: 3705,
  photoArea: { x: 0, y: 0, width: 2084, height: 3705, radius: 0 },
  fit: { base: 'contain' },
  frameAxis: 'x',
  qr: {
    src: '/templates/seeker-7th-portrait-qr.webp',
    x: 1713,
    y: 3399,
    width: 183,
    height: 183,
  },
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
  fonts: [{ family: 'NotoSansSCSub', url: '/fonts/noto-sans-sc-300-subset.woff2', weight: '300' }],
};

/** 横版 16:10 —— 昵称「@肖默」实测 bbox x[848,938] y[985,1012]，右锚 936 避开「方」字尾笔（x≈950） */
export const SEEKER_7TH_LANDSCAPE: WatermarkTemplate = {
  id: 'seeker-7th-landscape',
  name: 'Seeker 七周年纪念海报 · 横版',
  src: '/templates/seeker-7th-landscape-frame.webp',
  width: 2500,
  height: 1559,
  photoArea: { x: 0, y: 0, width: 2500, height: 1559, radius: 0 },
  fit: { base: 'contain' },
  frameAxis: 'y',
  qr: {
    src: '/templates/seeker-7th-landscape-qr.webp',
    x: 2265,
    y: 1367,
    width: 120,
    height: 120,
  },
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
  fonts: [{ family: 'NotoSansSCSub', url: '/fonts/noto-sans-sc-300-subset.woff2', weight: '300' }],
};

export const WATERMARK_TEMPLATES: readonly WatermarkTemplate[] = [
  SEEKER_7TH_PORTRAIT,
  SEEKER_7TH_LANDSCAPE,
];

export const DEFAULT_WATERMARK_TEMPLATE: WatermarkTemplate = SEEKER_7TH_PORTRAIT;

/** 昵称输入框长度上限（各模板取最大值） */
export const NICKNAME_MAX_LENGTH = Math.max(...WATERMARK_TEMPLATES.map(t => t.nickname.maxLength));
