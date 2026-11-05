import Image from 'next/image'

import { RichText } from '@/components/content/rich-text'
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
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border py-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl font-medium sm:text-3xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function CaseStudyBlocks({ blocks }: { blocks: CaseStudyBlock[] }) {
  if (!blocks?.length) {
    return null
  }

  return (
    <div>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`

        if (block.blockType === 'features') {
          return (
            <BlockSection key={key} title="Key features">
              <ul className="space-y-3">
                {(block.items ?? []).map((item, itemIndex) => (
                  <li
                    key={item.id ?? itemIndex}
                    className="flex gap-3 text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </BlockSection>
          )
        }

        if (block.blockType === 'mediaSection') {
          return (
            <BlockSection key={key} title="Gallery">
              <div className="grid gap-4 sm:grid-cols-2">
                {(block.items ?? [])
                  .map((item) => item.media)
                  .filter(isMedia)
                  .map((media) => (
                    <div
                      key={media.id}
                      className="relative aspect-[3/2] overflow-hidden rounded-[14px] border border-border"
                    >
                      <Image
                        src={media.url ?? ''}
                        alt={media.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
              {block.videoEmbedUrl ? (
                <div className="mt-4 aspect-video overflow-hidden rounded-[14px] border border-border">
                  <iframe
                    src={block.videoEmbedUrl}
                    title="Project video"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </BlockSection>
          )
        }

        const title = SECTION_TITLES[block.blockType]
        if (title && block.body) {
          return (
            <BlockSection key={key} title={title}>
              <RichText data={block.body} />
              {block.blockType === 'architecture' && isMedia(block.diagram) ? (
                <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[14px] border border-border">
                  <Image
                    src={block.diagram.url ?? ''}
                    alt={block.diagram.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-contain"
                  />
                </div>
              ) : null}
            </BlockSection>
          )
        }

        return null
      })}
    </div>
  )
}
