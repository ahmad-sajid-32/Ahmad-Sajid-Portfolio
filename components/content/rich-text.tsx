import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

interface RichTextProps {
  // Lexical editor state from Payload.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  className?: string
}

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
        '[&_p]:mb-4 [&_p]:text-muted-foreground',
        '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-foreground',
        '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-foreground',
        '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground',
        '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-muted-foreground',
        '[&_li]:mb-1',
        '[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:text-foreground',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic',
        className,
      ].join(' ')}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <PayloadRichText data={data as any} />
    </div>
  )
}
