import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
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
    shikiConfig: { theme: 'vitesse-light' },
    remarkPlugins: [remarkReadingTime],
  },
});
