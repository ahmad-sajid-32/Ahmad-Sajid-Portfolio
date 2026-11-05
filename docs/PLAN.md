# PLAN.md — Progress Tracker

Rebuild of Ahmad Sajid's portfolio: static HTML/CSS/JS → Next.js +
Payload CMS on Supabase, deployed on the same Vercel project and
domain (`ahmad-sajid.vercel.app`). Architecture: `docs/ARCHITECTURE.md`.
Working rules: `docs/AGENT.md`.

Last updated: 2026-11-05.

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

### ⬜ Phase 6 — Launch
Performance pass (Lighthouse ≥ 90 mobile, LCP < 2.5 s, no three.js
off the home page), adopt committed DB migrations, remove the old
static files from `rebuild`, single merge `rebuild` → `main`
(Vercel rollback is the safety net).

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
