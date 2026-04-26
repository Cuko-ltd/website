import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../lib/seo';

export async function GET(context: { site?: URL }) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Cuko Ltd — Writing',
    description:
      'Essays from Samuel Ventimiglia on engineering for crypto-native finance, healthcare, AI infrastructure, and regulated cloud-native and industrial systems.',
    site: context.site?.toString() ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      author: `samuel@cuko.uk (${post.data.author})`,
      categories: post.data.tags,
    })),
    customData: '<language>en-GB</language>',
  });
}
