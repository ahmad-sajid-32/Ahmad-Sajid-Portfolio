'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface SlideInProps {
  children: ReactNode
  /** Direction the content travels in from. */
  from?: 'left' | 'right' | 'up'
  /** Entrance delay in seconds. */
  delay?: number
  className?: string
}

const OFFSETS = {
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
  up: { x: 0, y: 72 },
} as const

/**
 * One-shot entrance (hero): content glides in from a side or rises
 * from below with a fade, on mount. Under reduced motion the content
 * simply renders.
 */
export function SlideIn({ children, from = 'up', delay = 0, className }: SlideInProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  const offset = OFFSETS[from]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
