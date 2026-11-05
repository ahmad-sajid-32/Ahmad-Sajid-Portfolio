import type { Block } from 'payload'

const richTextSection = (slug: string, label: string): Block => ({
  slug,
  labels: { singular: label, plural: label },
  fields: [
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
  ],
})

/**
 * Case-study body blocks for project pages (ARCHITECTURE §7.3). The
 * detail template renders only the blocks that are present, in order.
 */
export const caseStudyBlocks: Block[] = [
  richTextSection('overview', 'Overview'),
  richTextSection('problem', 'Problem'),
  richTextSection('solution', 'Solution'),
  {
    slug: 'architecture',
    labels: { singular: 'Architecture', plural: 'Architecture' },
    fields: [
      {
        name: 'body',
        type: 'richText',
        required: true,
      },
      {
        name: 'diagram',
        type: 'upload',
        relationTo: 'media',
        admin: {
          description: 'Optional architecture diagram image.',
        },
      },
    ],
  },
  {
    slug: 'features',
    labels: { singular: 'Key Features', plural: 'Key Features' },
    fields: [
      {
        name: 'items',
        type: 'array',
        required: true,
        fields: [
          {
            name: 'text',
            type: 'text',
            required: true,
          },
        ],
      },
    ],
  },
  richTextSection('challenges', 'Challenges'),
  richTextSection('outcome', 'Outcome'),
  {
    slug: 'mediaSection',
    labels: { singular: 'Media Break', plural: 'Media Breaks' },
    fields: [
      {
        name: 'items',
        type: 'array',
        fields: [
          {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            required: true,
          },
        ],
      },
      {
        name: 'videoEmbedUrl',
        type: 'text',
        admin: {
          description: 'Optional YouTube/Vimeo embed URL for a longer demo.',
        },
      },
    ],
  },
]
