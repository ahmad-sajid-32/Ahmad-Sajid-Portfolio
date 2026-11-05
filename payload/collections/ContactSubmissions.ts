import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

const NOTIFY_EMAIL =
  process.env.CONTACT_TO_EMAIL ?? 'ahmadsajid41324@gmail.com'

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
  hooks: {
    // Notify Ahmad by email on every new submission. The submission
    // is already stored when this runs (afterChange), and any mail
    // failure is logged, never thrown — a broken mailbox must not
    // lose or block a message.
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') {
          return doc
        }
        try {
          await req.payload.sendEmail({
            to: NOTIFY_EMAIL,
            subject: `Portfolio contact: ${doc.subject}`,
            text: [
              `New message from the portfolio contact form.`,
              ``,
              `Name: ${doc.name}`,
              `Email: ${doc.email}`,
              `Subject: ${doc.subject}`,
              ``,
              doc.message,
              ``,
              `— Reply directly to ${doc.email}, or manage this submission in the admin (Contact Submissions).`,
            ].join('\n'),
          })
        } catch (error) {
          req.payload.logger.error(
            `Contact notification email failed for submission ${doc.id}: ${String(error)}`,
          )
        }
        return doc
      },
    ],
  },
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
