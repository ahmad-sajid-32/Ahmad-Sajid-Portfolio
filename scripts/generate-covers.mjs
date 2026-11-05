// Generates placeholder cover images for seeded projects.
// Token-coloured (Lahore Dusk) abstract covers: dusk surface, amber
// ring, project initials. Ahmad replaces these with real screenshots
// in the admin whenever he has them — they exist so every project can
// be published (coverImage is required) from day one.
import { mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import sharp from 'sharp'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(dirname, 'covers')
mkdirSync(outDir, { recursive: true })

const covers = [
  { slug: 'memyselfi-ai', initials: 'M', title: 'MeMySelfI AI', label: 'AI / BACKEND / FULL STACK' },
  { slug: 'emilly', initials: 'E', title: 'Emilly', label: 'AI RECEPTIONIST' },
  { slug: 'laforme', initials: 'L', title: 'LaForme', label: 'BOOKING PLATFORM' },
  { slug: 'total-store', initials: 'T', title: 'Total Store', label: 'BACK-OFFICE / LARAVEL' },
  { slug: 'uaf-smart-e-library', initials: 'U', title: 'UAF Smart E-Library', label: 'FYP / RAG' },
  { slug: 'pharmasync', initials: 'P', title: 'PharmaSync', label: 'FRONTEND' },
  { slug: 'fleetslot', initials: 'F', title: 'FleetSlot', label: 'FLEET SCHEDULING' },
  { slug: 'blog-cover', initials: '§', title: 'Notes', label: 'BLOG PLACEHOLDER' },
]

for (const cover of covers) {
  const svg = `
  <svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="800" fill="#1E1420"/>
    <rect x="48" y="48" width="1104" height="704" fill="none" stroke="#3A2738" stroke-width="2"/>
    <circle cx="600" cy="360" r="150" fill="none" stroke="#E8A33D" stroke-width="3"/>
    <text x="600" y="408" font-family="Georgia, 'Times New Roman', serif" font-size="140" fill="#E8A33D" text-anchor="middle">${cover.initials}</text>
    <text x="600" y="600" font-family="Georgia, 'Times New Roman', serif" font-size="52" fill="#F5EDE4" text-anchor="middle">${cover.title}</text>
    <text x="600" y="652" font-family="'Courier New', monospace" font-size="24" letter-spacing="6" fill="#C9ADA3" text-anchor="middle">${cover.label}</text>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, `${cover.slug}.png`))
  console.log('cover:', cover.slug)
}
