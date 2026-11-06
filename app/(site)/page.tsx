import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from '@/components/ui/brand-icons'

import { PostCard } from '@/components/blog/post-card'
import { HeroWord } from '@/components/hero/hero-word'
import { ExpertiseIndex } from '@/components/home/expertise-index'
import { TechMarquee } from '@/components/home/tech-marquee'
import { Reveal } from '@/components/motion/reveal'
import { SlideIn } from '@/components/motion/slide-in'
import { ProjectsCoverflow } from '@/components/home/projects-coverflow'
import { SectionHeading } from '@/components/ui/section-heading'
import { getHomeContent, getSiteContent } from '@/lib/content'
import {
  getFeaturedProjects,
  getHeroCounts,
  getPublishedPosts,
  getTechnologies,
} from '@/lib/data'

/** Brand icons for the hero social badges, keyed by site.json social key. */
const SOCIAL_ICONS: Record<string, ReactNode> = {
  github: <GithubIcon className="h-[18px] w-[18px]" />,
  linkedin: <LinkedinIcon className="h-[18px] w-[18px]" />,
  instagram: <InstagramIcon className="h-[18px] w-[18px]" />,
  facebook: <FacebookIcon className="h-[18px] w-[18px]" />,
  // Lucide has no Fiverr mark; the badge carries its "fi" monogram.
  fiverr: <span className="text-[13px] font-bold tracking-tight">fi</span>,
}

const HERO_SOCIAL_KEYS = ['github', 'linkedin', 'instagram']

