'use client'

import { useSyncExternalStore } from 'react'

import { cn } from '@/lib/utils'

type Mode = 'dusk' | 'dawn'

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

function getSnapshot(): Mode {
  return document.documentElement.classList.contains('dark') ? 'dusk' : 'dawn'
}

function getServerSnapshot(): Mode {
  return 'dusk'
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = () => {
    const next: Mode = mode === 'dusk' ? 'dawn' : 'dusk'
    document.documentElement.classList.toggle('dark', next === 'dusk')
    try {
      localStorage.setItem('theme', next)
    } catch {
      // storage unavailable — the class toggle above still applies
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${mode === 'dusk' ? 'Dawn (light)' : 'Dusk (dark)'} theme`}
      className="font-mono text-[11px] tracking-[0.18em] uppercase transition-colors"
    >
      <span className={cn(mode === 'dusk' ? 'text-amber-text' : 'text-muted-foreground')}>
        Dusk
      </span>
      <span className="text-muted-foreground"> / </span>
      <span className={cn(mode === 'dawn' ? 'text-accent' : 'text-muted-foreground')}>
        Dawn
      </span>
    </button>
  )
}
