'use client'

import { AnimatePresence, motion } from 'motion/react'
import { MoreVertical, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from '@/components/ui/brand-icons'
import { cn } from '@/lib/utils'

/** Brand icons for the drawer footer, keyed by site.json social key. */
const SOCIAL_ICONS: Record<string, ReactNode> = {
  github: <GithubIcon className="h-[18px] w-[18px]" />,
  linkedin: <LinkedinIcon className="h-[18px] w-[18px]" />,
  instagram: <InstagramIcon className="h-[18px] w-[18px]" />,
}

interface MobileNavProps {
  nav: { label: string; href: string }[]
  socials: { key: string; label: string; href: string }[]
}

/**
 * Mobile navigation: a borderless three-dot button opening a
 * drawer that slides in from the right (backdrop blur, staggered
 * links, social icon buttons at the foot). Rendered only below
 * the `sm` breakpoint, where the header's inline nav is hidden.
 * Closes on backdrop tap, the X, Escape, or any link tap.
 */
export function MobileNav({ nav, socials }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open ])

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-y-0 right-0 z-[95] flex w-72 max-w-[85vw] flex-col border-l border-border bg-surface shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-end px-4 py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4">
                {nav.map((item, index) => {
                  const active = pathname === item.href
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.06, duration: 0.35 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'block rounded-lg px-3 py-2.5 transition-colors',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-primary/5',
                        )}
                      >
                        <span className="font-display text-xl font-medium">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="mt-auto flex items-center justify-center gap-2.5 px-6 py-5">
                {socials.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                  target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/40 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
                  >
                    {SOCIAL_ICONS[social.key]}
                  </a>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
