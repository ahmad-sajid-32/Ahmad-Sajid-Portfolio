import uafLogo from '@/assets/portraits/uaf-logo.png'
import universityOfOkaraLogo from '@/assets/portraits/university-of-okara-logo.jpg'
import ctaPaperPlane from '@/assets/portraits/cta-paper-plane.webp'
import ctaPaperPlaneDawn from '@/assets/portraits/cta-paper-plane-dawn.webp'
import heroPortrait from '@/assets/portraits/hero-portrait.png'
import heroPortraitDawn from '@/assets/portraits/hero-portrait-dawn.png'
import heroPortraitStudio from '@/assets/portraits/hero-portrait-studio.png'
import heroPortraitStudioDawn from '@/assets/portraits/hero-portrait-studio-dawn.png'

/**
 * Fixed brand imagery — the hero/About portraits and the
 * contact-CTA paper-plane art — lives in the repo under
 * assets/portraits/ and is imported statically, so Next.js
 * serves it from its own static pipeline with automatic blur
 * placeholders: no CMS round-trip and no storage bucket.
 * CMS-managed imagery (project and blog covers) still comes
 * from Payload media.
 */
export const IMAGES = {
  heroPortrait,
  heroPortraitDawn,
  heroPortraitStudio,
  heroPortraitStudioDawn,
  ctaPaperPlane,
  ctaPaperPlaneDawn,
} as const

/**
 * University emblems for the About education cards, keyed by
 * the `logo` slug in about.json. Same static-import route as
 * the brand imagery: they live in assets/portraits/ alongside
 * the portraits (the folder Ahmad uploads brand files to).
 */
export const EDUCATION_LOGOS = {
  uaf: uafLogo,
  'university-of-okara': universityOfOkaraLogo,
} as const

export type EducationLogoSlug = keyof typeof EDUCATION_LOGOS
