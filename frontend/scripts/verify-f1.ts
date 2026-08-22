import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'temp/screenshots/f1-verify'
mkdirSync(OUT, { recursive: true })

const errors: string[] = []

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  page.setDefaultTimeout(15000)
  page.setDefaultNavigationTimeout(15000)

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => localStorage.setItem('theme-mode', 'dark'))

  // Perf sample: measure delivered (rAF) frame pacing over ~1.5s of a double-tap
  // rAF sync, i.e. how many animation frames the tab actually produces per second.
  const perf = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let frames = 0
        const t0 = performance.now()
        const tick = () => {
          frames++
          if (performance.now() - t0 < 1500) requestAnimationFrame(tick)
          else resolve({ frames, ms: performance.now() - t0 })
        }
        requestAnimationFrame(tick)
      }),
  )
  console.log(`delivered frames in ~1.5s: ${perf.frames}`)

  // Sample frames across two cycles (~3.5s each): trace start, mid, end-of-trace, fade
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(900)
    try {
      await page.screenshot({
        path: `${OUT}/frame-${i}.png`,
        timeout: 10000,
        animations: 'disabled',
      })
      console.log(`frame-${i}`)
    } catch (e) {
      console.log(`frame-${i} skipped: ${(e as Error).message.split('\n')[0]}`)
    }
  }

  // Confirm the dot grid animates via transform (GPU-composited), not background-position.
  const grid = await page.evaluate(() => {
    const bs = getComputedStyle(document.body)
    const before = getComputedStyle(document.body, '::before')
    return {
      bodyBgImage: !!bs.backgroundImage && bs.backgroundImage !== 'none',
      bodyAnimation: bs.animationName,
      pseudoTransform: before.transform,
      pseudoAnimation: before.animationName,
    }
  })
  console.log('dot-grid:', JSON.stringify(grid))

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