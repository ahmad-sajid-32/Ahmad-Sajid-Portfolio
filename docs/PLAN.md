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
- Corrections from Ahmad's phone review (2026-11-06): the
  toggle's sun/moon disc is vertically centred (a double
  translate — utility class + inline style — had pushed it into
  the top edge). The mobile drawer drops its borders on the
  three-dot and close buttons, the name header, the email/social
  text footer (now three icon buttons: GitHub, LinkedIn,
  Instagram) and the link index numbers; link text steps down a
  size.
- Portrait correction (Ahmad, 2026-11-06): the first Dawn
  portrait was a separate generation (different expression) —
  replaced by a RELIGHT of the Dusk portrait itself (Media ids
  17/18, `hero-portrait-dawn.png` / `hero-portrait-studio-dawn.png`),
  so both themes now show the identical photograph, expression
  and blazer, with only the lighting changed. The earlier Dawn
  pair (ids 15/16) is superseded and unused.
- "What I do" section rebuilt as the Giant Index (Concept 3,
  picked by Ahmad from three rendered prototypes, 2026-11-06):
  giant Fraunces rows; on desktop the active row lights amber,
  nudges sideways and a tilted detail card floats to it (spring
  motion, clamped to the section); below lg the detail expands
  inline under the tapped row. Chips and the "More about me"
  About CTA live in the home data house; Lucide icon per area.
  The section's eyebrow was removed at Ahmad's request (it
  repeated the title); SectionHeading's eyebrow is now optional.
  The throwaway /proto route was deleted after the pick.
