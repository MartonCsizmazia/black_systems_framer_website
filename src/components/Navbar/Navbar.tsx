import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { images } from '../../assets/images'
import SquaresLogo from '../SquaresLogo/SquaresLogo'
import { scrollToSection } from '../../hooks/useLenis'
import Button from '../Button/Button'
import './Navbar.css'

export interface NavLink {
  title: string
  rollNo: string
  href: string
}

export interface NavbarProps {
  /**
   * Menu items. An href of '#<id>' smooth-scrolls to the element with that
   * id on this page ('#top' = page top); anything else is a normal link.
   */
  links?: NavLink[]
}

// One item per numbered section, in page order; rollNo matches that
// section's eyebrow index, and each '#id' matches the id on
// that section's root element.
// "Home" is the wordmark itself (it scrolls back to the top).
const DEFAULT_LINKS: NavLink[] = [
  { title: 'About Us', rollNo: '01', href: '#about' },
  { title: 'Portfolio', rollNo: '02', href: '#portfolio' },
  { title: 'Services', rollNo: '03', href: '#services' },
  { title: 'Testimonial', rollNo: '04', href: '#testimonial' },
  { title: 'Stats', rollNo: '05', href: '#stats' },
  { title: 'Article', rollNo: '06', href: '#article' },
  { title: 'Contact', rollNo: '07', href: '#contact' },
]

// Scroll-driven "compact" state: 0 at the top of the page, 1 once the first
// section (About) reaches the top of the viewport, i.e. after scrolling one
// viewport height past the hero.
//   0   -> 0.5 : CEO card and animated squares fade out
//   0.5 -> 1   : "Book a call" fades in; wordmark shrinks and slides left
//   0   -> 1   : translucent backdrop fades in behind the bar
const COMPACT_HALF = 0.5
const WORDMARK_MIN_SCALE = 0.8
const LOGO_GAP_PX = 6 // matches .navbar__logo-link gap

// Recovered from __framer__appearAnimationsContent id "93osxn" (the navbar's
// own entrance) and the per-item entries used inside "Menu Items" (staggered
// 0.4s/0.5s/0.6s/0.7s delays, tween ease [.44,0,.34,.98], duration .5).
const barAppear = {
  initial: { opacity: 0.001, y: -100, scale: 1 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 60, delay: 0.3, mass: 1, stiffness: 300 },
  },
} as const

const itemAppear = (delay: number) => ({
  initial: { opacity: 0.001, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'tween', ease: [0.44, 0, 0.34, 0.98], duration: 0.5, delay },
  },
})

function MenuIcon() {
  // Recovered inline SVG (viewBox 0 0 14 14), duplicated so the hover state
  // can slide the visible icon from the top copy to the bottom copy inside
  // a 14px-tall clipped track (see .navbar__cta-icon-track:hover in CSS).
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width={14} height={14}>
      <g transform="translate(0.092 1.048) rotate(-10 6.25 6)">
        <path d="M 5.455 0.917 C 5.455 0.41 5.865 0 6.371 0 L 11.538 0 C 12.044 0 12.455 0.41 12.455 0.917 L 12.455 6.083 C 12.455 6.59 12.044 7 11.538 7 L 6.371 7 C 5.865 7 5.455 6.59 5.455 6.083 Z" fill="currentColor" />
        <path d="M 0 7.483 C 0 6.931 0.448 6.483 1 6.483 L 4.455 6.483 C 5.007 6.483 5.455 6.931 5.455 7.483 L 5.455 10.938 C 5.455 11.49 5.007 11.938 4.455 11.938 L 1 11.938 C 0.448 11.938 0 11.49 0 10.938 Z" fill="currentColor" />
      </g>
    </svg>
  )
}

function MenuItem({ title, rollNo, href, delay, onNavigate }: NavLink & { delay: number; onNavigate?: () => void }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    scrollToSection(href)
    onNavigate?.()
  }

  return (
    <motion.a
      className="navbar__menu-item"
      href={href}
      onClick={handleClick}
      {...itemAppear(delay)}
    >
      <span className="navbar__menu-item-page">
        <span className="navbar__menu-item-title text-preset-152twjm">{title}</span>
        <span className="navbar__menu-item-underline" />
      </span>
      <span className="navbar__menu-item-roll text-preset-zhd8ta">{rollNo}</span>
    </motion.a>
  )
}

