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
  }),
});

export const collections = { members, welfare };
