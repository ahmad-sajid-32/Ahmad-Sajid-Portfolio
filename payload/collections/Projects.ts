import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { caseStudyBlocks } from '../blocks/caseStudy'
import { generateSlug } from '../hooks/generateSlug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateContent'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'deploymentStatus', 'featured', '_status', 'year'],
  },
  access: {
    read: publishedOnly,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [generateSlug],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from the title; editable before publish.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'deploymentStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Deployed', value: 'deployed' },
        { label: 'Not deployed', value: 'not-deployed' },
        { label: 'In progress', value: 'in-progress' },
      ],
    },
    {
      name: 'projectType',
      type: 'select',
      required: true,
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Professional', value: 'professional' },
        { label: 'Personal', value: 'personal' },
        { label: 'Academic', value: 'academic' },
      ],
    },
    {
      name: 'tracks',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Backend', value: 'backend' },
        { label: 'CRM Automation', value: 'crm-automation' },
        { label: 'Frontend', value: 'frontend' },
        { label: 'Full Stack', value: 'full-stack' },
        { label: 'AI', value: 'ai' },
        { label: 'Game Dev', value: 'game-dev' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured projects are eligible for the home page (max 3 shown).',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional short showcase clip. Supabase cap is 50 MB per file — use the embed field for long demos.',
      },
    },
    {
      name: 'videoEmbedUrl',
      type: 'text',
      admin: {
        description: 'Optional YouTube/Vimeo embed URL. Takes the hero slot when no video is uploaded.',
      },
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        description: 'Optional. When set, the project page shows a "Visit Live Site" button.',
      },
    },
    {
      name: 'githubUrl',
      type: 'text',
      admin: {
        description: 'Optional. When set, the project page shows a "View Code" button.',
      },
    },
    {
      name: 'techStack',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: caseStudyBlocks,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
      admin: {
        description: 'Falls back to title / excerpt / cover image when empty.',
      },
    },
  ],
}
