import Link from 'next/link'

import { PostCard } from '@/components/blog/post-card'
import { ProjectCard } from '@/components/projects/project-card'
import { SectionHeading } from '@/components/ui/section-heading'
import { getHomeContent, getSiteContent } from '@/lib/content'
import { getFeaturedProjects, getPublishedPosts } from '@/lib/data'

/**
 * Decorative stand-in for the Phase 4 "Dusk Field" 3D scene: concentric
 * rings and a prism block drawn purely with theme tokens. The hero
 * layout (split, copy left / scene right) is final; only the scene
 * itself is swapped when React Three Fiber lands.
 */
function DuskFieldPlaceholder() {
  return (
    <div
      aria-hidden
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[14px] border border-border bg-surface"
    >
      <div className="absolute h-64 w-64 rounded-full border border-primary/50" />
      <div className="absolute h-44 w-44 rounded-full border border-accent/60" />
      <div className="absolute h-24 w-24 rotate-12 border border-highlight/50" />
      <div className="h-16 w-16 rotate-45 bg-primary/80" />
      <p className="absolute bottom-4 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        Dusk Field — interactive scene in Phase 4
      </p>
    </div>
  )
}

export default async function HomePage() {
  const home = getHomeContent()
  const site = getSiteContent()
  const featured = await getFeaturedProjects()
  const posts = (await getPublishedPosts()).slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-highlight uppercase">
            {home.hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] font-medium">
            {home.hero.headline}
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            {home.hero.statement}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={home.hero.primaryCta.href}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {home.hero.primaryCta.label}
            </Link>
            <Link
              href={home.hero.secondaryCta.href}
              className="rounded-lg border border-input px-5 py-2.5 text-sm font-medium"
            >
              {home.hero.secondaryCta.label}
            </Link>
          </div>
          <p className="mt-8 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {site.availability}
          </p>
        </div>
        <DuskFieldPlaceholder />
      </section>

      {/* Intro / expertise */}
      <section className="border-t border-border py-14">
        <SectionHeading eyebrow="01 — What I do" title={home.intro.heading} />
        <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
          {home.intro.body}
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {home.expertise.map((area) => (
            <div
              key={area.title}
              className="rounded-[14px] border border-border bg-surface p-5"
            >
              <h3 className="font-display text-xl font-medium">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {area.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      {featured.length > 0 ? (
        <section className="border-t border-border py-14">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="02 — Selected work"
              title={home.sections.featuredProjects}
            />
            <Link
              href="/projects"
              className="hidden font-mono text-[11px] tracking-[0.18em] text-accent uppercase underline underline-offset-4 sm:block"
            >
              All projects
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Latest posts — rendered only once posts are published */}
      {posts.length > 0 ? (
        <section className="border-t border-border py-14">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="03 — Blog"
              title={home.sections.latestPosts}
            />
            <Link
              href="/blog"
              className="hidden font-mono text-[11px] tracking-[0.18em] text-accent uppercase underline underline-offset-4 sm:block"
            >
              All posts
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Contact CTA */}
      <section className="border-t border-border py-14">
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
      </section>
    </div>
  )
}
