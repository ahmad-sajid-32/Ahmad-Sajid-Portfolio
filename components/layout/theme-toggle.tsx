'use client'

import { Moon, Sun } from 'lucide-react'
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

const STARS = [
  { top: '18%', left: '16%', size: 2.5, delay: '0.05s' },
  { top: '30%', left: '38%', size: 1.8, delay: '0.15s' },
  { top: '12%', left: '58%', size: 2, delay: '0.25s' },
  { top: '26%', left: '78%', size: 2.4, delay: '0.1s' },
  { top: '44%', left: '88%', size: 1.6, delay: '0.3s' },
] as const

/**
 * Theme switch as a miniature desert scene (after the Dribbble
 * day/night toggle, re-skinned for Lahore Dusk): a sun crosses a
 * warm amber sky in Dawn; in Dusk it sets into a moon over dark
 * dunes while stars come out. The whole scene is token-driven and
 * every layer transitions, so flipping the theme animates the
 * landscape instead of snapping it.
 */
export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isDusk = mode === 'dusk'

  const toggle = () => {
    const next: Mode = isDusk ? 'dawn' : 'dusk'
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
      role="switch"
      aria-checked={isDusk}
      onClick={toggle}
      aria-label={`Desert theme toggle — currently ${isDusk ? 'Dusk (night)' : 'Dawn (day)'}; switch to ${isDusk ? 'Dawn' : 'Dusk'}`}
      title={isDusk ? 'Switch to Dawn' : 'Switch to Dusk'}
      className="relative block h-9 w-[76px] shrink-0 overflow-hidden rounded-full border border-border shadow-[inset_0_1px_4px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      {/* Dawn sky */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          isDusk ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklab, var(--primary) 45%, white) 0%, var(--primary) 62%, color-mix(in oklab, var(--primary) 78%, var(--highlight)) 100%)',
        }}
      />
      {/* Dusk sky */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          isDusk ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklab, var(--background) 45%, black) 0%, var(--background) 70%, color-mix(in oklab, var(--background) 82%, var(--primary)) 100%)',
        }}
      />
      {/* Stars (Dusk only) */}
      {STARS.map((star, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            'absolute rounded-full bg-white transition-all duration-700',
            isDusk ? 'translate-y-0 opacity-90' : 'translate-y-1 opacity-0',
          )}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            transitionDelay: star.delay,
          }}
        />
      ))}
      {/* Dunes */}
      <svg
        aria-hidden="true"
        viewBox="0 0 76 36"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full [&>path]:transition-[fill] [&>path]:duration-700"
      >
        <path
          d="M0 27 Q 14 19 30 24 T 76 22 V36 H0 Z"
          fill={
            isDusk
              ? 'color-mix(in oklab, var(--background) 55%, var(--primary))'
              : 'color-mix(in oklab, var(--primary) 62%, var(--highlight))'
          }
          opacity="0.75"
        />
        <path
          d="M0 31 Q 20 25 42 29 T 76 28 V36 H0 Z"
          fill={
            isDusk
              ? 'color-mix(in oklab, var(--background) 30%, black)'
              : 'color-mix(in oklab, var(--primary) 55%, black)'
          }
        />
      </svg>
      {/* The travelling sun / moon — centred by its top offset
          ((36px track − 26px disc) / 2); the inline transform is
          the only transform, so no utility translate can double it
          and push the disc into the top edge. */}
      <span
        aria-hidden="true"
        className="absolute top-[5px] left-[5px] h-[26px] w-[26px] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)]"
        style={{ transform: `translateX(${isDusk ? 40 : 0}px)` }}
      >
        <span
          className={cn(
            'absolute inset-0 rounded-full transition-opacity duration-500',
            isDusk ? 'opacity-0' : 'opacity-100',
          )}
          style={{
            background:
              'radial-gradient(circle at 35% 35%, color-mix(in oklab, var(--primary) 30%, white), var(--primary) 70%)',
            boxShadow: '0 0 10px 2px rgba(232, 163, 61, 0.55)',
          }}
        />
        <span
          className={cn(
            'absolute inset-0 rounded-full bg-[#e9e4d8] transition-opacity duration-500',
            isDusk ? 'opacity-100' : 'opacity-0',
          )}
          style={{ boxShadow: '0 0 8px 1px rgba(233, 228, 216, 0.35)' }}
        />
        <Sun
          className={cn(
            'absolute inset-0 m-auto h-[15px] w-[15px] text-amber-900 transition-all duration-500',
            isDusk ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100',
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 m-auto h-[14px] w-[14px] text-[#4a3b2a] transition-all duration-500',
            isDusk ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0',
          )}
        />
      </span>
    </button>
  )
}
