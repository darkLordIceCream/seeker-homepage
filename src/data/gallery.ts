/**
 * 首页「作品 Gallery」图单（feat-016，2026-09 问卷收集版）—— 唯一的换图入口。
 * 未来更换作品只改这个文件，WorksSection 的布局与交互不动。
 *
 * 数据来源（2026-09 成员问卷收集，39 张）：
 * - 全部图片存于 R2 `gallery/<作者ID>.jpg`（文件名即作者 ID），
 *   构建期统一长边 ≤2560 / JPEG q90 / 已去除 EXIF（含位置隐私）；
 * - author 即作者 ID（问卷署名，原样保留）；title 来自文件名中的作品名后缀；
 * - alt 依据真实画面内容撰写；
 * - `GALLERY_POOL` 为全量池（含未上墙作品），七周年板块的 HERO 背景、
 *   首页角卡与「留光成物」纪念物照片均从池中取图（单一来源）。
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
  /** 作者 ID（问卷署名，即 R2 文件名） */
  author: string;
  /** 作品名（问卷文件名中的作品名后缀，无题作品省略） */
  title?: string;
  /** 无障碍描述 */
  alt: string;
}

const R2 = 'https://r2.xn--seeker-ng2jm403afb4a.club';

/** 主视觉图位（横幅）：单格轮换列表 */
export const GALLERY_HERO: readonly GalleryImage[] = [
  {
    src: `${R2}/gallery/Feiyu.jpg`,
    w: 2560,
    h: 1035,
    author: 'Feiyu',
    alt: '航拍晨昏时分的红层峡谷，蜿蜒的沟壑被低角度的暖光染成橙红色。',
  },
  {
    src: `${R2}/gallery/日行性猫猫.jpg`,
    w: 2560,
    h: 1706,
    author: '日行性猫猫',
    alt: '雪夜里的亭台楼阁亮着暖黄的灯，灯影落在雪地上，光斑在夜色里漂浮。',
  },
  {
    src: `${R2}/gallery/柠檬茶Jayalt-松韵楼国旗满月.jpg`,
    w: 2560,
    h: 1707,
    author: '柠檬茶Jayalt',
    title: '松韵楼国旗满月',
    alt: '一轮圆月恰好悬在中式楼阁的飞檐之上，栏杆前立着旗杆与赏月的人。',
  },
  {
    src: `${R2}/gallery/阿帆📷.jpg`,
    w: 2560,
    h: 1439,
    author: '阿帆📷',
    alt: '夜色中，表演者吐出一道扇形火焰，四溅的火星照亮了四周。',
  },
  {
    src: `${R2}/gallery/心游万仞_武功山之金晨云海_.jpg`,
    w: 2419,
    h: 1491,
    author: '心游万仞',
    title: '武功山之金晨云海',
    alt: '金色晨光漫过武功山的草甸山脊，云海在山谷间缓缓铺开。',
  },
] as const;

/** 竖幅图位 ×3（2:3）：每格一份独立轮换列表 */
export const GALLERY_SUPPORT_TALL: readonly (readonly GalleryImage[])[] = [
  [
    {
      src: `${R2}/gallery/Rorbin.jpg`,
      w: 1704,
      h: 2560,
      author: 'Rorbin',
      alt: '夜色河岸边火光连成一片，对岸的城市灯火与浓云倒映在水里。',
    },
    {
      src: `${R2}/gallery/仔仔_济南的夏天.jpg`,
      w: 1703,
      h: 2560,
      author: '仔仔',
      title: '济南的夏天',
      alt: '一列列车驶过城市高架，夏夜的楼群与轨道在蓝调里延伸。',
    },
    {
      src: `${R2}/gallery/阿岐.jpg`,
      w: 1682,
      h: 2560,
      author: '阿岐',
      alt: '夜间的民俗表演上，铁水打向空中炸开漫天金色火花。',
    },
  ],
  [
    {
      src: `${R2}/gallery/Henry浩麟.jpg`,
      w: 1920,
      h: 2560,
      author: 'Henry浩麟',
      alt: '云雾在峭壁孤峰之间流动，山体在薄雾里只露出轮廓。',
    },
    {
      src: `${R2}/gallery/柳小丁_雾都雨夜_.jpg`,
      w: 1440,
      h: 2560,
      author: '柳小丁',
      title: '雾都雨夜',
      alt: '仰拍雨夜里的摩天楼直入云层，一把伞悬在两栋楼之间。',
    },
    {
      src: `${R2}/gallery/沐_静谧.jpg`,
      w: 1706,
      h: 2560,
      author: '沐',
      title: '静谧',
      alt: '俯瞰被白雪覆盖的滨海小镇，云雾安静地漫过海湾。',
    },
  ],
  [
    {
      src: `${R2}/gallery/Ferman.jpg`,
      w: 1440,
      h: 2560,
      author: 'Ferman',
      alt: '绿色极光在针叶林上空舞动，星空下雪地泛着微光。',
    },
    {
      src: `${R2}/gallery/南山.jpg`,
      w: 1706,
      h: 2560,
      author: '南山',
      alt: '航拍蓝橙交织的海岸漩涡，一块深色礁石正居涡心。',
    },
    {
      src: `${R2}/gallery/舒克大地瓜.jpg`,
      w: 1695,
      h: 2560,
      author: '舒克大地瓜',
      alt: '夜色渔港里泊着几艘渔船，远处的灯塔亮着暖光。',
    },
  ],
] as const;

