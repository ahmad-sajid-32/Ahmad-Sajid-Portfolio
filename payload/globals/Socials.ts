import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

/**
 * Social & contact-channel links, managed from the admin
 * (Globals → Social Links). The frontend renders every row
 * that has a URL — footer, contact page, and the curated
 * subsets in the hero and mobile drawer — so adding or
 * removing a link here updates the whole site with no code
 * change. The platform list covers the commonly used
 * networks; each key maps to a brand icon in
 * components/ui/brand-icons.tsx / social-icons.
 */
export const SOCIAL_PLATFORMS = [
  { label: 'GitHub', value: 'github' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Fiverr', value: 'fiverr' },
  { label: 'Upwork', value: 'upwork' },
  { label: 'X (Twitter)', value: 'x' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Website', value: 'website' },
] as const

export const Socials: GlobalConfig = {
  slug: 'socials',
  label: 'Social Links',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    description:
      'One row per platform. Rows render on the site in this order wherever socials appear; delete a row (or leave it out) to hide that platform. For Email use a mailto: link, for Phone a tel: link, for WhatsApp an https://wa.me/ link.',
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [...SOCIAL_PLATFORMS],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Full URL — https://…, mailto:… or tel:…',
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Optional display label; defaults to the platform name.',
          },
        },
      ],
    },
  ],
}
