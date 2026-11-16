import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export interface PaginatorLink {
  href: string
  title: string
}

/**
 * Slim split bar (Ahmad's pick from five rendered
 * concepts, 2026-11-16): the Previous / Next navigation
 * on detail pages as ONE bar split by a hairline —
 * label + title on a single line per side, arrows slide
 * on hover. Stacks vertically on phones. Replaces the
 * old pair of large cards on project and blog articles.
 */
export function DetailPaginator({
  prev,
  next,
  prevLabel,
  nextLabel,
  ariaLabel,
}: {
  prev: PaginatorLink | null
  next: PaginatorLink | null
  prevLabel: string
  nextLabel: string
  ariaLabel: string
}) {
  if (!prev && !next) {
    return null
  }
  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 sm:flex-row"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-1 items-center gap-3 px-5 py-4 transition-colors duration-300 hover:bg-primary/5"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
          <span className="min-w-0">
            <span className="block font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
              {prevLabel}
            </span>
            <span className="block truncate text-base font-semibold">
              {prev.title}
            </span>
          </span>
        </Link>
      ) : null}
      {prev && next ? (
        <span aria-hidden="true" className="h-px bg-border sm:h-auto sm:w-px" />
      ) : null}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-1 items-center justify-end gap-3 px-5 py-4 text-right transition-colors duration-300 hover:bg-primary/5"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
              {nextLabel}
            </span>
            <span className="block truncate text-base font-semibold">
              {next.title}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      ) : null}
    </nav>
  )
}
