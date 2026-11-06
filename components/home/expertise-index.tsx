'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Bot, LayoutDashboard, Server, Workflow, type LucideIcon } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

export interface ExpertiseArea {
  title: string
  body: string
  chips: string[]
}

const AREA_ICONS: Record<string, LucideIcon> = {
  backend: Server,
  'ai-agents': Bot,
  'crm-automation': Workflow,
  frontend: LayoutDashboard,
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function Chips({ chips }: { chips: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
        >
          {chip}
        </span>
      ))}
    </div>
  )
}

function AreaDetail({ area }: { area: ExpertiseArea }) {
  const Icon = AREA_ICONS[slugify(area.title)] ?? Server
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-2xl font-semibold">{area.title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.body}</p>
      <div className="mt-4">
        <Chips chips={area.chips} />
      </div>
    </>
  )
}

/**
 * "What I do" as a giant index (Concept 3, chosen by Ahmad):
 * the four expertise areas are oversized Fraunces rows. On
 * desktop, hovering or focusing a row lights it amber, nudges it
 * sideways, and a tilted detail card floats to that row with the
 * description and chips. Below `lg` the card gives way to an
 * inline expanding panel under the tapped row. The active area
 * is shared, so keyboard and touch get the same content.
 */
export function ExpertiseIndex({ areas }: { areas: ExpertiseArea[] }) {
  const [active, setActive] = useState(0)
  const [cardY, setCardY] = useState(0)
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  // Keep the floating card centred on the active row, clamped so
  // it never spills past the section's top or bottom edge.
  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current
      const row = rowRefs.current[active]
      const card = cardRef.current
      if (!container || !row || !card) return
      const centre = row.offsetTop + row.offsetHeight / 2
      const max = Math.max(0, container.offsetHeight - card.offsetHeight)
      setCardY(Math.min(Math.max(centre - card.offsetHeight / 2, 0), max))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  const activeArea = areas[active]

  return (
    <div ref={containerRef} className="relative">
      <div>
        {areas.map((area, index) => {
          const isActive = index === active
          return (
            <div
              key={area.title}
              ref={(el) => {
                rowRefs.current[index] = el
              }}
              className="border-t border-border last:border-b"
            >
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-expanded={isActive}
                aria-current={isActive || undefined}
                className={cn(
                  'flex w-full items-baseline gap-4 py-5 text-left transition-all duration-300 sm:gap-7',
                  isActive && 'translate-x-2 lg:translate-x-4',
                )}
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'font-display leading-none font-semibold tracking-tight whitespace-nowrap uppercase transition-colors duration-300 lg:text-7xl xl:text-8xl',
                    // Long titles (CRM AUTOMATION) step down on
                    // small screens so they never overflow.
                    area.title.length > 10
                      ? 'text-[8.2vw] sm:text-5xl'
                      : 'text-[11.5vw] sm:text-6xl',
                    isActive ? 'text-primary' : 'text-foreground/85',
                  )}
                >
                  {area.title}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'ml-auto hidden font-mono text-[11px] tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-300 md:block',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {area.chips.slice(0, 3).join(' · ')}
                </span>
              </button>

              {/* Inline detail panel (below lg) */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden lg:hidden"
                  >
                    <div className="pr-2 pb-6 pl-9 sm:pl-12">
                      <AreaDetail area={area} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Floating detail card (lg and up). Exactly one detail
          copy is ever in the accessibility tree: this card on
          desktop (the inline panel is display:none there), the
          panel below lg (this card is display:none there). */}
      <motion.div
        ref={cardRef}
        className="absolute top-0 right-[3%] hidden w-80 lg:block xl:right-[5%]"
        animate={{ y: cardY, rotate: reduceMotion ? 0 : -2 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        style={{ pointerEvents: 'none' }}
      >
        <div
          aria-live="polite"
          className="rounded-2xl border border-primary/40 bg-surface p-6 shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeArea.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <AreaDetail area={activeArea} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
