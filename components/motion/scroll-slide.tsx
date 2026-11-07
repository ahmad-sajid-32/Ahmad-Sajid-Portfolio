'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface ScrollSlideProps {
  children: ReactNode
  /** Direction the content travels in from as it scrolls into view. */
  from?: 'left' | 'right' | 'up'
  /** Entrance delay in seconds (for staggering siblings). */
  delay?: number
  className?: string
}

const OFFSETS = {
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
  up: { x: 0, y: 48 },
} as const

/**
 * Scroll-triggered directional reveal — the site-wide sibling
 * of the hero's intro-gated SlideIn. Content glides in from
 * the given side with a fade, once, when it enters the
 * viewport; sections alternate sides down the page so
 * scrolling feels choreographed rather than uniform. Under
 * reduced motion the content simply renders.
 */
export function ScrollSlide({
  children,
  from = 'up',
  delay = 0,
  className,
}: ScrollSlideProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  const offset = OFFSETS[from]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
