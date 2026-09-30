import { images } from '../../assets/images'
import { scrollToSection } from '../../hooks/useLenis'
import SquaresLogo from '../SquaresLogo/SquaresLogo'
import Button from '../Button/Button'
import { NAV_LINKS } from '../Navbar/Navbar'
import './Footer.css'

const NAME = 'Márton Csizmazia'
const EMAIL = 'marton@blacksystems.ai'
const PHONE = { display: '+36 30 316 5634', href: 'tel:+36303165634' }
const LINKEDIN = 'https://www.linkedin.com/in/m%C3%A1rton-csizmazia-8047611a3/'

/**
 * Site footer, sitting directly under Contact on the same near-black
 * surface. Reuses the navbar's desktop logo (animated squares + one-line
 * wordmark), its menu links and its smooth-scroll behaviour, and the
 * thin 16% divider lines of the section eyebrows.
 */
export default function Footer() {
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
            <a href="#top" className="footer__logo" aria-label="Black Systems — back to top" onClick={jumpTo('#top')}>
              <SquaresLogo className="footer__logo-icon" label="Black Systems" />
              <img src={images.blackSystemsLogoOneLine.src} alt="" className="footer__logo-img" />
            </a>
            <p className="footer__tagline">
              AI automation for growing businesses — instant lead response, less manual work.
            </p>
            <Button title="Book a call" variant="light" booking />
          </div>

          <div className="footer__column">
            <span className="footer__label text-preset-152twjm">(Contact)</span>
            <a className="footer__link">{NAME}</a>
            <a href={`mailto:${EMAIL}`} className="footer__link">{EMAIL}</a>
            <a href={PHONE.href} className="footer__link">{PHONE.display}</a>
          </div>

          <div className="footer__column">
            <span className="footer__label text-preset-152twjm">(Follow)</span>
            <a href={LINKEDIN} className="footer__link" target="_blank" rel="noopener noreferrer">
              LinkedIn <span className="footer__arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <nav className="footer__column" aria-label="Footer">
            <span className="footer__label text-preset-152twjm">(Menu)</span>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="footer__link" onClick={jumpTo(link.href)}>
                {link.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer__bottom text-preset-152twjm">
          <span>&copy; {year} Black Systems</span>
          <button type="button" className="footer__top-link" onClick={() => scrollToSection('#top')}>
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
