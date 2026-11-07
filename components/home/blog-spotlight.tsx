'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { formatDate } from '@/components/blog/post-card'
import type { PostDoc } from '@/lib/data'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 5500

/**
 * Latest posts as a spotlight stage with a playlist (Concept
 * D, chosen by Ahmad): the newest story plays on a cinematic
 * stage — cover, gradient, glass "now reading" pill — while
 * the playlist beside it highlights the playing story with
 * animated equalizer bars and a progress bar fills under the
 * stage. Auto-advances through the playlist (pauses on hover,
 * focus, hidden tab, or reduced motion); clicking a playlist
 * row jumps the stage to that story. The stage itself is the
 * link to the post.
 */
export function BlogSpotlight({ posts }: { posts: PostDoc[] }) {
  const count = posts.length
  const [active, setActive] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setActive((current) => (current + 1) % count)
        setCycle((current) => current + 1)
      }
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, reduceMotion, count, cycle])

  if (count === 0) return null
  const post = posts[active]
  const cover = post.coverImage
  const date = formatDate(post.publishedAt)
  const playing = !paused && !reduceMotion && count > 1

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Latest blog posts"
      className="grid gap-5 lg:grid-cols-[1.65fr_1fr]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Stage */}
      <Link
        href={`/blog/${post.slug}`}
        data-cursor="view"
        aria-label={`${post.title} — read story`}
        className="group relative block min-h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_90px_rgba(0,0,0,0.5)]"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${active}-${cycle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            {cover?.url ? (
              <Image
                src={cover.url}
                alt={cover.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        <span className="absolute top-5 left-5 rounded-full border border-white/25 bg-background/50 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-white uppercase backdrop-blur">
          Now reading{post.category ? ` · ${post.category.name}` : ''}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${active}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="max-w-xl font-display text-3xl leading-tight font-semibold text-white sm:text-4xl">
                {post.title}
              </h3>
              <p className="mt-2.5 line-clamp-2 max-w-xl leading-relaxed text-white/75">
                {post.excerpt}
              </p>
              <p className="mt-4 flex items-center gap-4 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-white/60 uppercase">
                {date ? <span>{date}</span> : null}
                {post.readingTime ? <span>{post.readingTime} min read</span> : null}
                <span className="inline-flex items-center gap-1.5 text-primary">
                  Read story <ArrowUpRight className="h-4 w-4" />
                </span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        {count > 1 && !reduceMotion ? (
          <div className="absolute right-0 bottom-0 left-0 h-1 bg-white/15">
            <div
              key={`bar-${active}-${cycle}`}
              className="animate-spotlight-progress h-full bg-primary"
              style={{ animationPlayState: paused ? 'paused' : 'running' }}
            />
          </div>
        ) : null}
      </Link>

      {/* Playlist */}
      <div className="flex flex-col gap-3">
        {posts.map((item, index) => {
          const isActive = index === active
          const itemCover = item.coverImage
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActive(index)
                setCycle((current) => current + 1)
              }}
              aria-current={isActive || undefined}
              className={cn(
                'flex flex-1 items-center gap-4 rounded-2xl border p-4 text-left transition-colors duration-300',
                isActive
                  ? 'border-primary/50 bg-primary/[0.07]'
                  : 'border-border bg-surface hover:border-input',
              )}
            >
              <span
                className={cn(
                  'font-mono text-xs',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {itemCover?.url ? (
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={itemCover.url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="block font-mono text-[9px] tracking-[0.16em] text-muted-foreground uppercase">
                  {item.category?.name ?? 'Notes'} · {formatDate(item.publishedAt) ?? ''}
                </span>
                <span className="mt-1 line-clamp-2 block font-display text-[17px] leading-snug font-semibold">
                  {item.title}
                </span>
              </span>
              {isActive ? (
                <span className="ml-auto flex shrink-0 items-end gap-[3px]" aria-hidden="true">
                  {[10, 16, 7].map((height, barIndex) => (
                    <span
                      key={barIndex}
                      className="animate-eq w-[3px] rounded bg-primary"
                      style={{
                        height,
                        animationDelay: `${barIndex * 0.15}s`,
                        animationPlayState: playing ? 'running' : 'paused',
                      }}
                    />
                  ))}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
