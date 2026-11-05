import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Server-side data access for the public site. Everything here reads
 * through Payload's Local API with access control enforced
 * (overrideAccess: false) AND an explicit published-only filter, so a
 * draft can never leak onto a public page.
 */

export interface MediaDoc {
  id: number
  url?: string | null
  alt: string
  caption?: string | null
  width?: number | null
  height?: number | null
}

export interface TechnologyDoc {
  id: number
  name: string
  slug: string
}

export interface CaseStudyBlock {
  blockType: string
  id?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  items?: { id?: string; text?: string; media?: MediaDoc | number }[]
  diagram?: MediaDoc | number
  videoEmbedUrl?: string | null
}

export interface ProjectDoc {
  id: number
  title: string
  slug: string
  tagline: string
  excerpt: string
  deploymentStatus: 'deployed' | 'not-deployed' | 'in-progress'
  projectType: 'client' | 'professional' | 'personal' | 'academic'
  tracks: string[]
  featured: boolean
  coverImage: MediaDoc
  gallery?: { id?: string; image: MediaDoc }[]
  video?: MediaDoc | null
  videoEmbedUrl?: string | null
  liveUrl?: string | null
  githubUrl?: string | null
  techStack: TechnologyDoc[]
  role: string
  year: number
  content?: CaseStudyBlock[]
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  }
}

export interface PostDoc {
  id: number
  title: string
  slug: string
  excerpt: string
  coverImage: MediaDoc
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  category?: { id: number; name: string; slug: string } | null
  tags?: { id?: string; tag: string }[]
  publishedAt?: string | null
  readingTime?: number | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  }
}

async function payload() {
  return getPayload({ config })
}

export async function getPublishedProjects(): Promise<ProjectDoc[]> {
  const payloadClient = await payload()
  const result = await payloadClient.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    overrideAccess: false,
    depth: 2,
    limit: 100,
    sort: '-year',
  })
  const docs = result.docs as unknown as ProjectDoc[]
  // Featured first, then newest year first (stable within a year).
  return [...docs].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) || b.year - a.year,
  )
}

export async function getFeaturedProjects(): Promise<ProjectDoc[]> {
  const projects = await getPublishedProjects()
  return projects.filter((project) => project.featured).slice(0, 3)
}

export interface HeroCounts {
  projects: number
  technologies: number
}

/**
 * Live counts for the hero stats, read from Payload at render time —
 * the numbers on the page are always the numbers in the CMS.
 * Projects counts published only, like every public surface.
 */
export async function getHeroCounts(): Promise<HeroCounts> {
  const payloadClient = await payload()
  const [projects, technologies] = await Promise.all([
    payloadClient.count({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      overrideAccess: false,
    }),
    payloadClient.count({
      collection: 'technologies',
      overrideAccess: false,
    }),
  ])
  return {
    projects: projects.totalDocs,
    technologies: technologies.totalDocs,
  }
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDoc | null> {
  const payloadClient = await payload()
  const result = await payloadClient.find({
    collection: 'projects',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    overrideAccess: false,
    depth: 2,
    limit: 1,
  })
  return (result.docs[0] as unknown as ProjectDoc) ?? null
}

export async function getPublishedPosts(): Promise<PostDoc[]> {
  const payloadClient = await payload()
  const result = await payloadClient.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    overrideAccess: false,
    depth: 2,
    limit: 100,
    sort: '-publishedAt',
  })
  return result.docs as unknown as PostDoc[]
}

export async function getPostBySlug(slug: string): Promise<PostDoc | null> {
  const payloadClient = await payload()
  const result = await payloadClient.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    overrideAccess: false,
    depth: 2,
    limit: 1,
  })
  return (result.docs[0] as unknown as PostDoc) ?? null
}

export const TRACK_LABELS: Record<string, string> = {
  backend: 'Backend',
  'crm-automation': 'CRM Automation',
  frontend: 'Frontend',
  'full-stack': 'Full Stack',
  ai: 'AI',
  'game-dev': 'Game Dev',
}

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  client: 'Client work',
  professional: 'Professional',
  personal: 'Personal',
  academic: 'Academic / FYP',
}

export const DEPLOYMENT_LABELS: Record<string, string> = {
  deployed: 'In production',
  'not-deployed': 'Delivered',
  'in-progress': 'In progress',
}
