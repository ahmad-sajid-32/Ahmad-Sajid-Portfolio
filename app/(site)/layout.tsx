import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono, Manrope } from 'next/font/google'

import { ThemeToggle } from '@/components/layout/theme-toggle'

import '../globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Ahmad Sajid — Software Engineer',
  description:
    'Backend, AI agents and automation. Portfolio of Ahmad Sajid, software engineer based in Lahore, Pakistan.',
}

// Runs before first paint: stored choice wins, then system preference,
// then Dusk (dark) as the default. Mirrors components/layout/theme-toggle.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dusk':(window.matchMedia('(prefers-color-scheme: light)').matches?false:true);document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${manrope.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <span className="font-mono text-xs tracking-[0.18em] uppercase">
              Ahmad Sajid
            </span>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-4">
            <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Lahore / Remote
            </span>
          </div>
        </footer>
      </body>
    </html>
  )
}
