'use client'

import { useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { ProjectDoc } from '@/lib/data'
import { DEPLOYMENT_LABELS, TRACK_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 4500
const DRAG_THRESHOLD = 42

function CardBody({ project }: { project: ProjectDoc }) {
  const cover = project.coverImage
  return (
    <>
      {cover?.url ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 640px) 88vw, 600px"
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
      <div className="px-6 py-7 text-center sm:px-8 sm:py-8">
        <h3 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.title}
        </h3>
        <p className="mx-auto mt-3 line-clamp-2 min-h-11 max-w-md leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {project.tracks.map((track) => (
            <span
              key={track}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-foreground/90 uppercase"
            >
              <span className="h-1 w-1 rounded-full bg-primary" />
              {TRACK_LABELS[track] ?? track}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * Featured projects as a 3D coverflow carousel (Concept C,
 * chosen by Ahmad; sizing/spacing per his 2026-11-06 review):
 * one large centre card — the whole card is the case-study
 * link and the custom cursor turns into its "View" badge on
 * hover — with neighbours tilted away in perspective. Cards
 * are sized to fill the section on every device. Auto-plays
 * through ALL featured projects (pauses on hover, focus, drag,
 * hidden tab, or reduced motion). Desktop gets arrows + dots;
 * mobile gets dots only and swipe/drag.
 */
export function ProjectsCoverflow({ projects }: { projects: ProjectDoc[] }) {
  const count = projects.length
  // Cards step down in size as more projects are featured, so
  // the fan stays composed instead of overwhelming the section
  // (Ahmad, 2026-11-06).
  const cardMaxWidth = count <= 3 ? 600 : count === 4 ? 540 : count === 5 ? 500 : 460
  const stageHeight =
    count <= 3
      ? 'h-[540px] sm:h-[660px] lg:h-[700px]'
      : count <= 5
        ? 'h-[500px] sm:h-[600px] lg:h-[640px]'
        : 'h-[470px] sm:h-[560px] lg:h-[600px]'
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [wide, setWide] = useState(true)
  const reduceMotion = useReducedMotion()
  const dragStartX = useRef<number | null>(null)
  const lastDragAt = useRef(0)

  const goTo = useCallback(
    (index: number) => setActive(((index % count) + count) % count),
    [count],
  )
  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  // Fan spread: tighter on small screens so the side cards
  // peek instead of crowding the centre card.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const spread = wide ? (count >= 6 ? 58 : 62) : 84

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
        className={`relative cursor-grab touch-pan-y select-none [perspective:1200px] [overflow-x:clip] ${stageHeight}`}
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
          return (
            <article
              key={project.id}
              aria-hidden={!isCenter || undefined}
              className={cn(
                'absolute top-1/2 left-1/2 overflow-hidden rounded-3xl border bg-surface',
                isCenter
                  ? 'border-primary/50 shadow-[0_50px_100px_rgba(0,0,0,0.55),0_0_80px_rgba(232,163,61,0.14)]'
                  : 'border-border',
              )}
              style={{
                width: `min(88vw, ${cardMaxWidth}px)`,
                // Five cards stay in view (centre ± 2); anything
                // further round the loop fades out entirely, so
                // the carousel scales to any number of featured
                // projects while the fan always shows five.
                transform: `translate(-50%, -50%) translateX(${rel * spread}%) translateZ(${-abs * 150}px) rotateY(${-rel * 28}deg)`,
                opacity: abs <= 2 ? 1 - abs * 0.22 : 0,
                zIndex: 20 - abs,
                pointerEvents: abs <= 2 ? 'auto' : 'none',
                transition:
                  'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease',
              }}
              onClick={() => {
                if (!isCenter && abs <= 2) goTo(index)
              }}
            >
              {isCenter ? (
                <Link
                  href={`/projects/${project.slug}`}
                  data-cursor="view"
                  className="block"
                  aria-label={`${project.title} — view case study`}
                >
                  <CardBody project={project} />
                </Link>
              ) : (
                <div aria-hidden="true">
                  <CardBody project={project} />
                </div>
              )}
            </article>
          )
        })}
      </div>

      {count > 1 ? (
        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous project"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-primary/60 hover:text-primary sm:flex"
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
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-primary/60 hover:text-primary sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
