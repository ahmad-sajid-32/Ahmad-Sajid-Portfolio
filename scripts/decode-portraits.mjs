/**
 * Materialises the hero/About portrait PNGs into public/images.
 *
 * Why this exists: the portraits are large binary PNGs that must
 * be served as local public assets (Ahmad's call, 2026-11-15 —
 * the Supabase media route made them load slowly), but the
 * GitHub write path available to the agent is text-only, so the
 * PNGs are stored in the repo base64-encoded under
 * assets/portraits/*.png.b64 and decoded back to byte-identical
 * PNGs here, automatically, before every dev/build run
 * (predev/prebuild hooks in package.json). The decoded files
 * are gitignored build artefacts.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'assets', 'portraits')
const outDir = join(root, 'public', 'images')

mkdirSync(outDir, { recursive: true })

const { readdirSync } = await import('node:fs')
for (const name of readdirSync(srcDir)) {
  if (!name.endsWith('.png.b64')) continue
  const out = join(outDir, name.slice(0, -'.b64'.length))
  const bytes = Buffer.from(readFileSync(join(srcDir, name), 'utf8').trim(), 'base64')
  if (existsSync(out) && readFileSync(out).equals(bytes)) {
    console.log(`portrait unchanged: ${name}`)
    continue
  }
  writeFileSync(out, bytes)
  console.log(`portrait decoded: ${name} -> public/images/${name.slice(0, -'.b64'.length)} (${(bytes.length / 1024).toFixed(0)}KB)`)
}
