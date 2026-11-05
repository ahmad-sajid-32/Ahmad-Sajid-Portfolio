/**
 * Phase 2 seed — verified facts only (02-Profile-and-Form-Facts.md).
 * Thin CLI wrapper around scripts/seed-core.ts. See that file for data.
 *   npx tsx scripts/seed.ts
 * In this sandbox the payload/tsx combination is unreliable; the same
 * runSeed() is also exposed once via a temporary dev route if needed.
 */
import { getPayload } from 'payload'

import config from '../payload/payload.config'
import { runSeed } from './seed-core'

async function main() {
  const payload = await getPayload({ config })
  await runSeed(payload)
  process.exit(0)
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
