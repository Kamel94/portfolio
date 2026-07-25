import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = (
    await getCollection('articles', ({ data }) => !data.draft && !data.externalUrl)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Kamel Azizi — Articles',
    description:
      'Tests, specs, feature flags : des articles pour faire durer le logiciel.',
    site: context.site,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.pubDate,
      link: `/articles/${a.id}/`,
    })),
  });
}
