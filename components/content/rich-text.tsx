import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

import { ScrollSlide } from '@/components/motion/scroll-slide'

interface RichTextProps {
  // Lexical editor state from Payload.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  className?: string
}

/**
 * Node types whose rendered block gets its own scroll reveal,
 * so article prose animates block by block as it is read
 * rather than arriving as one static column. Each override
 * calls the package's default converter and wraps its output
 * — the rendering itself is unchanged.
 */
const REVEALED_NODE_TYPES = ['paragraph', 'heading', 'quote', 'list', 'upload']

/**
 * Renders Payload Lexical content with theme-token typography. The
 * arbitrary-variant classes style the elements Lexical emits without
 * any raw colours — everything resolves to semantic tokens.
 */
export function RichText({ data, className = '' }: RichTextProps) {
  if (!data) {
    return null
  }
  return (
    <div
      className={[
        'text-base leading-relaxed text-foreground',
        '[&_p]:mb-5 [&_p]:leading-[1.85] [&_p]:text-muted-foreground',
        '[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground',
        '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-foreground',
        '[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:leading-[1.8] [&_ul]:text-muted-foreground',
        '[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_ol]:leading-[1.8] [&_ol]:text-muted-foreground',
        '[&_li]:mb-1',
        '[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:text-foreground',
        '[&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:bg-surface/60 [&_blockquote]:py-2 [&_blockquote]:pr-4 [&_blockquote]:pl-5 [&_blockquote]:italic',
        '[&_code]:rounded-md [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground',
        '[&_img]:rounded-3xl',
        className,
      ].join(' ')}
    >
      <PayloadRichText
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={data as any}
        converters={({ defaultConverters }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const base = defaultConverters as any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const wrapped: Record<string, any> = { ...base }
          for (const key of REVEALED_NODE_TYPES) {
            if (typeof base[key] === 'function') {
              const converter = base[key]
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              wrapped[key] = (props: any) => (
                <ScrollSlide from="up">{converter(props)}</ScrollSlide>
              )
            }
          }
          return wrapped
        }}
      />
    </div>
  )
}
