// Build-time prerender. Runs after `vite build` (client) and
// `vite build --ssr src/entry-server.tsx --outDir dist-server`: renders
// every page, in every language, to static HTML inside dist/, so crawlers
// and link previews see the full content and each page's own title and
// description. In the browser, React hydrates that HTML (src/main.tsx).
//
// Output (English at the root, Hungarian under /hu, see src/i18n/paths.ts):
//   dist/index.html                       home                      /
//   dist/case-studies/<slug>.html         one per case study        /case-studies/<slug>
//   dist/404.html                         not found (404 status)
//   dist/hu.html                          Hungarian home            /hu
//   dist/hu/case-studies/<slug>.html      Hungarian case studies    /hu/case-studies/<slug>
//   dist/hu/404.html                      Hungarian not found       (anything under /hu)
//   dist/sitemap.xml, dist/robots.txt     for search engines
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const serverDir = join(root, 'dist-server')

const { render, pageMeta, PRERENDER_PATHS, SITE_URL, LANGS, localizePath } = await import(
  pathToFileURL(join(serverDir, 'entry-server.js')).href
)

const template = await readFile(join(dist, 'index.html'), 'utf8')
for (const needed of ['<div id="root"></div>', '<title>', '<html lang="en">']) {
  if (!template.includes(needed)) throw new Error(`prerender: dist/index.html is missing ${needed}`)
}

const OG_LOCALE = { en: 'en_US', hu: 'hu_HU' }
const DEFAULT_LANG = 'en'

const escape = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const absolute = (pathname) => SITE_URL + pathname

/** `path`: page path without language prefix; omitted for the 404 pages. */
function headTags(meta, lang, path) {
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<meta property="og:site_name" content="Black Systems" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}" />`,
  ]
  if (path) {
    const url = absolute(localizePath(path, lang))
    tags.push(`<link rel="canonical" href="${escape(url)}" />`, `<meta property="og:url" content="${escape(url)}" />`)
    // Every language version of this page, so search engines pair them up.
    for (const other of LANGS) {
      tags.push(`<link rel="alternate" hreflang="${other}" href="${escape(absolute(localizePath(path, other)))}" />`)
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${escape(absolute(localizePath(path, DEFAULT_LANG)))}" />`)
    for (const other of LANGS) {
      if (other !== lang) tags.push(`<meta property="og:locale:alternate" content="${OG_LOCALE[other]}" />`)
    }
  } else {
    // The 404 pages shouldn't be indexed.
    tags.push(`<meta name="robots" content="noindex" />`)
  }
  if (meta.image) {
    // All preview images are 1200x630 (scripts/og-images.mjs); stating the
    // size lets LinkedIn and others show the large card on the first share.
    tags.push(
      `<meta property="og:image" content="${escape(absolute(meta.image))}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${escape(meta.title)}" />`,
    )
  }
  return tags.join('\n    ')
}

function page(pathname, meta, lang, path) {
  return template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, headTags(meta, lang, path))
    .replace('<div id="root"></div>', `<div id="root">${render(pathname)}</div>`)
}

/** '/' -> index.html, '/hu' -> hu.html, '/hu/case-studies/x' -> hu/case-studies/x.html */
function outFile(pathname) {
  if (pathname === '/') return join(dist, 'index.html')
  return join(dist, `${pathname.replace(/^\//, '')}.html`)
}

const written = []
async function write(file, html) {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
  written.push(file)
}

for (const lang of LANGS) {
  for (const path of PRERENDER_PATHS) {
    const pathname = localizePath(path, lang)
    await write(outFile(pathname), page(pathname, pageMeta(path, lang), lang, path))
  }
  // Any path that isn't a page renders App's NotFound, in that language.
  const notFound = localizePath('/__not-found__', lang)
  const file = lang === DEFAULT_LANG ? join(dist, '404.html') : join(dist, lang, '404.html')
  await write(file, page(notFound, pageMeta('/__not-found__', lang), lang))
}

// sitemap.xml: every page in every language, each listing its language
// versions (same pairs as the hreflang tags). The 404 pages are left out.
const urlEntries = PRERENDER_PATHS.flatMap((path) =>
  LANGS.map((lang) => {
    const alternates = [...LANGS, 'x-default']
      .map((other) => {
        const href = absolute(localizePath(path, other === 'x-default' ? DEFAULT_LANG : other))
        return `    <xhtml:link rel="alternate" hreflang="${other}" href="${escape(href)}" />`
      })
      .join('\n')
    return `  <url>\n    <loc>${escape(absolute(localizePath(path, lang)))}</loc>\n${alternates}\n  </url>`
  }),
)
await write(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>
`,
)
await write(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

await rm(serverDir, { recursive: true, force: true })
console.log(`prerendered ${written.length} files:\n  ` + written.map((f) => f.replace(root + '/', '')).join('\n  '))
