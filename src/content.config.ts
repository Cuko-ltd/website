import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Samuel Ventimiglia'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
    newsArticle: z.boolean().default(false),
    legislation: z
      .array(
        z.object({
          name: z.string(),
          identifier: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { blog };
