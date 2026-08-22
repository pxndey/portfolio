import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'temp/screenshots/retheme'
mkdirSync(OUT, { recursive: true })
const errors: string[] = []

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  // one shared listener via pages we open
  async function shot(path: string, name: string, theme: 'dark' | 'light') {
    const page = await context.newPage()
    page.on('console', (m) => m.type() === 'error' && errors.push(`[${name}] ${m.text()}`))
    page.on('pageerror', (e) => errors.push(`[${name}] ${e.message}`))
    await page.goto('http://localhost:3000' + path, { waitUntil: 'networkidle' })
    await page.evaluate((t) => {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('theme-mode', t)
    }, theme)
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${OUT}/${name}.png` })
    console.log(name)
    await page.close()
  }

  await shot('/', 'home-dark', 'dark')
  await shot('/', 'home-light', 'light')
  await shot('/projects', 'projects-dark', 'dark')
  await shot('/experience', 'experience-dark', 'dark')

  await browser.close()

  if (errors.length) {
    console.log('\nERRORS:')
    errors.forEach((e) => console.log('  ' + e))
    process.exit(1)
  }
  console.log('\nNo console/page errors.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
