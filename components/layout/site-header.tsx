import Link from 'next/link'

import { getSiteContent } from '@/lib/content'

import { MobileNav } from './mobile-nav'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  const site = getSiteContent()
  const navItems = site.nav.filter((item) => item.href !== '/')
  const email = site.socials
    .find((social) => social.key === 'email')
    ?.href.replace('mailto:', '')
  const webSocials = site.socials.filter((social) => social.key !== 'email')

  return (
    <header className="border-b border-border">
      <div className="flex w-full items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14 xl:px-20">
        <Link
          href="/"
          className="font-mono text-xs font-semibold tracking-[0.18em] uppercase"
        >
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileNav
            name={site.name}
            email={email ?? ''}
            nav={site.nav}
            socials={webSocials}
          />
        </div>
      </div>
    </header>
  )
}
