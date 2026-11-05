import { getSiteContent } from '@/lib/content'

export function SiteFooter() {
  const site = getSiteContent()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {site.location}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{site.footerText}</p>
        </div>
        <div className="flex gap-5">
          {site.socials.map((social) => (
            <a
              key={social.key}
              href={social.href}
              className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              {...(social.href.startsWith('http')
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
