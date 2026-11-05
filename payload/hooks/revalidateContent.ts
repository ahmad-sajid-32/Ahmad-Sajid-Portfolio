import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Revalidates the public paths a project/post appears on when a
 * published version changes, so admin edits go live without a redeploy.
 * Runs inside try/catch: hooks also fire from scripts and the local
 * API, where there is no Next.js request context to revalidate.
 */
function revalidate(collectionSlug: string, docSlug: unknown) {
  try {
    revalidatePath('/')
    if (collectionSlug === 'projects') {
      revalidatePath('/projects')
      if (typeof docSlug === 'string') {
        revalidatePath(`/projects/${docSlug}`)
      }
    }
    if (collectionSlug === 'posts') {
      revalidatePath('/blog')
      if (typeof docSlug === 'string') {
        revalidatePath(`/blog/${docSlug}`)
      }
    }
  } catch {
    // No Next.js context (seed/CLI) — nothing to revalidate.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({
  collection,
  doc,
}) => {
  if (doc?._status === 'published') {
    revalidate(collection.slug, doc.slug)
  }
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({
  collection,
  doc,
}) => {
  revalidate(collection.slug, doc?.slug)
  return doc
}
