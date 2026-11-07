/**
 * Case-study loading skeleton — shown instantly on navigation
 * while the page's data loads, so the route never sits blank
 * or half-painted (Ahmad: the slight delay "looked broken",
 * 2026-11-08). Shaped like the real page: pills, title,
 * meta card, cover, body lines — all in surface tones with
 * one shared pulse.
 */
export default function ProjectLoading() {
  return (
    <div className="page-gutter animate-pulse py-14" aria-hidden="true">
      <div className="flex gap-2">
        <div className="h-7 w-28 rounded-full bg-surface" />
        <div className="h-7 w-24 rounded-full bg-surface" />
      </div>
      <div className="mt-8 h-12 w-3/4 rounded-xl bg-surface sm:h-14" />
      <div className="mt-3 h-12 w-1/2 rounded-xl bg-surface sm:h-14" />
      <div className="mt-5 h-5 w-2/3 rounded-md bg-surface" />
      <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-surface/50 p-6 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-14 rounded bg-surface" />
            <div className="mt-2.5 h-4 w-24 rounded bg-surface" />
          </div>
        ))}
      </div>
      <div className="mt-10 aspect-[16/10] rounded-3xl bg-surface" />
      <div className="mt-10 space-y-3.5">
        <div className="h-4 w-full rounded bg-surface" />
        <div className="h-4 w-11/12 rounded bg-surface" />
        <div className="h-4 w-4/5 rounded bg-surface" />
        <div className="h-4 w-3/5 rounded bg-surface" />
      </div>
    </div>
  )
}
