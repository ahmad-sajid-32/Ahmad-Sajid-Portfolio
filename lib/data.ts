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

export interface SocialLink {
  key: string
  label: string
  href: string
}

const PLATFORM_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  fiverr: 'Fiverr',
  upwork: 'Upwork',
  x: 'X',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  email: 'Email',
  phone: 'Phone',
  website: 'Website',
}

/**
 * Social & contact-channel links from the Socials global
 * (Payload admin → Globals → Social Links) — the single
 * source every social surface renders from: footer, contact
 * page, hero/drawer subsets, Person JSON-LD. Links are
 * managed in the CMS; if the global is empty or unreadable,
 * the site.json set is the fallback so the site never loses
 * its links.
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const payloadClient = await payload()
    const global = (await payloadClient.findGlobal({
      slug: 'socials',
      overrideAccess: false,
      depth: 0,
    })) as unknown as {
      links?: { platform?: string; url?: string; label?: string | null }[] | null
    }
    const links = (global.links ?? [])
      .filter((link) => link?.platform && link?.url)
      .map((link) => ({
        key: link.platform as string,
        label: link.label || PLATFORM_LABELS[link.platform as string] || (link.platform as string),
        href: link.url as string,
      }))
    if (links.length > 0) return links
  } catch {
    // Fall through to the static fallback below.
  }
  const { getSiteContent } = await import('./content')
  return getSiteContent().socials.map((social) => ({
    key: social.key,
    label: social.label,
    href: social.href,
  }))
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
  // All featured projects: the home section is a coverflow
  // carousel, so every featured project rotates through.
  return projects.filter((project) => project.featured)
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

export interface TechnologyName {
  name: string
  slug: string
}

/** All technologies (name + slug) for logo strips and indexes. */
export async function getTechnologies(): Promise<TechnologyName[]> {
  const payloadClient = await payload()
  const result = await payloadClient.find({
    collection: 'technologies',
    limit: 100,
    sort: 'name',
    overrideAccess: false,
  })
  return result.docs.map((doc) => ({ name: doc.name, slug: doc.slug }))
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

// Label maps live in lib/labels.ts (client-safe); re-exported
// here so existing server-side imports keep working.
export {
  DEPLOYMENT_LABELS,
  PROJECT_TYPE_LABELS,
  TRACK_LABELS,
} from './labels'
