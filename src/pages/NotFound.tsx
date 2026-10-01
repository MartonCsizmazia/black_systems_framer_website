import Navbar from '../components/Navbar/Navbar'
import SectionEyebrow from '../components/SectionEyebrow/SectionEyebrow'
import Button from '../components/Button/Button'
import Footer from '../components/Footer/Footer'
import { useTranslation } from '../i18n/i18n'
import { localizePath } from '../i18n/paths'
import './NotFound.css'

/**
 * Shown for any address that isn't a page (prerendered as dist/404.html,
 * which the host serves with a 404 status). Same navbar and footer as the
 * rest of the site; the menu links lead back to the home page's sections.
 */
export default function NotFound() {
  const { lang, t } = useTranslation()
  return (
    <main className="not-found">
      <Navbar />
      <section className="not-found__section">
        <SectionEyebrow index="404" title={t('notFound.eyebrow')} dark />
        <div className="not-found__content">
          <h1 className="not-found__heading">{t('notFound.heading')}</h1>
          <p className="text-preset-q70fzl not-found__text">{t('notFound.text')}</p>
          <Button title={t('common.backHome')} href={localizePath('/', lang)} variant="light" solid />
        </div>
      </section>
      <Footer />
    </main>
  )
}
