'use client'

import Script from 'next/script'
import { useState } from 'react'

import { ScrollSlide } from '@/components/motion/scroll-slide'
import type { ContactContent } from '@/lib/content.types'

type FormState = 'idle' | 'sending' | 'sent' | 'error'

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40'

const labelClass =
  'font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase'

interface ContactFormProps {
  form: ContactContent['form']
  /** Public Turnstile site key; when set, the widget renders and the
   * server verifies its token before storing the message. */
  turnstileSiteKey?: string
}

export function ContactForm({ form, turnstileSiteKey }: ContactFormProps) {
  const [state, setState] = useState<FormState>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const data = new FormData(formElement)
    setState('sending')
    try {
      const response = await fetch('/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
          turnstileToken: data.get('cf-turnstile-response') ?? undefined,
        }),
      })
      if (!response.ok) {
        throw new Error('Submission failed')
      }
      setState('sent')
      formElement.reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6">
        <p className="font-medium text-success">{form.successMessage}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ScrollSlide from="left">
        <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className={labelClass}>
            {form.nameLabel}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className={labelClass}>
            {form.emailLabel}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
          </div>
        </div>
      </ScrollSlide>
      <ScrollSlide from="left" delay={0.08}>
        <div className="space-y-2">
          <label htmlFor="contact-subject" className={labelClass}>
            {form.subjectLabel}
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            className={inputClass}
          />
        </div>
      </ScrollSlide>
      <ScrollSlide from="left" delay={0.16}>
        <div className="space-y-2">
          <label htmlFor="contact-message" className={labelClass}>
            {form.messageLabel}
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            className={inputClass}
          />
        </div>
      </ScrollSlide>
      {turnstileSiteKey ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
          />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
        </>
      ) : null}
      {state === 'error' ? (
        <p className="text-sm text-destructive">{form.errorMessage}</p>
      ) : null}
      <ScrollSlide from="left" delay={0.24}>
        <button
          type="submit"
          disabled={state === 'sending'}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {state === 'sending' ? 'Sending…' : form.submitLabel}
        </button>
      </ScrollSlide>
    </form>
  )
}
