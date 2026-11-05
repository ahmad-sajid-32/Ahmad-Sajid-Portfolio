import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { generateSlug } from '../hooks/generateSlug'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [generateSlug],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from the name; editable.',
      },
    },
    {
      name: 'iconKey',
      type: 'text',
      admin: {
        description: 'Optional key the frontend maps to a brand/skill icon.',
      },
    },
  ],
}
