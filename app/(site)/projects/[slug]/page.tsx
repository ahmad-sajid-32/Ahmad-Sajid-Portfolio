import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CaseStudyBlocks } from '@/components/projects/case-study-blocks'
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

export async function generateStaticParams() {
  const projects = await getPublishedProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

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

  return (
    <article className="py-14">
      <Link
        href="/projects"
        className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        ← All projects
      </Link>

      <header className="mt-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
          {PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType}
          {' · '}
          {DEPLOYMENT_LABELS[project.deploymentStatus] ??
            project.deploymentStatus}
        </p>
        <h1 className="mt-3 font-display text-5xl leading-tight font-medium">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl font-display text-2xl leading-snug text-muted-foreground">
          {project.tagline}
        </p>
      </header>

      {cover?.url ? (
        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-[14px] border border-border">
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-4">
        <MetaItem label="Role" value={project.role} />
        <MetaItem label="Year" value={String(project.year)} />
        <MetaItem
          label="Tracks"
          value={
            project.tracks
              .map((track) => TRACK_LABELS[track] ?? track)
              .join(', ') || '—'
          }
        />
        <MetaItem
          label="Status"
          value={
            DEPLOYMENT_LABELS[project.deploymentStatus] ??
            project.deploymentStatus
          }
        />
      </div>

      {project.techStack.length > 0 ? (
        <div className="mt-8">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Built with
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech.id}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {(project.liveUrl || project.githubUrl) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Visit live site
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-input px-5 py-2.5 text-sm font-medium"
            >
              View on GitHub
            </a>
          ) : null}
        </div>
      )}

      <div className="mt-14">
        <CaseStudyBlocks blocks={project.content ?? []} />
      </div>

      {project.gallery && project.gallery.length > 0 ? (
        <section className="border-t border-border py-10">
          <h2 className="font-display text-2xl font-medium sm:text-3xl">
            Gallery
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.gallery
              .map((entry) => entry.image)
              .filter(isMedia)
              .map((media) => (
                <div
                  key={media.id}
                  className="relative aspect-[3/2] overflow-hidden rounded-[14px] border border-border"
                >
                  <Image
                    src={media.url ?? ''}
                    alt={media.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        </section>
      ) : null}

      {project.videoEmbedUrl ? (
        <section className="border-t border-border py-10">
          <h2 className="font-display text-2xl font-medium sm:text-3xl">Demo</h2>
          <div className="mt-4 aspect-video overflow-hidden rounded-[14px] border border-border">
            <iframe
              src={project.videoEmbedUrl}
              title={`${project.title} demo video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}

      {isMedia(project.video) && project.video.url ? (
        <section className="border-t border-border py-10">
          <h2 className="font-display text-2xl font-medium sm:text-3xl">Demo</h2>
          <video
            controls
            className="mt-4 w-full rounded-[14px] border border-border"
            src={project.video.url}
          />
        </section>
      ) : null}

      {(previous || next) && (
        <nav
          aria-label="More projects"
          className="mt-6 flex items-center justify-between border-t border-border pt-8"
        >
          {previous ? (
            <Link
              href={`/projects/${previous.slug}`}
              className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase"
            >
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase"
            >
              {next.title} →
            </Link>
          ) : null}
        </nav>
      )}
    </article>
  )
}
