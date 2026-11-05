import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/contact-form'
import { SectionHeading } from '@/components/ui/section-heading'
import { getContactContent, getSiteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Ahmad Sajid — hiring, freelance projects, or questions about the work. Replies are personal, not automated.',
}

export default function ContactPage() {
  const contact = getContactContent()
  const site = getSiteContent()

  return (
    <div className="py-14">
      <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
        ~/contact
      </p>
      <h1 className="mt-3 font-display text-5xl leading-tight font-medium">
        {contact.heading}
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        {contact.intro}
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm form={contact.form} />

        <aside className="space-y-8">
          <div className="rounded-[14px] border border-border bg-surface p-5">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {contact.emailCard.label}
            </p>
            <a
              href={`mailto:${contact.emailCard.address}`}
              className="mt-2 block font-medium break-all text-accent underline underline-offset-4"
            >
              {contact.emailCard.address}
            </a>
          </div>

          <div>
            <SectionHeading
              eyebrow="Elsewhere"
              title={contact.socialsHeading}
              className="[&_h2]:text-2xl"
            />
            <ul className="mt-4 space-y-3">
              {site.socials.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    className="text-accent underline underline-offset-4"
                    {...(social.href.startsWith('http')
                      ? { target: '_blank', rel: 'noreferrer' }
                      : {})}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {site.availability}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
