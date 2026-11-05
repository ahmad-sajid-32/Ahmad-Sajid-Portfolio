import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the media for screen readers and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption shown under gallery media.',
      },
    },
  ],
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1600 },
    ],
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    adminThumbnail: 'thumbnail',
  },
}
