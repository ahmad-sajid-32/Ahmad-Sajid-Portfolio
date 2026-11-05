'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * The hero's giant background word. Each letter drops in from above
 * with a fade, one at a time from left to right; the amber gradient
 * is vertical, so it reads identically on every letter. Under
 * reduced motion the word renders statically.
 */
export function HeroWord({ word }: { word: string }) {
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
          initial={{ opacity: 0, y: -72 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15 + index * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  )
}
