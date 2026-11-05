import type { CollectionBeforeValidateHook } from 'payload'

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Fills `slug` from `title` (projects/posts) or `name` (technologies,
 * categories) when the slug is empty. An explicitly set slug is never
 * overwritten, so Ahmad can adjust it before publishing.
 */
export const generateSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (data && !data.slug) {
    const source =
      typeof data.title === 'string'
        ? data.title
        : typeof data.name === 'string'
          ? data.name
          : undefined
    if (source) {
      data.slug = slugify(source)
    }
  }
  return data
}
