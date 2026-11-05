import Image from 'next/image'
import Link from 'next/link'

import { DEPLOYMENT_LABELS, TRACK_LABELS, type ProjectDoc } from '@/lib/data'

export function ProjectCard({ project }: { project: ProjectDoc }) {
  const cover = project.coverImage

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-[14px] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-input"
    >
      {cover?.url ? (
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {project.year} · {project.role}
          </p>
          {project.deploymentStatus === 'deployed' ? (
            <span className="font-mono text-[11px] tracking-[0.18em] text-success uppercase">
              {DEPLOYMENT_LABELS[project.deploymentStatus]}
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-snug font-medium">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tracks.map((track) => (
            <span
              key={track}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
            >
              {TRACK_LABELS[track] ?? track}
            </span>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
          View case study
        </p>
      </div>
    </Link>
  )
}
