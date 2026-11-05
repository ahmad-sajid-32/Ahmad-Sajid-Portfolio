# Portfolio Rebuild — Architecture Document

**Project:** Ahmad Sajid — personal portfolio, v2
**Status:** APPROVED by Ahmad, 2026-11-04 — this document is the contract the code is built against.
**Date:** 2026-11-04
**Location:** `docs/ARCHITECTURE.md` in this repository. Theme token values and the design structure summary are folded in as Appendices A and B so this file is self-contained.

---

## 1. Purpose and principles

Rebuild `ahmad-sajid.vercel.app` from a static HTML/CSS/JS page into a multi-page
Next.js + Payload CMS application that:

1. Proves Ahmad's actual level — backend depth, AI agents in production, and
   full-stack delivery — through real case-study pages, not skill bars.
2. Is editable without code for the things that change (projects, blogs,
   media) and editable by JSON for the things that don't (page copy).
3. Carries a distinct, animated, 3D-flavoured identity that does not read as
   a generic generated template.
4. Costs PKR 0 to run — free tiers and open-source software only.
5. Never breaks the live domain while being built — that domain sits on
   active job applications.

### Non-goals

- No e-commerce, no public user accounts, no comments system in v1.
- No page-builder. Pages are coded components; only their *text* and the
  catalog content are data-driven.
- No content may be invented. All factual copy comes from
  `02-Profile-and-Form-Facts.md` and the verified project list (§14).

---

## 2. System overview

```text
                        ┌──────────────────────────────────────────┐
   Visitor ───────────► │  Next.js app (Vercel, same project)      │
                        │                                          │
                        │  Public pages (SSG / ISR)                │
                        │    /  /about  /projects  /blog  /contact │
                        │                                          │
                        │  Payload CMS (embedded, /admin, /api)    │
                        └───────┬──────────────────┬───────────────┘
                                │                  │
                     Postgres (pooler)      S3-compatible storage
                                │                  │
                        ┌───────▼──────────────────▼───────────────┐
                        │  Supabase (free tier)                    │
                        │  Database 500 MB · Storage bucket 1 GB   │
                        └──────────────────────────────────────────┘

   Page copy ──► content/*.json  (in repo, imported at build, typed)
   Contact form ──► Payload collection + Resend email + Turnstile check
```

One deployable, one repo, one backend service. Payload runs *inside* the
Next.js app (its native v3 architecture) — there is no separate CMS server
to host, pay for, or keep awake.

---

## 3. Technology stack (all free / open source)

Versions follow Ahmad's `abbandesha` project where a choice already exists
there — consistency with his own codebase is deliberate.

| Layer | Choice | Version / note |
|---|---|---|
| Framework | Next.js (App Router) | 16.x, as in abbandesha |
| UI runtime | React / React DOM | 19.x |
| Language | TypeScript | 5.x, `strict: true` |
| Styling | Tailwind CSS | v4 (PostCSS plugin, `@theme` tokens) |
| UI primitives | Radix UI + class-variance-authority | shadcn-style, hand-owned components (his pattern) |
| Class merging | clsx + tailwind-merge | `cn()` in `lib/utils.ts` |
| Icons | lucide-react | no icon fonts, no raw SVG dumps in pages |
| CMS | Payload CMS | v3 — Postgres adapter + S3 storage adapter |
| Database + storage | Supabase (free) | Postgres 500 MB; storage bucket 1 GB, 50 MB/file max |
| Animation (UI/scroll) | Motion (`motion/react`) | as in abbandesha; `useScroll`/`useTransform` for parallax |
| Smooth scroll | Lenis | open source; disabled for reduced-motion users |
| 3D | three + @react-three/fiber + @react-three/drei | home hero only, lazy-loaded |
| Forms | React Hook Form + Zod | replaces abbandesha's manual `useState` validation |
| Email | Resend (free tier) | contact-form notifications only |
| Bot protection | Cloudflare Turnstile (free) | + honeypot field; keys split client/server |
| Analytics | Vercel Analytics + Speed Insights | free on Hobby |
| Lint / format | ESLint 9 (eslint-config-next) | `lint`, `typecheck`, `build` must all pass pre-merge |

