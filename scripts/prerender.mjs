// Build-time prerender. Runs after `vite build` (client) and
// `vite build --ssr src/entry-server.tsx --outDir dist-server`: renders
// every page to static HTML inside dist/, so crawlers and link previews see
// the full content and each page's own title and description. In the
// browser, React hydrates that HTML (src/main.tsx).
//
// Output:
//   dist/index.html                     home
//   dist/case-studies/<slug>.html       one per case study (served at /case-studies/<slug>)
//   dist/404.html                       not-found page (served with a 404 status)
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const serverDir = join(root, 'dist-server')

const { render, pageMeta, PRERENDER_PATHS, SITE_URL } = await import(
  pathToFileURL(join(serverDir, 'entry-server.js')).href
)

const template = await readFile(join(dist, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>') || !template.includes('<title>')) {
  throw new Error('prerender: dist/index.html is missing the root div or <title>')
}

const escape = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headTags(meta) {
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<meta property="og:site_name" content="Black Systems" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}" />`,
  ]
  if (meta.path) {
    const url = SITE_URL + (meta.path === '/' ? '/' : meta.path)
    tags.push(`<link rel="canonical" href="${escape(url)}" />`, `<meta property="og:url" content="${escape(url)}" />`)
  } else {
    // The 404 page shouldn't be indexed.
    tags.push(`<meta name="robots" content="noindex" />`)
  }
  if (meta.image) tags.push(`<meta property="og:image" content="${escape(SITE_URL + meta.image)}" />`)
  return tags.join('\n    ')
}

function page(path) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, headTags(pageMeta(path)))
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`)
}

function outFile(path) {
  if (path === '/') return join(dist, 'index.html')
  return join(dist, `${path.replace(/^\//, '')}.html`)
}

const written = []
for (const path of PRERENDER_PATHS) {
  const file = outFile(path)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(path))
  written.push(file)
}
// Any path that isn't a page renders App's NotFound.
await writeFile(join(dist, '404.html'), page('/__not-found__'))
written.push(join(dist, '404.html'))

await rm(serverDir, { recursive: true, force: true })
console.log(`prerendered ${written.length} pages:\n  ` + written.map((f) => f.replace(root + '/', '')).join('\n  '))
