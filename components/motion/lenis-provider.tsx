'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

import 'lenis/dist/lenis.css'

/**
 * Lenis smooth scrolling for the whole site (ARCHITECTURE §11).
 * Skipped entirely under prefers-reduced-motion — native scrolling
 * is the accessible default there.
 */
export function LenisProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.1,
    })
    return () => {
      lenis.destroy()
    }
  }, [])

  return null
}
