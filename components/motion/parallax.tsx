'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

interface ParallaxProps {
  children: ReactNode
  /** Total vertical travel in px across the element's scroll pass. */
  range?: number
  className?: string
}

/**
 * Gentle scroll parallax: the element drifts `range` px against the
 * scroll while it crosses the viewport. Disabled under reduced
 * motion. Keep ranges small — this is seasoning, not structure.
 */
export function Parallax({ children, range = 28, className }: ParallaxProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [range / 2, -range / 2])

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
