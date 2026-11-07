import Link from 'next/link'

import { getSiteContent } from '@/lib/content'
import { getSocialLinks } from '@/lib/data'

import { MobileNav } from './mobile-nav'
import { ThemeToggle } from './theme-toggle'

/**
 * Sticky header: pinned to the top of the viewport while
 * scrolling, with a translucent blur backdrop. The blur sits
 * on its own backdrop layer — NOT on the header element —
 * because a backdrop-filter on an ancestor would become the
 * containing block for the mobile drawer's fixed-position
 * panel and break it. Drawer socials come from the Socials
 * global in Payload (same trio as the hero).
 */
export async function SiteHeader() {
  const site = getSiteContent()
  const navItems = site.nav.filter((item) => item.href !== '/')
  const socials = await getSocialLinks()
  // The drawer footer carries the same three socials as the hero.
  const drawerSocials = socials.filter((social) =>
    ['github', 'linkedin', 'instagram'].includes(social.key),
  )

  return (
    <header className="sticky top-0 z-40">
      <div
        aria-hidden="true"
        className="absolute inset-0 border-b border-border bg-background/85 backdrop-blur-md"
      />
      <div className="relative flex w-full items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14 xl:px-20">
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
          <MobileNav nav={site.nav} socials={drawerSocials} />
        </div>
      </div>
    </header>
  )
}
