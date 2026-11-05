import type { Metadata } from 'next'

import { PostCard } from '@/components/blog/post-card'
import { getPublishedPosts } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes on backend engineering, AI agents and automation from Ahmad Sajid — production lessons, RAG, and the occasional expensive mistake, documented.',
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="py-14">
      <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
        ~/blog
      </p>
      <h1 className="mt-3 font-display text-5xl leading-tight font-medium">
        Blog
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        What building and running real systems teaches you — deployment,
        retrieval, automation, and the lessons that arrive with an invoice
        attached.
      </p>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[14px] border border-border bg-surface p-8">
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