Explicitly **not** used: Formspree (abbandesha's contact dependency — the
portfolio owns its backend), GSAP (Motion already covers every planned
effect; two animation engines is bundle bloat), any paid UI kit.

---

## 4. Repository and deployment topology

- **Repo:** `github.com/ahmad-sajid-32/Ahmad-Sajid-Portfolio` — the existing
  repo is overridden with the Next.js codebase. Same repo → same Vercel
  project → same production domain (`ahmad-sajid.vercel.app`). Nothing about
  DNS or domains changes at launch.
- **Branches:**
  - `legacy-html` — a permanent branch preserving the current static site
    exactly as it is today, before anything is overwritten.
  - `rebuild` — all new work. Vercel builds it as a **preview deployment**.
  - `main` — production. Merged into **once**, at launch, after the preview
    checklist in §15 passes.
- **Vercel settings:** framework preset auto-detects Next.js; root directory
  unchanged; production branch stays `main`. The old domain
  (`ahmad-sajid-s-portfolio.vercel.app`) already 307-redirects to the new
  one — no change needed or wanted.
- **Rollback:** if anything is wrong after the merge, production rolls back
  to the previous deployment from the Vercel dashboard in one click, and
  `legacy-html` still holds the old site intact.

### Environment variables (names only — values live in Vercel + local `.env`)

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | Payload | Supabase **transaction pooler** URI (port 6543) — required for serverless; direct connections exhaust on Vercel |
| `PAYLOAD_SECRET` | Payload | long random string; never committed |
| `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_REGION` | Payload storage adapter | Supabase Storage S3 credentials; bucket name `media` |
| `RESEND_API_KEY` | Contact form hook | server-only |
| `CONTACT_TO_EMAIL` | Contact form hook | Ahmad's inbox for notifications |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Contact form | secret is server-only |
| `NEXT_PUBLIC_SITE_URL` | SEO, sitemap, OG | `https://ahmad-sajid.vercel.app` |

---

## 5. Site map and page specifications

Home is a curated teaser, not a one-page site. Every section of the old
single page becomes a real route.

| Route | Purpose | Data source | Rendering |
|---|---|---|---|
| `/` | 3D hero, intro, featured projects (3), expertise snapshot, latest blogs (3), contact CTA | `content/home.json` + Payload (featured) | SSG + ISR |
| `/about` | Full story: bio, experience timeline (Devisgon, freelance), education (BS UAF 2022–2026, MS in progress), skills grouped by track, certificates | `content/about.json` | SSG |
| `/projects` | Full catalog with track filter (Backend / CRM Automation / Frontend / Full Stack / AI / Game Dev) | Payload `projects` | SSG + ISR |
| `/projects/[slug]` | Case study — see §5.1 | Payload `projects` | SSG (`generateStaticParams`) + ISR |
| `/blog` | Post index with category filter | Payload `posts` | SSG + ISR |
| `/blog/[slug]` | Article page, rich text, related posts | Payload `posts` | SSG + ISR |
| `/contact` | Form + social link cards — see §9 | `content/contact.json`, `content/site.json` | Static shell, form is client |
| `/admin`, `/api/*` | Payload admin + API | Payload | Dynamic, authenticated |
| `sitemap.xml`, `robots.txt`, OG images | SEO machinery | generated | Static |

### 5.1 Project detail page — adaptive layout (locked decision)

One template, driven by the project's own data. No forks, no duplicated
components:

- **Hero media, in priority order:** video (if provided) → cover image with
  parallax → gallery's first image.
- **Primary action:** `liveUrl` present → **Visit Live Site** button.
  `githubUrl` present → secondary **View Code** button. Neither → no buttons
  rendered at all (never a disabled/dead button).
- **Body:** flexible case-study blocks from Payload (§7.3) — overview,
  problem, solution, architecture, key features, challenges, outcome,
  media sections — only the blocks Ahmad fills in are rendered.
- **Meta rail:** role, year, project type, status, tech stack.
- **Footer:** next-project link (parallax image card).

---

## 6. Folder structure

Mirrors abbandesha's conventions, extended for multi-page + CMS + content.

