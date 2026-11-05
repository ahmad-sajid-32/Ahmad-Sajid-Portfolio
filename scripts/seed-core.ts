/**
 * Phase 2 seed — verified facts only (02-Profile-and-Form-Facts.md).
 * Idempotent: anything whose slug already exists is skipped.
 *
 * Run locally with the dev DATABASE_URL (tunnel) in the environment:
 *   npx tsx scripts/seed.ts
 */
import path from 'path'
import type { Payload } from 'payload'
import { fileURLToPath } from 'url'


const dirname = path.dirname(fileURLToPath(import.meta.url))

// --- Lexical helpers -------------------------------------------------------

type LexicalContent = ReturnType<typeof paragraphs>

function paragraphs(...texts: string[]) {
  return {
    root: {
      type: 'root',
      children: texts.map((text) => ({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text,
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function richSection(...texts: string[]) {
  return { body: paragraphs(...texts) }
}

function featuresBlock(items: string[]) {
  return { blockType: 'features', items: items.map((text) => ({ text })) }
}

// --- Seed data --------------------------------------------------------------

const technologies = [
  'Python',
  'FastAPI',
  'Node.js',
  'Express',
  'NestJS',
  'Next.js',
  'React',
  'TypeScript',
  'OpenAI API',
  'ElevenLabs',
  'Docker',
  'AWS',
  'PostgreSQL',
  'pgvector',
  'PHP',
  'Laravel',
]

const categories = ['Engineering', 'AI', 'Lessons Learned']

type ProjectSeed = {
  title: string
  tagline: string
  excerpt: string
  status: 'deployed' | 'not-deployed' | 'in-progress'
  projectType: 'client' | 'professional' | 'personal' | 'academic'
  tracks: string[]
  featured?: boolean
  role: string
  year: number
  publish: boolean
  tech: string[]
  content: Record<string, unknown>[]
  alt: string
}

const projects: ProjectSeed[] = [
  {
    title: 'MeMySelfI AI',
    tagline: 'An AI agent platform that answers, books and remembers — in production.',
    excerpt:
      'AI receptionist/agent platform built end to end: OpenAI tool-calling over self-built calendar, diary, budget and unified-inbox tools, with ElevenLabs voice. Deployed with Docker on AWS EC2 behind a self-built CI/CD pipeline and managed in live production.',
    status: 'deployed',
    projectType: 'personal',
    tracks: ['ai', 'backend', 'full-stack'],
    featured: true,
    role: 'Creator & lead developer',
    year: 2025,
    publish: true,
    tech: ['FastAPI', 'Express', 'Next.js', 'OpenAI API', 'ElevenLabs', 'Docker', 'AWS', 'PostgreSQL'],
    alt: 'Placeholder cover for MeMySelfI AI — amber monogram M on a dusk background',
    content: [
      {
        blockType: 'overview',
        ...richSection(
          'MeMySelfI is an AI agent platform I designed and built end to end. It combines a FastAPI and Express backend with a Next.js frontend, and its agents work through OpenAI tool-calling rather than canned replies: the agent can check a calendar, write to a diary, track a budget and search a unified inbox, because I built those tools for it to call.',
          'Voice is part of the product, not a demo add-on — ElevenLabs gives the agent a spoken presence for receptionist-style conversations.',
        ),
      },
      {
        blockType: 'solution',
        ...richSection(
          'The system is split by responsibility: FastAPI services where Python is strongest, Express where the JavaScript ecosystem fits better, and a single Next.js surface for the user. Every capability the agent has is an explicit, testable tool with a narrow contract — that discipline is what makes the agent reliable enough to leave running.',
        ),
      },
      featuresBlock([
        'OpenAI tool-calling over self-built calendar, diary, budget and unified-inbox tools',
        'ElevenLabs voice for spoken, receptionist-style conversations',
        'FastAPI + Express services behind a Next.js frontend',
        'Dockerised deployment on AWS EC2 with a self-built CI/CD pipeline',
        'Operated and managed in live production',
      ]),
      {
        blockType: 'outcome',
        ...richSection(
          'MeMySelfI ran in live production — the strongest test any system gets. Running it taught me the operational half of AI engineering: monitoring what the agent actually does, pricing the APIs it depends on, and designing tools so failures are visible instead of silent.',
        ),
      },
    ],
  },
  {
    title: 'Emilly',
    tagline: 'An AI receptionist that handles the front desk.',
    excerpt:
      'AI receptionist built on NestJS and Next.js — greeting, routing and answering for businesses that cannot staff a front desk around the clock.',
    status: 'not-deployed',
    projectType: 'professional',
    tracks: ['ai', 'full-stack'],
    role: 'Full-stack developer',
    year: 2025,
    publish: true,
    tech: ['NestJS', 'Next.js', 'TypeScript', 'OpenAI API'],
    alt: 'Placeholder cover for Emilly — amber monogram E on a dusk background',
    content: [
      {
        blockType: 'overview',
        ...richSection(
          'Emilly is an AI receptionist: it greets visitors, understands what they need, and routes or answers accordingly. The backend is NestJS — its module system suits a service with many small, well-separated responsibilities — with a Next.js frontend for configuration and review.',
        ),
      },
      featuresBlock([
        'NestJS backend with a modular service structure',
        'Next.js admin and configuration frontend',
        'Conversational intake and routing flows',
      ]),
    ],
  },
  {
    title: 'LaForme',
    tagline: 'A booking platform, delivered as named project lead.',
    excerpt:
      'Booking platform built on NestJS and Next.js. I was the named project lead — owning delivery across the backend services and the web experience.',
    status: 'not-deployed',
    projectType: 'professional',
    tracks: ['full-stack', 'backend'],
    featured: true,
    role: 'Named project lead',
    year: 2025,
    publish: true,
    tech: ['NestJS', 'Next.js', 'TypeScript', 'PostgreSQL'],
    alt: 'Placeholder cover for LaForme — amber monogram L on a dusk background',
    content: [
      {
        blockType: 'overview',
        ...richSection(
          'LaForme is a booking platform: customers discover, book and manage appointments, and the business runs its side of the schedule from the same system. NestJS powers the backend; Next.js carries both the customer and operator experiences.',
          'I was the named project lead on LaForme — the person accountable for the plan, the build order and the hand-over, not just a contributor to it.',
        ),
      },
      featuresBlock([
        'Customer booking flows with schedule management',
        'Operator side for running the business day to day',
        'NestJS services with a Next.js frontend',
      ]),
    ],
  },
  {
    title: 'Total Store',
    tagline: 'A 14-module back-office platform for a retail business.',
    excerpt:
      'Back-office platform for a retail store — 14 modules on PHP/Laravel covering the daily operations of the business. I led its delivery and wrote the 13-page client user guide that came with it.',
    status: 'not-deployed',
    projectType: 'professional',
    tracks: ['backend'],
    role: 'Led delivery',
    year: 2025,
    publish: true,
    tech: ['PHP', 'Laravel'],
    alt: 'Placeholder cover for Total Store — amber monogram T on a dusk background',
    content: [
      {
        blockType: 'overview',
        ...richSection(
          'Total Store is the back-office system of a retail business: fourteen modules covering the operations a store runs on every day, built on PHP and Laravel — a deliberate, boring-technology choice for a system that has to be dependable and maintainable.',
          'I led the delivery of the platform, and when it shipped I wrote the 13-page user guide the client\u2019s team actually works from. Software is not delivered until the people using it can use it.',
        ),
      },
      featuresBlock([
        '14 modules covering daily store operations',
        'PHP/Laravel — chosen for dependability and maintainability',
        '13-page client user guide written for the hand-over',
      ]),
    ],
  },
  {
    title: 'UAF Smart E-Library',
    tagline: 'Final-year project: a library system that answers questions, not just searches.',
    excerpt:
      'Final-year project at UAF. I built the frontend and added a RAG retrieval layer with pgvector, so students can ask questions and get answers grounded in the library\u2019s own material.',
    status: 'not-deployed',
    projectType: 'academic',
    tracks: ['ai', 'frontend'],
    featured: true,
    role: 'Frontend developer; built the RAG retrieval layer',
    year: 2026,
    publish: true,
    tech: ['Next.js', 'React', 'PostgreSQL', 'pgvector'],
    alt: 'Placeholder cover for UAF Smart E-Library — amber monogram U on a dusk background',
    content: [
      {
        blockType: 'overview',
        ...richSection(
          'The Smart E-Library was my final-year project at the University of Agriculture Faisalabad. I built the frontend, and gave the library a retrieval layer most student projects never attempt: documents are embedded and stored in PostgreSQL with pgvector, so a student\u2019s question retrieves the passages that actually answer it.',
          'It is retrieval-augmented generation done plainly — chunk, embed, retrieve by similarity, answer from the retrieved text — which keeps the answers grounded in the library\u2019s material instead of the model\u2019s imagination.',
        ),
      },
      featuresBlock([
        'RAG pipeline: chunking, embeddings, pgvector similarity search',
        'Answers grounded in retrieved library material',
        'Frontend designed and built end to end',
      ]),
    ],
  },
  {
    title: 'PharmaSync',
    tagline: 'A pharmacy system with a frontend built for the counter, not the desk.',
    excerpt:
      'Pharmacy management system — I built the frontend, designed around the speed and clarity a pharmacy counter actually needs.',
    status: 'not-deployed',
    projectType: 'professional',
    tracks: ['frontend'],
    role: 'Frontend developer',
    year: 2025,
    publish: true,
    tech: ['React', 'TypeScript'],
    alt: 'Placeholder cover for PharmaSync — amber monogram P on a dusk background',
    content: [
      {
        blockType: 'overview',
        ...richSection(
          'PharmaSync is a pharmacy management system. My part was the frontend — the screens the staff work on all day — built to be fast to scan and hard to misuse, because pharmacy work happens at a counter, under time pressure, with a queue watching.',
        ),
      },
      featuresBlock([
        'Frontend built for counter-speed workflows',
        'Component-based React interface',
      ]),
    ],
  },
  {
    title: 'FleetSlot',
    tagline: 'Fleet scheduling — details being finalised.',
    excerpt:
      'A fleet scheduling project. This entry is seeded as a draft while its facts (stack, role, links) are confirmed — the published catalog only carries verified details.',
    status: 'in-progress',
    projectType: 'personal',
    tracks: ['backend'],
    role: 'Developer',
    year: 2024,
    publish: false,
    tech: [],
    alt: 'Placeholder cover for FleetSlot — amber monogram F on a dusk background',
    content: [],
  },
]

type PostSeed = {
  title: string
  excerpt: string
  category: string
  tags: string[]
  body: string[]
}

const posts: PostSeed[] = [
  {
    title: 'Deploying MeMySelfI: Docker on AWS EC2 with a CI/CD pipeline I built myself',
    excerpt:
      'How my AI agent platform got from laptop to live production: containerised with Docker, running on a single EC2 instance, with a pipeline I assembled myself — and what operating it taught me.',
    category: 'Engineering',
    tags: ['docker', 'aws', 'ci-cd', 'production'],
    body: [
      'MeMySelfI — my AI agent platform — only became a real product the day it stopped running on my laptop. The deployment I chose was deliberately unfashionable: one Docker image, one AWS EC2 instance, and a CI/CD pipeline I put together myself instead of reaching for a platform that hides the moving parts.',
      'Containerising the services first forced the discipline everything else depends on: configuration through environment variables, no state hiding on the local filesystem, and a build that behaves the same on my machine as it does on the server. Once the image is trustworthy, EC2 is the simple part — pull, run, and keep the host boring.',
      'The pipeline exists because manual deploys are where mistakes breed. Building it myself — rather than inheriting a template — meant I understood every step the day something failed, which it did, and I could fix the step instead of fearing the whole chain.',
      'The lesson that stayed with me: production is a feature. Agent code gets the attention, but the Docker file, the pipeline and the restart behaviour are what users actually experience.',
    ],
  },
  {
    title: 'RAG with pgvector: how the UAF Smart E-Library answers questions',
    excerpt:
      'My final-year project needed answers grounded in the library\u2019s own documents, not a chatbot\u2019s guesses. Here is the plain, working recipe: chunk, embed, store in pgvector, retrieve, answer.',
    category: 'AI',
    tags: ['rag', 'pgvector', 'postgresql', 'fyp'],
    body: [
      'The UAF Smart E-Library had a simple brief with a hard edge: students should be able to ask a question and get an answer drawn from the library\u2019s material — not a fluent paragraph the model invented. That constraint is the whole architecture.',
      'The pipeline is plain on purpose. Documents are split into chunks small enough to be specific, each chunk is embedded into a vector, and the vectors live in PostgreSQL through the pgvector extension — the same database as everything else, because a final-year project does not need a second datastore to babysit. A question is embedded the same way, and similarity search returns the handful of chunks that genuinely bear on it.',
      'Those chunks become the context for generation. The model\u2019s job shrinks from "know everything" to "answer from this evidence", which is a job it can actually be trusted with. When retrieval finds nothing relevant, the honest answer is that the material does not cover it.',
      'If I rebuilt it today I would add evaluation — a fixed set of questions with known answers, scored on every change — but the shape would stay the same: retrieval first, generation second, grounding always.',
    ],
  },
  {
    title: 'The embedding bill: an early n8n lesson I now apply everywhere',
    excerpt:
      'Early in my career I wired an expensive third-party embedding service into a client\u2019s n8n workflow without checking its pricing — and the client paid for my assumption. What changed in how I work after that.',
    category: 'Lessons Learned',
    tags: ['n8n', 'automation', 'pricing', 'process'],
    body: [
      'On one of my first automation projects, I connected an n8n workflow to a third-party embedding service because it was well-known and easy to wire up. What I did not do was read its pricing page properly — or model what our actual usage would cost. The workflow worked beautifully. The bill did not.',
      'The client took a loss on my assumption, and I owned my part of it: I migrated the workflow to a cheaper alternative immediately, and the project recovered. But the lesson cost more than the invoice, and it should have.',
      'Since that day, pricing is part of my design step, not an afterthought. Before any third-party service goes into a system, I check its price page, its rate limits and its free tier, and I estimate the cost at the usage the system will really see. Tool-calling agents and embedding pipelines can spend money while nobody is watching — the design has to include the meter.',
      'It is the same habit as checking a library\u2019s licence or a database\u2019s limits before building on it: verify the constraints first, because "it works" is only half of "it is fit to ship".',
    ],
  },
]

// --- Runner ------------------------------------------------------------------

export async function runSeed(payload: Payload) {

  const findBySlug = async (collection: string, slug: string) => {
    const result = await payload.find({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: collection as any,
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return result.docs[0]
  }

  const techIds = new Map<string, number>()
  for (const name of technologies) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const existing = await findBySlug('technologies', slug)
    if (existing) {
      techIds.set(name, existing.id as number)
      continue
    }
    const created = await payload.create({
      collection: 'technologies',
      data: { name },
    })
    techIds.set(name, created.id as number)
    console.log('technology:', name)
  }

  const categoryIds = new Map<string, number>()
  for (const name of categories) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const existing = await findBySlug('post-categories', slug)
    if (existing) {
      categoryIds.set(name, existing.id as number)
      continue
    }
    const created = await payload.create({
      collection: 'post-categories',
      data: { name },
    })
    categoryIds.set(name, created.id as number)
    console.log('category:', name)
  }

  const coverMediaId = async (project: ProjectSeed): Promise<number> => {
    const filename = `${project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}.png`
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })
    if (existing.docs[0]) {
      return existing.docs[0].id as number
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt: project.alt },
      filePath: path.join(dirname, 'covers', filename),
    })
    console.log('media cover:', filename)
    return created.id as number
  }

  for (const project of projects) {
    const slug = project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    if (await findBySlug('projects', slug)) {
      console.log('project exists, skipping:', slug)
      continue
    }
    const coverImage = await coverMediaId(project)
    await payload.create({
      collection: 'projects',
      // Drafts skip required-field validation (FleetSlot's stack is
      // intentionally unconfirmed — see PLAN.md open items).
      draft: !project.publish,
      data: {
        title: project.title,
        tagline: project.tagline,
        excerpt: project.excerpt,
        deploymentStatus: project.status,
        projectType: project.projectType,
        tracks: project.tracks,
        featured: Boolean(project.featured),
        coverImage,
        techStack: project.tech.map((name) => techIds.get(name)!).filter(Boolean),
        role: project.role,
        year: project.year,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: project.content as any,
        _status: project.publish ? 'published' : 'draft',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })
    console.log('project:', slug, project.publish ? '(published)' : '(draft)')
  }

  for (const post of posts) {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
    if (await findBySlug('posts', slug)) {
      console.log('post exists, skipping:', slug)
      continue
    }
    // Posts are seeded as drafts (Ahmad publishes) and need a cover:
    // reuse the blog-generic placeholder generated alongside covers.
    const cover = await payload.find({
      collection: 'media',
      where: { filename: { equals: 'blog-cover.png' } },
      limit: 1,
    })
    let coverId = cover.docs[0]?.id as number | undefined
    if (!coverId) {
      const created = await payload.create({
        collection: 'media',
        data: { alt: 'Placeholder blog cover — amber ring on a dusk background' },
        filePath: path.join(dirname, 'covers', 'blog-cover.png'),
      })
      coverId = created.id as number
      console.log('media cover: blog-cover.png')
    }
    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        excerpt: post.excerpt,
        coverImage: coverId,
        content: paragraphs(...post.body) as LexicalContent,
        category: categoryIds.get(post.category)!,
        tags: post.tags.map((tag) => ({ tag })),
        _status: 'draft',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })
    console.log('post (draft):', slug)
  }

  console.log('Seed complete.')
}
