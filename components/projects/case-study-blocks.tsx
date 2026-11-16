import Image from 'next/image'

import { RichText } from '@/components/content/rich-text'
import { ScrollSlide } from '@/components/motion/scroll-slide'
import { VideoEmbed } from '@/components/projects/video-embed'
import type { CaseStudyBlock, MediaDoc } from '@/lib/data'

const SECTION_TITLES: Record<string, string> = {
  overview: 'Overview',
  problem: 'The problem',
  solution: 'The solution',
  challenges: 'Challenges',
  outcome: 'Outcome',
  architecture: 'Architecture',
}

function isMedia(value: MediaDoc | number | undefined): value is MediaDoc {
  return typeof value === 'object' && value !== null && 'url' in value
}

function BlockSection({
  title,
  children,
  first = false,
}: {
  title: string
  children: React.ReactNode
  /** First block in the study: no top border or padding. */
  first?: boolean
}) {
  return (
    <ScrollSlide from="up">
      <section
        className={
          first ? 'py-10 pt-0' : 'border-t border-border py-10'
        }
      >
        <h2 className="flex items-center gap-3.5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          <span
            aria-hidden="true"
            className="h-7 w-1 shrink-0 rounded-full bg-primary"
          />
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </section>
    </ScrollSlide>
  )
}

export function CaseStudyBlocks({
  blocks,
  excludeMediaIds = [],
}: {
  blocks: CaseStudyBlock[]
  /** Media already shown in the page-level gallery — media
   * breaks skip these so an image never appears twice. */
  excludeMediaIds?: number[]
}) {
  if (!blocks?.length) {
    return null
  }

  return (
    <div>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`

        if (block.blockType === 'features') {
          return (
            <BlockSection key={key} title="Key features" first={index === 0}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {(block.items ?? []).map((item, itemIndex) => (
                  <ScrollSlide
                    as="li"
                    key={item.id ?? itemIndex}
                    from="up"
                    delay={itemIndex * 0.07}
                    className="flex gap-3 rounded-2xl border border-border bg-surface p-4 leading-relaxed text-foreground/90 transition-colors duration-300 hover:border-primary/40"
                  >
                    <span
                      aria-hidden
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{item.text}</span>
                  </ScrollSlide>
                ))}
              </ul>
            </BlockSection>
          )
        }

        if (block.blockType === 'mediaSection') {
          const items = (block.items ?? [])
            .map((item) => item.media)
            .filter(isMedia)
            .filter((media) => !excludeMediaIds.includes(media.id))
          if (items.length === 0 && !block.videoEmbedUrl) {
            return null
          }
          return (
            <BlockSection key={key} title="Media" first={index === 0}>
              {items.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((media, mediaIndex) => (
                    <ScrollSlide
                      key={media.id}
                      from="up"
                      delay={mediaIndex * 0.08}
                    >
                      <div className="group relative aspect-[3/2] overflow-hidden rounded-3xl border border-border">
                        <Image
                          src={media.url ?? ''}
                          alt={media.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </ScrollSlide>
                  ))}
                </div>
              ) : null}
              {block.videoEmbedUrl ? (
                <div className="mx-auto mt-4 w-full max-w-3xl">
                  <VideoEmbed src={block.videoEmbedUrl} title="Project video" />
                </div>
              ) : null}
            </BlockSection>
          )
        }

        const title = SECTION_TITLES[block.blockType]
        if (title && block.body) {
          return (
            <BlockSection key={key} title={title} first={index === 0}>
              <RichText data={block.body} />
              {block.blockType === 'architecture' && isMedia(block.diagram) ? (
                <ScrollSlide from="up">
                  <div className="relative mx-auto mt-6 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface">
                    <Image
                      src={block.diagram.url ?? ''}
                      alt={block.diagram.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 768px"
                      className="object-contain"
                    />
                  </div>
                </ScrollSlide>
              ) : null}
            </BlockSection>
          )
        }

        return null
      })}
    </div>
  )
}
