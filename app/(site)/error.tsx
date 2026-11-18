'use client'

import Link from 'next/link'
import { ErrorScreen, ErrorRow, errorRowClass } from '@/components/error/error-screen'

const ROWS = [
  { name: 'Home', note: 'The front door', href: '/' },
  { name: 'Projects', note: 'The case studies', href: '/projects' },
  { name: 'Contact', note: 'Say hello', href: '/contact' },
]

/**
 * Segment error boundary, styled as the 504 gateway-timeout page
 * (Direction B): most server-side failures a visitor can hit here
 * are upstream slowness, and the honest instruction is the same —
 * wait a moment, then retry.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorScreen
      eyebrow="~/timed-out — 504"
      heading="The route stalled."
      variant="stalled"
      copy="The address is right — the server upstream just didn't respond in time. Wait a few seconds, then:"
    >
      <button type="button" onClick={() => reset()} className={errorRowClass}>
        <ErrorRow name="Try again" note="Reload this page" />
      </button>
      {ROWS.map((r) => (
        <Link key={r.name} href={r.href} className={errorRowClass}>
          <ErrorRow name={r.name} note={r.note} />
        </Link>
      ))}
    </ErrorScreen>
  )
}
