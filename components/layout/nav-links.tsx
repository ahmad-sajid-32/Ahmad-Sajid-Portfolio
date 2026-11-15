'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Primary nav (P1, chosen by Ahmad 2026-11-16): sentence-case
 * links in the body font; the current section gets full ink
 * plus a solid amber underline, and every other link grows the
 * same underline from the left on hover. Client component
 * because the active state follows the live pathname —
 * detail pages light up their parent section.
 */
export function NavLinks({
  items,
}: {
  items: { label: string; href: string }[]
}) {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex lg:gap-8">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`relative pb-1 text-sm font-medium transition-colors after:absolute after:-bottom-[3px] after:left-0 after:h-[2px] after:rounded-full after:bg-primary after:transition-[width] after:duration-300 ${
              active
                ? 'text-foreground after:w-full'
                : 'text-muted-foreground after:w-0 hover:text-foreground hover:after:w-full'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
