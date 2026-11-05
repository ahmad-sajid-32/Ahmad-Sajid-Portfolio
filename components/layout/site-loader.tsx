'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 * First-load splash: an animated illustration (orbiting rings and a
 * prism — the Dusk Field motif as flat illustration) over the
 * wordmark, with a short progress sweep. Plays once per browser
 * session, never longer than ~1.9s, and is skipped entirely under
 * reduced motion. Content renders underneath from the start, so the
 * loader is pure ceremony, never a gate.
 */
export function SiteLoader() {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<'show' | 'fade' | 'gone'>('show')

  useEffect(() => {
    if (reduceMotion || sessionStorage.getItem('pf-loader-seen')) {
      setPhase('gone')
      return
    }
    sessionStorage.setItem('pf-loader-seen', '1')
    const fadeTimer = setTimeout(() => setPhase('fade'), 1450)
    const goneTimer = setTimeout(() => setPhase('gone'), 1900)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(goneTimer)
    }
  }, [reduceMotion])

  if (phase === 'gone') {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        phase === 'fade' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <svg width="148" height="148" viewBox="0 0 148 148" fill="none">
        <motion.circle
          cx="74"
          cy="74"
          r="62"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeDasharray="5 9"
          opacity="0.75"
          style={{ originX: '74px', originY: '74px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
        <motion.circle
          cx="74"
          cy="74"
          r="44"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="3 7"
          opacity="0.8"
          style={{ originX: '74px', originY: '74px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
        />
        <motion.rect
          x="56"
          y="56"
          width="36"
          height="36"
          rx="5"
          stroke="var(--highlight)"
          strokeWidth="1.5"
          style={{ originX: '74px', originY: '74px' }}
          animate={{ rotate: [45, 135, 225, 315, 405], scale: [1, 1.12, 1, 1.12, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="74"
          cy="12"
          r="3.5"
          fill="var(--primary)"
          style={{ originX: '74px', originY: '74px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
        <circle cx="74" cy="74" r="4" fill="var(--primary)" />
      </svg>
      <p className="mt-7 font-mono text-[11px] tracking-[0.34em] text-muted-foreground uppercase">
        Ahmad Sajid
      </p>
      <div className="mt-4 h-[3px] w-40 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
