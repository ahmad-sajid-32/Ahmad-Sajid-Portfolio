import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** Mono path label, e.g. "~/projects" — the subpage signature. */
  path: string
  title: string
  intro?: string
  /** Optional extra row under the intro (counts, meta, pills). */
  children?: ReactNode
}

/**
 * Shared subpage header, in the home page's current language:
 * the mono path label, a large Fraunces title, a muted intro,
 * and a soft amber glow behind the top corner for the glossy
 * depth the home sections have.
 */
export function PageHeader({ path, title, intro, children }: PageHeaderProps) {
  return (
    <header className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative">
        <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
          {path}
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}
        {children}
      </div>
    </header>
  )
}
