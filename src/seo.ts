import { caseStudies, caseStudyHref, findCaseStudy } from './data/caseStudiesConfig'

/** The site's public address: used for canonical links and link previews,
 * which need absolute URLs. Change it if the production domain differs. */
export const SITE_URL = 'https://blacksystems.ai'

const SITE_NAME = 'Black Systems'

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

/** Title, description and preview image for a path. Unknown paths get the
 * "not found" details, matching what App renders for them. */
export function pageMeta(path: string): PageMeta {
  const clean = path.replace(/\/+$/, '') || '/'
  if (clean === '/') {
    return {
      title: `${SITE_NAME} - AI automation for growing businesses`,
      description:
        'The AI automation partner for growing businesses. AI systems that bring in more leads and take the repetitive work off your team.',
      path: '/',
    }
  }
  const match = clean.match(/^\/case-studies\/([^/]+)$/)
  const caseStudy = match ? findCaseStudy(match[1]) : undefined
  if (caseStudy) {
    return {
      title: `${caseStudy.title} - ${SITE_NAME}`,
      description: caseStudy.description,
      path: caseStudyHref(caseStudy.slug),
      image: caseStudy.image.src,
    }
  }
  return {
    title: `Page not found - ${SITE_NAME}`,
    description: "This page doesn't exist.",
  }
}
