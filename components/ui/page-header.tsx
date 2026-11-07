import type { ReactNode } from 'react'

import { ScrollSlide } from '@/components/motion/scroll-slide'

interface PageHeaderProps {
  title: string
  intro?: string
  /** Optional extra row under the intro (counts, meta, pills). */
  children?: ReactNode
}

/**
 * Shared subpage header, in the home page's current language:
 * a large Fraunces title, a muted intro, and a soft amber
 * glow behind the top corner for the glossy depth the home
 * sections have. Its pieces reveal on their own — title from
 * the left, the intro just behind it, any extra row rising
 * last — so pages using this header should NOT wrap it in
 * another reveal. (The mono "~/page" overline that used to
 * sit above the title was removed on Ahmad's call, 2026-11-08.)
 */
export function PageHeader({ title, intro, children }: PageHeaderProps) {
  return (
    <header className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative">
        <ScrollSlide from="left">
          <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            {title}
          </h1>
        </ScrollSlide>
        {intro ? (
          <ScrollSlide from="left" delay={0.12}>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
              {intro}
            </p>
          </ScrollSlide>
        ) : null}
        {children ? (
          <ScrollSlide from="up" delay={0.2}>
            {children}
          </ScrollSlide>
        ) : null}
      </div>
    </header>
  )
}
