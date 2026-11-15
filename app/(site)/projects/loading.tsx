/** Loading state for the project index while its Payload query resolves. */
export default function ProjectsLoading() {
  return (
    <div className="page-gutter animate-pulse py-14" aria-hidden="true">
      <div className="max-w-3xl">
        <div className="h-12 w-2/5 rounded-xl bg-surface sm:h-14" />
        <div className="mt-5 h-5 w-full rounded-md bg-surface" />
        <div className="mt-2 h-5 w-4/5 rounded-md bg-surface" />
        <div className="mt-5 h-3 w-40 rounded bg-surface" />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-8 w-24 rounded-full bg-surface" />
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-border bg-surface/50"
          >
            <div className="aspect-[16/10] bg-surface" />
            <div className="space-y-3 p-6 sm:p-7">
              <div className="h-7 w-3/4 rounded-md bg-surface" />
              <div className="h-4 w-full rounded bg-surface" />
              <div className="h-4 w-2/3 rounded bg-surface" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-20 rounded-full bg-surface" />
                <div className="h-6 w-24 rounded-full bg-surface" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