/** 方幅图位 ×3（1:1）：每格一份独立轮换列表 */
export const GALLERY_SUPPORT_SQUARE: readonly (readonly GalleryImage[])[] = [
  [
    {
      src: `${R2}/gallery/旺旺仙贝.jpg`,
      w: 2560,
      h: 2560,
      author: '旺旺仙贝',
      alt: '一面素墙前，台灯与落地灯各自亮着一团暖光。',
    },
    {
      src: `${R2}/gallery/拾1_绿鬣蜥.jpg`,
      w: 2560,
      h: 1928,
      author: '拾1',
      title: '绿鬣蜥',
      alt: '一只绿鬣蜥趴在沙地上回头张望，皮肤纹理清晰可见。',
    },
    {
      src: `${R2}/gallery/V.ter.jpg`,
      w: 2560,
      h: 1707,
      author: 'V.ter',
      alt: '夏日海滩的浅浪里，人们弯着腰嬉水，浪花漫过脚踝。',
    },
  ],
  [
    {
      src: `${R2}/gallery/Michelle_Chen_蓝调下的阳明滩.jpg`,
      w: 2560,
      h: 1707,
      author: 'Michelle_Chen',
      title: '蓝调下的阳明滩',
      alt: '蓝调时刻的大桥亮起灯链，灯光倒映在安静的江面上。',
    },
    {
      src: `${R2}/gallery/南迦巴瓦_恢复的3.jpg`,
      w: 1707,
      h: 2560,
      author: '南迦巴瓦',
      alt: '晨光落在河谷与雪峰之间，江水在金色山峦里穿行。',
    },
    {
      src: `${R2}/gallery/镜中_市井五味.jpg`,
      w: 988,
      h: 1440,
      author: '镜中',
      title: '市井五味',
      alt: '俯拍市集摊位，一格一格的香料五谷前围坐着挑拣的人。',
    },
  ],
  [
    {
      src: `${R2}/gallery/纯黑的林桑_怪天气_.jpg`,
      w: 1440,
      h: 2560,
      author: '纯黑的林桑',
      title: '怪天气',
      alt: '人物抱着警示条纹的方块，头顶漂浮着一簇绿色气球。',
    },
    {
      src: `${R2}/gallery/Zijie-Chen-大海道拍车.jpg`,
      w: 1535,
      h: 2048,
      author: 'Zijie-Chen',
      title: '大海道拍车',
      alt: '沙漠公路上，一辆车正驶向落日的尽头。',
    },
    {
      src: `${R2}/gallery/王哼哼.jpg`,
      w: 2560,
      h: 1920,
      author: '王哼哼',
      alt: '车站的长阶梯上两个行人擦肩，头顶悬着一面大钟。',
    },
  ],
] as const;

/** 全量池（39 张，含未上墙作品）：七周年 HERO 背景 / 首页角卡 / 纪念物取图来源 */
export const GALLERY_POOL: readonly GalleryImage[] = [
  ...GALLERY_HERO,
  ...GALLERY_SUPPORT_TALL.flat(),
  ...GALLERY_SUPPORT_SQUARE.flat(),
  {
    src: `${R2}/gallery/BayMax.jpg`,
    w: 1616,
    h: 1080,
    author: 'BayMax',
    alt: '黑白影调的老茶馆里，手艺人围着茶壶忙碌。',
  },
  {
    src: `${R2}/gallery/Forever逍遥_当百年一遇的666遇上世纪朝霞.jpg`,
    w: 2560,
    h: 1440,
    author: 'Forever逍遥',
    title: '当百年一遇的666遇上世纪朝霞',
    alt: '世纪朝霞把天空染成红金两色，跨海大桥的灯链亮在水面。',
  },
  {
    src: `${R2}/gallery/LUee.jpg`,
    w: 2560,
    h: 1722,
    author: 'LUee',
    alt: '草原上空悬着一道完整的环形彩虹，一个人站在田埂尽头。',
  },
  {
    src: `${R2}/gallery/No_25_不要回答.jpg`,
    w: 2560,
    h: 1707,
    author: 'No.25',
    title: '不要回答',
    alt: '晨雾里的巨型射电望远镜天线，一个身影从草坡下走过。',
  },
  {
    src: `${R2}/gallery/Siwenphotograph_寻山之路.jpg`,
    w: 1280,
    h: 2275,
    author: 'Siwenphotograph',
    title: '寻山之路',
    alt: '雨后的草甸上小路蜿蜒向远处的雪山，云层低垂。',
  },
  {
    src: `${R2}/gallery/Tommic_The_Night_of_Braunschwe.jpg`,
    w: 2560,
    h: 1919,
    author: 'Tommic',
    title: 'The Night of Braunschweig',
    alt: '雨后的石板路街口，落日把湿漉漉的路面照得发亮。',
  },
  {
    src: `${R2}/gallery/Wyatt.jpg`,
    w: 1601,
    h: 1200,
    author: 'Wyatt',
    alt: '紫色薰衣草田的尽头，一对牵手的人望向落日。',
  },
  {
    src: `${R2}/gallery/YVES.jpg`,
    w: 1920,
    h: 1280,
    author: 'YVES',
    alt: '夜色废墟前，一点提灯的绿光在草丛里亮着。',
  },
  {
    src: `${R2}/gallery/月某人_深圳之眼.jpg`,
    w: 1179,
    h: 2091,
    author: '月某人',
    title: '深圳之眼',
    alt: '垂直航拍城市十字路口的夜色，车流围出一枚发光的圆环。',
  },
  {
    src: `${R2}/gallery/通哈哈_麦田里的守望者_.jpg`,
    w: 2385,
    h: 2560,
    author: '通哈哈',
    title: '麦田里的守望者',
    alt: '麦田上空的星轨绕成同心圆，一点车灯划过田埂。',
  },
] as const;
