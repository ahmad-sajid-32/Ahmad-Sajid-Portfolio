interface SectionHeadingProps {
  /** Mono eyebrow, e.g. "02 — Projects". Optional — omit it when
   * the eyebrow would only repeat the title. */
  eyebrow?: string
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
      {eyebrow ? (
        <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-display text-3xl leading-tight font-medium sm:text-4xl ${
          eyebrow ? 'mt-3' : ''
        }`}
      >
        {title}
      </h2>
    </div>
  )
}
