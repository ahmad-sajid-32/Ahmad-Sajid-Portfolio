import Link from 'next/link'

import { getSiteContent } from '@/lib/content'

import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  const site = getSiteContent()

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="font-mono text-xs font-semibold tracking-[0.18em] uppercase"
        >
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {site.nav
            .filter((item) => item.href !== '/')
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <ThemeToggle />
      </div>
      <nav
        aria-label="Primary mobile"
        className="flex items-center gap-5 overflow-x-auto px-6 pb-3 sm:hidden"
      >
        {site.nav
          .filter((item) => item.href !== '/')
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase"
            >
              {item.label}
            </Link>
          ))}
      </nav>
    </header>
  )
}
