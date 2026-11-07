import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/rich-text'
import { formatDate } from '@/components/blog/post-card'
import { ScrollSlide } from '@/components/motion/scroll-slide'
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
  const title = post.seo?.metaTitle ?? post.title
  const description = post.seo?.metaDescription ?? post.excerpt
  const image = post.coverImage?.url
  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://ahmad-sajid.vercel.app/blog/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      images: image ? [{ url: image, alt: post.coverImage.alt }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    notFound()
  }

  const all = await getPublishedPosts()
  const index = all.findIndex((item) => item.slug === slug)
  const previous = index > 0 ? all[index - 1] : null
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null

  const date = formatDate(post.publishedAt)
  const cover = post.coverImage
  const meta = [date, post.readingTime ? `${post.readingTime} min read` : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="page-gutter py-14">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-all duration-300 hover:border-primary/50 hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All posts
      </Link>

      <ScrollSlide from="left">
        <header className="relative mt-10 max-w-3xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-foreground/90 uppercase">
              <span className="h-1 w-1 rounded-full bg-primary" />
              {post.category?.name ?? 'Notes'}
            </span>
            {meta ? (
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                {meta}
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </div>
        </header>
      </ScrollSlide>

      {cover?.url ? (
        <ScrollSlide from="up" className="mt-10">
          <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-border shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          </div>
        </ScrollSlide>
      ) : null}

      <div className="mt-12 max-w-3xl">
        <RichText data={post.content} />
      </div>

      {post.tags && post.tags.length > 0 ? (
        <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
          {post.tags.map((entry, index) => (
            <ScrollSlide key={entry.id ?? index} from="up" delay={index * 0.05}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-foreground/90 uppercase">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {entry.tag}
              </span>
            </ScrollSlide>
          ))}
        </div>
      ) : null}

      {(previous || next) && (
        <ScrollSlide from="up">
          <nav
            aria-label="More posts"
            className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
          >
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="group rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Newer post
              </span>
              <span className="mt-3 line-clamp-2 block font-display text-2xl font-semibold tracking-tight">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group rounded-3xl border border-border bg-surface p-6 text-right transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Older post
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="mt-3 line-clamp-2 block font-display text-2xl font-semibold tracking-tight">
                {next.title}
              </span>
            </Link>
            ) : null}
          </nav>
        </ScrollSlide>
      )}
    </article>
  )
}
