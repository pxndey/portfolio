import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'temp/screenshots/f1-verify'
mkdirSync(OUT, { recursive: true })

const errors: string[] = []

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.setItem('theme-mode', 'dark'))

  // Sample frames across two cycles (~3.5s each): trace start, mid, end-of-trace, fade
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${OUT}/frame-${i}.png` })
    console.log(`frame-${i}`)
  }

  // Check for any visible error overlay
  const overlay = await page.evaluate(() =>
    document.querySelector('vite-error-overlay, bun-error-overlay')?.textContent ?? null,
  )
  if (overlay) errors.push(`[overlay] ${overlay.slice(0, 300)}`)

  await browser.close()

  if (errors.length) {
    console.log('\nERRORS:')
    errors.forEach((e) => console.log('  ' + e))
    process.exit(1)
  }
  console.log('\nNo errors. Frames in ' + OUT)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
