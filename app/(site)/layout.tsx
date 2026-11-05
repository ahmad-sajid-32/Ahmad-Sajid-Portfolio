import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono, Manrope } from 'next/font/google'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { getSiteContent } from '@/lib/content'

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

const site = getSiteContent()

export const metadata: Metadata = {
  metadataBase: new URL('https://ahmad-sajid.vercel.app'),
  title: {
    default: site.defaultSeo.title,
    template: '%s — Ahmad Sajid',
  },
  description: site.defaultSeo.description,
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
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
