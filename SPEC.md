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

## Authorship and voice

The agent maintains the site and drafts mechanics; the prose voice is
Steven's. AI assists with writing, but Steven directs what gets said and
edits heavily before anything is publishable. The value of a personal blog
in the AI-slop era is that it reads as a specific human's genuine
perspective; prose that smells generated damages the brand with exactly the
audience that matters. The agent-built workflow is not a secret but brand
material: a colophon post ("how this site is built") is future content.

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

A project is not necessarily a map or a tool: a scrollytelling essay or
explorable explanation is also a project. The embedding rule relocates
interactivity to project pages; it does not exclude it from the body of work.
When the project is itself narrative, the blog post remains the canonical
write-up even though the project is the canonical experience.

### Embedding rule

Blog posts embed **nothing that executes**. No iframes, no plotly, no datamaps.
Interactive work is represented by a static asset linking to the full-page
artifact. Rationale: full-text RSS (embeds break in readers), datamaps are
hostile to partial-viewport embedding, and the blog stays maintenance-free
forever (text and images only; only project pages carry JS that can rot).
A corollary: posts are plain Markdown (`.md`), never MDX. No post needs
components, and plain Markdown keeps full-text RSS rendering trivial.

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

The quality bar: a post must be worth reading by someone who never clicks
through to the artifact. Posts are guided tours (what to look at, what was
found, why it matters), not captions. If a draft adds nothing beyond "I made
a thing, here's the link", it is not ready to publish. The press-release
archive is this architecture's failure mode, and it is a content failure the
structure cannot prevent; this bar is what prevents it.

### Datamap explainer

An evergreen "What is a datamap?" post is written early (first or second post).
Every datamap project post includes one inline sentence of explanation plus a
link to the explainer; the link is for depth, not basic comprehension. Keep the
explainer maintained as the canonical reference.

### Frontmatter schema

Required:

- `title`
- `date`
- `description` (doubles as OG description)
- `heroImage`
- `draft` (boolean; drafts excluded from build)

Optional:

- `updated` (date of last substantive revision; see "Dates and revisions")

### Dates and revisions

- Every post displays its publish date, in the byline and on the post index.
  Undated articles are a trust failure.
- Post slugs never contain dates; post URLs should look as permanent as
  project URLs.
- Write-ups and essays are dated artifacts: published once, then frozen apart
  from typo fixes (typo fixes do not bump `updated`).
- Reference posts (the datamap explainer) are maintained documents:
  substantive edits set `updated`, and the byline shows both dates when they
  differ ("Published March 2026, updated July 2026").
- A substantive revision gets a one-line note at the end of the post
  ("Revised July 2026: rewrote the clustering section") plus a link to the
  file's GitHub history; the public repo is the provenance record.
- RSS chronology keys off `date`, not `updated`.

## Pages

- `/` — homepage: one-liner, featured projects (a hand-picked row of about
  three: best work, not latest), recent posts, pointer to the full projects
  index. The drive-by visitor gets the best shot first, not the most recent.
- `/posts/` — post index and individual posts.
- `/projects/` — full index of all shareable projects. Populated completely at
  launch; this is the primary discovery surface. Backed by a typed content
  collection (name, one-liner, project URL, thumbnail, link to the write-up
  once it exists) so the index is data-driven and `publish-project` appends
  an entry.
- `/about/` — who I am, what I do, plus one sentence: available for consulting
  through Fazzio Consulting, with a contact link. No dedicated /consulting page
  until a prospect asks a question /about can't answer.
- `/rss.xml` (or `/feed/`) — full-text RSS of everything. All image URLs
  absolute.
- Email subscription — an RSS-mirror newsletter (Buttondown or similar): the
  email is the feed, no produced newsletter content. The signup form ships
  before the first promoted post; traffic spikes are when an audience
  accumulates, and capture cannot be backfilled.

Every page gets OG/social card tags. Discovery channels are HN, Reddit,
Bluesky, Twitter/X, and LinkedIn (ML/AI discourse is split across Bluesky and
Twitter/X, so cross-post to both; LinkedIn is where employers and consulting
prospects live). Syndication model is POSSE: the site is canonical, social
posts are pointers. The card image is what gets clicked.

Machine legibility is a discovery channel of equal rank: a growing share of
"who does interesting work on X" questions are answered by LLMs with search
access. Every page carries JSON-LD (Person on the homepage and `/about/`,
BlogPosting on posts), `rel="me"` links tie the site to GitHub and social
profiles, and the site serves an `llms.txt`. Stable canonical URLs and clean
semantic HTML are part of the same story.

## Analytics

Plausible, as a single site registered for `stevenfazzio.com`. The domain
cascade puts the blog and every project on one domain, so one dashboard
covers everything, with paths separating blog from projects; referrer flows
between them measure the site's first purpose (do visitors who land on one
project discover the others?). Outbound link tracking measures which posts
drive clicks into the interactives. Existing per-project Plausible sites
consolidate into the domain site when the custom domain flips. Cookieless;
no consent banner.

## Naming policy

Project repo names become URL paths, so:

- lowercase kebab-case, two or three words
- evocative over descriptive; name the artifact, not the tech
  (`atlantic-mirror` good, `qwen3-city-embeddings` bad)
- no dates or version numbers; project URLs should look permanent
- **Reserved paths, never used as repo names:** `posts`, `projects`, `about`,
  `feed`, `rss`, `tags`
- Post slugs follow the same style: lowercase kebab-case, no dates (see
  "Dates and revisions")

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
   projects), `/about/`, RSS, OG tags, machine-legibility tags (JSON-LD,
   `rel="me"`, `llms.txt`), footer license line, Plausible, email signup.
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

Amended 2026-08-21: a *light* design pass landed early, ahead of the first
post, because the site had to carry a job application. It is scoped to
tokens — a type scale, spacing rhythm, and a palette — plus thumbnails on
`/projects/`. Cartographic identity remains the deferred, larger pass.

Dark mode follows `prefers-color-scheme` only. The non-goal below rules out a
dark-mode *toggle*, which this is not: every project map renders on near-black,
so a hardcoded white page framing dark thumbnails read as an accident rather
than a choice.

## Licensing

Post text and images: CC BY 4.0, stated in the site footer. Site code
(templates, config): MIT. Project repos carry their own licenses. Declared
from day one; retroactive licensing is ambiguous.

## Non-goals (for now)

- Tags, search, dark-mode toggle (the OS-preference block is not one; see
  Design), comments. Revisit tags at ~20 posts if the
  need is felt. Do not let the agent volunteer these.
- A produced newsletter. The RSS-mirror email exists so followers can
  subscribe by email; writing newsletter-only content is out of scope.
- Video/audio production, meaning produced content (talking-head video,
  podcasts). Animated previews of interactive work are in scope; see the
  embedding rule.
- A /consulting page.
