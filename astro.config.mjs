import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeMermaid from 'rehype-mermaid';
import { remarkReadingTime } from './plugins/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://kamelazizi.dev',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: { theme: 'vitesse-light' },
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [[rehypeMermaid, { strategy: 'img-svg', dark: false }]],
  },
});
