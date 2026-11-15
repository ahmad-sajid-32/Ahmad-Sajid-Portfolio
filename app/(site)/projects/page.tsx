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

/** Max projects rendered per page; pagination appears beyond this. */
const PAGE_SIZE = 12

interface ProjectsPageProps {
  searchParams: Promise<{ track?: string; page?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { track, page } = await searchParams
  const projects = await getPublishedProjects()

  /**
   * Filter chips are derived from the projects actually
   * rendered: a track exists as a button only while at least
   * one published project carries it. The full label set
   * stays in TRACK_LABELS (the system), so a track's button
   * appears the moment its first project is published.
   */
  const presentTracks = Object.keys(TRACK_LABELS).filter((value) =>
    projects.some((project) => project.tracks.includes(value)),
  )
  const activeTrack =
    track && presentTracks.includes(track) ? track : null
  const visible = activeTrack
    ? projects.filter((project) => project.tracks.includes(activeTrack))
    : projects

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const requestedPage = Number.parseInt(page ?? '', 10)
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1
  const pageItems = visible.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const pageLink = (value: string | null, pageNumber: number) => {
    const params = new URLSearchParams()
    if (value) params.set('track', value)
    if (pageNumber > 1) params.set('page', String(pageNumber))
    const query = params.toString()
    return query ? `/projects?${query}` : '/projects'
  }
  const filterLink = (value: string | null) => pageLink(value, 1)

  const chipClass = (isActive: boolean) =>
    `rounded-full border px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-all duration-300 ${
      isActive
        ? 'border-primary bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(232,163,61,0.35)]'
        : 'border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground'
    }`

  /** Count + year range computed from the rendered set (Payload). */
  const years = visible.map((project) => project.year)
  const yearRange =
    years.length === 0
      ? ''
      : Math.min(...years) === Math.max(...years)
        ? `${Math.min(...years)}`
        : `${Math.min(...years)} — ${Math.max(...years)}`

  return (
    <div className="page-gutter py-14">
      <PageHeader
          title="Projects"
          intro="Real, delivered projects, written up as case studies — what was built, the decisions behind it, and what it took to ship. No demos and no tutorial builds: everything here was made for real users."
        >
          <p className="mt-4 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {visible.length}{' '}
            {visible.length === 1 ? 'case study' : 'case studies'}
            {yearRange ? ` · ${yearRange}` : ''}
          </p>
        </PageHeader>

      <ScrollSlide from="up" className="mt-10">
        <div className="flex flex-wrap gap-2">
          <Link href={filterLink(null)} className={chipClass(activeTrack === null)}>
            All
          </Link>
          {presentTracks.map((value) => (
            <Link
              key={value}
              href={filterLink(value)}
              className={chipClass(activeTrack === value)}
            >
              {TRACK_LABELS[value]}
            </Link>
          ))}
        </div>
      </ScrollSlide>

      {pageItems.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((project, index) => (
            <ScrollSlide
              key={project.id}
              from="up"
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

      {totalPages > 1 ? (
        <ScrollSlide from="up" className="mt-12">
          <nav
            aria-label="Project pages"
            className="flex flex-wrap items-center gap-2"
          >
            {currentPage > 1 ? (
              <Link
                href={pageLink(activeTrack, currentPage - 1)}
                className={chipClass(false)}
              >
                ← Prev
              </Link>
            ) : null}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <Link
                  key={pageNumber}
                  href={pageLink(activeTrack, pageNumber)}
                  aria-current={pageNumber === currentPage ? 'page' : undefined}
                  className={chipClass(pageNumber === currentPage)}
                >
                  {pageNumber}
                </Link>
              ),
            )}
            {currentPage < totalPages ? (
              <Link
                href={pageLink(activeTrack, currentPage + 1)}
                className={chipClass(false)}
              >
                Next →
              </Link>
            ) : null}
          </nav>
        </ScrollSlide>
      ) : null}
    </div>
  )
}
