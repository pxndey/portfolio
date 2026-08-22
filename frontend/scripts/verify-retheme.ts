import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'temp/screenshots/retheme'
mkdirSync(OUT, { recursive: true })
const errors: string[] = []

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  async function shot(path: string, name: string, theme: 'dark' | 'light') {
    const page = await context.newPage()
    page.setDefaultTimeout(12000)
    page.on('console', (m) => m.type() === 'error' && errors.push(`[${name}] ${m.text()}`))
    page.on('pageerror', (e) => errors.push(`[${name}] ${e.message}`))
    await page.goto('http://localhost:3000' + path, { waitUntil: 'domcontentloaded' })
    await page.evaluate((t) => {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('theme-mode', t)
    }, theme)
    await page.waitForTimeout(400)
    try {
      await page.screenshot({ path: `${OUT}/${name}.png`, timeout: 8000, animations: 'disabled' })
      console.log(name)
    } catch (e) {
      console.log(`${name} screenshot skipped: ${(e as Error).message.split('\n')[0]}`)
    }
    await page.close()
  }

  for (const theme of ['dark', 'light'] as const) {
    await shot('/', `home-${theme}`, theme)
    await shot('/projects', `projects-${theme}`, theme)
    await shot('/experience', `experience-${theme}`, theme)
    await shot('/research', `research-${theme}`, theme)
    await shot('/academics', `academics-${theme}`, theme)
  }

  await browser.close()

  if (errors.length) {
    console.log('\nERRORS:')
    errors.forEach((e) => console.log('  ' + e))
    process.exit(1)
  }
  console.log('\nNo console/page errors across all routes + themes.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})