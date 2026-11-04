# Ahmad Sajid — Portfolio

Personal portfolio of Ahmad Sajid, software engineer (backend, AI agents,
CRM automation, frontend). Currently being rebuilt from a static site to
Next.js + Payload CMS — see the `rebuild` branch; `main` still serves the
live site at [ahmad-sajid.vercel.app](https://ahmad-sajid.vercel.app)
until launch, and `legacy-html` preserves the original static site.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Payload CMS 3 (Postgres adapter + S3 storage) on Supabase
- Tailwind CSS v4 with a semantic token theme ("Lahore Dusk" — Dusk dark /
  Dawn light, WCAG-audited)

## Local development

```bash
npm install
# create .env.local with the variables listed in the project env template
# (DATABASE_URL, PAYLOAD_SECRET, S3_*) — never commit it
npm run dev        # site on :3000, admin at /admin
```

Quality gates: `npm run lint`, `npm run typecheck`, `npm run build`.
