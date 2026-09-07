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

export const collections = { members, welfare };
