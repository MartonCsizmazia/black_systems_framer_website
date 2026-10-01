// Link preview images (og:image): captures the top of every page, in every
// language, at 1200x630 (the size LinkedIn, Facebook and WhatsApp use) into
// public/og/<page>-<lang>.jpg. The build copies public/ into dist/, and
// src/seo.ts (ogImagePath) points each page's og:image at its file.
//
// Usage: start the dev server (npm run dev), then `npm run og`.
// Re-run it whenever the hero or a case study cover changes.
//   OG_BASE_URL   dev server address (default http://localhost:5174)
//   CHROME_PATH   Chrome executable (default: the macOS install location)
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'og')
const BASE = process.env.OG_BASE_URL ?? 'http://localhost:5174'
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Same pages and address scheme as the prerender (src/seo.ts, src/i18n/paths.ts).
const config = await readFile(join(root, 'src/data/caseStudiesConfig.ts'), 'utf8')
const slugs = [...config.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
// `hide`: page UI that doesn't belong on a card. The home card keeps only
// the mountain and the BLACK SYSTEMS wordmark (no button, lists, ticker).
const pages = [
  { name: 'home', path: '/', hide: '.hero__top, .hero__services, .hero__year-details, .hero__language' },
  ...slugs.map((slug) => ({ name: slug, path: `/case-studies/${slug}` })),
]
const LANGS = ['en', 'hu']
const localize = (path, lang) => (lang === 'en' ? path : path === '/' ? '/hu' : `/hu${path}`)

await mkdir(outDir, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  for (const lang of LANGS) {
    for (const { name, path, hide } of pages) {
      // Save the page's own language first, so the visitor-language redirect
      // never moves the capture to the other version.
      await page.goto(BASE, { waitUntil: 'domcontentloaded' })
      await page.evaluate((l) => localStorage.setItem('lang', l), lang)
      await page.goto(BASE + localize(path, lang), { waitUntil: 'networkidle0' })
      // The card is the page's own hero, without the menu bar.
      // `hide` keeps its space (visibility), so the rest stays where it is.
      const css = ['.navbar { display: none !important; }', '::-webkit-scrollbar { display: none; }']
      if (hide) css.push(`${hide} { visibility: hidden !important; }`)
      await page.addStyleTag({ content: css.join('\n') })
      await new Promise((r) => setTimeout(r, 4500)) // entrance animations
      const file = join(outDir, `${name}-${lang}.jpg`)
      await page.screenshot({ path: file, type: 'jpeg', quality: 85 })
      console.log('og image:', file.replace(root + '/', ''))
    }
  }
} finally {
  await browser.close()
}
