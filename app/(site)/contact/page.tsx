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
 * Contact, in the home page's language: the form sits in a
 * glossy rounded-3xl panel; the aside carries the email card
 * and every social/contact channel from the Payload Socials
 * global as icon rows (link-in-bio style), with the
 * availability pill under them. The "Elsewhere" eyebrow is
 * gone, per the site-wide no-eyebrow rule.
 */
export default async function ContactPage() {
  const contact = getContactContent()
  const site = getSiteContent()
  const socials = await getSocialLinks()

  return (
    <div className="py-14">
      <PageHeader path="~/contact" title={contact.heading} intro={contact.intro} />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ScrollSlide from="left" className="h-fit">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-[0_30px_60px_rgba(0,0,0,0.25)] sm:p-8">
            <ContactForm
              form={contact.form}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
        </ScrollSlide>

        <aside className="space-y-8">
          <ScrollSlide from="right">
            <div className="rounded-3xl border border-border bg-surface p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Mail className="h-[18px] w-[18px]" />
                </span>
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {contact.emailCard.label}
                </p>
              </div>
              <a
                href={`mailto:${contact.emailCard.address}`}
                className="mt-4 block font-medium break-all text-accent underline underline-offset-4"
              >
                {contact.emailCard.address}
              </a>
            </div>
          </ScrollSlide>

          <div>
            <ScrollSlide from="right">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {contact.socialsHeading}
              </h2>
            </ScrollSlide>
            <ul className="mt-4 space-y-2.5">
              {socials.map((social, index) => (
                <ScrollSlide
                  as="li"
                  key={social.key}
                  from="right"
                  delay={index * 0.06}
                >
                  <a
                    href={social.href}
                    {...(social.href.startsWith('http')
                      ? { target: '_blank', rel: 'noreferrer' }
                      : {})}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/40 text-muted-foreground transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary">
                      {SOCIAL_ICONS[social.key] ?? social.label}
                    </span>
                    <span className="font-medium">{social.label}</span>
                    <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </a>
                </ScrollSlide>
              ))}
            </ul>
            <ScrollSlide from="right">
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-highlight/50 bg-background/60 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-highlight uppercase backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-highlight" />
                {site.availability}
              </p>
            </ScrollSlide>
          </div>
        </aside>
      </div>
    </div>
  )
}
