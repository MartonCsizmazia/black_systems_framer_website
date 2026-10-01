import { useTranslation, type TextKey } from '../../i18n/i18n'

export interface NavLink {
  title: string
  rollNo: string
  href: string
}

// The home menu: one item per numbered section, in page order; rollNo
// matches that section's eyebrow index, and each '#id' matches the id on
// that section's root element. Titles are translation keys.
// "Home" is the wordmark itself (it scrolls back to the top).
const HOME_LINKS: { titleKey: TextKey; rollNo: string; href: string }[] = [
  { titleKey: 'nav.aboutUs', rollNo: '01', href: '#about' },
  { titleKey: 'nav.services', rollNo: '02', href: '#services' },
  { titleKey: 'nav.caseStudies', rollNo: '03', href: '#case-studies' },
  { titleKey: 'nav.faq', rollNo: '04', href: '#faq' },
  { titleKey: 'nav.contact', rollNo: '05', href: '#contact' },
]

/** The home menu in the current language (navbar default, footer menu). */
export function useHomeNavLinks(): NavLink[] {
  const { t } = useTranslation()
  return HOME_LINKS.map(({ titleKey, rollNo, href }) => ({ title: t(titleKey), rollNo, href }))
}
