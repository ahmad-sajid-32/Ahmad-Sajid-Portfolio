# PLAN.md — Progress Tracker

Rebuild of Ahmad Sajid's portfolio: static HTML/CSS/JS → Next.js +
Payload CMS on Supabase, deployed on the same Vercel project and
domain (`ahmad-sajid.vercel.app`). Architecture: `docs/ARCHITECTURE.md`.
Working rules: `docs/AGENT.md`.

Last updated: 2026-11-06.

## Phase status

### ✅ Phase 0 — Foundations (complete, 2026-11-04)
- GitHub branches created from `main`: `legacy-html` (frozen archive
  of the old site) and `rebuild` (all new work). `main` untouched.
- Supabase project created (Postgres 17, Seoul region) with a public
  `media` storage bucket; environment variables set locally and in
  Vercel (Preview scope).

### ✅ Phase 1 — Scaffold (complete, 2026-11-04 → 2026-11-05)
- Next.js 16 + Payload 3 scaffold with the Lahore Dusk theme tokens,
  Dusk/Dawn toggle, and route groups `(site)` / `(payload)`.
- Pushed to `rebuild`: scaffold commit `e157d41`, admin-styling fix
  `3f1c6ba` (the Payload admin CSS import).
- Verified end to end: Vercel preview deployed, Ahmad registered the
  first admin account, and the acceptance media upload was confirmed
  in the database and the storage bucket.

### ✅ Phase 2 — Data layer & seed (complete, 2026-11-05)
- Collections: Projects, Technologies, Posts, Post Categories,
  Contact Submissions; Media upgraded (required alt, caption, image
  sizes for thumbnail/card/hero).
- Access control (public = published only), hooks (slug generation,
  reading time, path revalidation), case-study blocks (overview,
  problem, solution, challenges, outcome, architecture, features,
  media).
- JSON data houses (`content/site|home|about|contact.json`) with
  typed Zod loaders in `lib/content.ts` — verified: removing a key
  fails the production build with a Zod error; restored, it passes.
- Seed run against Supabase, verified in the database and via public
  REST: 16 technologies, 3 post categories, 7 projects (6 published,
  FleetSlot held as a draft), 3 draft blog posts, 8 placeholder-cover
  media items. Public API returns published projects only; drafts
  are invisible.
- One deliberate deviation: the project field is `deploymentStatus`,
  not `status` (Payload reserves `status`).
- Note: placeholder covers are generated artifacts — regenerate with
  `node scripts/generate-covers.mjs` before seeding a fresh database.
- Lint, typecheck, and production build all green at close.

### ✅ Phase 3 — Pages (complete, 2026-11-05)
- All pages live on the Phase 2 data layer: Home (split hero,
  expertise, featured projects, contact CTA), About (bio, experience,
  education, skills, certificates), Projects index with track
  filtering, case-study detail pages (blocks, gallery, video, prev /
  next), Blog index + detail, Contact.
- Verified in dev and in a production serve: every route 200 with
  real seeded content; the FleetSlot draft returns 404 publicly;
  the contact form stores submissions (Phase 5 adds spam protection
  and email delivery); the blog shows an honest empty state until
  the first draft is published.
- The hero's right side carries a token-drawn placeholder for the
  Dusk Field scene — Phase 4 swaps in the real 3D.
- Lint, typecheck, and production build green at close.

### ✅ Phase 4 — Motion & 3D (complete, 2026-11-05)
- "Dusk Field" hero scene (React Three Fiber): three translucent
  rings + a prism in theme colours, warm key light, slow orbital
  drift and pointer parallax. Theme-aware (Dusk/Dawn palettes),
  DPR clamped, home page only — three.js ships as a lazy chunk no
  other route can load.
- Fallback contract honoured: static poster (same composition in
  CSS) for reduced-motion, no-WebGL, and low-FPS devices (an in-scene
  watchdog hands back to the poster below 28 FPS).
- Lenis smooth scrolling with anchor support, scroll reveals
  (fade + rise, once per element), parallax accents, and a short
  page transition on navigation — all disabled under
  `prefers-reduced-motion`.
