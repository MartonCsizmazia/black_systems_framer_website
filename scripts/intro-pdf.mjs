// Introduction PDFs: one slide deck per language (16:9, the PowerPoint
// widescreen size), for prospects who ask for introduction material after a
// call. Written to public/intro/black-systems-intro-<lang>.pdf, so they are
// also served at https://www.blacksystems.ai/intro/black-systems-intro-<lang>.pdf.
// Nothing on the site links to them: the user sends them.
//
// Every text comes from the translation files (src/i18n/<lang>.json; the
// PDF-only labels are under introPdf) and the contact details from src/data,
// so the PDFs say what the site says.
//
// Usage: `npm run intro-pdf` (no dev server needed).
// Re-run it whenever About, Services, the case studies or the contact
// details change, and commit the new PDFs.
//   CHROME_PATH   Chrome executable (default: the macOS install location)
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'intro')
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SITE = 'https://www.blacksystems.ai'
const LANGS = ['en', 'hu']

const read = (path) => readFile(join(root, path), 'utf8')
const MIME = { '.ttf': 'font/ttf', '.avif': 'image/avif', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
const dataUri = async (path) =>
  `data:${MIME[extname(path)]};base64,${(await readFile(join(root, path))).toString('base64')}`
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Contact details and booking link, from the same files the site uses.
const contactTs = await read('src/data/contact.ts')
const EMAIL = contactTs.match(/EMAIL = '([^']+)'/)[1]
const PHONE = contactTs.match(/display: '([^']+)'/)[1]
const LINKEDIN = contactTs.match(/LINKEDIN = '([^']+)'/)[1]
const BOOKING = `https://cal.com/${(await read('src/hooks/useCalEmbed.ts')).match(/CAL_LINK = '([^']+)'/)[1]}`

// Case studies in site order, with their cover images.
const config = await read('src/data/caseStudiesConfig.ts')
const imageIndex = await read('src/assets/images/index.ts')
const imageFile = (name) => {
  const importName = imageIndex.match(new RegExp(`${name}: \\{ src: (\\w+)`))[1]
  return `src/assets/images/${imageIndex.match(new RegExp(`import ${importName} from '\\./([^']+)'`))[1]}`
}
const caseStudies = [...config.matchAll(/slug: '([^']+)'.*?image: images\.(\w+)/g)].map((m) => ({
  slug: m[1],
  image: imageFile(m[2]),
}))

const img = {
  logo: await dataUri('src/assets/images/black-systems-thin-stacked-white.png'),
  founder: await dataUri(imageFile('assetMrongf')),
  services: await Promise.all(['leadCapture', 'manualWork', 'auditCustom'].map((n) => dataUri(imageFile(n)))),
  logos: await Promise.all(
    ['assetPtmk11', 'assetSji9he', 'asset4zx7dv', 'asset4wrdli'].map((n) => dataUri(imageFile(n))),
  ),
  cases: await Promise.all(caseStudies.map((c) => dataUri(c.image))),
}
// Fixed-weight copies of the site's variable font (scripts/fonts): Chrome
// turns a variable font into Type 3 glyph drawings in a PDF, which viewers
// show blurry when zoomed out. Made from src/assets/fonts with fontTools'
// instancer; add a file here before using a new font-weight in the CSS.
// The weights are one step lighter than the site's, matching how the
// first (Type 3) version of the PDF looked.
const WEIGHTS = [400, 500, 600]
const fonts = await Promise.all(WEIGHTS.map((w) => dataUri(`scripts/fonts/bdo-grotesk-${w}.ttf`)))

// Case study photos are cropped around their centre; these move the crop
// where the subject isn't in the middle.
const IMAGE_POSITION = { '24-7-front-desk': '75% 50%' }

