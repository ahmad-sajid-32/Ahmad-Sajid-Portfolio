import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/rich-text'
import { formatDate } from '@/components/blog/post-card'
import { ScrollSlide } from '@/components/motion/scroll-slide'
import { DetailPaginator } from '@/components/ui/detail-paginator'
import { getPostBySlug, getPublishedPosts } from '@/lib/data'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

// Post content comes from Payload at navigation time. This lets the
// segment loading boundary render while the database reads are pending.
export const dynamic = 'force-dynamic'

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
      <ScrollSlide from="left">
        <header className="relative max-w-3xl">
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
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border shadow-[0_40px_80px_rgba(0,0,0,0.35)] lg:aspect-[21/9]">
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

      <div className="mt-12">
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
          <div className="mt-10 border-t border-border pt-8">
            <DetailPaginator
              ariaLabel="More posts"
              prev={
                previous
                  ? { href: `/blog/${previous.slug}`, title: previous.title }
                  : null
              }
              next={
                next ? { href: `/blog/${next.slug}`, title: next.title } : null
              }
              prevLabel="Newer post"
              nextLabel="Older post"
            />
          </div>
        </ScrollSlide>
      )}
    </article>
  )
}
