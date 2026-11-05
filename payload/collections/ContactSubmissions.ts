import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
  },
  access: {
    // Anyone may submit through the contact form; only the admin can
    // read, update or delete submissions.
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  // Phase 5 adds an afterChange hook that emails a Resend notification
  // on create. The submission is stored first, so a mail failure can
  // never lose a message.
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
