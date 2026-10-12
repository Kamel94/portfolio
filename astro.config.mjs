import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeMermaid from 'rehype-mermaid';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkReadingTime } from './plugins/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://kameldev.fr',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  // Page Expériences en maintenance : retirer le filtre pour la réindexer.
  integrations: [sitemap({ filter: (page) => !page.includes('/experiences/') })],
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: { theme: 'vitesse-light' },
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      [rehypeMermaid, { strategy: 'img-svg', dark: false }],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
