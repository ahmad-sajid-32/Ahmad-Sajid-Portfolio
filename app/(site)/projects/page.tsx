import type { Metadata } from 'next'
import Link from 'next/link'

import { ScrollSlide } from '@/components/motion/scroll-slide'
import { ProjectCard } from '@/components/projects/project-card'
import { PageHeader } from '@/components/ui/page-header'
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
    `rounded-full border px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-all duration-300 ${
      isActive
        ? 'border-primary bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(232,163,61,0.35)]'
        : 'border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground'
    }`

  const years = projects.map((project) => project.year)
  const yearRange =
    years.length > 0
      ? `${Math.min(...years)} — ${Math.max(...years)}`
      : ''

  return (
    <div className="page-gutter py-14">
      <PageHeader
          path="~/projects"
          title="Projects"
          intro="The work itself, written up as case studies — what was built, how, and what it took to run it. Every claim here is from a real, delivered project."
        >
          <p className="mt-4 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {projects.length} case studies{yearRange ? ` · ${yearRange}` : ''}
          </p>
        </PageHeader>

      <ScrollSlide from="up" className="mt-10">
        <div className="flex flex-wrap gap-2">
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
      </ScrollSlide>

      {visible.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
            <ScrollSlide
              key={project.id}
              from={index % 2 === 0 ? 'left' : 'right'}
              delay={(index % 3) * 0.08}
              className="h-full"
            >
              <ProjectCard project={project} />
            </ScrollSlide>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-3xl border border-border bg-surface p-6 text-muted-foreground">
          No published projects in this track yet.
        </p>
      )}
    </div>
  )
}
