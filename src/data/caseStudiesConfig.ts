import { images } from '../assets/images'

type Image = { src: string; alt?: string }

export interface CaseStudyEntry {
  slug: string
  rollNo: string
  title: string
  category: string
  /** Shown on the hero and on the case study's card elsewhere ("© 2025"). */
  year: string
  /** Short line under the category at the bottom of the detail hero. */
  description: string
  /** The big 70px paragraph opening the detail page's content. */
  intro: string
  research: string
  experiment: string
  stats: { label: string; value: string }[]
  livePreview: string
  /** Card art on the home page, and the blurred detail-hero background. */
  image: Image
  /** Right-hand column of the detail page, top to bottom. */
  gallery: Image[]
}

// Recovered by opening every detail route in the mirror (Framer resolves
// them client-side from its CMS collection "UANVURkgl", so none of them
// exist as captured HTML). Text is verbatim, "Photograhy" typo included, as
// is the Experiment copy three of the four case studies share. Order matches the
// CMS order, which is also what "More Works" at the bottom of each detail page
// follows.
export const caseStudies: CaseStudyEntry[] = [
  {
    slug: 'vellfire-calibration',
    rollNo: '(01)',
    title: 'Lead Machine',
    category: 'Art Direction',
    year: '© 2025',
    description: 'A precision-driven approach focused on geometry and harmony.',
    intro:
      'Technical brand identity integrating precision, form, and calibrated visual rhythm inspired by structured design principles & Fuel®.',
    research:
      'Mapping functional requirements and analyzing system accuracy, Fuel creates a detailed foundation that informs every design decision.',
    experiment:
      'Redefining minimalism through material authenticity and design order. Fuel moves beyond simple form, creating refined designs that shape experiences.',
    stats: [
      { label: 'Traffic', value: '225k' },
      { label: 'Success rate', value: '100%' },
    ],
    livePreview: 'https://www.framer.com/',
    image: images.bgImageJqzov1,
    gallery: [images.womanOrangeBlurNzlidp, images.womanGreenBlurXqlxzt, images.manRunningBlurQfdoky, images.manDancingZvom13],
  },
  {
    slug: 'dunwill-lanson',
    rollNo: '(02)',
    title: 'Dunwill Lanson',
    category: 'Photograhy',
    year: '© 2024',
    description: 'A balanced fusion of proportion, typography, and visual tone.',
    intro:
      'Contemporary corporate identity blending structured layouts, strategic clarity, and modern visual systems developed with Fuel®.',
    research:
      'Exploring market position and brand intention to create a precise design framework rooted in clarity and balance for better response and orders.',
    experiment:
      'Developing style variations that shape professional expression with modern structure and clean aesthetic choices for better clarity and sequences.',
    stats: [
      { label: 'Traffic', value: '225k' },
      { label: 'Success rate', value: '100%' },
    ],
    livePreview: 'https://www.framer.com/',
    image: images.bgImageRmeblx,
    gallery: [images.womanOrangeBlurNzlidp, images.womanGreenBlurXqlxzt, images.manRunningBlurQfdoky, images.manDancingZvom13],
  },
  {
    slug: 'noara-willis',
    rollNo: '(03)',
    title: 'Noara Willis',
    category: 'Strategy',
    year: '© 2025',
    description: 'A refined identity system blending structure with expressive form.',
    intro:
      'Modern personal brand identity built through structured elegance, refined typography, and expressive visual character powered by Fuel®.',
    research:
      'Understanding tone, personality, and visual nuance. Fuel analyzes aesthetic direction to refine the foundation of brand clarity and brand aesthetics.',
    experiment:
      'Redefining minimalism through material authenticity and design order. Fuel moves beyond simple form, creating refined designs that shape experiences.',
    stats: [
      { label: 'Traffic', value: '225k' },
      { label: 'Success rate', value: '100%' },
    ],
    livePreview: 'https://www.framer.com/',
    image: images.bgImageJt7zqg,
    gallery: [images.womanOrangeBlurNzlidp, images.womanGreenBlurXqlxzt, images.manRunningBlurQfdoky, images.manDancingZvom13],
  },
  {
    slug: 'nike-studios',
    rollNo: '(04)',
    title: 'Nike Studios',
    category: 'Art Direction',
    year: '© 2025',
    description: 'A crafted creative direction built to elevate brand expression.',
    intro:
      'Design-forward athletic brand experience shaped through structured motion, minimal clarity, and bold visual identity crafted with Fuel®.',
    research:
      'Exploring brand intention through clarity and direction. Fuel uncovers visual patterns and defines a structured base that guides each creative movement.',
    experiment:
      'Redefining minimalism through material authenticity and design order. Fuel moves beyond simple form, creating refined designs that shape experiences.',
    stats: [
      { label: 'Traffic', value: '225k' },
      { label: 'Success rate', value: '100%' },
    ],
    livePreview: 'https://www.framer.com/',
    image: images.bgImageYiiumx,
    gallery: [images.womanGreenBlurXqlxzt, images.womanGlitchWbsn9c, images.manRunningBlurQfdoky, images.manDancingZvom13],
  },
]

export const caseStudyHref = (slug: string) => `/case-studies/${slug}`

export function findCaseStudy(slug: string) {
  return caseStudies.find((p) => p.slug === slug)
}

/** The source's "More Works" CMS query: page size 2, offset 0, `slug != current`. */
export function moreCaseStudies(slug: string, count = 2) {
  return caseStudies.filter((p) => p.slug !== slug).slice(0, count)
}
