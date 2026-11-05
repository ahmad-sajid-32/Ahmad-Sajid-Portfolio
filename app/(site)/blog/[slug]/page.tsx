import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/rich-text'
import { formatDate } from '@/components/blog/post-card'
import { getPostBySlug, getPublishedPosts } from '@/lib/data'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    return { title: 'Post not found' }
  }
  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
  }
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    notFound()
  }

  const date = formatDate(post.publishedAt)
  const cover = post.coverImage

  return (
    <article className="py-14">
      <Link
        href="/blog"
        className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        ← All posts
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-highlight uppercase">
          {post.category?.name ?? 'Notes'}
          {date ? ` · ${date}` : ''}
          {post.readingTime ? ` · ${post.readingTime} min read` : ''}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-medium sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </header>

      {cover?.url ? (
        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-[14px] border border-border">
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-12 max-w-3xl">
        <RichText data={post.content} />
      </div>

      {post.tags && post.tags.length > 0 ? (
        <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
          {post.tags.map((entry, index) => (
            <span
              key={entry.id ?? index}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
            >
              {entry.tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  )
}
