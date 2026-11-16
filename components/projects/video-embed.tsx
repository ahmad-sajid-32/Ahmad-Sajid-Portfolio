'use client'

import { Play } from 'lucide-react'
import { useState } from 'react'

/**
 * Click-to-play video facade: renders a poster (the
 * YouTube thumbnail when the embed is a YouTube URL)
 * with a play button, and only swaps in the real iframe
 * once the visitor clicks — so embeds stop dominating
 * the page and costing a heavy iframe on every load.
 */
export function VideoEmbed({ src, title }: { src: string; title: string }) {
  const [playing, setPlaying] = useState(false)

  const youtubeId =
    src.match(/youtube\.com\/embed\/([\w-]{6,})/)?.[1] ??
    src.match(/youtube\.com\/watch\?v=([\w-]{6,})/)?.[1] ??
    src.match(/youtu\.be\/([\w-]{6,})/)?.[1]
  const poster = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : null
  const playSrc = src.includes('?')
    ? `${src}&autoplay=1`
    : `${src}?autoplay=1`

  if (playing) {
    return (
      <div className="aspect-video overflow-hidden rounded-3xl border border-border">
        <iframe
          src={playSrc}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-3xl border border-border bg-surface text-left"
    >
      {poster ? (
        // Plain img: the poster is a third-party thumbnail,
        // not worth routing through the image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-95"
        />
      ) : null}
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(232,163,61,0.45)] transition-transform duration-300 group-hover:scale-110">
          <Play className="ml-1 h-7 w-7 fill-current" />
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-white/85 uppercase">
          Play video
        </span>
      </span>
    </button>
  )
}
