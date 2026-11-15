import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

import { ExperienceTimeline } from '@/components/about/experience-timeline'
import { SkillsBento } from '@/components/about/skills-bento'
import { ScrollSlide } from '@/components/motion/scroll-slide'
import { SectionHeading } from '@/components/ui/section-heading'
import { getAboutContent, getHomeContent, getSiteContent } from '@/lib/content'
import { EDUCATION_LOGOS, IMAGES } from '@/lib/images'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Ahmad Sajid — software engineer in Lahore: his story, where he has worked, education and certificates.',
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
    <div className="page-gutter py-14">
      <header className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_auto]">
          <ScrollSlide from="left" className="lg:col-start-1 lg:row-start-1">
            <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
              {about.heading}
            </h1>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-highlight/50 bg-background/60 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-highlight uppercase backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-highlight" />
              {site.availability}
            </p>
          </ScrollSlide>

          {/* Portrait medallion — the hero's Dawn/Dusk pair,
              large and centred under the heading on mobile,
              in the right column on desktop. */}
          <ScrollSlide
            from="right"
            className="lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:self-center"
          >
            <div className="animate-float relative mx-auto w-fit lg:mx-0">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-full bg-primary/20 blur-xl"
              />
              <div className="relative h-72 w-72 overflow-hidden rounded-full border-2 border-primary/60 shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:h-80 sm:w-80 lg:h-[440px] lg:w-[440px] xl:h-[500px] xl:w-[500px]">
                <Image
                  src={IMAGES.heroPortraitStudio}
                  alt=""
                  aria-hidden="true"
                  priority
                  placeholder="blur"
                  className="absolute inset-0 h-full w-full object-cover object-[center_18%] opacity-0 transition-opacity duration-700 dark:opacity-100"
                />
                <Image
                  src={IMAGES.heroPortraitStudioDawn}
                  alt={home.hero.portraitAlt}
                  priority
                  placeholder="blur"
                  className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-opacity duration-700 dark:opacity-0"
                />
              </div>
            </div>
          </ScrollSlide>

          {lead ? (
            <ScrollSlide
              from="left"
              delay={0.12}
              className="lg:col-start-1 lg:row-start-2"
            >
              <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">
                {lead}
              </p>
            </ScrollSlide>
          ) : null}

          {/* The remaining bio lives in the same grid row
              flow (row 3) so the portrait, spanning all three
              rows, centres against the whole intro — heading,
              lead and bio — instead of just the heading. */}
          {restBio.length > 0 ? (
            <div className="max-w-3xl space-y-5 leading-[1.85] text-muted-foreground lg:col-start-1 lg:row-start-3">
              {restBio.map((paragraph, index) => (
                <ScrollSlide key={index} from="up" delay={index * 0.1}>
                  <p>{paragraph}</p>
                </ScrollSlide>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <section className="mt-20">
        <ScrollSlide from="left">
          <SectionHeading title="Where I've worked" />
        </ScrollSlide>
        <ExperienceTimeline items={about.experience} />
      </section>

      <section className="mt-20">
        <ScrollSlide from="right">
          <SectionHeading title="Education" />
        </ScrollSlide>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {about.education.map((item, index) => (
            <ScrollSlide
              key={item.title}
              from="right"
              delay={index * 0.1}
              className="h-full"
            >
              <div className="h-full rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm">
                    <Image
                      src={EDUCATION_LOGOS[item.logo]}
                      alt={`${item.institution} logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="inline-flex rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {item.period}
                  </p>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-1 font-medium">{item.institution}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </div>
            </ScrollSlide>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <ScrollSlide from="left">
          <SectionHeading title="What I work with" />
        </ScrollSlide>
        <SkillsBento groups={about.skillGroups} />
      </section>

      <section className="mt-20">
        <ScrollSlide from="right">
          <SectionHeading title="Certificates" />
        </ScrollSlide>
        <ul className="mt-8 divide-y divide-border rounded-3xl border border-border bg-surface px-6 sm:px-7">
          {about.certificates.map((cert, index) => {
            const row = (
              <>
                <div>
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
                <span className="flex items-center gap-3">
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-foreground/90 uppercase">
                    {cert.issued}
                  </span>
                  {cert.url ? (
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                    />
                  ) : null}
                </span>
              </>
            )
            return (
              <ScrollSlide
                as="li"
                key={cert.name}
                from="right"
                delay={index * 0.07}
              >
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${cert.name} — view credential`}
                    className="group -mx-2 flex flex-wrap items-center justify-between gap-3 rounded-xl px-2 py-5 transition-colors hover:bg-background/40"
                  >
                    {row}
                  </a>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 py-5">
                    {row}
                  </div>
                )}
              </ScrollSlide>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
