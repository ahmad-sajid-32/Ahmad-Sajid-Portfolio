'use client'

import { useEffect, useState } from 'react'

/**
 * Hero entrance animations wait for the first-load loader: the
 * loader dispatches `pf:intro-done` (and stamps
 * `data-intro-done` on <html>) when it starts fading, so the hero
 * choreography is seen in full instead of playing behind the veil.
 * A safety timeout guarantees content appears even if the loader
 * is ever removed or its signal is missed.
 */
export function useIntroReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (document.documentElement.dataset.introDone === '1') {
      setReady(true)
      return
    }
    const onDone = () => setReady(true)
    window.addEventListener('pf:intro-done', onDone, { once: true })
    const safety = setTimeout(() => setReady(true), 3000)
    return () => {
      window.removeEventListener('pf:intro-done', onDone)
      clearTimeout(safety)
    }
  }, [])

  return ready
}
