import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../lib/seo';

export async function GET(context: { site?: URL }) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const site = context.site?.toString() ?? SITE_URL;
  const feedUrl = `${site.replace(/\/$/, '')}/rss.xml`;

  return rss({
    title: 'Cuko Ltd — Writing',
    description:
      'Essays from Samuel Ventimiglia on engineering for crypto-native finance, healthcare, AI infrastructure, and regulated cloud-native and industrial systems.',
    site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      author: `samuel@cuko.uk (${post.data.author})`,
      categories: post.data.tags,
    })),
    customData: `<language>en-GB</language><atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
  });
}