export default async function HomePage() {
  const home = getHomeContent()
  const site = getSiteContent()
  const heroSocials = site.socials.filter((social) =>
    HERO_SOCIAL_KEYS.includes(social.key),
  )
  // Hero stats are computed, never typed: project and technology
  // counts come live from Payload; specialisations counts the
  // expertise areas defined in the home data house.
  const heroCounts = await getHeroCounts()
  const statValues: Record<string, number> = {
    projects: heroCounts.projects,
    technologies: heroCounts.technologies,
    specialisations: home.expertise.length,
  }
  const featured = await getFeaturedProjects()
  const posts = (await getPublishedPosts()).slice(0, 3)
  const technologies = await getTechnologies()

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: 'https://ahmad-sajid.vercel.app',
    jobTitle: 'Software Engineer',
    description: site.defaultSeo.description,
    email: 'mailto:ahmadsajid41324@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
    sameAs: site.socials
      .map((social) => social.href)
      .filter((href) => href.startsWith('http')),
    knowsAbout: home.expertise.map((area) => area.title),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* Hero — portrait composition: giant word behind, portrait
          centred in front, intro stack left, stats rail right. */}
      <section className="relative flex min-h-[calc(100svh-3.6rem)] flex-col overflow-hidden pt-12 sm:pt-16">
        {/* Mobile/tablet: the giant word steps aside (it collides
            with the heading at these widths). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-12 hidden justify-center sm:top-14 lg:top-[19%] lg:flex"
        >
          <span className="font-display text-[15vw] leading-[0.85] font-bold tracking-tight whitespace-nowrap select-none">
            <HeroWord word={home.hero.giantWord} />
          </span>
        </div>
        <div
          aria-hidden="true"
          className="absolute top-40 left-1/2 hidden h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute top-[16%] left-[6%] hidden font-mono text-lg text-primary/35 select-none lg:block"
        >
          {'{ }'}
        </span>
        <span
          aria-hidden="true"
          className="absolute top-[58%] left-[3%] hidden font-mono text-lg text-highlight/30 select-none lg:block"
        >
          {'</>'}
        </span>
        <span
          aria-hidden="true"
          className="absolute top-[24%] right-[5%] hidden font-mono text-lg text-highlight/30 select-none lg:block"
        >
          {'=>'}
        </span>

        <div className="relative grid w-full flex-1 grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <div className="relative z-10 flex flex-col justify-between gap-10 pb-14">
            <SlideIn from="left">
              <p className="font-display text-2xl text-highlight italic">
                {home.hero.greeting}
              </p>
              <h1 className="mt-2 font-display text-[65px] leading-[0.95] font-semibold uppercase sm:text-[78px]">
                {home.hero.name}
              </h1>
              <p className="mt-4 font-mono text-sm tracking-[0.22em] text-foreground/80 uppercase">
                {home.hero.role}
              </p>
            </SlideIn>
            <SlideIn from="left" delay={0.18}>
              <p className="max-w-md leading-relaxed text-muted-foreground">
                {home.hero.statement}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={home.hero.primaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {home.hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={home.hero.secondaryCta.href}
                  className="rounded-lg border border-input px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-primary/60 hover:text-primary"
                >
                  {home.hero.secondaryCta.label}
                </Link>
              </div>
            </SlideIn>
          </div>

          <div className="relative z-[5] flex items-end justify-center">
            <SlideIn from="up" delay={0.5} className="lg:-mt-28 xl:-mt-36">
              {/* Mobile/tablet: bordered circular medallion of the
                  studio portrait, gently floating. The Dusk and
                  Dawn portraits cross-fade on the theme class, so
                  toggling never flashes or swaps abruptly. */}
              <div className="animate-float relative mx-auto lg:hidden">
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
              {/* Desktop: the full cutout overlapping the word,
                  cross-faded per theme the same way. */}
              <div className="relative hidden w-[min(88vw,420px)] sm:w-[500px] lg:block lg:w-[620px] xl:w-[680px]">
                <Image
                  src={home.hero.portraitUrl}
                  alt=""
                  aria-hidden="true"
                  width={1600}
                  height={1280}
                  priority
                  className="h-auto w-full opacity-0 drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)] transition-opacity duration-700 dark:opacity-100"
                />
                <Image
                  src={home.hero.portraitLightUrl}
                  alt={home.hero.portraitAlt}
                  width={1600}
                  height={1280}
                  priority
                  className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.30)] transition-opacity duration-700 dark:opacity-0"
                />
              </div>
            </SlideIn>
          </div>

          <SlideIn
            from="right"
            delay={0.3}
            className="relative z-10 flex flex-row flex-wrap justify-center gap-x-8 gap-y-6 pb-14 lg:flex-col lg:flex-nowrap lg:items-end lg:justify-center lg:gap-12"
          >
            {home.hero.stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-right">
                <p className="font-display text-5xl font-semibold text-primary">
                  {statValues[stat.key] ?? 0}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
            <div className="flex basis-full items-center justify-center gap-2.5 lg:basis-auto lg:justify-end">
              {heroSocials.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/60 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
                >
                  {SOCIAL_ICONS[social.key]}
                </a>
              ))}
            </div>
          </SlideIn>
        </div>
      </section>

      <TechMarquee technologies={technologies} />

      {/* Intro / expertise — the marquee above carries the
          section's top border, so the line stays a single
          hairline instead of doubling up. */}
      <section className="py-14">
        <Reveal>
          <SectionHeading title={home.intro.heading} />
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            {home.intro.body}
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <ExpertiseIndex areas={home.expertise} />
        </Reveal>
        <div className="mt-12 text-center">
          <Link
            href={home.intro.aboutCta.href}
            className="group inline-flex items-center gap-2 rounded-lg border border-input px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-primary/60 hover:text-primary"
          >
            {home.intro.aboutCta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Featured projects — 3D coverflow carousel (Concept C);
          heading and the View-all button are centred per the
          chosen prototype. */}
      {featured.length > 0 ? (
        <section className="border-t border-border py-14">
          <SectionHeading
            title={home.sections.featuredProjects}
            className="text-center"
          />
          <Reveal className="mt-4">
            <ProjectsCoverflow projects={featured} />
          </Reveal>
          <div className="mt-10 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(232,163,61,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {home.sections.allProjects}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : null}

      {/* Latest posts — rendered only once posts are published */}
      {posts.length > 0 ? (
        <section className="border-t border-border py-14">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading title={home.sections.latestPosts} />
            <Link
              href="/blog"
              className="hidden font-mono text-[11px] tracking-[0.18em] text-accent uppercase underline underline-offset-4 sm:block"
            >
              All posts
            </Link>
          </div>
          <Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* Contact CTA */}
      <section className="border-t border-border py-14">
        <Reveal>
          <div className="rounded-[14px] border border-border bg-surface p-8 sm:p-10">
          <h2 className="font-display text-3xl leading-tight font-medium">
            {home.sections.contactCta.heading}
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {home.sections.contactCta.body}
          </p>
          <Link
            href={home.sections.contactCta.href}
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            {home.sections.contactCta.label}
          </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
