import type { Lang } from './i18n'

/**
 * Language in the address: English at the root (/, /case-studies/<slug>),
 * Hungarian under /hu (/hu, /hu/case-studies/<slug>).
 */

/** Splits an address into its language and the page path without the prefix
 * ('/hu/case-studies/x' -> { lang: 'hu', path: '/case-studies/x' }). */
export function parseLangPath(pathname: string): { lang: Lang; path: string } {
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean === '/hu') return { lang: 'hu', path: '/' }
  if (clean.startsWith('/hu/')) return { lang: 'hu', path: clean.slice(3) }
  return { lang: 'en', path: clean }
}

/** The address of a page path in a language ('/', 'hu' -> '/hu';
 * '/case-studies/x', 'hu' -> '/hu/case-studies/x'). */
export function localizePath(path: string, lang: Lang): string {
  if (lang === 'en') return path
  return path === '/' ? '/hu' : `/hu${path}`
}

/** The current page's address in another language, keeping any #hash. */
export function currentPathIn(lang: Lang): string {
  const { path } = parseLangPath(window.location.pathname)
  return localizePath(path, lang) + window.location.hash
}
