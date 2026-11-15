import Link from 'next/link'

import { getSiteContent } from '@/lib/content'
import { getSocialLinks } from '@/lib/data'

import { MobileNav } from './mobile-nav'
import { NavLinks } from './nav-links'
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
        <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary font-display text-[15px] font-bold text-primary-foreground"
          >
            AS
          </span>
          <span className="hidden font-display text-lg leading-none font-semibold tracking-tight whitespace-nowrap sm:block">
            {site.name}
            <span aria-hidden="true" className="text-primary">
              .
            </span>
          </span>
        </Link>
        <NavLinks items={navItems} />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileNav nav={site.nav} socials={drawerSocials} />
        </div>
      </div>
    </header>
  )
}
