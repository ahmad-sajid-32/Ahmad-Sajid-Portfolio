import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono, Manrope } from 'next/font/google'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteLoader } from '@/components/layout/site-loader'
import { Cursor } from '@/components/motion/cursor'
import { LenisProvider } from '@/components/motion/lenis-provider'
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
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.defaultSeo.title,
    description: site.defaultSeo.description,
    url: 'https://ahmad-sajid.vercel.app',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.defaultSeo.title,
    description: site.defaultSeo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <SiteLoader />
        <LenisProvider />
        <Cursor />
        <SiteHeader />
        <main className="w-full overflow-x-clip">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
