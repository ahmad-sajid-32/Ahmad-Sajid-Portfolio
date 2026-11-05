import type { Access } from 'payload'

/**
 * Public reads see published documents only; a signed-in admin sees
 * everything (drafts included). Used on collections with drafts enabled.
 */
export const publishedOnly: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }
  return {
    _status: {
      equals: 'published',
    },
  }
}
