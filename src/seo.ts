import { caseStudies, caseStudyHref, caseStudyText, findCaseStudy } from './data/caseStudiesConfig'
import { DEFAULT_LANG, getTexts, translate, type Lang } from './i18n/i18n'

/** The site's public address: used for canonical links and link previews,
 * which need absolute URLs. Change it if the production domain differs. */
export const SITE_URL = 'https://www.blacksystems.ai'

export interface PageMeta {
  title: string
  description: string
  /** Path of the page ('/', '/case-studies/<slug>'); omitted for the 404. */
  path?: string
  /** Site-relative image for link previews. */
  image?: string
}

/** Every page that gets its own prerendered HTML file (the 404 is separate). */
export const PRERENDER_PATHS = ['/', ...caseStudies.map((cs) => caseStudyHref(cs.slug))]

/** Title, description and preview image for a path, in `lang` (English by
 * default). Unknown paths get the "not found" details, matching what App
 * renders for them. Texts come from the translation files (seo.*, and each
 * case study's title and description). */
export function pageMeta(path: string, lang: Lang = DEFAULT_LANG): PageMeta {
  const clean = path.replace(/\/+$/, '') || '/'
  if (clean === '/') {
    return {
      title: translate(lang, 'seo.home.title'),
      description: translate(lang, 'seo.home.description'),
      path: '/',
    }
  }
  const match = clean.match(/^\/case-studies\/([^/]+)$/)
  const caseStudy = match ? findCaseStudy(match[1]) : undefined
  if (caseStudy) {
    const text = caseStudyText(getTexts(lang), caseStudy.slug)
    return {
      title: translate(lang, 'seo.caseStudyTitle', { title: text.title }),
      description: text.description,
      path: caseStudyHref(caseStudy.slug),
      image: caseStudy.image.src,
    }
  }
  return {
    title: translate(lang, 'seo.notFound.title'),
    description: translate(lang, 'seo.notFound.description'),
  }
}
