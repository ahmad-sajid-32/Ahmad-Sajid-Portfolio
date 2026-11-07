'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * The footer's giant name, animated like the hero's DEVELOPER
 * word: each letter drops in from above with a fade, one at a
 * time from left to right — except the trigger is the footer
 * scrolling into view rather than the loader intro. The amber
 * gradient is vertical, so it reads identically on every
 * letter. Under reduced motion the name renders statically.
 */
export function FooterWord({ word }: { word: string }) {
  const reduceMotion = useReducedMotion()

  const letterClass =
    'inline-block bg-gradient-to-b from-primary via-primary/55 to-primary/0 bg-clip-text text-transparent'

  if (reduceMotion) {
    return (
      <span className="bg-gradient-to-b from-primary via-primary/55 to-primary/0 bg-clip-text text-transparent">
        {word}
      </span>
    )
  }

  return (
    <span role="text" aria-label={word}>
      {word.split('').map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          className={letterClass}
          initial={{ opacity: 0, y: -56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.7,
            delay: 0.04 + index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {letter === ' ' ? ' ' : letter}
        </motion.span>
      ))}
    </span>
  )
}
