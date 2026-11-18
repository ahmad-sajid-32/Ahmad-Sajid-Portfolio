import type { Metadata } from 'next'
import Link from 'next/link'
import { ErrorScreen, ErrorRow, errorRowClass } from '@/components/error/error-screen'

export const metadata: Metadata = { title: 'Page not found' }

const ROWS = [
  { name: 'Home', note: 'The front door', href: '/' },
  { name: 'Projects', note: 'The case studies', href: '/projects' },
  { name: 'Blog', note: 'Notes & lessons', href: '/blog' },
  { name: 'Contact', note: 'Say hello', href: '/contact' },
]

export default function NotFound() {
  return (
    <ErrorScreen
      eyebrow="~/lost — 404"
      heading="Dead end."
      variant="dead-end"
      copy="This address doesn't lead anywhere on the site. The good pages are back the way you came:"
    >
      {ROWS.map((r) => (
        <Link key={r.name} href={r.href} className={errorRowClass}>
          <ErrorRow name={r.name} note={r.note} />
        </Link>
      ))}
    </ErrorScreen>
  )
}
