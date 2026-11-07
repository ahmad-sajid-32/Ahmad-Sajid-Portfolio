import { Globe, Mail, Phone } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  UpworkIcon,
  WhatsappIcon,
  XIcon,
  YoutubeIcon,
} from './brand-icons'

/**
 * Platform key → icon, shared by every social surface (hero
 * badges, mobile drawer, footer, contact page). Keys match
 * the Socials global's platform select in Payload and the
 * site.json fallback set. Fiverr has no Simple Icons glyph
 * in use here, so it renders as the "fi" monogram like
 * before; Email/Phone/Website use Lucide.
 */
const ICON_CLASS = 'h-[18px] w-[18px]'

export const SOCIAL_ICONS: Record<string, ReactNode> = {
  github: <GithubIcon className={ICON_CLASS} />,
  linkedin: <LinkedinIcon className={ICON_CLASS} />,
  instagram: <InstagramIcon className={ICON_CLASS} />,
  facebook: <FacebookIcon className={ICON_CLASS} />,
  fiverr: <span className="font-display text-[13px] font-bold italic">fi</span>,
  upwork: <UpworkIcon className={ICON_CLASS} />,
  x: <XIcon className={ICON_CLASS} />,
  youtube: <YoutubeIcon className={ICON_CLASS} />,
  whatsapp: <WhatsappIcon className={ICON_CLASS} />,
  email: <Mail className={ICON_CLASS} />,
  phone: <Phone className={ICON_CLASS} />,
  website: <Globe className={ICON_CLASS} />,
}
