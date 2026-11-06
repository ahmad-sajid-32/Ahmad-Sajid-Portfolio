/**
 * Display labels for Payload enum values. Kept in this
 * client-safe module (no server imports) so client components
 * can use them without pulling the Payload config into the
 * browser bundle; lib/data.ts re-exports them for its existing
 * server-side consumers.
 */

export const TRACK_LABELS: Record<string, string> = {
  backend: 'Backend',
  'crm-automation': 'CRM Automation',
  frontend: 'Frontend',
  'full-stack': 'Full Stack',
  ai: 'AI',
  'game-dev': 'Game Dev',
}

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  client: 'Client work',
  professional: 'Professional',
  personal: 'Personal',
  academic: 'Academic / FYP',
}

export const DEPLOYMENT_LABELS: Record<string, string> = {
  deployed: 'In production',
  'not-deployed': 'Delivered',
  'in-progress': 'In progress',
}
