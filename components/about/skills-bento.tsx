import { Bot, Braces, Terminal } from 'lucide-react'
import type { ComponentType } from 'react'

import { ScrollSlide } from '@/components/motion/scroll-slide'
import { TECH_ICONS } from '@/components/ui/tech-icons'
import type { AboutContent } from '@/lib/content.types'

type SkillGroup = AboutContent['skillGroups'][number]

/**
 * Skill name -> Simple Icons key in TECH_ICONS. Skills that
 * are concepts rather than brands use a Lucide glyph instead
 * (LUCIDE_ICONS); anything unmapped keeps the amber dot.
 */
const GLYPH_KEYS: Record<string, string> = {
  Python: 'python',
  FastAPI: 'fastapi',
  Flask: 'flask',
  'Node.js': 'nodedotjs',
  NestJS: 'nestjs',
  Express: 'express',
  PHP: 'php',
  Laravel: 'laravel',
  TypeScript: 'typescript',
  JavaScript: 'javascript',
  'React.js': 'react',
  'Next.js': 'nextdotjs',
  HTML: 'html5',
  CSS: 'css',
  'Tailwind CSS': 'tailwindcss',
  Bootstrap: 'bootstrap',
  PostgreSQL: 'postgresql',
  MySQL: 'mysql',
  MongoDB: 'mongodb',
  Docker: 'docker',
  AWS: 'amazonwebservices',
  Supabase: 'supabase',
  Vercel: 'vercel',
  Render: 'render',
  Git: 'git',
  GitHub: 'github',
  n8n: 'n8n',
  Zapier: 'zapier',
  Make: 'make',
  'Zoho CRM': 'zoho',
  HubSpot: 'hubspot',
}

const LUCIDE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  'REST APIs': Braces,
  'AI Agents': Bot,
  'Prompt Engineering': Terminal,
}

function SkillBadge({
  name,
  large = false,
}: {
  name: string
  large?: boolean
}) {
  const glyph = TECH_ICONS[GLYPH_KEYS[name] ?? '']
  const LucideIcon = LUCIDE_ICONS[name]
  return (
    <span
      className={`flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 font-mono tracking-[0.14em] whitespace-nowrap text-foreground/90 uppercase ${
        large ? 'px-3 py-2 text-[11px]' : 'px-2 py-1.5 text-[10px]'
      }`}
    >
      {glyph ? (
        <span className="h-3.5 w-3.5 shrink-0 text-primary">{glyph}</span>
      ) : LucideIcon ? (
        <LucideIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
      ) : (
        <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
      )}
      {name}
    </span>
  )
}

const TILE_TINTS = [
  'border-primary/40 bg-gradient-to-br from-primary/15 via-surface to-surface',
  'border-highlight/40 bg-gradient-to-br from-highlight/10 via-surface to-surface',
] as const

const ACCENT_TINTS = ['text-primary', 'text-highlight'] as const

/**
 * "What I work with" as a bento grid (Ahmad's pick, W2 with
 * uniform badges): featured groups (Backend, AI & Automation)
 * get wide tinted tiles with an accent eyebrow and a 3-wide
 * badge lattice; the other groups get standard tiles with a
 * 2-wide lattice. Every badge fills its grid cell so the
 * columns line up uniformly instead of flowing ragged.
 */
export function SkillsBento({ groups }: { groups: SkillGroup[] }) {
  let featuredSeen = 0
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, index) => {
        const featured = group.featured === true
        const tintIndex = featured ? featuredSeen++ % TILE_TINTS.length : -1
        return (
          <ScrollSlide
            key={group.title}
            from="left"
            delay={index * 0.1}
            className={featured ? 'h-full sm:col-span-2' : 'h-full'}
          >
            <div
              className={`h-full rounded-3xl border p-6 sm:p-7 ${
                featured
                  ? TILE_TINTS[tintIndex]
                  : 'border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/50'
              }`}
            >
              {group.accent ? (
                <p
                  className={`font-mono text-[10px] tracking-[0.2em] uppercase ${
                    featured ? ACCENT_TINTS[tintIndex] : 'text-primary'
                  }`}
                >
                  {group.accent}
                </p>
              ) : null}
              <h3
                className={`font-display font-semibold tracking-tight ${
                  group.accent ? 'mt-2' : ''
                } ${featured ? 'text-3xl' : 'text-2xl'}`}
              >
                {group.title}
              </h3>
              <div
                className={`grid gap-2 ${featured ? 'mt-5' : 'mt-4'} ${
                  featured ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'
                }`}
              >
                {group.skills.map((skill) => (
                  <SkillBadge key={skill} name={skill} large={featured} />
                ))}
              </div>
            </div>
          </ScrollSlide>
        )
      })}
    </div>
  )
}