```text
app/
  (site)/                      # public site route group (shared layout)
    page.tsx                   # /
    about/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    contact/page.tsx
  (payload)/                   # Payload's own routes (generated by Payload)
    admin/[[...segments]]/
    api/[...slug]/
  layout.tsx                   # root: fonts, theme provider, cursor, Lenis
  globals.css                  # token system (§8)
  sitemap.ts  robots.ts
components/
  ui/                          # primitives: button, card, badge, input,
                               # textarea, section, scroll-reveal, ...
  layout/                      # navbar, footer, mobile-nav, theme-toggle
  home/  about/  projects/  blog/  contact/   # feature components per route
  motion/                      # parallax-image, reveal helpers, magnetic
  three/                       # hero-scene (R3F canvas + fallback)
  cursor/                      # custom-cursor
content/                       # JSON data houses (§10)
  site.json  home.json  about.json  contact.json
lib/
  utils.ts                     # cn()
  content.ts                   # typed JSON loader, keyed by slug
  content.types.ts
  payload.ts                   # Payload client + query helpers
  queries/                     # getProjects, getProjectBySlug, getPosts, ...
  format.ts  seo.ts
payload/
  payload.config.ts
  collections/                 # Users, Media, Projects, Posts, ...
  blocks/                      # case-study + article blocks
  hooks/                       # slug, revalidation, contact notification
  access/                      # access-control helpers
public/                        # favicon, OG fallback, Ahmad's photo, CV pdf
```

Rules that keep this structure honest:

- Server Components by default; `"use client"` only where interaction,
  Motion, or the canvas requires it — and pushed as deep (as leaf-level) as
  possible.
- Pages never query Payload directly; they call `lib/queries`. Components
  never fetch at all — data flows down as props.
- Named exports, `@/` alias, one component per file — his existing habits.

---

## 7. Payload CMS design

### 7.1 Collections at a glance

| Collection | Slug | Public read | Create | Purpose |
|---|---|---|---|---|
| Users | `users` | no | first-user/admin | Payload admin login (Ahmad only) |
| Media | `media` | yes | admin | Images + videos in the Supabase bucket |
| Projects | `projects` | published only | admin | Project catalog + case studies |
| Technologies | `technologies` | yes | admin | Tech-stack taxonomy (name, slug, icon key) |
| Posts | `posts` | published only | admin | Blog articles |
| Post categories | `post-categories` | yes | admin | Blog taxonomy |
| Contact submissions | `contact-submissions` | **no** | **public (form only)** | Stored form messages; read/update admin only |

Drafts: `projects` and `posts` use Payload drafts/versions — public queries
always filter `_status: published`. Nothing unpublished can leak.

Payload **Globals are deliberately not used for page copy** — that would
create a second source of truth next to the JSON data houses (§10). One
string, one home.

### 7.2 Media (`media`)

| Field | Type | Req | Notes |
|---|---|---|---|
| `alt` | text | yes | Required for accessibility + SEO; admin is reminded, never auto-guessed |
| `caption` | text | no | Shown under gallery media |
| upload | file | yes | Stored via S3 adapter in Supabase bucket `media`. Images: Payload generates `thumbnail` (400w), `card` (800w), `hero` (1600w) sizes. Video: mp4/webm only, **50 MB Supabase cap** — admin note in the upload UI copy; long demos use the embed field on the project instead |

### 7.3 Projects (`projects`)

| Field | Type | Req | Notes |
|---|---|---|---|
| `title` | text | yes | |
| `slug` | text (unique, indexed) | auto | Generated from title by hook; editable before publish |
| `tagline` | text | yes | One line — used on cards and detail hero |
| `excerpt` | textarea | yes | Card + listing summary |
| `status` | select | yes | `deployed` / `not-deployed` / `in-progress` — drives badges and page behaviour |
| `projectType` | select | yes | `client` / `professional` (Devisgon-era) / `personal` / `academic` |
| `tracks` | select, hasMany | yes | `backend` / `crm-automation` / `frontend` / `full-stack` / `ai` / `game-dev` — powers /projects filtering |
| `featured` | checkbox | no | Featured = eligible for the home page (max 3 shown) |
| `coverImage` | upload → media | yes | The one mandatory visual |
| `gallery` | array of uploads → media | no | Optional, ordered |
| `video` | upload → media | no | Optional short showcase clip (see 50 MB rule) |
| `videoEmbedUrl` | text (URL) | no | Optional YouTube/Vimeo embed for long demos; takes the hero slot if set and no uploaded video |
| `liveUrl` | text (URL) | no | **Optional by design.** Present → "Visit Live Site" (§5.1) |
| `githubUrl` | text (URL) | no | Optional. Present → "View Code" |
| `techStack` | relationship → technologies, hasMany | yes | |
| `role` | text | yes | e.g. "Project lead", "Backend developer" — wording bound by §14 rules |
| `year` | number | yes | |
| `content` | blocks | no | Case-study body — blocks: `overview`, `problem`, `solution`, `architecture` (rich text + optional diagram image), `features` (repeater list), `challenges`, `outcome`, `mediaSection` (gallery/video break) |
| `seo` | group | no | `metaTitle`, `metaDescription`, `ogImage` — falls back to title/excerpt/cover when empty |
| `_status` | drafts | — | draft / published |

