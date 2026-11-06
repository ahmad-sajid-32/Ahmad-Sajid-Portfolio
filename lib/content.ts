import { z } from 'zod'

import aboutJson from '@/content/about.json'
import contactJson from '@/content/contact.json'
import homeJson from '@/content/home.json'
import siteJson from '@/content/site.json'

import type {
  AboutContent,
  ContactContent,
  HomeContent,
  SiteContent,
} from './content.types'

/**
 * JSON data houses (ARCHITECTURE §10). Every content file is parsed
 * through its Zod schema the moment this module is imported — which
 * happens during `next build` — so a missing key or wrong type fails
 * the build instead of rendering a blank section in production.
 */

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

const siteSchema = z.object({
  name: z.string().min(1),
  roles: z.array(z.string().min(1)).min(1),
  location: z.string().min(1),
  availability: z.string().min(1),
  nav: z.array(linkSchema).min(1),
  socials: z.array(
    z.object({
      key: z.string().min(1),
      label: z.string().min(1),
      href: z.string().min(1),
    }),
  ),
  footerText: z.string().min(1),
  defaultSeo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
})

const homeSchema = z.object({
  hero: z.object({
    greeting: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    giantWord: z.string().min(1),
    portraitUrl: z.string().min(1),
    portraitLightUrl: z.string().min(1),
    circlePortraitUrl: z.string().min(1),
    circlePortraitLightUrl: z.string().min(1),
    portraitAlt: z.string().min(1),
    statement: z.string().min(1),
    stats: z
      .array(
        z.object({
          key: z.string().min(1),
          label: z.string().min(1),
        }),
      )
      .min(1),
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
  }),
  intro: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    aboutCta: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
  }),
  expertise: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        chips: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
  sections: z.object({
    featuredProjects: z.string().min(1),
    allProjects: z.string().min(1),
    latestPosts: z.string().min(1),
    contactCta: z.object({
      heading: z.string().min(1),
      body: z.string().min(1),
      label: z.string().min(1),
      href: z.string().min(1),
    }),
  }),
})

const aboutSchema = z.object({
  heading: z.string().min(1),
  bio: z.array(z.string().min(1)).min(1),
  experience: z.array(
    z.object({
      role: z.string().min(1),
      company: z.string().min(1),
      period: z.string().min(1),
      summary: z.string().min(1),
    }),
  ),
  education: z.array(
    z.object({
      title: z.string().min(1),
      institution: z.string().min(1),
      period: z.string().min(1),
      summary: z.string().min(1),
    }),
  ),
  skillGroups: z.array(
    z.object({
      title: z.string().min(1),
      skills: z.array(z.string().min(1)).min(1),
    }),
  ),
  certificates: z.array(
    z.object({
      name: z.string().min(1),
      issuer: z.string().min(1),
      year: z.string().min(1),
    }),
  ),
})

const contactSchema = z.object({
  heading: z.string().min(1),
  intro: z.string().min(1),
  form: z.object({
    nameLabel: z.string().min(1),
    emailLabel: z.string().min(1),
    subjectLabel: z.string().min(1),
    messageLabel: z.string().min(1),
    submitLabel: z.string().min(1),
    successMessage: z.string().min(1),
    errorMessage: z.string().min(1),
  }),
  emailCard: z.object({
    label: z.string().min(1),
    address: z.string().email(),
  }),
  socialsHeading: z.string().min(1),
})

export function getSiteContent(): SiteContent {
  return siteSchema.parse(siteJson)
}

export function getHomeContent(): HomeContent {
  return homeSchema.parse(homeJson)
}

export function getAboutContent(): AboutContent {
  return aboutSchema.parse(aboutJson)
}

export function getContactContent(): ContactContent {
  return contactSchema.parse(contactJson)
}
