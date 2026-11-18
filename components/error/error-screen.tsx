import type { ReactNode } from 'react'

/**
 * Shared shell for the site's error screens (404 not-found and the
 * 504-styled error page): a dashed "route" that either dead-ends at
 * an amber X or stalls at a silent-server clock, then index rows
 * pointing back to the good pages. Direction B, picked by Ahmad
 * from rendered prototypes (2026-11-18).
 */
export function ErrorScreen({
  eyebrow,
  heading,
  variant,
  copy,
  children,
}: {
  eyebrow: string
  heading: string
  variant: 'dead-end' | 'stalled'
  copy: string
  children: ReactNode
}) {
  return (
    <section className="page-gutter flex min-h-[72vh] flex-col justify-center py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
      <h1 className="mt-4 font-display text-6xl font-semibold sm:text-7xl">{heading}</h1>

      {variant === 'dead-end' ? (
        <svg viewBox="0 0 720 130" className="mt-10 w-full max-w-3xl" fill="none" aria-hidden>
          <path d="M8 100 C 180 20, 420 120, 640 55" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="7 9" />
          <circle cx="8" cy="100" r="6" className="fill-primary" />
          <g stroke="#e8a33d" strokeWidth="4" strokeLinecap="round">
            <line x1="652" y1="38" x2="676" y2="62" />
            <line x1="676" y1="38" x2="652" y2="62" />
          </g>
          <text x="8" y="128" className="fill-current font-mono" fontSize="11" opacity="0.6">YOU</text>
          <text x="612" y="96" className="fill-current font-mono" fontSize="11" opacity="0.6">NOTHING HERE</text>
        </svg>
      ) : (
        <svg viewBox="0 0 720 130" className="mt-10 w-full max-w-3xl" fill="none" aria-hidden>
          <path d="M8 100 C 140 40, 220 90, 320 62" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="7 9" />
          <path d="M420 62 C 520 40, 620 90, 700 50" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="7 9" />
          <circle cx="8" cy="100" r="6" className="fill-primary" />
          <circle cx="370" cy="62" r="24" stroke="#e8a33d" strokeWidth="3" />
          <line x1="370" y1="62" x2="370" y2="46" stroke="#e8a33d" strokeWidth="3" strokeLinecap="round" />
          <line x1="370" y1="62" x2="382" y2="68" stroke="#e8a33d" strokeWidth="3" strokeLinecap="round" />
          <text x="8" y="128" className="fill-current font-mono" fontSize="11" opacity="0.6">YOU</text>
          <text x="318" y="118" className="fill-current font-mono" fontSize="11" opacity="0.6">SERVER SILENT</text>
        </svg>
      )}

      <p className="mt-8 max-w-lg text-base text-muted-foreground">{copy}</p>
      <div className="mt-10 max-w-3xl">{children}</div>
    </section>
  )
}

export function ErrorRow({ name, note }: { name: string; note: string }) {
  return (
    <>
      <span className="font-display text-2xl transition-colors group-hover:text-primary">{name}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {note} <span aria-hidden>↗</span>
      </span>
    </>
  )
}

export const errorRowClass =
  'group flex w-full items-baseline justify-between border-t border-foreground/10 py-4 text-left last:border-b'
