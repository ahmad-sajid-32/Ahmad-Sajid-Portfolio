/**
 * Mobile horizontal-overflow regression check.
 *
 * Why this exists: the scroll-reveal components rest off-canvas
 * (translated ±56px) whenever they are out of view. If the page's
 * overflow-x clipping ever regresses, mobile browsers count those
 * elements in the scrollable area — the page becomes side-scrollable
 * and renders shifted, with content cut at the edges (Ahmad's phone
 * report, 2026-11-07). This script fails if that ever comes back.
 *
 * Prerequisites:
 *   1. A production server on http://localhost:3101
 *      (npm run build && npm run start -- --port 3101)
 *   2. Chrome with CDP on port 9223, e.g. chrome-headless-shell
 *      --remote-debugging-port=9223 --user-data-dir=/tmp/chrome-profile
 *
 * It also checks card links for internally clipped content
 * (an <a> whose scrollWidth exceeds its clientWidth): the
 * featured blog card once sized its grid column to its widest
 * row and clipped its own title — invisible to scrollWidth
 * checks because the card hides its overflow (2026-11-08).
 *
 * Run from the app root:  node scripts/mobile-overflow-check.mjs
 * Exit code 0 = no page can scroll sideways at 390px or 360px.
 */
import WebSocket from 'ws'

const BASE = process.env.CHECK_BASE || 'http://localhost:3101'
const PAGES = [
  '/',
  '/projects',
  '/projects/memyselfi-ai',
  '/blog',
  '/blog/deploying-memyselfi-docker-on-aws-ec2-with-a-ci-cd-pipeline-i-built-myself',
  '/about',
  '/contact',
]
const WIDTHS = [390, 360]

const list = await (await fetch('http://127.0.0.1:9223/json/list')).json()
let target = list.find((t) => t.type === 'page')
if (!target) {
  target = await (
    await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' })
  ).json()
}
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.on('open', r))
let id = 0
const pending = new Map()
ws.on('message', (d) => {
  const m = JSON.parse(d)
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result)
    pending.delete(m.id)
  }
})
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id
    pending.set(i, res)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
const evalJs = async (expr) => {
  const r = await send('Runtime.evaluate', {
    expression: expr,
    returnByValue: true,
    awaitPromise: true,
  })
  if (r?.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 300))
  return r?.result?.value
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await send('Page.enable')
await send('Runtime.enable')

let failures = 0
for (const width of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  })
  for (const path of PAGES) {
    await send('Page.navigate', { url: `${BASE}${path}` })
    await sleep(3500)
    const clipped = await evalJs(`(() => {
      const bad = []
      for (const a of document.querySelectorAll('a')) {
        if (a.scrollWidth > a.clientWidth + 2) {
          bad.push({
            href: a.getAttribute('href'),
            sw: a.scrollWidth,
            cw: a.clientWidth,
            text: (a.textContent || '').trim().slice(0, 40),
          })
        }
      }
      return bad
    })()`)
    for (const b of clipped) {
      failures++
      console.log(
        `FAIL ${width}px ${path}: link card clips its content (scrollWidth=${b.sw} > clientWidth=${b.cw}) href=${b.href} "${b.text}"`,
      )
    }
    for (const y of [0, 500, 1200, 2400, 99999]) {
      const m = await evalJs(`(async () => {
        window.scrollTo(0, ${y})
        await new Promise((r) => setTimeout(r, 1100))
        const before = document.documentElement.scrollWidth
        window.scrollTo(600, window.scrollY)
        await new Promise((r) => setTimeout(r, 150))
        return { sw: before, iw: window.innerWidth, sx: Math.round(window.scrollX) }
      })()`)
      const bad = m.sw > m.iw || m.sx !== 0
      if (bad) {
        failures++
        console.log(
          `FAIL ${width}px ${path} @y=${y}: scrollWidth=${m.sw} innerWidth=${m.iw} scrollX after side-scroll attempt=${m.sx}`,
        )
      }
    }
    console.log(`ok   ${width}px ${path}`)
  }
}
ws.close()
console.log(failures === 0 ? '\nALL PAGES PASS — no sideways scroll.' : `\n${failures} FAILURES`)
process.exit(failures === 0 ? 0 : 1)
