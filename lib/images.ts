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
