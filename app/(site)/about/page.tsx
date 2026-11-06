import type { Metadata } from 'next'

import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { getAboutContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Ahmad Sajid — backend-focused software engineer in Lahore: Devisgon experience, freelance work, education and certificates.',
}

export default function AboutPage() {
  const about = getAboutContent()

  return (
    <div className="py-14">
      <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
        ~/about
      </p>
      <h1 className="mt-3 font-display text-5xl leading-tight font-medium">
        {about.heading}
      </h1>
      <div className="mt-8 max-w-3xl space-y-5 leading-relaxed text-muted-foreground">
        {about.bio.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <Reveal>
      <section className="mt-16">
        <SectionHeading title="Where I've worked" />
        <div className="mt-8 space-y-0">
          {about.experience.map((item) => (
            <article
              key={`${item.role}-${item.period}`}
              className="grid gap-2 border-t border-border py-6 sm:grid-cols-[220px_1fr] sm:gap-6"
            >
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {item.period}
              </p>
              <div>
                <h3 className="font-display text-xl font-medium">
                  {item.role} · {item.company}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mt-16">
        <SectionHeading title="Education" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {about.education.map((item) => (
            <div
              key={item.title}
              className="rounded-[14px] border border-border bg-surface p-5"
            >
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {item.period}
              </p>
              <h3 className="mt-2 font-display text-xl font-medium">
                {item.title}
              </h3>
              <p className="mt-1 text-sm font-medium">{item.institution}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mt-16">
        <SectionHeading title="What I work with" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {about.skillGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-[14px] border border-border bg-surface p-5"
            >
              <h3 className="font-display text-xl font-medium">{group.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mt-16">
        <SectionHeading title="Certificates" />
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {about.certificates.map((cert) => (
            <li
              key={cert.name}
              className="flex flex-wrap items-baseline justify-between gap-3 py-4"
            >
              <div>
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              </div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {cert.year}
              </p>
            </li>
          ))}
        </ul>
      </section>
      </Reveal>
    </div>
  )
}