### 7.4 Posts (`posts`)

| Field | Type | Req | Notes |
|---|---|---|---|
| `title`, `slug`, `excerpt` | text / auto / textarea | yes | Same slug hook as projects |
| `coverImage` | upload → media | yes | |
| `content` | richText (Lexical) | yes | Headings, code blocks with syntax highlighting, images, embeds |
| `category` | relationship → post-categories | yes | |
| `tags` | text array | no | Free-form tags |
| `publishedAt` | date | auto | Set on publish |
| `readingTime` | number | auto | Computed by hook from content word count |
| `seo` | group | no | Same pattern as projects |
| `_status` | drafts | — | |

### 7.5 Contact submissions (`contact-submissions`)

Fields: `name`, `email`, `subject`, `message`, `status`
(`new` / `read` / `archived`), plus automatic timestamps.
Access: **create = anyone** (the form), **read/update/delete = admin only**.
An `afterChange` hook on create sends the Resend notification email — the
submission is stored first, so a mail failure can never lose a message.

### 7.6 Hooks and access helpers

- `generateSlug` — beforeValidate, shared by projects/posts.
- `computeReadingTime` — posts only.
- `revalidateContent` — afterChange/afterDelete on published projects/posts:
  calls Next.js `revalidatePath` / `revalidateTag` so edits go live without
  a redeploy, while pages stay statically cached between edits.
- Access helpers in `payload/access/`: `isAdmin`, `publishedOnly`
  (public reads see published docs only).

### 7.7 Database and storage wiring

- Postgres adapter pointed at Supabase's **pooler** connection string
  (transaction mode) — mandatory for Vercel's serverless functions.
- Schema changes run as Payload migrations committed to the repo
  (`payload/migrations/`) — never hand-edited in the Supabase dashboard.
- Storage adapter: S3 plugin, Supabase endpoint, bucket `media`, public
  read. All media URLs come from Payload — components never hard-code a
  bucket URL, which is what keeps a future storage move a config change.

---

## 8. Theme and design-token system

Extends abbandesha's `globals.css` pattern exactly:

- CSS variables on `:root` (light) and `.dark`, mapped into Tailwind v4 via
  `@theme` as `--color-*` tokens. Components may only reference semantic
  tokens: `background, foreground, surface, surface-foreground, primary,
  primary-foreground, secondary, secondary-foreground, muted,
  muted-foreground, accent, accent-foreground, border, input, ring`.
- **Additions over abbandesha:** `--destructive` (+ foreground) — fixes his
  raw `bg-red-500` slip; `--success` (+ foreground) for form states;
  `--cursor` / `--cursor-ring` so even the custom cursor is token-driven;
  radius scale (`--radius` family) carried over as-is.
- **Dark is the portfolio's primary theme** (the 3D hero is designed for
  it); light tokens are fully defined and the toggle ships — no half-themed
  light mode. Final palette hues and typography are the open design decision
  (§16) and land as variable *values* only — token names never change.
- Typography: `next/font` self-hosted (no Google Fonts request at runtime),
  exposed as `--font-sans` / `--font-display` tokens.
- **Hard rule:** no hex values, no raw Tailwind palette classes
  (`bg-slate-500` etc.) in component code. Enforced at review; token or
  nothing.

---

## 9. Contact page and form flow

**Page:** form on one side; on the other, Ahmad's socials as interactive
cards (tilt/hover glow, cursor "Open" state) — GitHub, LinkedIn, email,
WhatsApp — all sourced from `content/site.json`, so a handle change is a
one-line JSON edit. This replaces the old footer-icon-row pattern entirely.

