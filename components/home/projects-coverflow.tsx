'use client'

import { useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { ProjectDoc } from '@/lib/data'
import { DEPLOYMENT_LABELS, TRACK_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 4500
const DRAG_THRESHOLD = 42

/**
 * Featured projects as a 3D coverflow carousel (Concept C,
 * chosen by Ahmad): the centre card stands upright with the
 * full story and glows; neighbours tilt away in perspective
 * and fade. Auto-plays through ALL featured projects (pauses
 * on hover, focus, drag, hidden tab, or reduced motion);
 * arrows, dots, clicking a side card, and drag/swipe all move
 * it. The centre card is the case-study link.
 */
export function ProjectsCoverflow({ projects }: { projects: ProjectDoc[] }) {
  const count = projects.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const dragStartX = useRef<number | null>(null)
  const lastDragAt = useRef(0)

  const goTo = useCallback(
    (index: number) => setActive(((index % count) + count) % count),
    [count],
  )
  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setActive((current) => (current + 1) % count)
      }
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, reduceMotion, count])

  if (count === 0) return null

  const relativeOffset = (index: number) => {
    let rel = (((index - active) % count) + count) % count
    if (rel > count / 2) rel -= count
    return rel
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative h-[470px] touch-pan-y select-none sm:h-[540px] [perspective:1200px]"
        onPointerDown={(event) => {
          dragStartX.current = event.clientX
        }}
        onPointerUp={(event) => {
          if (dragStartX.current === null) return
          const dx = event.clientX - dragStartX.current
          dragStartX.current = null
          if (Math.abs(dx) > DRAG_THRESHOLD) {
            lastDragAt.current = Date.now()
            if (dx < 0) next()
            else prev()
          }
        }}
        onClickCapture={(event) => {
          // A drag ends in a click — don't let it navigate or
          // re-centre on whatever sits under the pointer.
          if (Date.now() - lastDragAt.current < 200) {
            event.preventDefault()
            event.stopPropagation()
          }
        }}
      >
        {projects.map((project, index) => {
          const rel = relativeOffset(index)
          const abs = Math.abs(rel)
          const isCenter = rel === 0
          const cover = project.coverImage
          return (
            <article
              key={project.id}
              aria-hidden={!isCenter || undefined}
              className={cn(
                'absolute top-1/2 left-1/2 w-[min(80vw,380px)] overflow-hidden rounded-3xl border bg-surface',
                isCenter
                  ? 'border-primary/50 shadow-[0_50px_100px_rgba(0,0,0,0.55),0_0_80px_rgba(232,163,61,0.14)]'
                  : 'border-border',
              )}
              style={{
                transform: `translate(-50%, -50%) translateX(${rel * 62}%) translateZ(${-abs * 190}px) rotateY(${-rel * 36}deg)`,
                opacity: abs <= 2 ? 1 - abs * 0.3 : 0,
                zIndex: 20 - abs,
                pointerEvents: abs <= 2 ? 'auto' : 'none',
                transition:
                  'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease',
              }}
              onClick={() => {
                if (!isCenter && abs <= 2) goTo(index)
              }}
            >
              {cover?.url ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={cover.url}
                    alt={isCenter ? cover.alt : ''}
                    fill
                    sizes="380px"
                    className="object-cover"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
                  {project.deploymentStatus === 'deployed' ? (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-highlight/50 bg-background/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-highlight uppercase backdrop-blur">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-highlight" />
                      {DEPLOYMENT_LABELS[project.deploymentStatus]}
                    </span>
                  ) : null}
                </div>
              ) : null}
              <div className="p-5 text-center">
                <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  {project.year} · {project.role}
                </p>
                <h3 className="mt-1.5 font-display text-3xl font-semibold">
                  {project.title}
                </h3>
                <p className="mx-auto mt-1.5 line-clamp-2 min-h-10 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {project.tagline}
                </p>
                <div className="mt-3.5 flex flex-wrap justify-center gap-2">
                  {project.tracks.map((track) => (
                    <span
                      key={track}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                    >
                      {TRACK_LABELS[track] ?? track}
                    </span>
                  ))}
                </div>
                {isCenter ? (
                  <Link
                    href={`/projects/${project.slug}`}
                    data-cursor="view"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-accent uppercase underline underline-offset-4"
                  >
                    View case study <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <p className="mt-4 font-mono text-[11px] tracking-[0.18em] text-muted-foreground/60 uppercase">
                    View case study
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {count > 1 ? (
        <div className="mt-1 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-primary/60 hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show ${project.title}`}
                aria-current={index === active || undefined}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === active ? 'w-7 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-primary/60 hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
