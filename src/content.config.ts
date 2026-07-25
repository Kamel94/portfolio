import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const experiences = defineCollection({
  loader: glob({ base: './src/content/experiences', pattern: '**/*.md' }),
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    company: z.string(),
    role: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    stack: z.array(z.string()),
    summary: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    title: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    stack: z.array(z.string()),
    summary: z.string(),
    demoUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    externalUrl: z.string().url().optional(),
    externalHost: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { experiences, projects, articles };
