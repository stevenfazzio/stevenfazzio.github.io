import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts: the canonical write-up for every project, plus essays.
// Plain Markdown only (never MDX); images live under public/ and are
// referenced by root-relative paths so full-text RSS stays trivial.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    heroImage: z.string(),
    draft: z.boolean(),
    updated: z.coerce.date().optional(),
  }),
});

// Projects index: the primary discovery surface. One YAML file per project;
// `publish-project` appends an entry here.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    oneLiner: z.string(),
    url: z.string().url().optional(),
    thumbnail: z.string().optional(),
    post: z.string().optional(),
    featured: z.boolean().default(false),
    // Hidden from the index until the project actually serves (e.g. repo not
    // yet published). Distinct from curation: unlisted projects stay out of
    // the collection entirely.
    published: z.boolean().default(true),
    order: z.number().default(999),
  }),
});

export const collections = { posts, projects };
