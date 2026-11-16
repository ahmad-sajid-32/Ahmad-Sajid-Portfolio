import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ScrollSlide } from '@/components/motion/scroll-slide'
import { CaseStudyBlocks } from '@/components/projects/case-study-blocks'
import { VideoEmbed } from '@/components/projects/video-embed'
import { DetailPaginator } from '@/components/ui/detail-paginator'
import { GithubIcon } from '@/components/ui/brand-icons'
import { TECH_ICONS } from '@/components/ui/tech-icons'
import {
  DEPLOYMENT_LABELS,
  PROJECT_TYPE_LABELS,
  TRACK_LABELS,
  getProjectBySlug,
  getPublishedProjects,
  type MediaDoc,
} from '@/lib/data'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

// Project content comes from Payload at navigation time. This lets the
// segment loading boundary render while the database reads are pending.
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) {
    return { title: 'Project not found' }
  }
  const title = project.seo?.metaTitle ?? project.title
  const description = project.seo?.metaDescription ?? project.excerpt
  const image = project.coverImage?.url
  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://ahmad-sajid.vercel.app/projects/${project.slug}`,
      images: image ? [{ url: image, alt: project.coverImage.alt }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function isMedia(value: MediaDoc | number | null | undefined): value is MediaDoc {
  return typeof value === 'object' && value !== null && 'url' in value
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) {
    notFound()
  }

  const all = await getPublishedProjects()
  const index = all.findIndex((item) => item.slug === slug)
  const previous = index > 0 ? all[index - 1] : null
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null

  const cover = project.coverImage

  // Dedupe (Ahmad's combo, 2026-11-16): media shown in the
  // page-level gallery is skipped inside media-break blocks,
  // and a project video embed already used in a block does
  // not render a second time in the Demo section.
  const galleryMediaIds = (project.gallery ?? [])
    .map((entry) => entry.image)
    .filter(isMedia)
    .map((media) => media.id)
  const blockEmbedUrls = (project.content ?? [])
    .map((block) => block.videoEmbedUrl)
    .filter((url): url is string => Boolean(url))
  const showDemoEmbed =
    project.videoEmbedUrl && !blockEmbedUrls.includes(project.videoEmbedUrl)

  return (
    <article className="page-gutter py-14">
      <ScrollSlide from="left">
        <header className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-foreground/90 uppercase">
              <span className="h-1 w-1 rounded-full bg-primary" />
              {PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType}
            </span>
            {project.deploymentStatus === 'deployed' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-highlight/50 bg-background/60 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-highlight uppercase backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-highlight" />
                {DEPLOYMENT_LABELS[project.deploymentStatus]}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-border px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                {DEPLOYMENT_LABELS[project.deploymentStatus] ??
                  project.deploymentStatus}
              </span>
            )}
          </div>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            {project.title}
          </h1>
            <p className="mt-4 max-w-2xl font-display text-2xl leading-snug text-muted-foreground italic">
              {project.tagline}
            </p>
          </div>
        </header>
      </ScrollSlide>

      {cover?.url ? (
        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-3xl border border-border shadow-[0_40px_80px_rgba(0,0,0,0.35)] lg:aspect-[21/9]">
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        </div>
      ) : null}

      <ScrollSlide from="right" className="mt-10">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-surface p-6 sm:grid-cols-4 sm:p-7">
          <ScrollSlide from="up">
            <MetaItem label="Role" value={project.role} />
          </ScrollSlide>
          <ScrollSlide from="up" delay={0.06}>
            <MetaItem label="Year" value={String(project.year)} />
          </ScrollSlide>
          <ScrollSlide from="up" delay={0.12}>
            <MetaItem
              label="Tracks"
              value={
                project.tracks
                  .map((track) => TRACK_LABELS[track] ?? track)
                  .join(', ') || '—'
              }
            />
          </ScrollSlide>
          <ScrollSlide from="up" delay={0.18}>
            <MetaItem
              label="Status"
              value={
                DEPLOYMENT_LABELS[project.deploymentStatus] ??
                project.deploymentStatus
              }
            />
          </ScrollSlide>
        </div>
      </ScrollSlide>

      {project.techStack.length > 0 ? (
        <div className="mt-8">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Built with
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <ScrollSlide key={tech.id} from="up" delay={index * 0.04}>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-foreground/90 uppercase">
                  {TECH_ICONS[tech.slug] ? (
                    <span className="inline-flex [&>svg]:h-3.5 [&>svg]:w-3.5">
                      {TECH_ICONS[tech.slug]}
                    </span>
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-primary" />
                  )}
                  {tech.name}
                </span>
              </ScrollSlide>
            ))}
          </div>
        </div>
      ) : null}

      {(project.liveUrl || project.githubUrl) && (
        <ScrollSlide from="up" className="mt-8">
          <div className="flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(232,163,61,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Visit live site <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
            >
              <GithubIcon className="h-4 w-4" /> View on GitHub
            </a>
          ) : null}
          </div>
        </ScrollSlide>
      )}

      <div className="mt-14">
        <CaseStudyBlocks
          blocks={project.content ?? []}
          excludeMediaIds={galleryMediaIds}
        />
      </div>

      {project.gallery && project.gallery.length > 0 ? (
        <section className="border-t border-border py-10">
          <ScrollSlide from="left">
            <h2 className="font-display text-2xl font-medium sm:text-3xl">
              Gallery
            </h2>
          </ScrollSlide>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery
              .map((entry) => entry.image)
              .filter(isMedia)
              .map((media, mediaIndex) => (
                <ScrollSlide key={media.id} from="up" delay={mediaIndex * 0.08}>
                  <div className="group relative aspect-[3/2] overflow-hidden rounded-3xl border border-border">
                    <Image
                      src={media.url ?? ''}
                      alt={media.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </ScrollSlide>
              ))}
          </div>
        </section>
      ) : null}

      {showDemoEmbed ? (
        <section className="border-t border-border py-10">
          <ScrollSlide from="up">
            <h2 className="font-display text-2xl font-medium sm:text-3xl">
              Demo
            </h2>
            <div className="mx-auto mt-4 w-full max-w-3xl">
              <VideoEmbed
                src={project.videoEmbedUrl as string}
                title={`${project.title} demo video`}
              />
            </div>
          </ScrollSlide>
        </section>
      ) : null}

      {isMedia(project.video) && project.video.url ? (
        <section className="border-t border-border py-10">
          <ScrollSlide from="up">
            <h2 className="font-display text-2xl font-medium sm:text-3xl">
              Demo
            </h2>
            <video
              controls
              className="mx-auto mt-4 w-full max-w-3xl rounded-3xl border border-border"
              src={project.video.url}
            />
          </ScrollSlide>
        </section>
      ) : null}

      {(previous || next) && (
        <ScrollSlide from="up">
          <div className="mt-10 border-t border-border pt-8">
            <DetailPaginator
              ariaLabel="More projects"
              prev={
                previous
                  ? {
                      href: `/projects/${previous.slug}`,
                      title: previous.title,
                    }
                  : null
              }
              next={
                next
                  ? { href: `/projects/${next.slug}`, title: next.title }
                  : null
              }
              prevLabel="Previous project"
              nextLabel="Next project"
            />
          </div>
        </ScrollSlide>
      )}
    </article>
  )
}
