export interface ContentLink {
  label: string
  href: string
}

export interface SiteContent {
  name: string
  roles: string[]
  location: string
  availability: string
  nav: ContentLink[]
  socials: (ContentLink & { key: string })[]
  footerText: string
  defaultSeo: {
    title: string
    description: string
  }
}

export interface HomeContent {
  hero: {
    greeting: string
    name: string
    role: string
    giantWord: string
    portraitUrl: string
    portraitLightUrl: string
    circlePortraitUrl: string
    circlePortraitLightUrl: string
    portraitAlt: string
    statement: string
    stats: {
      key: string
      label: string
    }[]
    primaryCta: ContentLink
    secondaryCta: ContentLink
  }
  intro: {
    heading: string
    body: string
    aboutCta: {
      label: string
      href: string
    }
  }
  expertise: {
    title: string
    body: string
    chips: string[]
  }[]
  sections: {
    featuredProjects: string
    latestPosts: string
    contactCta: {
      heading: string
      body: string
      label: string
      href: string
    }
  }
}

export interface AboutContent {
  heading: string
  bio: string[]
  experience: {
    role: string
    company: string
    period: string
    summary: string
  }[]
  education: {
    title: string
    institution: string
    period: string
    summary: string
  }[]
  skillGroups: {
    title: string
    skills: string[]
  }[]
  certificates: {
    name: string
    issuer: string
    year: string
  }[]
}

export interface ContactContent {
  heading: string
  intro: string
  form: {
    nameLabel: string
    emailLabel: string
    subjectLabel: string
    messageLabel: string
    submitLabel: string
    successMessage: string
    errorMessage: string
  }
  emailCard: {
    label: string
    address: string
  }
  socialsHeading: string
}
