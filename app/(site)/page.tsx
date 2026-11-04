export default function HomePage() {
  return (
    <section className="py-16">
      <p className="font-mono text-xs tracking-[0.18em] text-highlight uppercase">
        Phase 1 — Scaffold check
      </p>
      <h1 className="mt-4 font-display text-5xl leading-tight font-medium">
        Lahore Dusk, on a clean premium structure.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        This placeholder page exists to prove the token system in both modes.
        Every colour below comes from a semantic token in THEME.md — no raw
        values anywhere in the markup. Real pages arrive in Phase 3.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[14px] border border-border bg-surface p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Surface
          </p>
          <p className="mt-2 text-sm">Card on the surface token, hairline border.</p>
        </div>
        <div className="rounded-[14px] border border-border bg-surface-raised p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Surface raised
          </p>
          <p className="mt-2 text-sm">Raised panels and menus use this step.</p>
        </div>
        <div className="rounded-[14px] border border-input bg-background p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Input border
          </p>
          <p className="mt-2 text-sm">Functional borders use the input token.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Primary action
        </span>
        <span className="rounded-lg bg-accent-fill px-4 py-2 text-sm font-semibold text-accent-foreground">
          Accent fill
        </span>
        <span className="rounded-lg border border-input px-4 py-2 text-sm">
          Outline action
        </span>
        <span className="text-sm text-accent underline underline-offset-4">Teal link</span>
        <span className="text-sm font-semibold text-amber-text">Amber text</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.18em] uppercase">
        <span className="text-destructive">Destructive</span>
        <span className="text-success">Success</span>
        <span className="text-highlight">Highlight label</span>
      </div>
    </section>
  )
}
