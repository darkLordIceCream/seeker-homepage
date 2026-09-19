import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      title: z.string(),
      avatar: image(),
      bio: z.string(),
      specialties: z.array(z.string()),
      social: z
        .object({
          douyin: z.string().optional(),
          xiaohongshu: z.string().optional(),
          '500px': z.string().optional(),
        })
        .optional(),
    }),
});

const welfare = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/welfare' }),
  schema: z.object({
    /** 卡片与详情页主标题，如「带上她的眼睛」 */
    title: z.string(),
    /** 副标题，如「在遥远的地方，我看到了什么」 */
    subtitle: z.string().optional(),
    /** 文首品牌句（原公众号排版中的 SEEKER / 繁星闪烁之时） */
    kicker: z.string().optional(),
    /** 封面引言（原排版中的「山村中的摄影课」） */
    coverLine: z.string().optional(),
    /** 项目卡片 / 文章页头图 */
    cover: z.string(),
    /** 摘要（列表卡片展示用） */
    excerpt: z.string(),
    /** 文首金句（可选） */
    quote: z.string().optional(),
    quoteAuthor: z.string().optional(),
    pubDate: z.coerce.date(),
    author: z.string().default('Seeker追光者'),
    /** 列表排序，越小越靠前 */
    order: z.number().default(0),
    /** 文章模板：editorial = 画册/编辑部（默认），hasselblad = 哈苏式图集，magnum = Magnum 式画册 */
    layout: z.enum(['editorial', 'hasselblad', 'magnum']).default('editorial'),
    /** 延伸阅读卡标题；不设则用 title（当 title 与项目名相同时应设置此项） */
    cardTitle: z.string().optional(),
  }),
});

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: () => {
    /** 画廊条目：一天多投共用一个日期章节（日期相同即同章）；images 支持一稿多图（同一作品下多张照片）。
     *  早期版式（2021-2025）无日期头/作品名，date/title 均可选 */
    const activityEntry = z.object({
      /** 展示日期，如「7月28日」；无日期版式可省略 */
      date: z.string().optional(),
      /** 作品名称（不含书名号）；无作品名版式可省略 */
      title: z.string().optional(),
      /** 所属栏目章节，如「城市」「人像肖像组」；无栏目版式可省略 */
      group: z.string().optional(),
      /** 作者的一句话说明 */
      caption: z.string(),
      /** 作者署名（不含 @） */
      author: z.string(),
      /** 照片（R2 远程 URL，构建期经 src/lib/activity-image-meta 提供尺寸） */
      images: z.array(z.string()).min(1),
    });

    return z.object({
      /** 活动名，如「时间的故事」 */
      title: z.string(),
      /** 本期主题句，如「夕光沉远岸，秋意漫画框」 */
      subtitle: z.string(),
      /** 期数名，如「八月篇」 */
      issue: z.string(),
      /** 期数时间标注，如「AUGUST 2026」 */
      period: z.string(),
      /** 活动卡片 / 页面封面（R2 远程 URL，构建期经 src/lib/activity-image-meta 提供尺寸） */
      cover: z.string(),
      /** 摘要（SEO / 列表展示用） */
      excerpt: z.string(),
      /** 开篇金句 */
      quote: z.string().optional(),
      /** 本月组长 / 编辑 */
      team: z
        .object({
          lead: z.string(),
          editor: z.string(),
        })
        .optional(),
      pubDate: z.coerce.date(),
      /** 期数排序，越小越早 */
      order: z.number().default(0),
      /** 页面模板（当前仅 gallery-story 画廊型） */
      layout: z.enum(['gallery-story']).default('gallery-story'),
      entries: z.array(activityEntry),
      /** 结尾诗（多行） */
      poem: z.string().optional(),
      /** 组委会收尾品牌图（R2 远程 URL） */
      committeeImage: z.string().optional(),
      /** 组委会署名 */
      committee: z
        .object({
          name: z.string(),
          team: z.string(),
        })
        .optional(),
    });
  },
});

/** 追光之旅获奖者：公示名单 + 赏析文共用的获奖条目 */
const lightChasingAward = z.object({
  /** 奖项名，如「总冠军」「自然组冠军」「优秀作品」 */
  award: z.string(),
  /** 作品名称（不含书名号） */
  title: z.string(),
  /** 作者昵称（原文「ID：」后的名字，照录） */
  author: z.string(),
  /** 代表图（结果公示区展示，R2 绝对 URL，构建期经 activity-image-meta 提供尺寸） */
  cover: z.string(),
  /** 赏析图组（作品赏析区按序展示，R2 绝对 URL） */
  images: z.array(z.string()).default([]),
  /** 背后的故事（摄影师第一人称自述，原文照录） */
  story: z.string().optional(),
});

// 追光之旅年度大赛：每年一个 .md（结果公示 + 作品赏析合并一页，影展式常暗）
const lightChasing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/light-chasing' }),
  schema: z.object({
    /** 届数年份，如 2024（同时是路由参数） */
    year: z.number(),
    /** 大赛全名，如「2024追光之旅摄影大赛」 */
    title: z.string(),
    /** 届期标注，如「DEC 2024 — APR 2025」 */
    period: z.string(),
    /** hero 封面 / og:image（总冠军代表图，R2 绝对 URL） */
    cover: z.string(),
    /** 摘要（SEO / 门户年份卡展示用） */
    excerpt: z.string(),
    /** 投稿数据句（原文照录，如「10w 余张投稿」） */
    stats: z.string().optional(),
    /** 赞助鸣谢（文字行，原文名单照录） */
    sponsors: z.string().optional(),
    /** 总冠军（hero 即其展示位） */
    grandPrize: lightChasingAward,
    /** 组别冠军（自然/城市/人文/商业创意/校园/组图） */
    groups: z.array(lightChasingAward).default([]),
    /** 优秀作品 */
    excellence: z.array(lightChasingAward).default([]),
    /** 特别关注奖 */
    attention: z.array(lightChasingAward).default([]),
    /** 公示期与异议渠道说明（原文照录） */
    resultsNote: z.string().optional(),
    /** 微信原文链接：结果公示 */
    sourceResults: z.string(),
    /** 微信原文链接：作品赏析 */
    sourceStories: z.string(),
    pubDate: z.coerce.date(),
    /** 届数排序，越小越早 */
    order: z.number().default(0),
    /** 页面模板（当前仅 light-chasing 影展型） */
    layout: z.enum(['light-chasing']).default('light-chasing'),
  }),
});

// 七周年手记：文章就位后在此目录新增 .md（schema 参照 welfare）
const anniversary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/anniversary' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
    pubDate: z.coerce.date(),
    order: z.number().default(0),
  }),
});

export const collections = { members, welfare, activities, lightChasing, anniversary };
