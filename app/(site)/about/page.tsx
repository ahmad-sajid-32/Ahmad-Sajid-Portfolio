import type { Metadata } from 'next'
import Image from 'next/image'

import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { getAboutContent, getHomeContent, getSiteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Ahmad Sajid — backend-focused software engineer in Lahore: Devisgon experience, freelance work, education and certificates.',
}

/**
 * About, rebuilt in the home page's language: a portrait
 * medallion (the same Dawn/Dusk cross-fade pair as the hero)
 * beside the heading and availability pill, the bio with a
 * lead paragraph, experience as an amber-noded timeline, and
 * education / skills / certificates as glossy rounded-3xl
 * cards. All copy still comes from about.json.
 */
export default function AboutPage() {
  const about = getAboutContent()
  const home = getHomeContent()
  const site = getSiteContent()
  const [lead, ...restBio] = about.bio

  return (
    <div className="py-14">
      <header className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
              ~/about
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
              {about.heading}
            </h1>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-highlight/50 bg-background/60 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-highlight uppercase backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-highlight" />
              {site.availability}
            </p>
            {lead ? (
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-foreground/90">
                {lead}
              </p>
            ) : null}
          </div>

          {/* Portrait medallion — the hero's Dawn/Dusk pair. */}
          <div className="animate-float relative mx-auto lg:mx-0">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-full bg-primary/20 blur-xl"
            />
            <div className="relative h-60 w-60 overflow-hidden rounded-full border-2 border-primary/60 shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:h-72 sm:w-72">
              <Image
                src={home.hero.circlePortraitUrl}
                alt=""
                aria-hidden="true"
                width={640}
                height={640}
                priority
                className="absolute inset-0 h-full w-full object-cover object-[center_18%] opacity-0 transition-opacity duration-700 dark:opacity-100"
              />
              <Image
                src={home.hero.circlePortraitLightUrl}
                alt={home.hero.portraitAlt}
                width={640}
                height={640}
                priority
                className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-opacity duration-700 dark:opacity-0"
              />
            </div>
          </div>
        </div>
      </header>

      {restBio.length > 0 ? (
        <div className="mt-10 max-w-3xl space-y-5 leading-[1.85] text-muted-foreground">
          {restBio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      <Reveal>
        <section className="mt-20">
          <SectionHeading title="Where I've worked" />
          <div className="relative mt-10">
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-primary/60 via-border to-transparent"
            />
            {about.experience.map((item) => (
              <article
                key={`${item.role}-${item.period}`}
                className="relative pb-10 pl-10 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full border-2 border-primary bg-background"
                />
                <p className="inline-flex rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  {item.period}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                  {item.role} · {item.company}
                </h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-20">
          <SectionHeading title="Education" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {about.education.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 sm:p-7"
              >
                <p className="inline-flex rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  {item.period}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-1 font-medium">{item.institution}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-20">
          <SectionHeading title="What I work with" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {about.skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 sm:p-7"
              >
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  {group.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-foreground/90 uppercase"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary" />
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
        <section className="mt-20">
          <SectionHeading title="Certificates" />
          <ul className="mt-8 divide-y divide-border rounded-3xl border border-border bg-surface px-6 sm:px-7">
            {about.certificates.map((cert) => (
              <li
                key={cert.name}
                className="flex flex-wrap items-center justify-between gap-3 py-5"
              >
                <div>
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
                <p className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-foreground/90 uppercase">
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
