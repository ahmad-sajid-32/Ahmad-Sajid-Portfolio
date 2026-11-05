import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Contact form endpoint. Verifies the Cloudflare Turnstile token
 * (when TURNSTILE_SECRET_KEY is configured), then stores the message
 * as a Payload contact submission — which fires the notification
 * email hook. Without a secret key (local dev), verification is
 * skipped; production must always set it.
 */

interface SubmitBody {
  name?: string
  email?: string
  subject?: string
  message?: string
  turnstileToken?: string
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return true
  }
  if (!token) {
    return false
  }
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
      },
    )
    const data = (await response.json()) as { success?: boolean }
    return data.success === true
  } catch {
    // Fail closed: an unverifiable visitor is treated as unverified.
    return false
  }
}

export async function POST(request: Request) {
  let body: SubmitBody
  try {
    body = (await request.json()) as SubmitBody
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const subject = body.subject?.trim() ?? ''
  const message = body.message?.trim() ?? ''

  if (!name || !email || !subject || !message || !email.includes('@')) {
    return Response.json(
      { ok: false, error: 'Please complete every field with a valid email.' },
      { status: 400 },
    )
  }

  const human = await verifyTurnstile(body.turnstileToken ?? '')
  if (!human) {
    return Response.json(
      { ok: false, error: 'Verification failed. Please try again.' },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config })
  await payload.create({
    collection: 'contact-submissions',
    data: { name, email, subject, message },
  })

  return Response.json({ ok: true })
}
