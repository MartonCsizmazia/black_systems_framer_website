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
  solution: string
  stats: { label: string; value: string }[]
  /** Card art on the home page, and the blurred detail-hero background. */
  image: Image
}

// Every case study on the site: the home page's Case Studies cards and each
// /case-studies/<slug> page are rendered from these entries. Order matters:
// it's the order of the cards, and "More Works" at the bottom of a case
// study page shows the first two entries other than the current one.
export const caseStudies: CaseStudyEntry[] = [
  {
    slug: 'lead-machine',
    rollNo: '(01)',
    title: 'The Lead Machine',
    category: 'Real Estate',
    year: '© 2026',
    description: 'Turning every property inquiry into a qualified sales opportunity.',
    intro:
      'An automated lead engine that captures every inquiry, qualifies intent, responds instantly, and routes sales-ready prospects directly into the CRM.',
    research:
      'We mapped the journey from first inquiry to booked call, identifying slow response times, manual qualification, fragmented lead sources, and missed follow-ups.',
    solution:
      'Every lead is captured and enriched automatically. AI qualifies intent, structures key details, updates the CRM, triggers a tailored response, and routes qualified prospects to sales.',
    stats: [
      { label: 'Response time', value: '<1 min' },
      { label: 'Lead capture', value: '24/7' },
    ],
    image: images.bgImageJqzov1,
  },
  {
    slug: 'ai-recruiter',
    rollNo: '(02)',
    title: 'The AI Recruiter',
    category: 'Recruitment',
    year: '© 2026',
    description: 'Turning hundreds of applications into a structured shortlist.',
    intro:
      'An AI-powered screening workflow that reads incoming applications, extracts candidate data, evaluates job fit, and gives recruiters a prioritized shortlist.',
    research:
      'We mapped the screening process and found recruiters repeatedly reading CVs, transferring candidate data, checking requirements, and manually building shortlists.',
    solution:
      'AI extracts and structures every application, evaluates candidates against defined criteria, flags missing requirements, scores fit, and syncs the results directly with the ATS.',
    stats: [
      { label: 'Applications', value: '24/7' },
      { label: 'Data capture', value: '100%' },
    ],
    image: images.bgImageRmeblx,
  },
  {
    slug: '24-7-front-desk',
    rollNo: '(03)',
    title: 'The 24/7 Front Desk',
    category: 'Hospitality',
    year: '© 2026',
    description: 'Guest inquiries answered and routed while the team sleeps.',
    intro:
      'An always-on AI front desk that handles routine guest questions, captures requests, schedules services, and escalates conversations that need a human.',
    research:
      'We analyzed repetitive guest communication across web and messaging channels, identifying recurring questions, delayed replies, booking friction, and unnecessary staff workload.',
    solution:
      'The AI responds instantly using approved business information, handles common requests, collects missing details, schedules where possible, and hands complex conversations to staff.',
    stats: [
      { label: 'Availability', value: '24/7' },
      { label: 'Response time', value: '<1 min' },
    ],
    image: images.bgImageJt7zqg,
  },
  {
    slug: 'invisible-back-office',
    rollNo: '(04)',
    title: 'The Invisible Back Office',
    category: 'Professional Services',
    year: '© 2026',
    description: 'The repetitive admin work happens without anyone touching it.',
    intro:
      'A connected operations workflow that processes documents, moves data between systems, updates records, sends follow-ups, and keeps reporting current automatically.',
    research:
      'We mapped recurring administrative work across email, documents, CRM and internal tools, exposing duplicate entry, copy-pasting, inconsistent records, and manual reporting.',
    solution:
      'Documents and messages are processed automatically, key data is validated and structured, systems stay synchronized, and exceptions are routed to people only when judgment is required.',
    stats: [
      { label: 'Data flow', value: 'Automated' },
      { label: 'Operations', value: '24/7' },
    ],
    image: images.bgImageYiiumx,
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
