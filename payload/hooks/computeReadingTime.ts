import type { CollectionBeforeChangeHook } from 'payload'

type LexicalNode = {
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

function extractText(node: LexicalNode | undefined): string {
  if (!node) {
    return ''
  }
  const own = typeof node.text === 'string' ? node.text : ''
  const children = Array.isArray(node.children)
    ? node.children.map((child) => extractText(child)).join(' ')
    : ''
  return `${own} ${children}`
}

/** Sets `readingTime` (minutes, minimum 1) from the Lexical content. */
export const computeReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (data && data.content) {
    const words = extractText(data.content as LexicalNode)
      .split(/\s+/)
      .filter(Boolean).length
    data.readingTime = Math.max(1, Math.ceil(words / 200))
  }
  return data
}
