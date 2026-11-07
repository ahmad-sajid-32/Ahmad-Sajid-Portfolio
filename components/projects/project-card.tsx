import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { DEPLOYMENT_LABELS, TRACK_LABELS, type ProjectDoc } from '@/lib/data'

/**
 * Project card in the home coverflow's language: rounded-3xl
 * shell, cover with a glossy sheen and the glass "In
 * production" pill, amber track badges, and a sliding-arrow
 * case-study row. The whole card is the link.
 */
export function ProjectCard({ project }: { project: ProjectDoc }) {
  const cover = project.coverImage

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="view"
      className="group block overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
    >
      {cover?.url ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
          {project.deploymentStatus === 'deployed' ? (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-highlight/50 bg-background/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-highlight uppercase backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-highlight" />
              {DEPLOYMENT_LABELS[project.deploymentStatus]}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="p-6 sm:p-7">
        <h3 className="font-display text-[26px] leading-snug font-semibold tracking-tight sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tracks.map((track) => (
            <span
              key={track}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-foreground/90 uppercase"
            >
              <span className="h-1 w-1 rounded-full bg-primary" />
              {TRACK_LABELS[track] ?? track}
            </span>
          ))}
        </div>
        <p className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
          View case study
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  )
}
