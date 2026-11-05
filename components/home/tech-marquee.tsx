import { Database } from 'lucide-react'

import { TECH_ICONS } from '@/components/ui/tech-icons'
import type { TechnologyName } from '@/lib/data'

/** Payload slug → Simple Icons key in TECH_ICONS. */
const ICON_KEYS: Record<string, string> = {
  python: 'python',
  typescript: 'typescript',
  'node-js': 'nodedotjs',
  fastapi: 'fastapi',
  nestjs: 'nestjs',
  express: 'express',
  'next-js': 'nextdotjs',
  react: 'react',
  postgresql: 'postgresql',
  php: 'php',
  laravel: 'laravel',
  docker: 'docker',
  aws: 'amazonwebservices',
  'openai-api': 'openai',
  elevenlabs: 'elevenlabs',
}

/** Display order: languages & runtimes, frameworks, data, platform. */
const ORDER = [
  'python',
  'typescript',
  'node-js',
  'fastapi',
  'nestjs',
  'express',
  'next-js',
  'react',
  'postgresql',
  'pgvector',
  'php',
  'laravel',
  'docker',
  'aws',
  'openai-api',
  'elevenlabs',
]

function MarqueeRow({ technologies, hidden }: { technologies: TechnologyName[]; hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {technologies.map((tech) => {
        const icon = TECH_ICONS[ICON_KEYS[tech.slug] ?? '']
        return (
          <span
            key={tech.slug}
            className="mx-7 flex items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-primary sm:mx-9"
          >
            <span className="flex h-7 w-7 items-center justify-center">
              {icon ?? <Database className="h-6 w-6" aria-hidden="true" />}
            </span>
            <span className="text-[15px] font-medium whitespace-nowrap">{tech.name}</span>
          </span>
        )
      })}
    </div>
  )
}

/**
 * Tech-stack logo marquee directly under the hero: every technology
 * from Payload with its brand glyph, in theme colours (muted by
 * default, amber on hover), scrolling endlessly on a duplicated
 * track. Pauses on hover; the edge fade keeps it feeling boundless.
 * Under reduced motion the track rests and can be scrolled.
 */
export function TechMarquee({ technologies }: { technologies: TechnologyName[] }) {
  const ordered = [...technologies].sort(
    (a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug),
  )

  return (
    <section aria-label="Tech stack" className="overflow-hidden border-b border-border py-7">
      <div className="group relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <MarqueeRow technologies={ordered} />
          <MarqueeRow technologies={ordered} hidden />
        </div>
      </div>
    </section>
  )
}
