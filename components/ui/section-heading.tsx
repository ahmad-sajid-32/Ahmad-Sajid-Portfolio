interface SectionHeadingProps {
  /** Mono eyebrow, e.g. "01 — Projects". */
  eyebrow: string
  title: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl leading-tight font-medium sm:text-4xl">
        {title}
      </h2>
    </div>
  )
}
