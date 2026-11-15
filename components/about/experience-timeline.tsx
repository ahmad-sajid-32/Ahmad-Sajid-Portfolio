'use client'

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'

export interface ExperienceItem {
  role: string
  company: string
  period: string
  summary: string
}

/**
 * "Where I've worked" as a scroll-driven progress line — the
 * pattern Ahmad pointed at from interlinksolutions' "A Guided
 * Execution" section (2026-11-16): a rail on the left fills
 * with a glowing amber stream as the reader scrolls through
 * the section (and drains again on the way back up), a lit
 * tip rides the fill, each node lights as the stream reaches
 * it, and the entries themselves fade up into place. Scroll
 * position drives everything, so the whole sequence plays in
 * both directions.
 */
export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.82', 'end 0.55'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  })

  /**
   * The line spans exactly from the first node's centre to
   * the last node's centre — it must stop at the last badge,
   * not trail below it to the container's bottom edge
   * (Ahmad, 2026-11-16). Measured from layout offsets
   * (offsetTop/offsetHeight), which the entries' entrance
   * transforms do not disturb; recomputed on resize and once
   * webfonts land.
   */
  const [span, setSpan] = useState<{ top: number; height: number } | null>(
    null,
  )
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const measure = () => {
      const nodes = container.querySelectorAll<HTMLElement>(
        '[data-timeline-node]',
      )
      if (nodes.length === 0) return
      const centre = (node: HTMLElement) => {
        let y = node.offsetTop + node.offsetHeight / 2
        let parent = node.offsetParent as HTMLElement | null
        while (parent && parent !== container) {
          y += parent.offsetTop
          parent = parent.offsetParent as HTMLElement | null
        }
        return y
      }
      const first = centre(nodes[0])
      const last = centre(nodes[nodes.length - 1])
      setSpan({ top: first, height: Math.max(0, last - first) })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
  }, [items])

  const tipTop = useTransform(progress, (v) =>
    span ? `${span.top + v * span.height}px` : '0px',
  )
  const spanStyle = span
    ? { top: span.top, height: span.height }
    : undefined
  const spanClass = span ? '' : 'top-2 bottom-2'

  return (
    <div ref={containerRef} className="relative mt-10">
      {/* Rail */}
      <div
        aria-hidden="true"
        style={spanStyle}
        className={`absolute left-[5px] w-px bg-border ${spanClass}`}
      />
      {reduceMotion ? (
        <div
          aria-hidden="true"
          style={spanStyle}
          className={`absolute left-[4px] w-[3px] rounded-full bg-primary ${spanClass}`}
        />
      ) : (
        <>
          {/* Glow underlay — a blurred copy of the fill. */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: progress, ...spanStyle }}
            className={`absolute left-[3px] w-[5px] origin-top rounded-full bg-primary/40 blur-[6px] ${spanClass}`}
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: progress, ...spanStyle }}
            className={`absolute left-[4px] w-[3px] origin-top rounded-full bg-gradient-to-b from-highlight via-primary to-primary ${spanClass}`}
          />
          {/* The lit tip riding the end of the fill. */}
          <motion.span
            aria-hidden="true"
            style={{ top: tipTop }}
            className="absolute left-[5px] z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 blur-[5px]" />
            <span className="block h-[9px] w-[9px] rounded-full bg-primary" />
          </motion.span>
        </>
      )}

      {items.map((item, index) => (
        <TimelineEntry
          key={`${item.role}-${item.period}`}
          item={item}
          index={index}
          progress={progress}
          threshold={(index + 0.5) / items.length}
          reduceMotion={!!reduceMotion}
        />
      ))}
    </div>
  )
}

function TimelineEntry({
  item,
  index,
  progress,
  threshold,
  reduceMotion,
}: {
  item: ExperienceItem
  index: number
  progress: MotionValue<number>
  threshold: number
  reduceMotion: boolean
}) {
  const [lit, setLit] = useState(false)
  useMotionValueEvent(progress, 'change', (v) => {
    setLit(v >= threshold)
  })

  const node = (
    <span
      aria-hidden="true"
      data-timeline-node=""
      className={`absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full border-2 transition-all duration-500 ${
        lit || reduceMotion
          ? 'border-primary bg-primary shadow-[0_0_10px] shadow-primary/60'
          : 'border-primary bg-background'
      }`}
    />
  )
  const body = (
    <>
      <p className="inline-flex rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {item.period}
      </p>
      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
        {item.role} · {item.company}
      </h3>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
        {item.summary}
      </p>
    </>
  )

  if (reduceMotion) {
    return (
      <article className="relative pb-10 pl-10 last:pb-0">
        {node}
        {body}
      </article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative pb-10 pl-10 last:pb-0"
    >
      {node}
      {body}
    </motion.article>
  )
}