**Submission flow:**

```text
Browser (React Hook Form + Zod, client validation)
  → Turnstile widget token attached
  → POST route handler (server)
      1. verify Turnstile token (server secret)
      2. honeypot field must be empty
      3. re-validate payload with the same Zod schema
      4. Payload local API → create contact-submission
      5. hook sends Resend notification to Ahmad
  → success state in the form (token-styled, no page reload)
```

Failure at any step returns a field-level or generic error without losing
the visitor's typed message. The form never talks to Payload's REST API
directly from the browser.

---

## 10. JSON data houses

**Purpose:** stable page copy is data, not code. Edit the JSON, the page
updates — no component hunting.

```text
content/
  site.json      # name, roles, nav links, footer text, socials, default SEO
  home.json      # hero lines, intro, section headings, CTA labels
  about.json     # bio paragraphs, timeline entries, skill groups, certificates
  contact.json   # page headings, form labels, success/error messages
```

**Mechanics:**

- `lib/content.ts` exposes typed loaders keyed by slug:
  `getSiteContent()`, `getPageContent("home")`, etc. Pages import content
  the same way they import Payload data — as props-ready objects.
- Every JSON file has a TypeScript type in `lib/content.types.ts` and a Zod
  schema validated **at build time** — a missing key or wrong type fails
  `npm run build`, it never renders a blank section in production.
- Images referenced from JSON are by path under `public/` or by media slug —
  never embedded base64, never hot-linked.

**The boundary (locked):** JSON = copy that changes rarely and belongs to a
page. Payload = catalog content (projects, posts, media, submissions).
Contact-form *labels* live in `contact.json`; contact-form *submissions*
live in Payload. A string never lives in both.

**Known trade-off, accepted:** a JSON edit needs a commit + Vercel redeploy
(automatic on push). Anything Ahmad expects to edit often belongs in
Payload, not JSON — when in doubt during the build, it goes to Payload.

---

## 11. Motion, parallax, cursor, and 3D

One animation engine (Motion) + one 3D scene. Everything else is restraint.

### 11.1 Scroll system

- **Lenis** smooth scroll at the root layout level; anchor navigation and
  route changes are Lenis-aware. Disabled entirely when the user prefers
  reduced motion.
- **ScrollReveal** — abbandesha's component, carried over with two fixes:
  `viewport={{ once: true }}` (his version re-triggers on every pass) and
  token-only styling.
