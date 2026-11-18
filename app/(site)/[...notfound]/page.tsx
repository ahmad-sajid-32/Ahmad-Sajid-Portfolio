import { notFound } from 'next/navigation'

/**
 * Catch-all for unmatched paths inside the site group: with route
 * groups acting as root layouts, a bare app-level not-found never
 * renders for unknown URLs — this route matches them instead and
 * hands over to (site)/not-found.tsx, keeping the site chrome.
 */
export default function CatchAllNotFound() {
  notFound()
}
