import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const OUT = 'temp/screenshots'
mkdirSync(OUT, { recursive: true })

const pages = [
  { path: '/', name: 'home' },
  { path: '/experience', name: 'experience' },
  { path: '/projects', name: 'projects' },
  { path: '/academics', name: 'academics' },
  { path: '/research', name: 'research' },
  { path: '/tools', name: 'tools' },
]

const themes = ['dark', 'light'] as const

async function run() {
  const browser = await chromium.launch()

  for (const theme of themes) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: theme,
    })

    for (const pg of pages) {
      const page = await context.newPage()
      await page.goto(BASE + pg.path, { waitUntil: 'networkidle' })

      await page.evaluate((t: string) => {
        document.documentElement.setAttribute('data-theme', t)
        localStorage.setItem('theme-mode', t)
      }, theme)

      await page.waitForTimeout(600)

      await page.screenshot({
        path: `${OUT}/${pg.name}-${theme}.png`,
        fullPage: true,
      })
      console.log(`  ✓ ${pg.name}-${theme}.png`)
      await page.close()
    }
    await context.close()
  }

  await browser.close()
  console.log(`\nDone — ${pages.length * themes.length} screenshots in ${OUT}/`)
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
