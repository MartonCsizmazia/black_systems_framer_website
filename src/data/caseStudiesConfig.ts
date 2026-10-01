import { images } from '../assets/images'
import type { Lang, Translations } from '../i18n/i18n'
import { localizePath } from '../i18n/paths'

type Image = { src: string; alt?: string }

/** A case study's texts in one language (en.json / hu.json, under
 * caseStudies.items.<slug>). */
export type CaseStudyText = Translations['caseStudies']['items'][CaseStudySlug]
/** Slugs that have texts in the translation files; a case study without
 * them is a type error. */
export type CaseStudySlug = keyof Translations['caseStudies']['items']

export interface CaseStudyEntry {
  slug: CaseStudySlug
  rollNo: string
  /** Shown on the hero and on the case study's card elsewhere ("© 2025"). */
  year: string
  /** Card art on the home page, and the blurred detail-hero background. */
  image: Image
}

// Every case study on the site: the home page's Case Studies cards, each
// /case-studies/<slug> page and the slider at the bottom of those pages are
// rendered from these entries. Order matters: it's the order of the cards
// and of the slider. Their texts (title, category, intro, ...) live in the
// translation files under caseStudies.items.<slug>.
export const caseStudies: CaseStudyEntry[] = [
  { slug: 'lead-machine', rollNo: '(01)', year: '© 2026', image: images.residenceGoldenHour },
  { slug: 'ai-recruiter', rollNo: '(02)', year: '© 2026', image: images.officeResumeReview },
  { slug: '24-7-front-desk', rollNo: '(03)', year: '© 2026', image: images.hotelLobbyReception },
  { slug: 'invisible-back-office', rollNo: '(04)', year: '© 2026', image: images.officeSunsetSigning },
]

/** A case study's address in a language (English: /case-studies/<slug>,
 * Hungarian: /hu/case-studies/<slug>). */
export const caseStudyHref = (slug: string, lang: Lang = 'en') => localizePath(`/case-studies/${slug}`, lang)

export function findCaseStudy(slug: string) {
  return caseStudies.find((p) => p.slug === slug)
}

/** The texts of one case study from a language's translations. */
export function caseStudyText(texts: Translations, slug: CaseStudySlug): CaseStudyText {
  return texts.caseStudies.items[slug]
}
