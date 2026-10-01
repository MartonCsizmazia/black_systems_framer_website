import { images } from '../../assets/images'
import { scrollToSection, scrollToTop } from '../../hooks/useLenis'
import SquaresLogo from '../SquaresLogo/SquaresLogo'
import Button from '../Button/Button'
import { useHomeNavLinks } from '../Navbar/homeNavLinks'
import { useTranslation } from '../../i18n/i18n'
import { localizePath } from '../../i18n/paths'
import { EMAIL, LINKEDIN, NAME, PHONE } from '../../data/contact'
import './Footer.css'


/**
 * Site footer, sitting directly under Contact on the same near-black
 * surface. Reuses the navbar's desktop logo (animated squares + one-line
 * wordmark), its menu links and its smooth-scroll behaviour, and the
 * thin 16% divider lines of the section eyebrows.
 */
export default function Footer() {
  const { lang, t } = useTranslation()
  const navLinks = useHomeNavLinks()
  const year = new Date().getFullYear()

  const jumpTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection(href)
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a href={localizePath('/', lang)} className="footer__logo" aria-label={t('common.logoLabel')} onClick={jumpTo('#top')}>
              <SquaresLogo className="footer__logo-icon" label={t('common.brand')} />
              <img src={images.blackSystemsLogoOneLine.src} alt="" className="footer__logo-img" />
            </a>
            <p className="footer__tagline">{t('footer.tagline')}</p>
            <Button title={t('common.bookCall')} variant="light" booking />
          </div>

          <div className="footer__column">
            <span className="footer__label text-preset-152twjm">{t('footer.contact')}</span>
            <a className="footer__link">{NAME}</a>
            <a href={`mailto:${EMAIL}`} className="footer__link">{EMAIL}</a>
            <a href={PHONE.href} className="footer__link">{PHONE.display}</a>
          </div>

          <div className="footer__column">
            <span className="footer__label text-preset-152twjm">{t('footer.follow')}</span>
            <a href={LINKEDIN} className="footer__link" target="_blank" rel="noopener noreferrer">
              LinkedIn <span className="footer__arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <nav className="footer__column" aria-label={t('footer.navLabel')}>
            <span className="footer__label text-preset-152twjm">{t('footer.menu')}</span>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="footer__link" onClick={jumpTo(link.href)}>
                {link.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer__bottom text-preset-152twjm">
          <span>{t('footer.copyright', { year })}</span>
          <button type="button" className="footer__top-link" onClick={scrollToTop}>
            {t('common.backToTop')} <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
