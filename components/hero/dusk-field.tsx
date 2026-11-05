'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState, useSyncExternalStore } from 'react'

import { DuskFieldPoster } from './dusk-field-poster'
import type { DuskFieldColors } from './dusk-field-scene'

function subscribeTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

function getThemeSnapshot(): boolean {
  return document.documentElement.classList.contains('dark')
}

function getServerThemeSnapshot(): boolean {
  return true
}

const DuskFieldScene = dynamic(() => import('./dusk-field-scene'), {
  ssr: false,
})

// Lahore Dusk signal colours, tuned per mode exactly as THEME.md
// prescribes for on-screen elements.
const DUSK_COLORS: DuskFieldColors = {
  ringPrimary: '#E8A33D',
  ringAccent: '#4FB3A6',
  ringHighlight: '#CD949B',
  prism: '#E8A33D',
}

const DAWN_COLORS: DuskFieldColors = {
  ringPrimary: '#0F5A4E',
  ringAccent: '#8F5C06',
  ringHighlight: '#0F5A4E',
  prism: '#8F5C06',
}

let webGLCache: boolean | null = null

function supportsWebGL(): boolean {
  if (webGLCache !== null) {
    return webGLCache
  }
  try {
    const canvas = document.createElement('canvas')
    webGLCache = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    webGLCache = false
  }
  return webGLCache
}

function subscribeCapability(onStoreChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onStoreChange)
  return () => query.removeEventListener('change', onStoreChange)
}

function getCapabilitySnapshot(): boolean {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return !reduced && supportsWebGL()
}

function getServerCapabilitySnapshot(): boolean {
  return false
}

/**
 * The hero's Dusk Field visual. Live 3D only when the device earns
 * it: WebGL available, motion allowed, and (via the watchdog inside
 * the scene) frame rate healthy. Every other path lands on the
 * static poster — the hero never depends on the GPU.
 */
export function DuskField() {
  const capable = useSyncExternalStore(
    subscribeCapability,
    getCapabilitySnapshot,
    getServerCapabilitySnapshot,
  )
  const dark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  )
  const [watchdogTripped, setWatchdogTripped] = useState(false)
  const live = capable && !watchdogTripped

  const handleLowPerformance = useCallback(() => setWatchdogTripped(true), [])

  if (!live) {
    return <DuskFieldPoster />
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-border bg-surface">
      <DuskFieldScene
        colors={dark ? DUSK_COLORS : DAWN_COLORS}
        onLowPerformance={handleLowPerformance}
      />
    </div>
  )
}
