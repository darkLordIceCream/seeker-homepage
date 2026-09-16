/**
 * 首页「作品 Gallery」图单（feat-016）—— 唯一的换图入口。
 * 未来更换作品只改这个文件，WorksSection 的布局与交互不动。
 *
 * 约定（来自 Gallery 重构计划）：
 * - 图片一律引用 R2 现有对象（R2 只读：不新增 / 不移动 / 不重命名）；
 * - author / title 摘自 src/content/activities/*.md entries 的真实署名，
 *   不确定作者的作品不署名；alt 依据真实画面内容撰写；
 * - w / h 与 src/lib/activity-image-meta.ts 登记值一致（布局与 CLS 预留）；
 * - 不收录带第三方水印（手机品牌等）的图，作者本人的签名不算；
 * - 图片仅作 Seeker 作品展示，不代表特定活动主题，可整体替换。
 */
export interface GalleryImage {
  /** R2 绝对 URL */
  src: string;
  /** 原始像素宽（构建期布局 + CLS 预留） */
  w: number;
  /** 原始像素高 */
  h: number;
  /** 作者昵称（activities entries 真实署名） */
  author: string;
  /** 作品名（entries 原文，无题作品省略） */
  title?: string;
  /** 无障碍描述 */
  alt: string;
}

const R2 = 'https://r2.xn--seeker-ng2jm403afb4a.club';

/** 主视觉池：主图位轮换慢速 crossfade（横幅，比例接近 4:3~3:2） */
export const GALLERY_HERO: readonly GalleryImage[] = [
  {
    src: `${R2}/activities/2026-04/02.webp`,
    w: 1080,
    h: 719,
    author: '立青',
    title: '渡光',
    alt: '落日把滩涂镀成金色，一群蛎鹬振翅飞过，两只白鹭静立在映着夕光的水洼边。',
  },
  {
    src: `${R2}/activities/story-of-time-2025-01/04.webp`,
    w: 1080,
    h: 828,
    author: '钪钇',
    alt: '雪山国王峰脚下的冰川，蓝冰纹理铺满前景，夕阳照亮尖顶。',
  },
  {
    src: `${R2}/activities/2026-02/04.webp`,
    w: 1080,
    h: 709,
    author: '魔法药',
    title: '留白待雪',
    alt: '大雪留白的海岸弧线，一只小鸟立在雪沿，远处的跨海大桥隐在雾色里。',
  },
] as const;

/** 辅助展墙 · 竖幅一排（2:3） */
export const GALLERY_SUPPORT_TALL: readonly GalleryImage[] = [
  {
    src: `${R2}/activities/2026-08/01.webp`,
    w: 1080,
    h: 1620,
    author: '迅雷疾风',
    title: '霞染申城',
    alt: '清晨霞光下的上海：老城厢尚未苏醒，陆家嘴天际线在橙红云层下静静发亮。',
  },
  {
    src: `${R2}/activities/2026-02/01.webp`,
    w: 1080,
    h: 1620,
    author: '日行性猫猫',
    title: '暮日之城',
    alt: '暮色里透过黑色拱门望向覆雪的教堂，圣诞树与 2026 字样立在广场中央。',
  },
  {
    src: `${R2}/activities/story-of-time-2025-10/01.webp`,
    w: 960,
    h: 1440,
    author: '源Dream',
    alt: '一颗彗星悬在贡嘎雪山峰顶上空的星夜里，山体覆着皑皑白雪。',
  },
] as const;

/** 辅助展墙 · 方幅一排（1:1） */
export const GALLERY_SUPPORT_SQUARE: readonly GalleryImage[] = [
  {
    src: `${R2}/activities/2026-04/08.webp`,
    w: 1080,
    h: 1083,
    author: '屋顶数星星',
    title: '从“头”开始',
    alt: '黑白街头：理发店墙上挂满发型肖像，镜子里的老板正在等客。',
  },
  {
    src: `${R2}/activities/2026-03/14.webp`,
    w: 1080,
    h: 1080,
    author: '白纸',
    title: '我与我',
    alt: '雾蓝色调中，一扇发光的门洞里立着举相机的剪影，倒影落在水面。',
  },
  {
    src: `${R2}/activities/2026-05/03.webp`,
    w: 1080,
    h: 1080,
    author: '柯达拍什么',
    title: '一瞬与永恒',
    alt: '闪光灯微距下的红色麦秆菊，一只蜜蜂停在黄色花蕊上采蜜。',
  },
] as const;
