import { CAL_URL, calTriggerProps, preventCalNavigation } from '../../hooks/useCalEmbed'
import './Button.css'

export interface ButtonProps {
  title?: string
  href?: string
  variant?: 'light' | 'dark'
  newTab?: boolean
  /** Opens the Cal.com booking popup instead of navigating (href is ignored). */
  booking?: boolean
  /** Filled block style for the page's main calls to action; the default
   * underlined text style is for secondary ones. */
  solid?: boolean
  /** With `solid`: brand-orange fill instead of the black/white one. */
  accent?: boolean
  /** Extra class for context-specific sizing (e.g. a compact navbar button). */
  className?: string
  tabIndex?: number
}

/**
 * Recovered from the "Button" component in rOGldfam3.BqEDOnzk.mjs
 * (framer-cVr5E). Text on the left, a 45deg-rotated arrow icon + underline
 * on the right; on hover the icon slides from top to bottom within its
 * clipped 8px track.
 */
export default function Button({ title = 'Explore Now', href = '#', variant = 'light', newTab = false, booking = false, solid = false, accent = false, className, tabIndex }: ButtonProps) {
  return (
    <a
      href={booking ? CAL_URL : href}
      {...(booking ? { ...calTriggerProps, onClick: preventCalNavigation } : {})}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={`button button--${variant}${solid ? ' button--solid' : ''}${solid && accent ? ' button--accent' : ''}${className ? ` ${className}` : ''}`}
      tabIndex={tabIndex}
    >
      <span className="button__content">
        <span className="button__text text-preset-q70fzl">{title}</span>
        <span className="button__icon-track">
          <span className="button__arrow" />
          <span className="button__arrow" />
        </span>
      </span>
      <span className="button__line" />
    </a>
  )
}
