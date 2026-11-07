import type { Metadata } from 'next'

import { PostCard } from '@/components/blog/post-card'
import { ScrollSlide } from '@/components/motion/scroll-slide'
import { PageHeader } from '@/components/ui/page-header'
import { getPublishedPosts } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes on backend engineering, AI agents and automation from Ahmad Sajid — production lessons, RAG, and the occasional expensive mistake, documented.',
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  const [lead, ...rest] = posts

  return (
    <div className="py-14">
      <ScrollSlide from="left">
        <PageHeader
          path="~/blog"
          title="Blog"
          intro="What building and running real systems teaches you — deployment, retrieval, automation, and the lessons that arrive with an invoice attached."
        />
      </ScrollSlide>

      {posts.length > 0 ? (
        <>
          <ScrollSlide from="left">
            <div className="mt-12">
              <PostCard post={lead} featured />
            </div>
          </ScrollSlide>
          {rest.length > 0 ? (
            <ScrollSlide from="right">
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </ScrollSlide>
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
