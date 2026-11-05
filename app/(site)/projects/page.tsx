import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import { ProjectCard } from '@/components/projects/project-card'
import { getPublishedProjects, TRACK_LABELS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Case studies of Ahmad Sajid\u2019s work — an AI agent platform in production, booking and back-office systems, a RAG-powered library, and more.',
}

export const dynamic = 'force-dynamic'

interface ProjectsPageProps {
  searchParams: Promise<{ track?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { track } = await searchParams
  const projects = await getPublishedProjects()
  const activeTrack =
    track && track in TRACK_LABELS ? track : null
  const visible = activeTrack
    ? projects.filter((project) => project.tracks.includes(activeTrack))
    : projects

  const filterLink = (value: string | null) =>
    value ? `/projects?track=${value}` : '/projects'

  const chipClass = (isActive: boolean) =>
    `rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors ${
      isActive
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border text-muted-foreground hover:border-input hover:text-foreground'
    }`

  return (
    <div className="py-14">
      <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
        ~/projects
      </p>
      <h1 className="mt-3 font-display text-5xl leading-tight font-medium">
        Projects
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        The work itself, written up as case studies — what was built, how,
        and what it took to run it. Every claim here is from a real,
        delivered project.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href={filterLink(null)} className={chipClass(activeTrack === null)}>
          All
        </Link>
        {Object.entries(TRACK_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={filterLink(value)}
            className={chipClass(activeTrack === value)}
          >
            {label}
          </Link>
        ))}
      </div>

      {visible.length > 0 ? (
        <Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Reveal>
      ) : (
        <p className="mt-10 rounded-[14px] border border-border bg-surface p-6 text-muted-foreground">
          No published projects in this track yet.
        </p>
      )}
    </div>
  )
}