- Custom cursor: amber dot + trailing ring, expands over links,
  becomes a filled "View" badge over project cards; never on touch
  devices, native cursor restored in form fields, and the Payload
  admin is untouched.
- Lint, typecheck, and production build green at close; production
  serve verified (cursor markup, poster in SSR HTML, View hooks on
  cards).

### ✅ Phase 5 — Contact & SEO (complete, 2026-11-05; keys added by Ahmad the same day)
- SEO: dynamic sitemap (static routes + published projects/posts),
  robots (admin/api disallowed), SVG icon in theme colours,
  Open Graph + Twitter cards site-wide and per project/post (cover
  image as the share image), Person JSON-LD on the home page.
- Contact delivery: submissions now post to a dedicated
  `/contact/submit` route, are stored in Payload, and fire an
  afterChange hook that emails Ahmad a notification (payload's
  Resend adapter; the mail step can never block or lose a message).
- Spam protection: Cloudflare Turnstile widget + server-side
  verification in the submit route (fails closed when configured).
- Verified: build green; sitemap lists all published projects;
  robots and icon served; OG tags present on detail pages; a test
  submission stored with status "new" and the notification email
  attempted to Ahmad's inbox (test row cleaned up).
- **Activation:** Ahmad added `RESEND_API_KEY`,
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY` to
  the Vercel environment on 2026-11-05 (confirmed by him; the
  preview sits behind Deployment Protection, so the deployed check
  is his acceptance pass: widget visible on /contact, a test
  submission, and the notification email in his inbox). Production
  scope gets the same variables at Phase 6. Local `.env.local`
  intentionally holds no keys — local dev runs the form in
  stored-only mode.

### ✅ Phase 6 — Launch (complete, 2026-11-05 — SITE IS LIVE)
- Performance pass: Dusk Field hardened — idle start after first
  paint, render pauses off-screen, faster two-stage FPS watchdog.
  Sandbox Lighthouse (software GPU): a11y 100, best practices 100,
  SEO 100, CLS 0; the performance score there is not representative
  for a WebGL page — the real-device reading comes from PageSpeed
  Insights on the live URL.
- Committed DB migrations adopted: `migrations/` holds the initial
  migration (44 tables); the live database is baselined as applied.
- Old static files removed from `rebuild` (23 files; the old site
  survives on `legacy-html`).
- Launch merged in two PRs: #1 took `rebuild` to Phase 5 state —
  its production build failed because Production env vars were not
  set yet; once Ahmad set them, #2 merged the Phase 6 remainder and
  the production build succeeded.
- Verified live on https://ahmad-sajid.vercel.app: every route 200,
  draft project 404, old assets 404, sitemap with all 6 projects,
  Turnstile widget rendered on /contact and a tokenless submit
  rejected (400) — spam protection active; /admin up.

### ✅ Improvement round 2 — Hero redesign (complete, 2026-11-06 — MERGED & LIVE via PR #3, main `a7e8758`)
- Full-width layout across the site (header, main, footer share the
  same full-bleed padded wrapper; inner text blocks keep readable
  max-widths).
- New hero after the reference reel's composition, in Lahore Dusk:
  giant amber-gradient word "DEVELOPER" behind a centred studio
  portrait cutout (generated from Ahmad's photo, background removed;
  the file lives in Payload Media, `hero-portrait.png`, and the URL
  sits in the `content/home.json` data house). Intro stack left
  (greeting, name, role, statement, CTAs, availability — no location
  in the hero; Lahore, Pakistan stays in the footer), stats rail
  right (7 projects / 16 technologies / 4 specialisations).
- Entrance animations (all reduced-motion safe): DEVELOPER letters
  drop in one at a time left→right; intro glides from the left,
  stats from the right, portrait rises from below. New primitives:
  `components/motion/slide-in.tsx`, `components/hero/hero-word.tsx`.
- Custom first-load loader (`components/layout/site-loader.tsx`):
  animated rings-and-prism illustration + wordmark + progress sweep,
  once per session, <2s, skipped under reduced motion.
- Dusk Field retired: the three.js scene components are deleted and
  `three` / `@react-three/fiber` uninstalled; the home page ships no
  WebGL now.
- Verified locally: production build green; screenshots checked in
  Dawn and Dusk, desktop and mobile (a missing `grid-cols-1` caused
  a 52px mobile overflow — found by measurement and fixed; the stats
  row now wraps on small screens).
- Feedback pass (Ahmad's review, 2026-11-06): availability line
  removed from the hero; statement rewritten first-person as
  "Software Engineer" (was Associate, project-flavoured); DEVELOPER
  re-sized to 15vw and centred behind the portrait (the R clipped
  on Ahmad's display at 16.5vw); role line switched from teal to
  foreground/80 (teal clashed with the amber word); portrait
  enlarged (680px on xl) and pulled up so the head overlaps the
  word's fade — the 3D pop; hero is now full viewport height
  (100svh − header) with the portrait bottom-anchored at any
  resolution; social badges added under the stats (GitHub,
  LinkedIn, Instagram, Facebook, Fiverr — brand glyphs in
  `components/ui/brand-icons.tsx`, Simple Icons CC0, because
  lucide-react dropped brand icons; site.json socials extended,
  so the footer and the Person JSON-LD `sameAs` picked them up
  too). Verified by screenshots at 1600×1000 and 1366×768 in Dusk
  and Dawn.
- Mobile/tablet pass + live stats (Ahmad, 2026-11-06): hero
  socials cut to GitHub / LinkedIn / Instagram (Facebook and
  Fiverr live in the footer list). Below `lg` the DEVELOPER word
  is hidden (it collided with the heading) and a light full-screen
  amber wash (`from-primary/20`) carries the hero; the portrait
  becomes a bordered circular medallion of the studio portrait
  (new Media item `hero-portrait-studio.png`, URL in home.json as
  `circlePortraitUrl`) with a gentle float animation
  (`.animate-float` in globals.css, reduced-motion safe) and more
  air before the stats. Desktop composition unchanged. Hero stats
  are now computed at render: projects = published count and
  technologies = count from Payload (`getHeroCounts` in
  lib/data.ts), specialisations = number of expertise areas in
  the data house; home.json stats carry keys + labels only. The
  projects stat therefore reads 6 until FleetSlot is published.
- Gradient off + bigger medallion (Ahmad, 2026-11-06): the
  mobile amber wash and the radial glow blob are hidden below
  `lg` (desktop keeps both); the circular portrait grows to
  240px (288px on sm+).
- **Launch verification (2026-11-06):** PR #3 merged (one
  conflict, docs/PLAN.md only — resolved by aligning main's PLAN
  to the rebuild tracker, a strict superset). Verified live on
  https://ahmad-sajid.vercel.app: home serves the new hero with
  live stats (6 / 16 / 4), both portrait files optimise through
  the Next image pipeline (200), all routes 200, FleetSlot draft
  still 404, sitemap at 14 URLs, no Dusk Field traces.
- Post-launch hero tweaks (on `rebuild`, 2026-11-06): hero
  entrances now wait for the loader (it dispatches
  `pf:intro-done` as it fades; `useIntroReady` gates SlideIn and
  HeroWord, with a safety timeout) so the choreography is seen,
  not spent behind the veil. Dawn gets its own portrait set
  (Media ids 15/16) cross-faded against the Dusk set on the theme
  class — no swap glitch. The theme toggle is now a miniature
  desert scene (sun/moon travelling over dunes, stars at Dusk).
  Mobile header: the link strip is replaced by a three-dot button
  opening a right-hand slide-in drawer. A tech-stack logo marquee
  is built and awaiting Ahmad's preview approval before it joins
  the page.

## Open items (content & decisions)
- **FleetSlot** is seeded as a draft — its stack, type, and links
  need Ahmad's confirmed facts before it can be published.
- Real per-project media (screenshots, gallery images, demo videos,
  live/repo links) to be collected and swapped in for the generated
  placeholder covers.
- `/resume` page vs CV-download-only — undecided; download-only is
  the current proposal for v1.
- Updating the portfolio URL on resumes, LinkedIn, and job profiles —
  a separate later task, only on Ahmad's instruction.
- The Vercel preview sits behind Deployment Protection; relax it only
  if shareable preview links are wanted.
