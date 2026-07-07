# stevenfazzio.com — Site Specification

Personal website and blog for Steven Fazzio. This document is the source of truth
for site decisions. When a change contradicts this spec, update the spec first.

## Purpose

The site serves three audiences, in priority order:

1. **Drive-by visitors** who land on one project and should discover the others.
2. **Followers** who want to keep up with new work (RSS-first).
3. **Professional contacts** (potential employers, consulting prospects) who want
   to learn who I am and what I do.

The site's identity is the public-discourse identity: researcher, FOSS developer,
creator. Consulting gets a quiet mention, not top billing.

## Identity

One-liner for the homepage:

> I make maps of large text collections.

Second sentence carries the technical gloss (embeddings, clustering, interactive
datamaps) for readers who want it.

The one-liner describes **current focus**, not a permanent charter. Revise it
freely as research interests evolve; a specific sentence revised annually beats
a vague evergreen one. The durable identity (storyteller who codes, data
visualization as narrative medium) lives on `/about/`.

## Architecture

- **Repo:** `stevenfazzio/stevenfazzio.github.io` (public). This is the GitHub
  Pages *user site*; the name is mandated by GitHub.
- **Domain:** `stevenfazzio.com`, DNS via Cloudflare, set as the custom domain on
  this repo. Project repos then serve automatically at
  `stevenfazzio.com/<repo-name>/` with no per-repo config.
- **SSG:** Astro. Content collections with typed frontmatter schemas; build fails
  on missing required fields.
- **Deploy:** GitHub Action builds Astro and publishes to Pages (Action is the
  deployment source, not a branch).
- **No CMS, no admin UI, no database.** Adding a post = create one Markdown file
  matching the skeleton, commit, push. The agent is the author-of-record.

## Content model

Two content types:

1. **Blog posts** — the canonical write-up for every project, plus essays and
   opinion pieces. Posts live under `/posts/`.
2. **Project pages** — the interactive artifacts themselves, hosted in their own
   repos at `stevenfazzio.com/<repo-name>/`. A project page carries at most one
   line of description plus a link to its blog post. Standalone About/Methodology
   pages inside projects are retired; the blog post is canonical.

### Embedding rule

Blog posts embed **nothing that executes**. No iframes, no plotly, no datamaps.
Interactive work is represented by a static asset linking to the full-page
artifact. Rationale: full-text RSS (embeds break in readers), datamaps are
hostile to partial-viewport embedding, and the blog stays maintenance-free
forever (text and images only; only project pages carry JS that can rot).

Animated loops (GIF, or preferably looping muted WebM/MP4) count as static
assets and are encouraged: a short pan/zoom/hover loop is the best preview of
an interactive artifact. Pattern: looping video on the site, still or small GIF
as the RSS fallback. The `heroImage` used for OG cards stays a still for
renderer reliability.

### Post skeleton

Every project post follows the inverted pyramid:

1. Hook + hero image
2. What it is and why it's interesting (accessible; assumes the reader knows
   what an LLM is, does not assume they're a data scientist)
3. How it works, educated-layperson level
4. **Technical appendix** — prompts, model parameters, pipeline details.
   A plain heading, not `<details>` (renders inconsistently in feed readers).

### Datamap explainer

An evergreen "What is a datamap?" post is written early (first or second post).
Every datamap project post includes one inline sentence of explanation plus a
link to the explainer; the link is for depth, not basic comprehension. Keep the
explainer maintained as the canonical reference.

### Frontmatter schema (required fields)

- `title`
- `date`
- `description` (doubles as OG description)
- `heroImage`
- `draft` (boolean; drafts excluded from build)

## Pages

- `/` — homepage: one-liner, recent posts, pointer to projects.
- `/posts/` — post index and individual posts.
- `/projects/` — full index of all shareable projects. Populated completely at
  launch; this is the primary discovery surface.
- `/about/` — who I am, what I do, plus one sentence: available for consulting
  through Fazzio Consulting, with a contact link. No dedicated /consulting page
  until a prospect asks a question /about can't answer.
- `/rss.xml` (or `/feed/`) — full-text RSS of everything. All image URLs
  absolute.

Every page gets OG/social card tags. Discovery channels are HN, Reddit,
Bluesky, and Twitter/X (ML/AI discourse is split across the last two;
cross-post to both). Syndication model is POSSE: the site is canonical,
social posts are pointers. The card image is what gets clicked.

## Naming policy

Project repo names become URL paths, so:

- lowercase kebab-case, two or three words
- evocative over descriptive; name the artifact, not the tech
  (`atlantic-mirror` good, `qwen3-city-embeddings` bad)
- no dates or version numbers; project URLs should look permanent
- **Reserved paths, never used as repo names:** `posts`, `projects`, `about`,
  `feed`, `rss`, `tags`

## Project standardization

Each shared project repo gets, via a `publish-project` checklist skill:

- the shared favicon
- a consistent header/footer element linking back to the blog post
  ("← read the write-up")
- OG/social card tags
- an entry on the `/projects/` index

## Launch plan

1. Deploy placeholder page first; verify custom domain works and an existing
   project subpath (e.g. `stevenfazzio.com/semantic-github-map/`) resolves.
2. Templates: homepage, post layout, `/projects/` (fully populated with all ~11
   projects), `/about/`, RSS, OG tags.
3. First post: atlantic-mirror (draft in progress; not a datamap, no explainer
   dependency). The "What is a datamap?" explainer lands before the first
   datamap project post.
4. Release backlog posts roughly weekly, ordered by shareability. Do not
   backdate. ~11 projects = 2+ months of cadence runway.
5. Skills last: `write-post` (skeleton + frontmatter) and `publish-project`
   (checklist above), encoding what phases 2–3 taught us. `CLAUDE.md` points at
   this spec and the skills.

## Design

Structure first, aesthetics second. Ship with near-default styling, then do a
dedicated design pass in a separate session. Cartographic identity is the
long-term aesthetic direction.

## Non-goals (for now)

- Tags, search, dark-mode toggle, comments, analytics, newsletter. Revisit tags
  at ~20 posts if the need is felt. Do not let the agent volunteer these.
- Video/audio production, meaning produced content (talking-head video,
  podcasts). Animated previews of interactive work are in scope; see the
  embedding rule.
- A /consulting page.
