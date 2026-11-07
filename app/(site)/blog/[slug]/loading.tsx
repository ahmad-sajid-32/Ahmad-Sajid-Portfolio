/**
 * Article loading skeleton — shown instantly on navigation
 * while the post loads, matching the article's shape (meta
 * row, title, lead, cover, body lines) so the route never
 * sits blank or half-painted.
 */
export default function PostLoading() {
  return (
    <div className="page-gutter animate-pulse py-14" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="h-7 w-28 rounded-full bg-surface" />
        <div className="h-3.5 w-36 rounded bg-surface" />
      </div>
      <div className="mt-7 h-11 w-4/5 max-w-3xl rounded-xl bg-surface sm:h-13" />
      <div className="mt-3 h-11 w-3/5 max-w-3xl rounded-xl bg-surface sm:h-13" />
      <div className="mt-6 h-5 w-2/3 max-w-3xl rounded-md bg-surface" />
      <div className="mt-4 h-5 w-1/2 max-w-3xl rounded-md bg-surface" />
      <div className="mt-10 aspect-[16/10] rounded-3xl bg-surface" />
      <div className="mt-10 max-w-3xl space-y-3.5">
        <div className="h-4 w-full rounded bg-surface" />
        <div className="h-4 w-11/12 rounded bg-surface" />
        <div className="h-4 w-full rounded bg-surface" />
        <div className="h-4 w-4/5 rounded bg-surface" />
        <div className="h-4 w-3/5 rounded bg-surface" />
      </div>
    </div>
  )
}
