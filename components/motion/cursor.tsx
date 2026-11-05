'use client'

import { useEffect, useRef } from 'react'

type CursorState = 'default' | 'link' | 'view' | 'hidden'

const FORM_FIELD_SELECTOR = 'input, textarea, select, [contenteditable="true"]'
const LINK_SELECTOR = 'a, button, [role="button"]'
const VIEW_SELECTOR = '[data-cursor="view"]'

/**
 * Custom cursor (DESIGN-SPEC §3): an amber dot that tracks instantly
 * and a trailing ring that lerps behind it. The ring expands over
 * links, and becomes a filled "View" badge over project cards.
 * Never rendered on touch devices or under reduced motion; over form
 * fields the custom cursor hides and the native one returns (see
 * globals.css `.has-cursor` rules). Site layout only, so the Payload
 * admin always keeps its native cursor.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringInnerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) {
      return
    }

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) {
      return
    }

    document.documentElement.classList.add('has-cursor')
    dot.style.opacity = '0'
    ring.style.opacity = '0'

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let state: CursorState = 'hidden'
    let raf = 0

    const applyState = () => {
      const scale = state === 'view' ? 2.4 : state === 'link' ? 1.6 : 1
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      if (ringInnerRef.current) {
        ringInnerRef.current.style.transform = `scale(${scale})`
        ringInnerRef.current.style.backgroundColor =
          state === 'view' ? 'var(--cursor)' : 'transparent'
      }
      if (labelRef.current) {
        labelRef.current.style.opacity = state === 'view' ? '1' : '0'
      }
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      const visible = state !== 'hidden'
      dot.style.opacity = visible ? '1' : '0'
      ring.style.opacity = visible ? '1' : '0'
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      applyState()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      if (state === 'hidden') {
        state = 'default'
        ringX = mouseX
        ringY = mouseY
      }
    }

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) {
        return
      }
      if (target.closest(FORM_FIELD_SELECTOR)) {
        state = 'hidden'
      } else if (target.closest(VIEW_SELECTOR)) {
        state = 'view'
      } else if (target.closest(LINK_SELECTOR)) {
        state = 'link'
      } else {
        state = 'default'
      }
    }

    const onLeave = () => {
      state = 'hidden'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] h-9 w-9 opacity-0"
      >
        <div
          ref={ringInnerRef}
          className="h-full w-full rounded-full border border-cursor transition-[background-color,transform] duration-200"
        />
        <span
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-semibold tracking-[0.14em] text-primary-foreground uppercase opacity-0 transition-opacity duration-150"
        >
          View
        </span>
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 rounded-full bg-cursor opacity-0"
      />
    </>
  )
}