export default function Navbar({ links = DEFAULT_LINKS }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const { scrollY } = useScroll()
  // Layout-dependent inputs as motion values, re-measured on resize, so the
  // animation updates immediately when the window is resized — not only on
  // the next scroll (a stale value left the wordmark off by the icon's
  // width change when crossing the navbar breakpoint while scrolled down).
  const viewportH = useMotionValue(window.innerHeight)
  const slideDistance = useMotionValue(0)
  const raise = useMotionValue(0)
  const progress = useTransform([scrollY, viewportH], ([y, h]: number[]) => Math.min(1, Math.max(0, y / h)))
  const firstHalfOut = useTransform(progress, [0, COMPACT_HALF], [1, 0])
  const secondHalfIn = useTransform(progress, [COMPACT_HALF, 1], [0, 1])
  const wordmarkScale = useTransform(secondHalfIn, [0, 1], [1, WORDMARK_MIN_SCALE])
  // Slide the wordmark left by exactly the (faded-out) icon's width + gap,
  // so it ends up where the icon started — the left edge of the bar.
  const iconRef = useRef<HTMLSpanElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const measure = () => {
      viewportH.set(window.innerHeight)
      slideDistance.set((iconRef.current?.offsetWidth ?? 0) + LOGO_GAP_PX)
      // How far the bar rises in the compact state comes from CSS
      // (--navbar-raise, set per layout in Navbar.css), so the breakpoint
      // only lives in the stylesheet.
      const cssRaise = headerRef.current ? getComputedStyle(headerRef.current).getPropertyValue('--navbar-raise') : ''
      raise.set(parseFloat(cssRaise) || 0)
    }
    measure()
    window.addEventListener('resize', measure)
    // The icon's width changes via CSS at the breakpoint; observe it directly too.
    const observer = new ResizeObserver(measure)
    if (iconRef.current) observer.observe(iconRef.current)
    return () => {
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [viewportH, slideDistance, raise])
  const wordmarkX = useTransform([secondHalfIn, slideDistance], ([t, d]: number[]) => -t * d)
  const barY = useTransform([progress, raise], ([p, r]: number[]) => -p * r)

  // Whichever of the CEO card / Book button is showing is the interactive one.
  const [compact, setCompact] = useState(false)
  useMotionValueEvent(progress, 'change', (p) => setCompact(p >= COMPACT_HALF))

  const scrollHome = (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection('#top')
    setMobileOpen(false)
  }

  return (
    <motion.header
      ref={headerRef}
      className="navbar"
      data-framer-name="Primary"
      {...barAppear}
    >
      <motion.div className={`navbar__bar${mobileOpen ? ' navbar__bar--open' : ''}`} style={{ y: barY }}>
        {/* Translucent grey backdrop, faded in with scroll so the white menu
            stays readable over light sections. */}
        <motion.div className="navbar__backdrop" style={{ opacity: progress }} aria-hidden="true" />
        <div className="navbar__logo-group">
          <button
            type="button"
            className="navbar__hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
          <a href="#top" className="navbar__logo-link" aria-label="Black Systems — back to top" onClick={scrollHome}>
            <motion.span ref={iconRef} className="navbar__logo-icon-wrap" style={{ opacity: firstHalfOut }}>
              <SquaresLogo className="navbar__logo-icon" label="Black Systems" />
            </motion.span>
            <motion.img
              src={images.blackSystemsLogoOneLine.src}
              alt=""
              className="navbar__logo-img"
              style={{ x: wordmarkX, scale: wordmarkScale }}
            />
          </a>
        </div>

        <nav className="navbar__menu" aria-label="Primary">
          {links.map((link, i) => (
            <MenuItem key={link.title} {...link} delay={0.4 + i * 0.1} onNavigate={() => setMobileOpen(false)} />
          ))}
        </nav>

        <div className="navbar__actions">
        {/* No destination for now (no href), so clicking does nothing. */}
        <motion.a
          className="navbar__cta"
          style={{ opacity: firstHalfOut, pointerEvents: compact ? 'none' : 'auto' }}
          aria-hidden={compact}
        >
          <span className="navbar__cta-avatar">
            <img src={images.ctaAvatarWfrjn1.src} alt={images.ctaAvatarWfrjn1.alt || 'CEO'} />
          </span>
          <span className="navbar__cta-content">
            <span className="navbar__cta-heading-row">
              <span className="navbar__cta-heading text-preset-q70fzl">Meet the CEO</span>
              <span className="navbar__cta-icon-track">
                <MenuIcon />
                <MenuIcon />
              </span>
            </span>
            <span className="navbar__cta-name-position">
              <span className="text-preset-152twjm navbar__cta-name">Márton Csizmazia</span>
              <span className="text-preset-152twjm navbar__cta-position">CEO</span>
            </span>
          </span>
        </motion.a>
        <motion.div
          className="navbar__book"
          style={{ opacity: secondHalfIn, pointerEvents: compact ? 'auto' : 'none' }}
          aria-hidden={!compact}
        >
          <Button title="Book a call" variant="light" booking className="navbar__book-button" tabIndex={compact ? 0 : -1} />
        </motion.div>
        </div>
      </motion.div>
    </motion.header>
  )
}
