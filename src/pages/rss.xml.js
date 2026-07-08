import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

const md = new MarkdownIt({ html: true });

// Full-text feed of everything, with absolute URLs (see SPEC.md). Posts are
// plain Markdown by design, so rendering the raw body is sufficient.
export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const site = context.site.href; // trailing slash included

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => {
      const html = sanitizeHtml(md.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title'],
        },
      })
        // Root-relative URLs break in feed readers; absolutize them.
        .replaceAll('src="/', `src="${site}`)
        .replaceAll('href="/', `href="${site}`);

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/posts/${post.id}/`,
        content: html,
      };
    }),
  });
}
