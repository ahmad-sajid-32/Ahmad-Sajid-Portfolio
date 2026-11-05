/**
 * Static poster for the Dusk Field scene — the same composition
 * (rings + prism) drawn with theme tokens. Shown when motion is
 * reduced, WebGL is unavailable, or the FPS watchdog trips, so the
 * hero always has its visual, whatever the device.
 */
export function DuskFieldPoster() {
  return (
    <div
      aria-hidden
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[14px] border border-border bg-surface"
    >
      <div className="absolute h-64 w-64 rounded-full border-2 border-primary/60" />
      <div className="absolute h-44 w-44 rounded-full border border-accent/70" />
      <div className="absolute h-28 w-28 rotate-12 rounded-[14px] border border-highlight/50" />
      <div className="h-16 w-16 rotate-45 bg-primary/80" />
    </div>
  )
}
