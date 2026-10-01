import { useEffect } from 'react'
import Lenis from 'lenis'
import { localizePath, parseLangPath } from '../i18n/paths'

/**
 * Framer-published sites run Lenis for smooth scrolling (confirmed live:
 * the mirror's <html> carries a "lenis" class and window.lenisVersion is
 * set). Without it, native wheel scrolling feels comparatively "weightless"
 * - no inertia glide once the wheel stops. Framer's own baked-in defaults
 * are duration 1.2s with an easeOutExpo-style curve; bumped to 1.8s here
 * per explicit feedback that the default felt too quick/light - a longer
 * duration is what makes the post-scroll glide read as heavier ("walking
 * on ice") rather than just slower-but-still-snappy.
 */

/**
 * Menu "jump to section" scrolling. Tune these to change how navigation
 * clicks feel (independent of the wheel settings in useLenis below).
 */
export const SECTION_SCROLL = {
  /** Seconds the scroll animation takes. */
  duration: 1.8,
  /** 0 -> 1 progress curve (default: easeInOutCubic - gentle start and stop). */
  easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  /** Where a jump stops, relative to the section's eyebrow (or its
   * [data-scroll-anchor] element): negative = that many px below the top of
   * the screen. One value for every section, so all jumps land alike; it
   * must clear the compact fixed navbar (~70px tall incl. its top gap);
   * -90 leaves ~20px of breathing room below it. */
  offset: -80,
}

// The page's single Lenis instance, so other components can drive it.
let lenisInstance: Lenis | null = null

/**
 * Smoothly scroll to a section by its element id ('about' or '#about'), or
 * to the very top ('top' / '#top'). Falls back to native smooth scrolling
 * if Lenis isn't running.
 */
export function scrollToSection(target: string) {
  const id = target.replace(/^#/, '')
  // On a sub-page (e.g. /case-studies/<slug>) the home sections aren't on
  // the page: go to them on the home page, in the same language, instead
  // (App scrolls to the hash once it has rendered). The logo's '#top' goes
  // to the home page too.
  const { lang, path } = parseLangPath(window.location.pathname)
  if (path !== '/' && (id === 'top' || !document.getElementById(id))) {
    const home = localizePath('/', lang)
    window.location.href = id === 'top' ? home : `${home}#${id}`
    return
  }
  const section = id === 'top' ? null : document.getElementById(id)
  if (id !== 'top' && !section) return
  // Land on the section's heading row, not its outer edge - sections have
  // different amounts of top padding, so their edges aren't comparable.
  const el = section?.querySelector<HTMLElement>('[data-scroll-anchor], .section-eyebrow') ?? section

  if (lenisInstance) {
    lenisInstance.scrollTo(el ?? 0, {
      duration: SECTION_SCROLL.duration,
      easing: SECTION_SCROLL.easing,
      offset: el ? SECTION_SCROLL.offset : 0,
    })
  } else if (el) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + SECTION_SCROLL.offset, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

/** Smoothly scroll to the top of the current page (any page, unlike
 * scrollToSection('#top'), which leaves a sub-page for the home page). */
export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: SECTION_SCROLL.duration, easing: SECTION_SCROLL.easing })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisInstance = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
    }
  }, [])
}
