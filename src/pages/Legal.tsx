import { Fragment, type ReactNode } from 'react'
import Navbar, { type NavLink } from '../components/Navbar/Navbar'
import SectionEyebrow from '../components/SectionEyebrow/SectionEyebrow'
import OverlapFiller from '../components/OverlapFiller/OverlapFiller'
import Footer from '../components/Footer/Footer'
import { COMPANY, HOSTING_PROVIDER } from '../data/company'
import { EMAIL, PHONE } from '../data/contact'
import { useTranslation } from '../i18n/i18n'
import './Legal.css'

// Web addresses and email addresses inside the legal texts become links.
const LINK_PATTERN = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g

function linkify(text: string): ReactNode[] {
  return text.split(LINK_PATTERN).map((part, i) => {
    if (i % 2 === 0) return part
    // A sentence may end right after a web address: keep that dot outside.
    const trailing = part.match(/[.,;:)]+$/)?.[0] ?? ''
    const target = trailing ? part.slice(0, -trailing.length) : part
    const href = target.includes('@') && !target.startsWith('http') ? `mailto:${target}` : target
    const external = href.startsWith('http')
    return (
      <Fragment key={i}>
        <a
          href={href}
          className="legal__link"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {target}
        </a>
        {trailing}
      </Fragment>
    )
  })
}

/**
 * Legal information (/legal, /hu/legal): company details first (what
 * clients and accountants look for), then what to expect when working
 * together, then the privacy notice (GDPR Art. 13). The company details are
 * placeholders in src/data/company.ts.
 */
export default function Legal() {
  const { t, tm } = useTranslation()
  const navLinks = useLegalNavLinks()
  const fill = (text: string) => text.replace(/{{company}}/g, COMPANY.name).replace(/{{email}}/g, EMAIL)

  const companyRows: [string, ReactNode][] = [
    [t('legal.company.fields.name'), COMPANY.name],
    [t('legal.company.fields.seat'), COMPANY.seat],
    [t('legal.company.fields.registrationNumber'), COMPANY.registrationNumber],
    [t('legal.company.fields.registrationCourt'), COMPANY.registrationCourt],
    [t('legal.company.fields.taxNumber'), COMPANY.taxNumber],
    ...(COMPANY.euVatNumber ? [[t('legal.company.fields.euVatNumber'), COMPANY.euVatNumber] as [string, ReactNode]] : []),
    [t('legal.company.fields.representative'), t('common.founderName')],
    [t('legal.company.fields.email'), <a href={`mailto:${EMAIL}`} className="legal__link">{EMAIL}</a>],
    [t('legal.company.fields.phone'), <a href={PHONE.href} className="legal__link">{PHONE.display}</a>],
    [
      t('legal.company.fields.hosting'),
      <>
        {HOSTING_PROVIDER.name}, {HOSTING_PROVIDER.address}, {linkify(HOSTING_PROVIDER.email)}
      </>,
    ],
  ]

  return (
    <main className="legal">
      <Navbar links={navLinks} hideCta />

      <section className="legal__intro">
        <div className="legal__intro-inner">
          <h1 className="legal__heading">{t('legal.heading')}</h1>
          <p className="text-preset-q70fzl legal__intro-text">{t('legal.intro')}</p>
          <p className="text-preset-152twjm legal__updated">{t('legal.updated')}</p>
        </div>
      </section>

      <div className="legal__body">
        <OverlapFiller color="paper" />

        <section id="company" className="legal__section">
          <SectionEyebrow index="01" title={t('legal.company.title')} heading />
          <dl className="legal__facts">
            {companyRows.map(([term, value]) => (
              <div className="legal__fact" key={term}>
                <dt className="text-preset-q70fzl legal__fact-term">{term}</dt>
                <dd className="text-preset-q70fzl legal__fact-value">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="working-with-us" className="legal__section">
          <SectionEyebrow index="02" title={t('legal.working.title')} heading />
          <div className="legal__rows">
            {tm('legal.working.items').map((item) => (
              <div className="legal__row" key={item.label}>
                <h3 className="text-preset-q70fzl legal__row-label">{item.label}</h3>
                <div className="legal__row-content">
                  <p className="text-preset-q70fzl legal__text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="privacy" className="legal__section">
          <SectionEyebrow index="03" title={t('legal.privacy.title')} heading />
          <div className="legal__rows">
            {tm('legal.privacy.blocks').map((block) => (
              <div className="legal__row" key={block.label}>
                <h3 className="text-preset-q70fzl legal__row-label">{block.label}</h3>
                <div className="legal__row-content">
                  {block.items.length > 0 && (
                    <dl className="legal__details">
                      {block.items.map((item) => (
                        <div className="legal__detail" key={item.term}>
                          <dt className="text-preset-152twjm legal__detail-term">{item.term}</dt>
                          <dd className="text-preset-q70fzl legal__text">{linkify(fill(item.desc))}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {block.text.map((paragraph) => (
                    <p className="text-preset-q70fzl legal__text" key={paragraph}>
                      {linkify(fill(paragraph))}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}

/** Legal page menu: its three sections, matching their (01)-(03) eyebrows. */
function useLegalNavLinks(): NavLink[] {
  const { t } = useTranslation()
  return [
    { title: t('legal.company.title'), rollNo: '01', href: '#company' },
    { title: t('legal.working.title'), rollNo: '02', href: '#working-with-us' },
    { title: t('legal.privacy.title'), rollNo: '03', href: '#privacy' },
  ]
}
