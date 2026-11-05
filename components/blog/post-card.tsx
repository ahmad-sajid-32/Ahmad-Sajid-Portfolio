import Image from 'next/image'
import Link from 'next/link'

import type { PostDoc } from '@/lib/data'

function formatDate(value?: string | null): string | null {
  if (!value) {
    return null
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function PostCard({ post }: { post: PostDoc }) {
  const cover = post.coverImage
  const date = formatDate(post.publishedAt)

  return (
    <Link
      href={`/blog/${post.slug}`}
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
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {post.category?.name ?? 'Notes'}
          {date ? ` · ${date}` : ''}
          {post.readingTime ? ` · ${post.readingTime} min read` : ''}
        </p>
        <h3 className="mt-3 font-display text-2xl leading-snug font-medium">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
          Read post
        </p>
      </div>
    </Link>
  )
}

export { formatDate }
