import { ArrowUpRight, Mail } from 'lucide-react'
import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/contact-form'
import { ScrollSlide } from '@/components/motion/scroll-slide'
import { PageHeader } from '@/components/ui/page-header'
import { SOCIAL_ICONS } from '@/components/ui/social-icons'
import { getContactContent, getSiteContent } from '@/lib/content'
import { getSocialLinks } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Ahmad Sajid — hiring, freelance projects, or questions about the work. Replies are personal, not automated.',
}

/**
 * Contact (layout approved by Ahmad from the rendered
 * prototype, 2026-11-16): a narrower form panel beside the
 * social channels as a uniform grid of small tiles — icon
 * in a medallion on top, small mono label at the bottom,
 * three per row — stretched so the grid block ends level
 * with the form. The availability pill sits under the
 * intro. Beneath, the "Write to me directly" banner
 * (Ahmad's pick, option C) carries the email address set
 * large, for visitors who prefer their own mail app.
 * Channels come from the Payload Socials global.
 */
// Hover word per channel — the tile label swaps to an
// action on hover (Ahmad's ask, 2026-11-16).
const HOVER_WORDS: Record<string, string> = {
  email: 'Write',
  phone: 'Call',
  whatsapp: 'Chat',
}

export default async function ContactPage() {
  const contact = getContactContent()
  const site = getSiteContent()
  const socials = await getSocialLinks()

  return (
    <div className="page-gutter py-14">
      <PageHeader title={contact.heading} intro={contact.intro} />

      <ScrollSlide from="up">
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-highlight/50 bg-background/60 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-highlight uppercase backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-highlight" />
          {site.availability}
        </p>
      </ScrollSlide>

      <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[6fr_5fr]">
        <ScrollSlide from="left" className="h-full">
          <div className="h-full rounded-3xl border border-border bg-surface p-6 shadow-[0_30px_60px_rgba(0,0,0,0.25)] sm:p-8">
            <ContactForm
              form={contact.form}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
        </ScrollSlide>

        <div className="flex h-full flex-col">
          <ScrollSlide from="right">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {contact.socialsHeading}
            </h2>
          </ScrollSlide>
          <ScrollSlide from="right" className="mt-4 flex-1">
            <div className="grid h-full grid-cols-3 gap-3">
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  {...(social.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                  className="group flex flex-col rounded-3xl border border-border bg-surface p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <span className="flex flex-1 items-center justify-center">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background/40 text-muted-foreground transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary sm:h-14 sm:w-14 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
                      {SOCIAL_ICONS[social.key] ?? social.label}
                    </span>
                  </span>
                  <span className="grid font-mono text-[10px] tracking-[0.14em] uppercase">
                    <span className="col-start-1 row-start-1 text-center text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0">
                      {social.label}
                    </span>
                    <span className="col-start-1 row-start-1 flex translate-y-1 items-center justify-center gap-1 text-center text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {HOVER_WORDS[social.key] ?? 'Visit'}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </ScrollSlide>
        </div>
      </div>

      <div className="mt-20">
        <ScrollSlide from="up">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {contact.emailBannerHeading}
          </h2>
        </ScrollSlide>
        <ScrollSlide from="up">
          <a
            href={`mailto:${contact.emailCard.address}`}
            className="group mt-6 flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 sm:p-8"
          >
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                {contact.emailCard.label}
              </span>
              <span className="mt-1 block font-display text-xl font-semibold tracking-tight break-all sm:text-3xl">
                {contact.emailCard.address}
              </span>
            </span>
            <ArrowUpRight className="ml-auto h-6 w-6 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </a>
        </ScrollSlide>
      </div>
    </div>
  )
}
