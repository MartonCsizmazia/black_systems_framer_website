import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Framer-published sites run Lenis for smooth scrolling (confirmed live:
 * the mirror's <html> carries a "lenis" class and window.lenisVersion is
 * set). Without it, native wheel scrolling feels comparatively "weightless"
 * — no inertia glide once the wheel stops. Framer's own baked-in defaults
 * are duration 1.2s with an easeOutExpo-style curve; bumped to 1.8s here
 * per explicit feedback that the default felt too quick/light — a longer
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
  /** 0 -> 1 progress curve (default: easeInOutCubic — gentle start and stop). */
  easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  /** Pixels to stop short of (negative) or past (positive) the section top. */
  offset: 0,
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
  const el = id === 'top' ? null : document.getElementById(id)
  if (id !== 'top' && !el) return

  if (lenisInstance) {
    lenisInstance.scrollTo(el ?? 0, {
      duration: SECTION_SCROLL.duration,
      easing: SECTION_SCROLL.easing,
      offset: SECTION_SCROLL.offset,
    })
  } else if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
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
