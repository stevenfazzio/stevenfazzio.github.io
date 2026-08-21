import { getCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const publicDir = new URL('../../public/', import.meta.url);

/**
 * Every published project, ordered, with the invariants the index depends on
 * checked at build time.
 *
 * `jeopardy-map` sat hidden behind `published: false` for weeks while the map
 * was live, because nothing checked. These assertions fail the build instead:
 * a project is either published with somewhere to point, or it is not published.
 */
export async function getProjects() {
  const all = await getCollection('projects');

  const problems: string[] = [];

  for (const { id, data } of all) {
    if (data.published && !data.url) {
      problems.push(`${id}: published: true but no url — it has nowhere to point.`);
    }
    if (!data.published && data.url) {
      problems.push(
        `${id}: has a url but published: false — if it serves, flip the flag; if not, drop the url.`
      );
    }
    if (data.featured && !data.published) {
      problems.push(`${id}: featured: true but not published — it cannot reach the homepage.`);
    }
    if (data.thumbnail && !existsSync(fileURLToPath(new URL(`.${data.thumbnail}`, publicDir)))) {
      problems.push(`${id}: thumbnail ${data.thumbnail} does not exist under public/.`);
    }
  }

  const published = all.filter(({ data }) => data.published);

  const seen = new Map<number, string>();
  for (const { id, data } of published) {
    const clash = seen.get(data.order);
    if (clash) problems.push(`${id}: order ${data.order} collides with ${clash}.`);
    else seen.set(data.order, id);
  }

  if (problems.length) {
    throw new Error(`Invalid project entries:\n  - ${problems.join('\n  - ')}`);
  }

  return published.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects() {
  return (await getProjects()).filter(({ data }) => data.featured);
}
