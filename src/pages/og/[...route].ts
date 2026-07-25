import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const articles = await getCollection('articles', ({ data }) => !data.draft && !data.externalUrl);

const pages = Object.fromEntries([
  ['site', { title: 'Kamel Azizi', description: 'Développeur Fullstack Senior — Kotlin · Java · TypeScript' }],
  ...articles.map((a) => [a.id, { title: a.data.title, description: a.data.description }]),
]);

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: { title: string; description: string }) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[250, 246, 240]],
    border: { color: [154, 59, 46], width: 16, side: 'inline-start' },
    font: {
      title: { color: [26, 26, 26], size: 60, weight: 'Bold' },
      description: { color: [107, 98, 89], size: 30 },
    },
  }),
});
