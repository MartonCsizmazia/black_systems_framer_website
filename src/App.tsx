import { useEffect } from 'react'
import { scrollToSection, useLenis } from './hooks/useLenis'
import { useCalEmbed } from './hooks/useCalEmbed'
import Home from './pages/Home'
import CaseStudy from './pages/CaseStudy'
import NotFound from './pages/NotFound'
import { findCaseStudy } from './data/caseStudiesConfig'
import { useTranslation } from './i18n/i18n'
import { I18nProvider } from './i18n/I18nProvider'
import { parseLangPath } from './i18n/paths'
import { pageMeta } from './seo'

// Minimal path-based routing: every link in the site is a plain <a href>, so
// navigation is a full page load and the route only needs resolving once.
// The build prerenders every page, in every language, to its own HTML file
// (see scripts/prerender.mjs); the dev server falls back to index.html for
// any path, so this also works while developing.
// `path` is the page path without the language prefix (see i18n/paths.ts).
function resolveRoute(path: string) {
  if (path === '/') return <Home />
  const match = path.match(/^\/case-studies\/([^/]+)$/)
  const caseStudy = match ? findCaseStudy(match[1]) : undefined
  return caseStudy ? <CaseStudy caseStudy={caseStudy} /> : <NotFound />
}

/** Keeps the browser tab's title in the current language (it changes when
 * the language is switched in place). */
function DocumentTitle({ path }: { path: string }) {
  const { lang } = useTranslation()
  useEffect(() => {
    document.title = pageMeta(path, lang).title
  }, [path, lang])
  return null
}

/** `pathname`: the address to render, language prefix included ('/hu/...');
 * given by the build-time prerender (there is no window there), otherwise
 * read from the browser's address. */
export default function App({ pathname }: { pathname?: string }) {
  const { lang, path } = parseLangPath(pathname ?? window.location.pathname)
  useLenis()
  useCalEmbed()


  // Arriving from a sub-page menu link like "/#services": the browser's own
  // anchor jump runs before React has rendered the section, so scroll once
  // the page is mounted instead.
  useEffect(() => {
    if (!window.location.hash) return
    const id = window.location.hash
    const t = window.setTimeout(() => scrollToSection(id), 100)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <I18nProvider lang={lang}>
      <DocumentTitle path={path} />
      {resolveRoute(path)}
    </I18nProvider>
  )
}
