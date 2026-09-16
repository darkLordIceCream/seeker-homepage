/**
 * 首页「作品 Gallery」图单（feat-016）—— 唯一的换图入口。
 * 未来更换作品只改这个文件，WorksSection 的布局与交互不动。
 *
 * 约定（来自 Gallery 重构计划）：
 * - 图片一律引用 R2 现有对象（R2 只读：不新增 / 不移动 / 不重命名）；
 * - author / title 摘自 src/content/activities/*.md entries 的真实署名，
 *   不确定作者的作品不署名；alt 依据真实画面内容撰写；
 * - w / h 与 src/lib/activity-image-meta.ts 登记值一致（布局与 CLS 预留）；
 * - 不收录带第三方水印（手机品牌等）的图，作者本人 / 小组水印不算；
 * - 图片仅作 Seeker 作品展示，不代表特定活动主题，可整体替换。
 *
 * 轮换模型：每个图位持有自己的候选列表，由 WorksSection 的小段脚本
 * 以 3~6s/次的独立随机间隔轮换（各图位节奏互不相同，形成不对称感）。
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

/** 主视觉图位（横幅）：单格轮换列表 */
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
  {
    src: `${R2}/activities/story-of-time-2025-06/03.webp`,
    w: 1080,
    h: 810,
    author: 'iwanna我想',
    alt: '岩洞的缺口天然像一幅画框，框住湖边静立的人影与远处锥形的山。',
  },
  {
    src: `${R2}/activities/story-of-time-2024-12/01.webp`,
    w: 1080,
    h: 720,
    author: '脏了的布娃娃',
    alt: '一轮巨大的落日悬在山上亭阁背后，鸟群掠过橙红色的天空。',
  },
] as const;

/** 竖幅图位 ×3（2:3）：每格一份独立轮换列表 */
export const GALLERY_SUPPORT_TALL: readonly (readonly GalleryImage[])[] = [
  [
    {
      src: `${R2}/activities/2026-08/01.webp`,
      w: 1080,
      h: 1620,
      author: '迅雷疾风',
      title: '霞染申城',
      alt: '清晨霞光下的上海：老城厢尚未苏醒，陆家嘴天际线在橙红云层下静静发亮。',
    },
    {
      src: `${R2}/activities/2026-04/05.webp`,
      w: 1080,
      h: 1620,
      author: 'X_ming',
      title: '金辉下的澳门港',
      alt: '金色暮光下的跨海大桥层层叠向远方，桥下是欧式风情建筑群与游船。',
    },
    {
      src: `${R2}/activities/2026-01/01.webp`,
      w: 1080,
      h: 1623,
      author: 'ClevelandZhu',
      title: '你好！2026！',
      alt: '跨年夜烟花在铁塔形建筑四周绽放出 2026 字样，人群举起一片手机。',
    },
  ],
  [
    {
      src: `${R2}/activities/2026-02/01.webp`,
      w: 1080,
      h: 1620,
      author: '日行性猫猫',
      title: '暮日之城',
      alt: '暮色里透过黑色拱门望向覆雪的教堂，圣诞树与 2026 字样立在广场中央。',
    },
    {
      src: `${R2}/activities/2026-05/01.webp`,
      w: 1024,
      h: 1536,
      author: '日行性猫猫',
      title: '林中密城',
      alt: '云雾在绿色山谷间流动，一栋蓝色屋顶的建筑藏在林海深处。',
    },
    {
      src: `${R2}/activities/story-of-time-2025-11/03.webp`,
      w: 1080,
      h: 1620,
      author: 'Talon',
      alt: '仰拍一棵秋意正浓的大树，橙红的枝叶间露出小块蓝天。',
    },
  ],
  [
    {
      src: `${R2}/activities/story-of-time-2025-10/01.webp`,
      w: 960,
      h: 1440,
      author: '源Dream',
      alt: '一颗彗星悬在贡嘎雪山峰顶上空的星夜里，山体覆着皑皑白雪。',
    },
    {
      src: `${R2}/activities/2026-07/01.webp`,
      w: 1080,
      h: 1620,
      author: 'X_ming',
      title: '天穹彼岸',
      alt: '沙井般的岩洞圆窗里旋着绿色气辉与星轨，一个人提灯站在洞底。',
    },
    {
      src: `${R2}/activities/story-of-time-2025-07/11.webp`,
      w: 1080,
      h: 1620,
      author: '移动城堡内的全麦',
      alt: '银河核心悬在山脊上空，一个人站在草坡上仰望，远处城市灯带发亮。',
    },
  ],
] as const;

/** 方幅图位 ×3（1:1）：每格一份独立轮换列表 */
export const GALLERY_SUPPORT_SQUARE: readonly (readonly GalleryImage[])[] = [
  [
    {
      src: `${R2}/activities/2026-04/08.webp`,
      w: 1080,
      h: 1083,
      author: '屋顶数星星',
      title: '从“头”开始',
      alt: '黑白街头：理发店墙上挂满发型肖像，镜子里的老板正在等客。',
    },
    {
      src: `${R2}/activities/2026-01/23.webp`,
      w: 1080,
      h: 975,
      author: '程早',
      title: '极光洒落童话小镇',
      alt: '极光垂在彩色木屋小镇上空，光带倒映在水面上。',
    },
    {
      src: `${R2}/activities/story-of-time-2025-08/15.webp`,
      w: 1080,
      h: 895,
      author: '月某人',
      alt: '航拍城市夜景的微小星球效果，万家灯火被云层环绕。',
    },
  ],
  [
    {
      src: `${R2}/activities/2026-03/14.webp`,
      w: 1080,
      h: 1080,
      author: '白纸',
      title: '我与我',
      alt: '雾蓝色调中，一扇发光的门洞里立着举相机的剪影，倒影落在水面。',
    },
    {
      src: `${R2}/activities/2026-04/23.webp`,
      w: 1080,
      h: 1080,
      author: '黑暗之王',
      alt: '高调留白的海滩，一道蜿蜒的水线旁有个小小的人影。',
    },
    {
      src: `${R2}/activities/story-of-time-2025-09/14.webp`,
      w: 1080,
      h: 1080,
      author: '让我吃一口',
      alt: '幽暗的房间里，一扇亮着的窗前立着一个背影。',
    },
  ],
  [
    {
      src: `${R2}/activities/2026-05/03.webp`,
      w: 1080,
      h: 1080,
      author: '柯达拍什么',
      title: '一瞬与永恒',
      alt: '闪光灯微距下的红色麦秆菊，一只蜜蜂停在黄色花蕊上采蜜。',
    },
    {
      src: `${R2}/activities/2026-05/08.webp`,
      w: 1080,
      h: 1080,
      author: '屋顶数星星',
      title: '海边的袋鼠',
      alt: '海边草崖上一只袋鼠坐着望向大海，柔和的光铺在草坡上。',
    },
    {
      src: `${R2}/activities/story-of-time-2025-11/20.webp`,
      w: 1080,
      h: 1080,
      author: '黑暗之王',
      alt: '黑白影调里，云雾漫过城市高楼群与黑色沙滩。',
    },
  ],
] as const;
