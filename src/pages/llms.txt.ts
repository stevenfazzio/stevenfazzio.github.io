import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getProjects } from '../lib/projects';
import { SITE_URL, CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from '../consts';

/**
 * Generated, not hand-maintained: the previous static public/llms.txt described
 * the one-project-per-subpath convention but named a single project, so a model
 * reading it learned the pattern and none of the inventory. Building it from the
 * same collection that renders /projects/ means the two cannot drift.
 */
export const GET: APIRoute = async () => {
  const projects = await getProjects();
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const projectLines = projects
    .map(({ data }) => `- [${data.name}](${data.url}): ${data.oneLiner}`)
    .join('\n');

  const postLines = posts.length
    ? posts
        .map(
          ({ id, data }) =>
            `- [${data.title}](${SITE_URL}/posts/${id}/) (${data.date.toISOString().slice(0, 10)}): ${data.description}`
        )
        .join('\n')
    : '- No posts published yet; the first write-up lands soon.';

  const body = `# Steven Fazzio

> Personal site and blog of Steven Fazzio, a data scientist who makes interactive
> maps of large text collections (embeddings, clustering, interactive datamaps).
> The blog post is the canonical write-up for every project; the interactive
> artifacts themselves are served at subpaths of this domain (one project per
> subpath, e.g. ${SITE_URL}/semantic-github-map/).

## Pages

- [Posts](${SITE_URL}/posts/): project write-ups, explainers, and essays
- [Projects](${SITE_URL}/projects/): index of all interactive projects
- [About](${SITE_URL}/about/): who Steven is, what he does, contact
- [RSS](${SITE_URL}/rss.xml): full-text feed of all posts

## Projects

${projectLines}

## Posts

${postLines}

## Contact

- Email: ${CONTACT_EMAIL}
- GitHub: ${GITHUB_URL}
- LinkedIn: ${LINKEDIN_URL}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