- **Parallax patterns** (Motion `useScroll` + `useTransform`, transform and
  opacity only — never layout properties):
  - *Hero depth:* 3D scene / background layer moves at ~0.3× scroll speed,
    foreground copy at 1×, a mid layer (grid/ring) between them.
  - *Card images:* image inside a project card translates ±8% across the
    card's viewport pass, clipped by the card frame.
  - *Detail hero:* cover/video scales subtly (1 → 1.08) and fades on exit.
  - *Sticky storytelling:* on About and project case studies, a pinned
    visual rail while text blocks step through (the level-up of
    interlinksolutions.tech's sequenced sections).
- **Scroll progress** indicator in the navbar on article/project pages.

### 11.2 Custom cursor

Single `CustomCursor` component at root; dot follows instantly, ring follows
with lerp via `requestAnimationFrame`. States driven by `data-cursor`
attributes on interactive elements — components declare intent, the cursor
owns behaviour:

| State | Trigger | Behaviour |
|---|---|---|
| default | — | 6px dot + 32px ring, token colours |
| link | `a`, `button`, `[data-cursor="link"]` | ring expands to 56px, fills with `primary` at low opacity |
| view | project card / gallery item | ring becomes a labelled badge ("View") |
| text | `input`, `textarea`, contenteditable | cursor hides, **native cursor returns** |
| pressed | mousedown anywhere | ring scales to 0.85 |

Hard rules: rendered only on `(pointer: fine)` devices — touch never sees
it and keeps the native experience; never mounted on `/admin` routes;
fully disabled under `prefers-reduced-motion`. Buttons additionally get a
magnetic hover (translate toward cursor within a few px) via a shared
`Magnetic` wrapper — used sparingly, primary CTAs only.

### 11.3 3D hero

- React Three Fiber canvas, loaded with `next/dynamic` (`ssr: false`)
  **only on `/`** — no other page ships three.js.
- Scene concept is the open design decision (§16); the architecture only
  fixes the contract: one interactive scene reacting to pointer position,
  DPR clamped to `[1, 1.75]`, no post-processing in v1.
- **Fallbacks, in order:** WebGL unavailable → token-styled static hero
  visual; reduced motion → static first frame, no animation loop;
  slow device (FPS watchdog) → canvas unmounts itself and the fallback
  takes over. The hero copy is never inside the canvas — text is HTML,
  always readable, always indexable.

### 11.4 Motion availability matrix

| Feature | Desktop | Mobile / touch | Reduced motion |
|---|---|---|---|
| Lenis smooth scroll | on | on (native feel) | off |
| Scroll reveals | on | on, shorter distance | fade only / instant |
| Parallax | on | reduced factor | off |
| Custom cursor | on | **never rendered** | off |
| 3D hero | on | on, lower DPR + watchdog | static frame |
| Magnetic buttons | on | off | off |

---

## 12. Rendering, SEO, and performance

- Public pages are **SSG/ISR**: built statically, revalidated on content
  change via the Payload hook (§7.6) plus a 1-hour safety revalidate.
  Visitors almost never wait on Supabase — which also keeps the free
  database mostly idle (its inactivity pause is then only an admin concern;
  a weekly keep-alive ping is a noted operational option, §15).
- Every route exports `generateMetadata` from the content/Payload SEO
  fields — unique title/description/OG per project and post, canonical URL
  on `ahmad-sajid.vercel.app`, `sitemap.ts` generated from Payload slugs.
- **Performance budgets (launch gates, §15):** Lighthouse (mobile)
  Performance ≥ 90 on `/`, `/projects`, a project detail and a post;
  LCP < 2.5 s, CLS < 0.1 on the same set; three.js absent from every
  non-home bundle (verified in build output).
- Images only through `next/image` with Payload-generated sizes; videos
  always carry a poster and `preload="none"` until in view.

## 13. Accessibility

- Semantic landmarks, one `h1` per page, visible token-styled focus rings
  (`ring` token) — the custom cursor never replaces focus indication.
- All Motion reveals end at full opacity even if JS fails partway; content
  is never *dependent* on animation to be readable.
- `alt` is a required field in Media (§7.2); icon-only buttons carry
  `aria-label`; form errors are announced (`aria-live`) and tied to fields.
- Colour contrast checked in both themes when the palette lands (§16).

## 14. Content inventory and seed plan

Seed data is built **only** from verified facts. Source of truth:
`02-Profile-and-Form-Facts.md`. Notable corrections versus the old site:
BS CS (UAF) completed 2026, CGPA 3.62 — not "completing my Bachelor's";
MS CS (University of Okara) in progress; Devisgon Associate Software
Engineer 5 Aug 2025 – 5 Oct 2026 (never "Present"); no skill percentages
anywhere; "Team Lead" never appears as a job title (project-lead wording
only where verified: LaForme, Total Store delivery).

**Projects to seed (media/links to be confirmed per project at seed time —
gaps stay empty, the adaptive template handles them):**

| Project | Known stack / facts | Tracks |
|---|---|---|
| MeMySelfI AI | FastAPI/Express/Next.js, OpenAI, ElevenLabs, tool-calling; Docker on AWS EC2, self-built CI/CD, ran in production | AI, Backend, Full Stack |
| Emilly | AI receptionist — NestJS + Next.js | AI, Full Stack |
| LaForme | NestJS + Next.js booking platform; Ahmad = named project lead | Full Stack, Backend |
| Total Store back-office | PHP/Laravel, 14 modules; led delivery; wrote 13-page client guide | Backend |
| UAF Smart E-Library | Final-year project; RAG/pgvector layer; frontend built by Ahmad | AI, Frontend, Academic |
| PharmaSync | Pharmacy system; frontend built by Ahmad | Frontend |
| FleetSlot | Fleet scheduling project | TBD at seed time |

**Blog starters (from real work only):** (1) deploying MeMySelfI — Docker
on AWS EC2 with a self-built CI/CD pipeline; (2) RAG with pgvector in the
UAF Smart E-Library; (3) the early n8n embedding-pricing lesson and the
audit habit it created. Drafted in Payload as drafts; Ahmad publishes.

**Static copy:** home/about/contact JSON is drafted from the same verified
facts (skills list exactly as in 02; certificates: Google Prompting
Essentials, Git/GitHub Intro — listed as text, credential IDs never
invented).

## 15. Build phases and launch plan

Each phase ends with `lint` + `typecheck` + `build` green and a preview
deployment Ahmad can open. One phase at a time; verified before moving on.

| Phase | Deliverable | Acceptance check |
|---|---|---|
| 0 — Safety | `legacy-html` branch pushed; `rebuild` branch created; Supabase project + `media` bucket created; env vars set in Vercel (preview scope) | Old site still live; preview URL exists |
| 1 — Scaffold | Next.js + Tailwind v4 token system + Payload wired to Supabase (DB + storage), admin login working on preview | Ahmad can log into `/admin` on the preview URL and upload a test image that lands in Supabase |
| 2 — Data layer | All collections, blocks, hooks, access rules; JSON data houses + typed loaders; seed script with §14 content | Seeded projects/posts visible in admin; build fails if a JSON key is removed (validation proven) |
| 3 — Pages | All routes from §5 built with token-styled components; adaptive project template | Every route renders correctly with full, partial, *and* minimal project data (no liveUrl, no video, no gallery cases all tested) |
| 4 — Motion & 3D | Lenis, reveals, parallax, custom cursor, R3F hero + fallbacks | §11.4 matrix verified per device/motion class; non-home bundles contain no three.js |
| 5 — Contact & SEO | Form flow end-to-end (Turnstile → Payload → Resend), sitemap, metadata, OG | A test submission appears in admin *and* in Ahmad's inbox; spam checks reject a bot-style post |
| 6 — Launch | Budgets checked (§12), content proofread against 02, merge `rebuild` → `main` | Production serves the new site on `ahmad-sajid.vercel.app`; rollback path confirmed before merge |

**Post-launch (separate, later tasks — not part of this build):** updating
the portfolio URL on resumes, LinkedIn, and job portals (Ahmad's explicit
instruction); the Supabase keep-alive decision; first blog publications.

## 16. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Supabase free project pauses after 1 week idle | Admin/API unavailable until restored; cached public pages keep serving | SSG/ISR front-end (§12); optional weekly keep-alive ping; restore is one click in Supabase if it ever happens |
| 1 GB storage / 50 MB per file | Project videos eat the bucket | Short compressed WebM clips; posters; `videoEmbedUrl` for long demos; storage behind adapter = R2 move is config-only |
| Postgres connections from serverless | Connection exhaustion errors | Pooler URI (§7.7) from day one |
| Payload cold starts on Vercel Hobby | Slow first admin hit | Public pages are static; admin slowness is tolerable and self-resolves while active |
| 3D/animation hurts performance or recruiters' patience | High bounce, bad first impression | One scene, home only, DPR clamp, FPS watchdog, static fallbacks, §12 budgets are launch gates |
| Repo override breaks production | Live link on applications goes down | Branch strategy (§4) — production untouched until a verified preview is merged; instant Vercel rollback |
| Copy drifts from verified facts | Misrepresentation in applications | §14 source-of-truth rule; proofread gate in Phase 6 |

## 17. Open decisions (Ahmad's call — defaults proposed)

1. **Visual identity** — palette hues, display typography, and the exact 3D
   hero concept. *Next step: 2–3 design directions presented for his pick.
   The token architecture (§8) absorbs any choice without code changes.*
2. **Blog starters** — the three topics in §14, or his own list first.
3. **`/resume` page vs download-only CV** — *default proposed: download
   only in v1 (the Full Stack resume PDF in `public/`), revisit after
   launch.*
4. **Per-project seed gaps** — which projects have a live URL, a repo link,
   a video, or only images. *Collected at Phase 2 seed time, project by
   project; empty fields are fine by design.*


---

## Appendix A — Theme: Lahore Dusk (locked 2026-11-04)

Colour theme and typography from design direction "E — Lahore Dusk",
contrast-engineered: every text pair meets WCAG AA or better in both
modes (computed ratios, not eyeballed). Rule set by Ahmad: fills keep
the brand colours; text colours are tuned per mode until they pass —
never force a prototype value that hurts contrast.

### Typography

- **Display:** Fraunces (variable, optical sizing) — hero and page titles.
- **Body & UI:** Manrope.
- **Technical labels:** JetBrains Mono, uppercase, letter-spaced —
  eyebrows, meta lines, stack lists, dates.
- Self-hosted via `next/font`; no runtime Google Fonts requests.

### Dark — "Dusk" (default mode)

| Token | Value | Token | Value |
|---|---|---|---|
| `--background` | `#140D16` | `--primary` | `#E8A33D` (amber fill) |
| `--surface` | `#1E1420` | `--primary-foreground` | `#221303` |
| `--surface-raised` | `#291B2E` | `--accent` | `#4FB3A6` (teal text) |
| `--foreground` | `#F5EDE4` | `--accent-fill` | `#1F7A6D` (deep teal fill, white text) |
| `--muted-foreground` | `#C9ADA3` | `--highlight` | `#CD949B` (small labels only) |
| `--border` | `#3A2738` | `--ring` | `#E8A33D` |
| `--input` | `#7A5A6C` | `--destructive` / `--success` | `#F0857C` / `#5FBF8A` |

### Light — "Dawn"

| Token | Value | Token | Value |
|---|---|---|---|
| `--background` | `#FAF3E7` | `--primary` | `#E8A33D` (amber fill) |
| `--surface` | `#F2E6D0` | `--primary-foreground` | `#26160A` |
| `--surface-raised` | `#FFFFFF` | `--accent` / `--accent-fill` | `#0F5A4E` (deep teal) |
| `--foreground` | `#2B171E` | `--amber-text` / `--highlight` | `#8F5C06` (amber-coloured text) |
| `--muted-foreground` | `#71493C` | `--ring` | `#0F5A4E` |
| `--border` | `#DEC9A6` | `--destructive` / `--success` | `#B3261E` / `#1E7A46` |
| `--input` | `#96702F` | `--primary-deep` | `#33202B` (alt. button fill) |

Usage rules: amber is a fill/signal colour — amber *text* in light mode
always uses `--amber-text`. Rose (`--highlight`) is for tiny labels
only, never headings or body text. Both modes are complete products;
nothing ships styled for one mode only. Any future colour change
re-runs the contrast audit before it lands.

## Appendix B — Design structure (locked 2026-11-04)

The Lahore Dusk theme sits on a clean, premium, editorial structure.
The Lahore Dusk *concept* elements (star medallion, arch frames, folio
voice) and the earlier "White Cube" concept do **not** apply.

- **Editorial, not decorative:** large Fraunces headlines, generous
  whitespace, hairline rules, small mono eyebrows. One focal point per
  viewport. Quiet cards: `--surface`, 1px `--border`, 14px radius;
  hover is a 2–4px lift, nothing bounces.
- **Hero:** split layout — copy left (eyebrow, headline, statement,
  amber CTA, availability line), abstract 3D scene right ("Dusk Field":
  thin translucent rings + a soft prism in amber/teal, slow orbital
  drift, pointer parallax). Home page only, DPR clamp, FPS watchdog,
  static-poster fallback, `prefers-reduced-motion` = still frame.
- **Motion:** premium pace (400–700 ms cubic eases), Lenis smooth
  scroll, parallax per §11. Custom cursor: amber dot + trailing ring,
  expands on links, "View" state on project cards; never on touch
  devices, native cursor in form fields and `/admin`.
- **Modes:** Dusk is the default; stored choice wins, then system
  preference. Toggle in the nav, mono-labelled `DUSK / DAWN`.

## Appendix C — Amendments made during the build

1. **`Projects.status` renamed to `deploymentStatus` (Phase 2).**
   Payload reserves `status` for its draft/versions system; a custom
   field with that name collides with the internal `_status` enum in
   Postgres. The field's meaning and values (`deployed`,
   `not-deployed`, `in-progress`) are unchanged from §7.3.
2. **Media `alt` is required (Phase 2).** Existing media rows were
   backfilled when the rule landed.
3. **Schema management:** until migrations are adopted (§7.7), the
   schema is applied by Payload's dev-push against the shared Supabase
   database. Moving to committed migrations is a pre-launch task
   (Phase 6).
