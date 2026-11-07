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

function CategoryPill({ name, onCover = false }: { name: string; onCover?: boolean }) {
  if (onCover) {
    return (
      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-foreground uppercase backdrop-blur">
        <span className="h-1 w-1 rounded-full bg-primary" />
        {name}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-foreground/90 uppercase">
      <span className="h-1 w-1 rounded-full bg-primary" />
      {name}
    </span>
  )
}

/**
 * Blog card in the home sections' current language —
 * rounded-3xl, sheen over the cover, category pill, sliding
 * arrow. The `featured` variant is the wide lead story on
 * the blog index: cover and text side by side.
 */
export function PostCard({
  post,
  featured = false,
}: {
  post: PostDoc
  featured?: boolean
}) {
  const cover = post.coverImage
  const date = formatDate(post.publishedAt)
  const category = post.category?.name ?? 'Notes'
  const meta = [date, post.readingTime ? `${post.readingTime} min read` : null]
    .filter(Boolean)
    .join(' · ')

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        data-cursor="view"
        className="group grid overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.35)] md:grid-cols-2"
      >
        {cover?.url ? (
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:h-full md:min-h-[320px]">
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
          </div>
        ) : null}
        <div className="flex flex-col p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <CategoryPill name={category} />
            {meta ? (
              <span className="font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-muted-foreground uppercase">
                {meta}
              </span>
            ) : null}
          </div>
          <h3 className="mt-5 font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
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
          <CategoryPill name={category} onCover />
        </div>
      ) : null}
      <div className="p-6 sm:p-7">
        {meta ? (
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            {meta}
          </p>
        ) : null}
        <h3 className="mt-3 font-display text-2xl leading-snug font-semibold tracking-tight">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </div>
    </Link>
  )
}

export { formatDate }
