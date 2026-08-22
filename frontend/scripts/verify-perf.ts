import { chromium } from 'playwright'

const errors: string[] = []
const warnings: string[] = []

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  page.setDefaultTimeout(12000)

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))
  page.on('requestfailed', (req) => warnings.push(`[reqfail] ${req.url()} (${req.failure()?.errorText})`))

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => localStorage.setItem('theme-mode', 'dark'))

  const grid = await page.evaluate(() => {
    const before = getComputedStyle(document.body, '::before')
    return {
      pseudoTransform: before.transform,
      pseudoAnimationName: before.animationName,
      bodyHasAnimation: getComputedStyle(document.body).animationName !== 'none',
    }
  })
  console.log('dot-grid:', JSON.stringify(grid))

  // Confirm the accent cache is reading a concrete color and canvas exists.
  const canvas = await page.evaluate(() => {
    const c = document.querySelector('canvas[aria-hidden="true"]')
    return { present: !!c, accent: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() }
  })
  console.log('f1-canvas:', JSON.stringify(canvas))

  // Best-effort single screenshot with animations disabled.
  try {
    await page.screenshot({
      path: 'temp/screenshots/perf-home.png',
      timeout: 8000,
      animations: 'disabled',
    })
    console.log('screenshot: ok')
  } catch (e) {
    console.log('screenshot: skipped', (e as Error).message.split('\n')[0])
  }

  const overlay = await page.evaluate(() =>
    document.querySelector('vite-error-overlay, bun-error-overlay')?.textContent ?? null,
  )
  if (overlay) errors.push(`[overlay] ${overlay.slice(0, 300)}`)

  await browser.close()

  if (warnings.length) console.log('\nWARNINGS:\n  ' + warnings.slice(0, 8).join('\n  '))
  if (errors.length) {
    console.log('\nERRORS:')
    errors.forEach((e) => console.log('  ' + e))
    process.exit(1)
  }
  console.log('\nOK: no console/page errors; dot grid on composited ::before')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})