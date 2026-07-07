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

export const collections = { members };
