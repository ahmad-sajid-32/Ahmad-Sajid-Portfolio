'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 * First-load splash: the legacy portfolio's gear spinner (see
 * .loader-gear in app/globals.css) — a notched gear whose conic
 * gradient sweeps a bright wedge around it, pure CSS. Behaviour
 * follows the old site: once the window has fully loaded, the
 * loader lingers a further 2s, then fades out over 600ms. It runs
 * on every full page load (client-side navigations never remount
 * it) and is skipped entirely under reduced motion. Content
 * renders underneath from the start, so the loader is pure
 * ceremony, never a gate.
 */
/**
 * Hero entrance animations wait for this signal (see
 * components/motion/use-intro-ready.ts): it fires when the loader
 * starts fading — or immediately when the loader is skipped — so
 * the hero choreography plays in front of the user, not behind
 * the veil.
 */
function signalIntroDone() {
  document.documentElement.dataset.introDone = '1'
  window.dispatchEvent(new Event('pf:intro-done'))
}

export function SiteLoader() {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<'show' | 'fade' | 'gone'>('show')

  useEffect(() => {
    if (reduceMotion) {
      signalIntroDone()
      setPhase('gone')
      return
    }
    let exitStarted = false
    let lingerTimer: number | undefined
    let goneTimer: number | undefined
    const beginExit = () => {
      if (exitStarted) return
      exitStarted = true
      // The legacy rhythm: a fixed 2s linger after load, then the
      // slow fade. The intro signal fires as the fade begins.
      lingerTimer = window.setTimeout(() => {
        signalIntroDone()
        setPhase('fade')
        goneTimer = window.setTimeout(() => setPhase('gone'), 650)
      }, 2000)
    }
    if (document.readyState === 'complete') {
      beginExit()
    } else {
      window.addEventListener('load', beginExit, { once: true })
    }
    // A hung asset must never trap the page behind the veil: if
    // the load event has not arrived within 4s, exit anyway.
    const capTimer = window.setTimeout(beginExit, 4000)
    return () => {
      window.removeEventListener('load', beginExit)
      clearTimeout(lingerTimer)
      clearTimeout(goneTimer)
      clearTimeout(capTimer)
    }
  }, [reduceMotion])

  if (phase === 'gone') {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-[600ms] ${
        phase === 'fade' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="loader-gear" />
    </div>
  )
}
