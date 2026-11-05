# AGENT.md — Coding Rules & Preferences

The working rules for anyone (human or AI agent) building this
portfolio. They come from Ahmad Sajid, the owner, and they outrank
default habits. The architecture itself lives in
`docs/ARCHITECTURE.md`; progress lives in `docs/PLAN.md`.

## 1. Facts discipline

- **Never invent content.** Every factual claim on the site — roles,
  dates, project details, metrics, certificates — must trace to a
  verified fact about Ahmad. If a fact is missing, ask one blocking
  question instead of guessing.
- **Never overwrite something Ahmad wrote or filled in himself.**
- No fabricated experience, titles, or numbers, ever — including
  "harmless" placeholder copy that states facts. Placeholders must be
  obviously placeholders.

## 2. Stack (locked)

- Next.js 16 / React 19 / TypeScript (strict) / Tailwind CSS v4.
- Payload CMS v3, embedded in the same Next.js app.
- Supabase: Postgres (via the transaction pooler) + S3-compatible
  storage bucket `media`. Free tier only — the whole stack must cost
  PKR 0 to run; free and open-source software only.
- This Next.js version has breaking changes versus older releases —
  read `node_modules/next/dist/docs/` before writing framework code,
  and heed the note in the repo-root `AGENTS.md`.

## 3. Code style

- **Component-based architecture.** Pages compose components;
  components stay small and single-purpose.
- **Semantic theme tokens only.** Colours come from the CSS-variable
  tokens in `app/globals.css` (`background`, `foreground`, `primary`,
  `surface`, `surface-raised`, `muted-foreground`, `accent`,
  `highlight`, `border`, `input`, `ring`, …), mapped through Tailwind's
  `@theme inline`. **No raw colour classes** (`text-amber-500`,
  `bg-[#1E1420]`, …) in component code.
- **Both modes, always.** Every component is built and checked in Dusk
  (dark) and Dawn (light). A component that only works in one mode is
  unfinished.
- TypeScript strict; no `any` without a comment saying why.
- Professional English only — in code, comments, commit messages,
  docs, and all outward text.

## 4. Content architecture

- **JSON data houses for stable copy.** Page text lives in
  `content/*.json` (site, home, about, contact), keyed by slug where
  applicable, and is loaded through the typed Zod loaders in
  `lib/content.ts`. A missing or mistyped key must fail the build —
  never silently fall back.
- **Payload for dynamic content.** Projects, posts, media,
  technologies, categories, and contact submissions live in Payload.
- **A string never lives in both.** If copy is in a JSON data house it
  is not in Payload, and vice versa.

## 5. Payload conventions

- Collections live in `payload/collections/`, blocks in
  `payload/blocks/`, hooks in `payload/hooks/`, access helpers in
  `payload/access/`.
- Access pattern: public reads see **published** content only
  (`publishedOnly`); writes are admin-only, except contact-submission
  creation, which is public.
- Slugs are generated from the title/name by hook and are **never**
  overwritten once set.
- The project lifecycle field is named **`deploymentStatus`**, never
  `status` — Payload reserves `status` for drafts/versions.
- Content changes revalidate the affected public paths via the
  revalidation hook; don't add manual cache workarounds.

## 6. Workflow

- **One thing at a time.** Finish and verify one step before starting
  the next; no parallel juggling.
- **Verify the rendered UI, not just APIs.** A step is not done
  because endpoints return 200 — look at the actual page/admin output
  (styling, both themes) before calling it done.
- Before any push: `lint`, `typecheck`, and production `build` all
  green.
- **Branches:** all rebuild work happens on `rebuild`. `main` stays
  untouched (the old site keeps serving the live domain) until the
  single Phase 6 merge. `legacy-html` is the frozen archive of the
  old site — never commit to it.
- **Secrets never enter the repo.** Real values live only in
  `.env.local` (gitignored) and in Vercel's environment settings.
  `env.example` documents variable names only.
- Report status unsweetened: what is done, what is blocked, and why —
  with counts and evidence, not adjectives.
