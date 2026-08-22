import { chromium } from 'playwright'
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'

const DIR = 'src/assets/timeline'
const OUT = 'temp/screenshots/svg-review'
mkdirSync(OUT, { recursive: true })

const files = readdirSync(DIR).filter((f) => f.endsWith('.svg')).sort()

const cards = files
  .map((f) => {
    const svg = readFileSync(`${DIR}/${f}`, 'utf8')
      .replace(/currentColor/g, 'var(--ink)')
    return `<figure><div class="art">${svg}</div><figcaption>${f}</figcaption></figure>`
  })
  .join('\n')

const html = `<!doctype html><html><head><style>
  body { margin: 0; font-family: monospace; }
  .sheet { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; padding: 16px; }
  figure { margin: 0; text-align: center; }
  .art { width: 200px; height: 200px; border: 1px dashed #8883; display: flex; align-items: center; justify-content: center; }
  .art svg { width: 160px; height: 160px; }
  figcaption { font-size: 11px; padding: 4px 0; color: inherit; }
</style></head><body>
<div class="sheet" id="dark" style="--ink:#e4e4e7; background:#09090b; color:#e4e4e7">${cards}</div>
<div class="sheet" id="light" style="--ink:#18181b; background:#fafafa; color:#18181b">${cards}</div>
</body></html>`

writeFileSync('temp/svgs.html', html)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
await page.goto('file:///Users/pxndey/dev/portfolio/frontend/temp/svgs.html')
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/dark.png`, clip: { x: 0, y: 0, width: 1200, height: 480 }, fullPage: true })
await page.evaluate(() => document.getElementById('dark').scrollIntoView())
// full-page shot captures both sheets
await page.screenshot({ path: `${OUT}/all.png`, fullPage: true })
await browser.close()
console.log('done ->', OUT)
