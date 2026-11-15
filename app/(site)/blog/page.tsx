import type { Metadata } from 'next'
import Link from 'next/link'

import { PostCard } from '@/components/blog/post-card'
import { ScrollSlide } from '@/components/motion/scroll-slide'
import { PageHeader } from '@/components/ui/page-header'
import { getPublishedPosts } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes on backend engineering, AI agents and automation from Ahmad Sajid — production lessons, RAG, and the occasional expensive mistake, documented.',
}

export const dynamic = 'force-dynamic'

// One featured story on top and nine cards below it.
const PAGE_SIZE = 10

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const posts = await getPublishedPosts()

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const requestedPage = Number.parseInt(params.page ?? '', 10)
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages)
  const pagePosts = posts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const [lead, ...rest] = pagePosts

  const pageLink = (page: number) => (page <= 1 ? '/blog' : `/blog?page=${page}`)

  return (
    <div className="page-gutter py-14">
      <PageHeader
        title="Blog"
        intro="What building and running real systems teaches you — deployment, retrieval, automation, and the lessons that arrive with an invoice attached."
      />

      {posts.length > 0 ? (
        <>
          <ScrollSlide from="up">
            <div className="mt-12">
              <PostCard post={lead} featured />
            </div>
          </ScrollSlide>
          {rest.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <ScrollSlide
                  key={post.id}
                  from="up"
                  delay={(index % 3) * 0.08}
                  className="h-full"
                >
                  <PostCard post={post} />
                </ScrollSlide>
              ))}
            </div>
          ) : null}

          {totalPages > 1 ? (
            <nav
              aria-label="Blog pages"
              className="mt-12 flex flex-wrap items-center gap-2"
            >
              {currentPage > 1 ? (
                <Link
                  href={pageLink(currentPage - 1)}
                  className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  Prev
                </Link>
              ) : null}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Link
                    key={page}
                    href={pageLink(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={
                      page === currentPage
                        ? 'rounded-full border border-primary bg-primary px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-primary-foreground uppercase'
                        : 'rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-primary/50 hover:text-foreground'
                    }
                  >
                    {page}
                  </Link>
                ),
              )}
              {currentPage < totalPages ? (
                <Link
                  href={pageLink(currentPage + 1)}
                  className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </>
      ) : (
        <div className="mt-12 rounded-3xl border border-border bg-surface p-8">
          <h2 className="font-display text-2xl font-medium">
            The first posts are being written.
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Drafts are in progress — a production deployment story, a
            RAG/pgvector walkthrough, and one costly early-career lesson.
            They will appear here as they are published.
          </p>
        </div>
      )}
    </div>
  )
}
