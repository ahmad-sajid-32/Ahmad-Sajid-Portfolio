'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  span: motion.span,
} as const

type ScrollSlideTag = keyof typeof MOTION_TAGS

interface ScrollSlideProps {
  children: ReactNode
  /** Direction the content travels in from as it scrolls into view. */
  from?: 'left' | 'right' | 'up'
  /** Entrance delay in seconds (for staggering siblings). */
  delay?: number
  className?: string
  /**
   * Element to render — `li` for list items (keeps list markup
   * valid when every row animates on its own), `span` for
   * inline contexts. Defaults to `div`.
   */
  as?: ScrollSlideTag
}

const OFFSETS = {
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
  up: { x: 0, y: 48 },
} as const

/**
 * Scroll-triggered directional reveal — the site-wide sibling
 * of the hero's intro-gated SlideIn. Content glides in from
 * the given side with a fade EVERY time it enters the
 * viewport (Ahmad asked for the animations to replay with
 * each scroll, 2026-11-07); sections alternate sides down
 * the page so scrolling feels choreographed rather than
 * uniform. Under reduced motion the content simply renders.
 */
export function ScrollSlide({
  children,
  from = 'up',
  delay = 0,
  className,
  as = 'div',
}: ScrollSlideProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  const MotionTag = MOTION_TAGS[as]
  const offset = OFFSETS[from]

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
