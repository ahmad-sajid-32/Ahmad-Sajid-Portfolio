import { SOCIAL_ICONS } from '@/components/ui/social-icons'
import { getSiteContent } from '@/lib/content'
import { getSocialLinks } from '@/lib/data'

import { FooterClock } from './footer-clock'

/**
 * The footer, site-wide: a scrolling ribbon, the postcard
 * block (coordinates, Lahore, live local time and the full
 * channel icon set), the giant gradient name, and a single
 * copyright line. Nothing else — no nav (the header is
 * sticky), no stack credits, no back-to-top. Social and
 * channel links come from the Socials global in Payload
 * (see lib/data.getSocialLinks), so they are edited in the
 * CMS, never in code.
 */
export async function SiteFooter() {
  const site = getSiteContent()
  const socials = await getSocialLinks()
  const year = new Date().getFullYear()

  const ribbonRow = (
    <>
      {site.footerRibbon.map((phrase) => (
        <span key={phrase} className="mx-6 inline-flex items-center gap-12">
          <span>{phrase}</span>
          <span aria-hidden="true" className="text-primary">
            ✦
          </span>
        </span>
      ))}
    </>
  )

  return (
    <footer className="border-t border-border">
      {/* Marquee ribbon */}
      <div className="overflow-hidden border-b border-border py-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="animate-marquee flex w-max font-display text-2xl font-medium whitespace-nowrap text-foreground/85">
          <span className="flex">
            {ribbonRow}
            {ribbonRow}
          </span>
          <span className="flex" aria-hidden="true">
            {ribbonRow}
            {ribbonRow}
          </span>
        </div>
      </div>

      {/* Postcard */}
      <div className="px-6 pt-10 text-center sm:px-10 lg:px-14 xl:px-20">
        <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground uppercase">
          {site.coordinates}
        </p>
        <p className="mt-3 font-display text-3xl font-semibold">{site.location}</p>
        <p className="mt-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Local time <FooterClock /> · UTC +5
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {socials.map((social) => (
            <a
              key={social.key}
              href={social.href}
              aria-label={social.label}
              title={social.label}
              {...(social.href.startsWith('http')
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/60 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
            >
              {SOCIAL_ICONS[social.key] ?? social.label}
            </a>
          ))}
        </div>
      </div>

      {/* Big sign-off */}
      <p
        aria-hidden="true"
        className="mt-10 bg-gradient-to-b from-primary via-primary/60 to-primary/5 bg-clip-text px-2 text-center font-display text-[11.5vw] leading-none font-bold tracking-tight whitespace-nowrap text-transparent select-none"
      >
        {site.name.toUpperCase()}
      </p>

      {/* Copyright */}
      <div className="border-t border-border py-5 text-center">
        <p className="text-xs text-muted-foreground">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
