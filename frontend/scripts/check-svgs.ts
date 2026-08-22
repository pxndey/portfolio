import { chromium } from 'playwright'
import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'

const DIR = 'src/assets/timeline'
const files = readdirSync(DIR).filter((f) => f.endsWith('.svg')).sort()

// True render test: an invalid/unrenderable SVG fires onerror on <img>
const rows = files.map((f) => `<img data-f="${f}" src="file://${resolve(DIR, f)}">`)

const html = `<!doctype html><body>${rows.join('\n')}</body>`

import { writeFileSync } from 'fs'
writeFileSync('temp/svg-render-test.html', html)

let fail = false
for (const f of files) {
  const size = statSync(`${DIR}/${f}`).size
  const flag = size > 1024 ? ' (>1KB!)' : ''
  console.log(`${f.padEnd(26)} ${String(size).padStart(4)}B${flag}`)
}

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('file:///Users/pxndey/dev/portfolio/frontend/temp/svg-render-test.html')
await page.waitForTimeout(500)

const results = await page.evaluate(() =>
  Array.from(document.querySelectorAll('img')).map((img) => ({
    f: (img as HTMLImageElement).dataset.f,
    ok: img.naturalWidth > 0,
    w: img.naturalWidth,
    h: img.naturalHeight,
  })),
)

for (const r of results) {
  if (!r.ok) {
    console.log(`RENDER FAIL: ${r.f}`)
    fail = true
  } else if (r.w !== r.h || ![16, 120].includes(r.w)) {
    console.log(`SIZE ODD: ${r.f} ${r.w}x${r.h}`)
  }
}

await browser.close()
if (fail) process.exit(1)
console.log(`\nAll ${results.length} SVGs render correctly at expected sizes.`)