function html(t, lang) {
  const localize = (path) => (lang === 'en' ? SITE + path : `${SITE}/hu${path === '/' ? '' : path}`)
  const year = new Date().getFullYear()
  const unwrap = (label) => label.replace(/^\(\+?=?|\)$/g, '')
  let n = 1
  const footer = () => `<footer class="slide__footer"><span>${esc(t.common.brand)}</span><span>${++n}</span></footer>`
  // All case studies on one slide, one headline result each (the first in
  // its results list); each tile opens the full case study on the site.
  const caseTile = ({ slug }, i) => {
    const c = t.caseStudies.items[slug]
    const parts = c.stats[0].value.split(' → ')
    const after = parts.pop()
    return `
    <a class="tile" href="${localize(`/case-studies/${slug}`)}">
      <img class="tile__image" src="${img.cases[i]}" alt=""${IMAGE_POSITION[slug] ? ` style="object-position: ${IMAGE_POSITION[slug]}"` : ''}>
      <span class="eyebrow">${esc(c.category)}</span>
      <h3 class="tile__title">${esc(c.title)}</h3>
      <span class="tile__label dim">${esc(c.stats[0].label)}</span>
      ${parts.length ? `<span class="tile__before dim">${esc(parts.join(' → '))} →</span>` : ''}
      <span class="tile__after${after.length > 16 ? ' tile__after--long' : ''} accent">${esc(after)}</span>
      <span class="tile__link">${esc(t.introPdf.fullCaseStudy)} ↗</span>
    </a>`
  }

  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8">
<style>
${WEIGHTS.map((w, i) => `  @font-face { font-family: "BDO Grotesk"; src: url(${fonts[i]}) format("truetype"); font-weight: ${w}; }`).join('\n')}
  @page { size: 1280px 720px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "BDO Grotesk", sans-serif; color: #000; font-size: 17px; line-height: 1.4;
    letter-spacing: -0.01em; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  a { color: inherit; text-decoration: none; }
  .slide { width: 1280px; height: 720px; padding: 64px 72px 72px; position: relative; overflow: hidden;
    page-break-after: always; display: flex; flex-direction: column; }
  .slide:last-child { page-break-after: auto; }
  .slide--dark { background: #111; color: #fff; }
  .slide__footer { position: absolute; left: 72px; right: 72px; bottom: 28px; display: flex;
    justify-content: space-between; font-size: 12px; color: rgba(0,0,0,.45); }
  .slide--dark .slide__footer { color: rgba(255,255,255,.55); }
  .dim { color: rgba(0,0,0,.5); }
  .slide--dark .dim { color: rgba(255,255,255,.55); }
  .accent { color: #f14b00; }
  .eyebrow { display: block; font-size: 14px; font-weight: 600; color: rgba(0,0,0,.5); margin-bottom: 14px; }
  .slide--dark .eyebrow { color: rgba(255,255,255,.55); }
  h1 { font-size: 64px; line-height: 1; font-weight: 500; letter-spacing: -0.04em; }
  h2 { font-size: 44px; line-height: 1.05; font-weight: 500; letter-spacing: -0.035em; margin-bottom: 14px; }
  .lead { font-size: 21px; line-height: 1.3; }
  .button { display: inline-block; background: #f14b00; color: #fff; font-weight: 600; font-size: 18px;
    padding: 16px 30px; border-radius: 999px; }
  .logo { width: 190px; }

  /* Cover and closing */
  .cover__main { margin-top: auto; }
  .cover__main h1 { max-width: 980px; margin-bottom: 22px; }
  .cover__tagline { font-size: 20px; margin-bottom: 36px; }
  .contact-row { display: flex; gap: 40px; font-size: 15px; border-top: 1px solid rgba(255,255,255,.16); padding-top: 18px; }
  .closing__main { margin-top: auto; margin-bottom: auto; }
  .closing__main h1 { margin-bottom: 20px; }
  .closing__main p { max-width: 640px; margin-bottom: 36px; }

  /* About */
  .about__heading { font-size: 36px; max-width: 1080px; margin-bottom: 36px; }
  /* Pre/Post and Results as one block, centred in the space under the heading. */
  .about__body { margin: auto 0; display: flex; flex-direction: column; gap: 56px; }
  .prepost { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .prepost p { font-size: 18px; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .stat { border-top: 1px solid rgba(0,0,0,.16); padding-top: 16px; }
  .stat__value { display: block; font-size: 30px; line-height: 1.05; font-weight: 500; letter-spacing: -0.035em; color: #f14b00; margin-bottom: 8px; white-space: nowrap; }
  .stat__label { font-size: 15px; }

  /* Founder */
  .founder { display: grid; grid-template-columns: 330px 1fr; gap: 64px; flex: 1; min-height: 0; }
  .founder img { width: 330px; height: 100%; object-fit: cover; border-radius: 10px; }
  .founder__text { display: flex; flex-direction: column; }
  .founder__text p { font-size: 18px; margin-top: 12px; }
  .logos { margin-top: auto; }
  .logos__row { display: flex; align-items: center; justify-content: space-between; gap: 32px; }
  .logos__row img { height: 22px; max-width: 120px; object-fit: contain; opacity: .7; }

  /* Services */
  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 10px; }
  .card img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 16px; }
  .card .eyebrow { margin-bottom: 6px; }
  .card h3 { font-size: 24px; font-weight: 500; letter-spacing: -0.02em; margin-bottom: 8px; }
  .card p { font-size: 15px; }

  /* Process */
  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; list-style: none; margin-top: auto; margin-bottom: auto; }
  .step { border-top: 1px solid rgba(0,0,0,.16); padding-top: 20px; }
  .step__no { display: block; font-size: 56px; font-weight: 500; letter-spacing: -0.04em; color: #f14b00; line-height: 1; margin-bottom: 18px; }
  .step h3 { font-size: 22px; font-weight: 500; letter-spacing: -0.02em; margin-bottom: 10px; }
  .step p { font-size: 15px; }

  /* Case studies */
  .tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: auto; margin-bottom: auto; }
  .tile { display: flex; flex-direction: column; }
  .tile__image { width: 100%; height: 190px; object-fit: cover; border-radius: 10px; margin-bottom: 16px; }
  .tile .eyebrow { margin-bottom: 4px; }
  .tile__title { font-size: 22px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 18px; }
  .tile__label { font-size: 14px; border-top: 1px solid rgba(0,0,0,.16); padding-top: 12px; margin-bottom: 4px; }
  .tile__before { font-size: 16px; }
  .tile__after { font-size: 30px; font-weight: 500; letter-spacing: -0.035em; line-height: 1.1; }
  /* A long result ("Under 1 hr/week/person") would wrap at full size. */
  .tile__after--long { font-size: 22px; line-height: 1.5; }
  .tile__link { margin-top: 14px; font-size: 14px; font-weight: 500; }
</style></head>
<body>

<section class="slide slide--dark">
  <img class="logo" src="${img.logo}" alt="${esc(t.common.brand)}">
  <div class="cover__main">
    <h1>${esc(t.hero.line1)} ${esc(t.hero.line2)} <span class="accent">${esc(t.hero.line2Dim)}</span> ${esc(t.hero.line3)}</h1>
    <p class="cover__tagline dim">${esc(t.footer.tagline)}</p>
    <div class="contact-row">
      <span>${esc(t.common.founderName)}</span>
      <a href="mailto:${EMAIL}">${esc(EMAIL)}</a>
      <span>${esc(PHONE)}</span>
      <a href="${localize('/')}">blacksystems.ai</a>
    </div>
  </div>
</section>

<section class="slide">
  <span class="eyebrow">${esc(t.about.eyebrow)}</span>
  <h2 class="about__heading">${esc(t.about.heading)}</h2>
  <div class="about__body">
  <div class="prepost">
    <div><span class="eyebrow">${esc(t.about.pre.label)}</span><p>${esc(t.about.pre.text)}</p></div>
    <div><span class="eyebrow">${esc(t.about.post.label)}</span><p>${esc(t.about.post.text)}</p></div>
  </div>
  <div>
    <span class="eyebrow">${esc(t.about.results.label)}</span>
    <div class="stats">${t.about.results.stats
      .map((s) => `<div class="stat"><span class="stat__value">${esc(s.value)}</span><span class="stat__label">${esc(s.label)}</span></div>`)
      .join('')}</div>
  </div>
  </div>
  ${footer()}
</section>

<section class="slide">
  <h2>${esc(unwrap(t.services.process.label))}</h2>
  <ol class="steps">${t.services.process.steps
    .map((s, i) => `<li class="step"><span class="step__no">0${i + 1}</span><h3>${esc(s.title)}</h3><p class="dim">${esc(s.text)}</p></li>`)
    .join('')}</ol>
  ${footer()}
</section>

<section class="slide">
  <div class="founder">
    <img src="${img.founder}" alt="">
    <div class="founder__text">
      <span class="eyebrow">${esc(t.about.founder.label)}</span>
      <h2>${esc(t.common.founderName)}</h2>
      <span class="lead dim">${esc(t.about.founder.role)}</span>
      <p>${esc(t.about.founder.intro)}</p>
      <p>${esc(t.about.founder.more[0])}</p>
      <div class="logos">
        <span class="eyebrow">${esc(t.about.logosLabel)}</span>
        <div class="logos__row">${img.logos.map((src) => `<img src="${src}" alt="">`).join('')}</div>
      </div>
    </div>
  </div>
  ${footer()}
</section>

<section class="slide">
  <h2>${esc(t.services.eyebrow)}</h2>
  <div class="cards">${t.services.cards
    .map(
      (c, i) => `
    <div class="card">
      <img src="${img.services[i]}" alt="">
      <span class="eyebrow">${esc(c.category)}</span>
      <h3>${esc(c.heading)}</h3>
      <p class="dim">${esc(c.body)}</p>
    </div>`,
    )
    .join('')}</div>
  ${footer()}
</section>

<section class="slide">
  <h2>${esc(t.caseStudies.eyebrow)}</h2>
  <div class="tiles">${caseStudies.map(caseTile).join('')}</div>
  ${footer()}
</section>

<section class="slide slide--dark">
  <img class="logo" src="${img.logo}" alt="${esc(t.common.brand)}">
  <div class="closing__main">
    <span class="eyebrow">${esc(t.contact.eyebrow)}</span>
    <h1>${esc(t.contact.heading)}</h1>
    <p class="lead dim">${esc(t.contact.description)}</p>
    <a class="button" href="${BOOKING}">${esc(t.common.bookFreeCall)} ↗</a>
  </div>
  <div class="contact-row">
    <span>${esc(t.common.founderName)}</span>
    <a href="mailto:${EMAIL}">${esc(EMAIL)}</a>
    <span>${esc(PHONE)}</span>
    <a href="${LINKEDIN}">LinkedIn ↗</a>
    <a href="${localize('/')}">blacksystems.ai ↗</a>
  </div>
  <footer class="slide__footer"><span>${esc(t.footer.copyright.replace('{{year}}', year))}</span><span>${++n}</span></footer>
</section>

</body></html>`
}

await mkdir(outDir, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  const page = await browser.newPage()
  for (const lang of LANGS) {
    const t = JSON.parse(await read(`src/i18n/${lang}.json`))
    await page.setContent(html(t, lang), { waitUntil: 'load' })
    await page.evaluateHandle('document.fonts.ready')
    const file = join(outDir, `black-systems-intro-${lang}.pdf`)
    await page.pdf({ path: file, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true })
    console.log('intro pdf:', file.replace(root + '/', ''))
  }
} finally {
  await browser.close()
}