- Featured Projects rebuilt as a 3D coverflow carousel
  (Concept C, picked by Ahmad from glossy round-2 prototypes,
  2026-11-06): centre card upright and glowing with the full
  story, neighbours tilted in perspective; auto-plays through
  ALL featured projects (getFeaturedProjects no longer slices
  to 3), pauses on hover/focus/drag/hidden tab/reduced motion;
  arrows, dots, side-card clicks and drag/swipe all drive it.
  Heading centred; the old "All projects" text link replaced by
  a prominent solid "View all projects" button centred under
  the carousel (label in the home data house). Label maps moved
  to client-safe lib/labels.ts (data.ts re-exports) so client
  components no longer pull Payload into the browser bundle.
  Coverflow corrections (Ahmad's live review, 2026-11-06):
  cards enlarged to fill the section (min(88vw, 600px), 16/10
  covers, taller stage; fan spread tightens on mobile); the
  whole centre card is the case-study link with the custom
  cursor's "View" badge — the inner text link is gone; the
  year · role line above the title is removed; title larger
  (text-4xl/5xl); track badges redesigned as amber-tinted
  pills with a dot; roomier card padding; on mobile the
  arrows are hidden — dots only, swipe drives it.
  Scaling rules (Ahmad, 2026-11-06): the featured cap is
  gone in code AND data — all six published projects are now
  flagged featured (Emilly was the only unflagged one). Card
  width steps down as the featured count grows (600/540/500/
  460px at 3/4/5/6+), and exactly five cards stay in view
  (centre ± 2, gentler 28° tilt) while any number can be
  featured — the rest rotate through the fan.

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

## Blog section: Spotlight Stage (added 2026-11-06, on rebuild)

Six prototypes across two rounds (Magazine, Story Rail,
Rotating Stack, then the glossier Spotlight Stage, Headline
Index, Glass Tilt Cards); Ahmad picked Concept D — Spotlight
Stage. Production component: components/home/blog-spotlight.tsx.
A cinematic stage (current post's cover full-bleed, gradients,
glass "Now reading · category" pill, title/excerpt/meta over
the scrim, the whole stage is the post link with the "View"
cursor) beside a playlist of the latest posts (home now takes
the newest 5). Auto-advances every 5.5s with a crossfade; a
progress bar under the stage fills over the cycle
(.animate-spotlight-progress keyframe in globals.css, exactly
matching the timer) and the active playlist row carries
animated equalizer bars (.animate-eq). Pauses on hover, focus,
hidden tab, or reduced motion; clicking a row jumps the stage
there and restarts the cycle. The section header pairs the
title with the prominent solid "View all posts" button
(sections.allPosts). Verified by build + CDP: the stage
advanced from story 01 to 03 on its own past one cycle and
aria-current tracked it.

Discovery during prototyping: the three seeded blog posts are
PUBLISHED in the database (published 5 Nov 2026), not drafts —
so this section renders live content today. All three posts
currently share one generic cover in the CMS; per-post covers
can be swapped in the admin whenever Ahmad wants topic art.

## Contact CTA: paper-plane art + Copy B (added 2026-11-07, on rebuild)

The home page's last original section. Ahmad asked for a
generated image on the card's empty right side, faded from
left to right, plus stronger copy. Two prototype rounds:
atmospheric art (Lahore skyline, night desk, amber ribbons)
was rejected as "random" — he wanted contact-related imagery;
round 2 offered a glowing envelope, a paper plane, and glass
chat bubbles. He picked the PAPER PLANE + Copy B ("Tell me
about the role or the project — the stack, the problem, the
deadline. I reply personally to every message, and the first
reply is never a template." — now sections.contactCta.body).

Per Ahmad's follow-up, there are TWO versions of the image:
the Dusk original and a Dawn RELIGHT of the same image (same
plane, trail and clouds; only the lighting changed — the
portrait rule applied to art). Both live in Payload Media
(id 21 cta-paper-plane.webp, id 20 cta-paper-plane-dawn.webp;
uploaded via the temporary token route, deleted after) and
are wired as contactCta.imageUrl / imageLightUrl, cross-fading
on the theme class like the portraits. The image layer sits
on the right 58-70% of the card under a left-to-right mask
fade; a surface scrim (solid to 25%, 70% at 55%) keeps the
text column on near-solid card colour. Contrast verified by
CDP screenshots in BOTH themes using the real image files
(local temp swap, restored before push): Dawn needed the
scrim strengthened and the image narrowed after the first
pass — the shipped values are the corrected ones.

## Post-launch batch MERGED & LIVE (2026-11-07)

PR #7 merged rebuild into main (merge commit c5d8437) on
Ahmad's go — no code conflicts. The batch: loader-gated hero
entrances, Dawn/Dusk portrait cross-fade, desert theme
toggle, mobile drawer nav, tech marquee, Giant Index (What I
do), numbered eyebrows removed, 3D coverflow with 5-in-view
scaling, blog Spotlight Stage, and the Contact CTA
paper-plane art with Copy B. Verified live at
ahmad-sajid.vercel.app: routes 200 (draft project 404), hero
stats 6/16/4, both carousels in markup, the CTA's optimized
plane image serving 200, Copy B live. The sandbox browser
renders a blank page for the live domain (proxy quirk), so
live verification ran over HTTP + the live HTML.
- 2026-11-07 — Footer mix LIVE on rebuild (5acf92d): ribbon + postcard (live Lahore clock) + giant name + © line only; Socials global in Payload (seeded, all surfaces read from it, hero/drawer keep 3); sticky header; coverflow mobile overflow fixed ([overflow-x:clip] + body clip; 390px scrollWidth verified). Payload CLI is broken in the sandbox (undici/Node 24) — migration hand-authored from the dev-pushed schema, ledger batch 2; see IDEAS-AND-DECISIONS.md before the next schema change.
- 2026-11-07 — Footer batch MERGED TO MAIN & LIVE via PR #8 (merge 94267e4; main PLAN aligned first at 629fc5b — the conflict was PLAN-only again, from the twin PR #7 PLAN commits 814b184/4ee4e67). Live-verified: footer markers (wa.me, tel:, © line, coordinates), sticky header class, old footerText gone, routes 200, FleetSlot 404.
- 2026-11-07 — All subpages recreated in the home page's glossy language (rebuild b4a641c): shared PageHeader; projects index as coverflow-style cards + glowing filter chips + computed counts; case-study pages with pill header/meta card/icon tech chips/feature cards/prev-next cards; blog index with featured lead story; article pages with richer prose + prev/next; About with portrait medallion + availability pill + experience timeline + rounded-3xl cards; Contact with glossy form panel + CMS channel rows (Elsewhere eyebrow duplication removed). Responsive verified per route (390px: scrollWidth == innerWidth on all six routes).
- 2026-11-07 — Subpages recreation MERGED TO MAIN & LIVE via PR #9 (merge 81b7d05; PLAN pre-aligned on both branches this time — merged cleanly first try). Live-verified with correct-case markers (the first poll round used uppercase greps against CSS-uppercased text and false-negatived): "6 case studies" on /projects, availability pill + timeline on /about, WhatsApp channel row on /contact, routes 200, FleetSlot 404.
- 2026-11-07 — Motion round (rebuild f090d31): About portrait enlarged (288/320/380px) and repositioned (under the heading on mobile, right column on desktop); new ScrollSlide directional scroll reveals alternating sides on every page; What-I-do rows reveal one at a time, staggered left-to-right; footer AHMAD SAJID animates letter-by-letter like the hero DEVELOPER word (FooterWord, scroll-triggered). Verified locally: builds green, phone measurements + screenshots, no overflow at rest.
- 2026-11-07 — Motion round MERGED TO MAIN & LIVE via PR #10 (merge 10575401; PLAN pre-aligned — the first push attempt failed on a missing /tmp paths file lost to a VM cycle, recreated and pushed to both branches before merging; merged cleanly). Live-verified: FooterWord marker (aria-label="AHMAD SAJID") + the 380px medallion class in live /about HTML, routes 200, FleetSlot 404.
- 2026-11-07 — Replay tweak (rebuild 13d9c0c): scroll animations now repeat with each scroll (once: false on ScrollSlide, Reveal, expertise rows, footer word) and the sequences are slower per Ahmad — What-I-do rows stagger 0.3s apart over 0.8s, footer letters step 0.1s. CDP-verified: rows reset to hidden when scrolled away and replay on return; mid-stagger sample 0.98/0.64/0/0.
- 2026-11-07 — Replay tweak MERGED TO MAIN & LIVE via PR #11 (merge 0e6ada88; PLAN pre-aligned on both branches, merged cleanly). Vercel status for the merge commit: success; all routes 200.
- 2026-11-07 — Per-component reveals + card CTA removal (rebuild c6d1d1c7): ScrollSlide gained an `as` prop; reveals moved from section wrappers onto the components themselves (PageHeader self-staggers; grids reveal card-by-card from alternating sides; About items, case-study blocks/features/gallery, detail meta/tech chips, RichText paragraphs via wrapped default Lexical converters, contact fields + channel rows, home headings/buttons, footer postcard). "View case study" removed from project cards and "Read post" from blog cards (whole card is the link). Two earlier push attempts hung on the `| tail -1` pipe quirk (see AGENTS.md lesson); the file-redirect push landed in 11s. Build green; article-paragraph reveals measured in CDP.
- 2026-11-07 — Per-component reveals + card CTA removal MERGED TO MAIN & LIVE via PR #12 (merge 89fec21f; PLAN pre-aligned on both branches, clean merge). Live-verified by absence markers: "View case study" gone from live /projects HTML and zero "Read post" on /blog (both present before the deploy); routes 200, FleetSlot 404. (Vercel commit status lagged at pending while the new build was already serving.)
- 2026-11-08 — Mobile overflow fix + hero halo + coverflow from below (rebuild c72e7fc5): Ahmad's phone screenshots showed every page shifted with content cut at the edges. Root cause: scroll reveals rest off-canvas (±56px) when out of view; with overflow-x: clip on body only, mobile Chrome counted them in the scrollable area (scrollWidth 438 @390px). Fix: clip on html AND body (globals.css, with the why documented in a comment) + overflow-x-clip on <main>. Regression guard shipped: scripts/mobile-overflow-check.mjs (CDP sweep, 7 routes × 390/360px × 5 scroll positions + forced side-scroll; all pass). Also: coverflow reveals from below (from=up, Ahmad's ask); mobile hero medallion glow is now a radial-gradient halo falling to transparent (was a solid blurred disc with a visible edge); coverflow stage has a 4% edge-fade mask; blog spotlight scrim denser (via/60) + meta row nowrap. Build green; medallion and card geometry screenshot/measurement-verified.
- 2026-11-08 — Mobile overflow fix MERGED TO MAIN & LIVE via PR #13 (merge 04e650ec; PLAN pre-aligned, clean merge; Vercel status success; new build confirmed live by the coverflow mask class in the served HTML; routes 200). The regression sweep (scripts/mobile-overflow-check.mjs) is the standing gate for any future animation/layout round: run it before merging.
- 2026-11-08 — Full-width layout (rebuild 6383a83f): on Ahmad's diagnosis, <main> no longer pads — it is truly full width and the inset lives in a .page-gutter utility (globals.css) applied to content blocks and subpage roots; hero/marquee/coverflow stage bleed to the screen edges (measured 390/390/390 at 390px, gutter 24px). Hero medallion glow now matches About's exact -inset-3 disc construction; coverflow edge-fade mask removed (it nibbled the centre card at inset stage widths). Overflow sweep still all-pass; coverflow neighbours now peek from the true screen edges.
- 2026-11-08 — Full-width layout MERGED TO MAIN & LIVE via PR #14 (merge 28320ce5; the merge's approval card timed out twice overnight while Ahmad slept, approved on his "try again" at 02:50). Live-verified: page-gutter class in the served home HTML, Vercel status success, routes 200.
- 2026-11-08 — Featured blog card mobile fix (rebuild b7334b01): Ahmad's /blog screenshot showed the lead card's title/excerpt/meta sliced at the right edge. Cause: the featured PostCard grid had no base grid-cols-1, so its column sized to the non-wrapping meta row (~411px) and overflow-hidden clipped the rest (the hero's 2026-11-06 trap, second occurrence). Fix: grid-cols-1, min-w-0 text column, meta row flex-wrap, featured title text-[1.65rem] on phones (sm:text-4xl unchanged). Sweep script now also fails on link cards whose scrollWidth exceeds clientWidth. Verified at 390/360 (sw == cw), screenshots clean, sweep all-pass.
- 2026-11-08 — Featured blog card fix MERGED TO MAIN & LIVE via PR #15 (merge 30b47cb8; Vercel success; new title class confirmed in live /blog HTML; routes 200).
- 2026-11-08 — Cleanup round (rebuild 615cd76d): (1) ~/page overlines removed everywhere (PageHeader path prop deleted; About's hardcoded ~/about gone); (2) availability pill text (site.availability, About + Contact) changed from situational open-to-work copy to identity: "Software Engineer — backend, AI agents & CRM automation"; footer ribbon "Open to new roles" -> "Software Engineer"; (3) All projects / All posts back pills removed from detail pages (prev/next cards stay); (4) loading.tsx skeletons added for projects/[slug] and blog/[slug] (page-shaped pulse skeletons) so navigation no longer sits blank. Verified: build pass, local HTML markers clean, sweep all-pass.
- 2026-11-08 — Cleanup round MERGED TO MAIN & LIVE via PR #16 (merge ee9b6bae; Vercel success; live /about + /contact carry the new identity badge and no ~/ overlines; live case study has no back pill).
- 2026-11-08 — About portrait desktop fix (rebuild 9d5d3c63): the medallion spanned only heading+lead rows and sat at 380px, reading small and top-pinned against the longer bio. Bio paragraphs moved into the header grid (row 3); portrait spans rows 1-3, self-centred (measured centre delta 5px at 1920/1440); sizes 440px lg / 500px xl (mobile unchanged). Verified: build pass, screenshots, sweep all-pass.
