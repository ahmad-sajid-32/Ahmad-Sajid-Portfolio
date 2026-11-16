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
- 2026-11-08 — About portrait fix MERGED TO MAIN & LIVE via PR #17 (merge a21faf6c; Vercel success; 440px class confirmed in live /about HTML; routes 200).
- 2026-11-15 — Toggle + image round (rebuild 3c22adc3): (1) theme toggle below sm is now a compact 36px round sun/moon icon button with the same rotate/cross-fade animation; the desert scene remains on sm+. (2) All images migrated PNG -> WebP: portraits were 0.9-1.4MB each (hero pair 2.1MB, About pair 2.5MB); now hero cutouts 65/79KB, studio medallions 30/39KB, covers ~40KB -> ~11KB. New media ids 22-33; projects/posts cover_image_id re-pointed in the DB (live immediately); home.json hero URLs swapped + optional blur data-URI fields added to schema/types and wired as next/image blur placeholders on hero + About portraits. Old PNG media kept for rollback. Verified: build pass, toggle measured 36x36 mobile / 76px desktop, live media route serves WebP, sweep all-pass.
- 2026-11-15 — Toggle + WebP round MERGED TO MAIN & LIVE via PR #18 (merge f7fe85e6; Vercel success; live home references hero-portrait.webp with zero PNG portrait refs; the optimized portrait the browser downloads measures 38KB, was ~900KB+).
- 2026-11-15 — Portraits moved to local public assets (rebuild b5fd9cfd + 2e6832dc): on Ahmad's diagnosis, the portraits were slow because the optimizer fetched them through the Payload media route from the Supabase bucket (Seoul) on every cold load. They are now repo-local: home.json points at /images/*.png, original PNG quality restored (the PR #18 WebP media remains for covers). Transport: the agent's GitHub write path is text-only (push-files rejects non-UTF-8, verified), and Ahmad declined a GitHub sign-in for web upload — so the PNGs are stored base64-encoded in assets/portraits/*.png.b64 and scripts/decode-portraits.mjs restores them byte-identically into public/images/ via predev/prebuild hooks (decoded files gitignored). Verified: clean build decodes all four with git blob hashes matching the originals; the largest encoded file fetched back from GitHub byte-identical (sha256); local render check shows all portraits loading through the optimizer from local files; sweep all-pass.
- 2026-11-15 — Local portrait assets MERGED TO MAIN & LIVE via PR #19 (merge 5653d975): live /images/hero-portrait.png serves 200 image/png at exactly 917,530 bytes and studio-dawn at 1,461,937 bytes (the originals, byte-exact); home references /images/* with zero /api/media portrait refs — the Vercel build decoded the .b64 sources via the prebuild hook as designed.
- 2026-11-16 — Static image imports + bucket cleanup (rebuild): Ahmad pushed the real image files himself (assets/portraits/: 4 portrait PNGs + both CTA WebPs, rebuild 7a97371f) and asked for the paths fixed properly, the workaround scripts removed, and the bucket emptied. Brand imagery is now imported statically via lib/images.ts (Next static pipeline, automatic blur) — home.json carries copy only (portrait/CTA URL + hand-made blur fields removed from JSON, Zod schema and types); the base64 decode script, prebuild/predev hooks, .gitignore workaround and public/images/.gitkeep are deleted. Bucket: inventoried 92 objects / 23MB against the DB — backed up in full locally, re-pointed UAF's cover to its WebP twin (media 9 -> 30), then deleted 68 objects (all portraits, CTA files, old PNG covers and every generated variant of them). 24 objects / 143KB remain: the 8 live covers (7 published + FleetSlot draft) x original + 2 WebP variants.
- 2026-11-16 — Static imports MERGED TO MAIN & LIVE via PR #20 (merge 68822e64): live home references all six images as hashed files under /_next/static/immutable/media/ (this Next version's static path), zero /images/ refs, api/media refs only for the CMS covers; portrait verified through the live optimizer (200, optimized PNG) and CTA likewise (200). Bucket re-listed after the purge: exactly the 24 keeper objects remain, and live cover URLs (blog-cover, uaf WebP after re-point, memyselfi) all serve 200.
- 2026-11-16 — Header redesign (rebuild): Ahmad picked prototype P1 from two rendered rounds (8 options; an illustrated portrait logo was generated, rejected by Ahmad, and dropped). The header logo is now an amber rounded-square "AS" monogram badge (Fraunces bold) + "Ahmad Sajid." Fraunces wordmark with an amber full stop; on mobile only the badge renders. Nav links moved to a client NavLinks component (usePathname): sentence-case Manrope, the current section gets full ink + a solid amber underline (detail pages light their parent section), other links grow the underline on hover. The favicon (app/icon.svg) is now the same badge — real Fraunces Bold "AS" glyph outlines extracted from the site's own font files, amber #E8A33D with the badge's dark ink. Theme toggle untouched. Verified: build pass, CDP header checks (active state on /projects, none on /, Dawn + Dusk, 390px badge-only, no overflow), sweep all-pass.
- 2026-11-16 — Header redesign MERGED TO MAIN & LIVE via PR #21 (merge cf63efcc; PLAN pre-aligned on both branches, clean merge; Vercel success): live home HTML carries the badge + underline-nav classes, live /icon.svg serves the new 7,230-byte badge favicon, all routes 200, FleetSlot still 404.
- 2026-11-16 — About round (rebuild): (1) Bio rewritten to be about Ahmad rather than his Devisgon chapter — Okara → Lahore, game-dev origin, freelance since May 2024 alongside the UAF degree, Devisgon as one chapter (LaForme lead, Total Store live as NEXRA, intern supervision), MeMySelfI flagship, MS at University of Okara; every fact from the verified profile. (2) "Where I've worked" rebuilt as a scroll-driven progress timeline (new components/about/experience-timeline.tsx): a glowing amber stream fills/drains the rail with scroll in both directions, a lit tip rides the fill, nodes light as the stream reaches them, entries fade up — the pattern from interlinksolutions' "A Guided Execution" that Ahmad pointed at. (3) Education cards carry the university emblems in white tiles (UAF + University of Okara, statically imported via lib/images.ts EDUCATION_LOGOS keyed by a new `logo` slug in about.json; Ahmad uploaded the two logo files to assets/portraits/ himself, byte-identical to the prepared optimized copies). (4) Certificates rebuilt from his LinkedIn Licenses & certifications section: all 5 entries (was 2) in profile order with issue dates and live credential links (Syntecxhub ML Internship May 2026, HP LIFE AI for Beginners Dec 2025, Google Git & GitHub Oct 2025, Google Crash Course on Python Oct 2025, Google Prompting Essentials Jul 2025 — the last date from his verified records, LinkedIn shows none; no credential IDs displayed). Schema: certificates year -> issued + optional url; education + logo enum. Verified: build pass, CDP checks (fill ratio 0.55 mid-scroll with 2 of 3 nodes lit, cert links exact, mobile no-overflow), sweep all-pass.
- 2026-11-16 — About round MERGED TO MAIN & LIVE via PR #22 (merge f755ec54; PLAN pre-aligned, clean merge; Vercel success): live /about carries the new bio, all five certificates and the timeline fill; both emblems serve 200 from /_next/static/immutable/media/ (uaf-logo PNG, university-of-okara-logo JPG); routes 200, FleetSlot 404. Ahmad uploaded the logos into assets/portraits/ (not assets/logos/ as first suggested) — the imports point there; blob hashes match the prepared files exactly.
- 2026-11-16 — Images folder renamed (rebuild 01ebe0b9, direct commit): assets/portraits -> assets/images for all 8 brand files; lib/images.ts imports updated.
- 2026-11-16 — Loading states + animation directions (rebuild 5ba901cc, direct commit): index-level loading.tsx skeletons added for /blog and /projects; blog/projects page animation directions adjusted.
- 2026-11-16 — Skills bento (rebuild): "What I work with" rebuilt as the bento grid Ahmad picked from two rendered prototype rounds (10 concepts; W2 with uniform badges was the pick). Featured groups — Backend ("Core strength") and AI & Automation ("Current focus"), new accent/featured fields in about.json + Zod schema + types — get wide tinted tiles and a 3-wide badge lattice; Frontend and Data & Cloud get standard tiles with a 2-wide lattice; every badge fills its grid cell so the columns align uniformly instead of flowing ragged. TECH_ICONS extended 15 -> 33 with the real Simple Icons marks for the remaining skills (Flask, JavaScript, HTML5, CSS, Tailwind CSS, Bootstrap, MySQL, MongoDB, Supabase, Vercel, Render, Git, GitHub, n8n, Zapier, Make, Zoho, HubSpot); concept skills use Lucide glyphs (REST APIs braces, AI Agents bot, Prompt Engineering terminal); only GoHighLevel keeps the amber dot (no brand mark exists). New components/about/skills-bento.tsx replaces the chip-card grid. Verified: build pass, CDP measured 35 badges with 34 carrying glyphs, sweep all-pass.
- 2026-11-16 — Skills bento MERGED TO MAIN & LIVE via PR #23 (merge 691a48f2; PLAN pre-aligned on both branches, clean merge): live /about carries "Core strength" / "Current focus" markers and the bento tiles; the PR also landed the two pending rebuild commits (assets/images rename, blog/projects loading skeletons). All routes 200, FleetSlot 404.
- 2026-11-16 — Timeline line ends at the last badge (rebuild): on Ahmad's screenshot, the "Where I've worked" progress line trailed below the Freelance node to the container's bottom edge. The rail, glow, fill and reduced-motion line now span exactly from the first node's centre to the last node's centre, measured from layout offsets (offsetTop/offsetHeight — immune to the entries' entrance transforms) and recomputed on resize and font load; the lit tip rides the same span and lands on the last badge. CDP-verified at full progress: fill top/bottom and rail top/bottom all within 0px of the first/last node centres. Sweep all-pass.
- 2026-11-16 — Timeline line fix MERGED TO MAIN & LIVE via PR #24 (merge 67bdd986; PLAN pre-aligned, clean merge): live /about serves the measured-span timeline (data-timeline-node markers present); the line now ends exactly at the Freelance badge.
- 2026-11-16 — Projects page round (rebuild): (1) Intro rewritten: "Real, delivered projects, written up as case studies — what was built, the decisions behind it, and what it took to ship. No demos and no tutorial builds: everything here was made for real users." (2) The count/year line is computed from the rendered Payload set and now follows the active filter (single year shown when min == max). (3) Filter chips are derived from the tracks the published projects actually carry — CRM Automation and Game Dev buttons no longer render (no published projects); their labels stay in TRACK_LABELS so the buttons appear automatically when a project in that track is published; a stale track URL falls back to All. (4) Cards are uniform: the card link is a full-height flex column and the track badges are pinned to the bottom (mt-auto), so badge rows align across a row regardless of tagline length (CDP: both row-1 cards 430.4px, badge rows identical Y). Cover hover zoom gentled 1.05 -> 1.03 so the image no longer presses the card border. (5) Pagination: max 12 projects per page (?page=, composes with ?track=, out-of-range clamps); controls render only when the filtered set exceeds 12. Verified with a temporary PAGE_SIZE=2 build (3 pages, correct slices, Prev/Next edges, AI filter paginating with track preserved), then restored to 12 and rebuilt: 6 cards, no pagination nav. Sweep all-pass.
- 2026-11-16 — Projects page round MERGED TO MAIN & LIVE via PR #25 (merge c76d59e4; PLAN pre-aligned, clean merge): live /projects carries the new intro, data-derived filter chips (CRM Automation and Game Dev gone until a project renders in them), the filter-aware Payload count line, uniform cards, and 12-per-page pagination (inactive at 6 projects). Vercel's rollout lagged ~15 minutes behind the merge; the serving HTML, not the status API, confirmed the switch.
- 2026-11-16 — Blog page round (rebuild): (1) Small cards are uniform: the card link is a full-height flex column and the excerpt is pinned to the bottom of the text block (mt-auto), so descriptions align across a row regardless of title length (CDP: all three grid cards 513.9px tall, excerpt tops and bottoms identical). Cover hover zoom gentled 1.05 -> 1.03 on both card variants. (2) Pagination: max 10 posts per page (?page=) — one featured on top, nine below; controls render only when the total exceeds 10. Verified with a temporary PAGE_SIZE=3 build (2 pages over 4 posts, correct slices, page=99 clamps), then restored to 10 and rebuilt: featured + 3 grid, no pagination nav. (3) Fourth post published in Payload: "Rebuilding my portfolio: Next.js, Payload CMS and a database I control" (Engineering, shared blog cover, h2-sectioned body) — newest post, so it leads the blog index as the featured story and enters the home spotlight. Its two-digit date (16 Nov 2026) tipped the home spotlight's nowrap meta row 4px over at 360px — the sweep caught it; the row now wraps (flex-wrap, gap-x-4 gap-y-1) instead of clipping.
- 2026-11-16 — Blog page round MERGED TO MAIN & LIVE via PR #26 (merge 3a8cbd90; PLAN pre-aligned, clean merge): live /blog serves the uniform small cards with bottom-pinned excerpts, the 1.03 cover zoom, 10-per-page pagination (inactive at 4 posts) and the new post as featured story; live home spotlight carries the wrapping meta row. Sweep all-pass (14/14) on the shipped build.
- 2026-11-16 — Contact page round (rebuild): layout approved by Ahmad from a rendered prototype (two rounds; five beneath-section candidates A–E, he picked C). (1) The form panel narrows (grid 5fr/6fr) and the availability pill moves under the intro. (2) The social link rows and the standalone email card are replaced by a uniform tile grid fed by the Payload Socials global — icon in a medallion on top, small mono label pinned at the bottom, three per row; the grid stretches so its block ends exactly level with the form (CDP: panel and grid bottoms both 822, all 9 tiles 132.7px). On hover the label swaps to an action word — Visit for the socials, Write for email, Call for phone, Chat for WhatsApp. The global currently holds exactly nine channels (GitHub, LinkedIn, Instagram, Facebook, X, Fiverr, Email, Phone, WhatsApp), so the grid is a full 3x3; rows added in the CMS flow in automatically. (3) Beneath, the "Write to me directly" banner (new emailBannerHeading in contact.json + Zod + types): a wide mailto card with the address set large in Fraunces. Verified: build pass, 9 tiles with the correct hrefs, banner present, sweep all-pass (14/14).
- 2026-11-16 — Contact page round MERGED TO MAIN & LIVE via PR #27 (merge 04f307a1; PLAN pre-aligned, clean merge): live /contact serves the narrowed form, the 3x3 social tile grid (9 tiles, correct hrefs, hover action words in the markup) and the "Write to me directly" banner. Note: /projects/fleetslot serves the not-found page (no draft content in the payload) but with HTTP 200 — the streaming/loading boundary flushes 200 before notFound resolves; behaviour predates this round (since the index loading.tsx commit), flagged to Ahmad as a status-code nit, not a leak.
- 2026-11-16 — Contact tweaks (rebuild): from Ahmad's live screenshot — the social tiles carried too much empty space on wide screens. Tile padding p-4 -> p-3, and the form/grid ratio flips 5fr/6fr -> 6fr/5fr so the form takes the reclaimed width (CDP at 1280px: form 488 -> 585px, tiles narrower, bottoms still level). Mobile: tile medallions shrink (h-11/w-11, 20px glyphs; desktop keeps h-14/24px), and the beneath banner text shrinks (heading text-2xl, address text-xl; desktop keeps sm:text-3xl — the address now fits one line at 390px). Verified: build pass, geometry measured on desktop + mobile, sweep all-pass (14/14).
- 2026-11-16 — Contact tweaks MERGED TO MAIN & LIVE via PR #28 (merge 695f4de1; PLAN pre-aligned, clean merge): live /contact serves the 6fr/5fr layout with tighter tiles and the smaller mobile medallions/banner text.
- 2026-11-16 — Project detail media round (rebuild): Ahmad's verdict on the fully-filled UAF case study — the text sections read well, but every media element rendered at the full page width and dominated the screen. From four strategies he picked the combo: dedupe + sized tiers + click-to-play. (1) Cover shallowed 3/2 -> 16/10 on mobile and 21/9 on desktop (measured 1265x843 -> 1265x542). (2) The architecture diagram is capped at max-w-3xl and centred (1265 -> 768px wide). (3) Media-break blocks are retitled "Media", their image grid goes 3-up on desktop, and any image already in the page-level Gallery is filtered out so nothing shows twice. (4) The Gallery grid also goes 3-up on desktop (tiles 411px). (5) Videos are click-to-play: new client component components/projects/video-embed.tsx renders the YouTube poster (or a plain surface fallback) with an amber play disc and swaps in the iframe only on click (autoplay=1 appended) — the page now loads with zero iframes; the standalone Demo section renders only when its embed URL is not already used inside a block, and uploaded videos are capped at max-w-3xl too. On UAF the duplicate Demo section is gone and the Media block carries just the video. Prototype approved by Ahmad from rendered screenshots before the code push. Verified: build pass, CDP geometry (cover/diagram/facade/gallery measured), sweep all-pass (14/14).
- 2026-11-16 — Project detail media round MERGED TO MAIN & LIVE via PR #29 (merge 09aa4e48; PLAN pre-aligned, clean merge): live UAF case study serves the shallowed 21/9 cover, the capped centred diagram, the "Media" block with its click-to-play facade (YouTube poster confirmed in the live HTML), exactly one Gallery and no Demo section; the page loads with zero iframes; all routes 200.
- 2026-11-16 — Paginator slim bar (rebuild): the Previous/Next cards at the foot of project case studies and blog articles were ~140px tall each and read as whole sections. Ahmad picked concept A from five rendered prototypes (slim split bar, ghost pills, thumb mini-cards, index rows, mono line): ONE bar split by a hairline, label + title on a single line per side, arrows slide and light amber on hover, halves tint on hover; it stacks vertically on phones. New shared component components/ui/detail-paginator.tsx, wired into both detail pages (projects: Previous/Next project; blog: Newer/Older post), replacing the two large cards in each. Measured 72px tall on desktop (was ~140px per card, two cards plus gap). The paginator prototype route lived only in the work copy and was deleted before this push. Verified: build pass, CDP geometry + rendered check on a project page and an article, sweep all-pass (14/14).
- 2026-11-16 — Paginator slim bar MERGED TO MAIN & LIVE via PR #30 (merge 8d2b7c73; PLAN pre-aligned, clean merge): live project and blog detail pages serve the 72px split bar (DetailPaginator markup confirmed in the live HTML, correct neighbour hrefs); the only remaining p-6 rounded-3xl cards on a case study are the meta panel, as intended. All routes 200.
- 2026-11-16 — Blog article round (rebuild): the single-post page got the same treatment as the case studies, on Ahmad's list: lower the hero, let the text cover the whole screen, add a line beside the subheadings. (1) Cover shallowed 3/2 -> 16/10 on mobile and 21/9 on desktop (measured 1105x737 -> 1105x474), matching the project detail cover. (2) The article body was max-w-3xl left-aligned under the full-width cover, leaving a void on the right — the measure is removed, prose now runs the full width like the case studies; the title block keeps its narrower measure as the intro. (3) Subheadings (h2 in RichText) gain the amber line beside them — the same h-7 w-1 rounded bar the case-study section titles use, implemented as before: variants in components/content/rich-text.tsx so every article heading carries it. The paginator on this page is already the PR #30 slim bar. Prototype approved by Ahmad from rendered screenshots before the code push. Verified: build pass, CDP geometry + rendered checks, sweep all-pass (14/14).
- 2026-11-16 — Blog article round MERGED TO MAIN & LIVE via PR #31 (merge ebea7593; PLAN pre-aligned, clean merge): live article serves the 21/9 cover, full-width prose (no max-w-3xl body wrapper in the HTML), the h2 amber-bar classes, and the slim paginator bar. All routes 200.
- 2026-11-16 — Admin rich-text fix (rebuild): the Payload admin's rich-text editor rendered as a blank box on every Body field (found during the UAF fill), so case-study text could not be edited in the admin at all. Root cause: app/(payload)/admin/importMap.js was empty (`export const importMap = {}`) — the admin resolves the Lexical editor components through that map. The Payload CLI cannot regenerate it in the agent sandbox (CLI crashes on this Node), so the map was hand-authored with the exact registrations the Lexical package itself declares: client#RichTextField plus rsc#RscEntryLexicalField, rsc#RscEntryLexicalCell and rsc#LexicalDiffComponent. Verified locally: production build passes and the admin bundles now contain the editor code (absent before); live admin check follows the merge.
- 2026-11-17 — Admin rich-text fix, round 2 (rebuild): live check of the round-1 map showed the editors rendering and editable but with NO toolbar — each Lexical feature (bold, italic, lists, link, headings, the inline toolbar itself…) registers its own client component in the same import map. The map now carries all 20 feature clients of the package's default feature set (verified against lexical/config/server/default.js in the installed @payloadcms/richtext-lexical), alongside the original 4 entries. Note: Payload's default editor has no always-visible fixed toolbar — formatting appears as the inline toolbar on text selection, plus the slash menu; that is the stock behaviour this restores.
