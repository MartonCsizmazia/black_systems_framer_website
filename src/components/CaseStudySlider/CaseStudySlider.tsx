import { useEffect, useRef, useState } from 'react'
import WorkCard from '../WorkCard/WorkCard'
import { scrollToSection } from '../../hooks/useLenis'
import { caseStudies, caseStudyHref } from '../../data/caseStudiesConfig'
import './CaseStudySlider.css'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'

export interface CaseStudySliderProps {
  /** Slug of the case study being viewed: its card is tagged "(Current)",
   * scrolled into view on load, and scrolls up to `currentTarget` instead
   * of reloading the page. */
  currentSlug: string
  /** Section id the current card scrolls to (e.g. '#case-study-content'). */
  currentTarget: string
}

function Arrow({ direction }: { direction: 'prev' | 'next' }) {
  // Same chevrons as the testimonial slider's buttons.
  return (
    <svg viewBox="0 0 8.004 14.003" width={8} height={14} aria-hidden="true">
      <path
        fill="currentColor"
        d={
          direction === 'prev'
            ? 'M 7.733 12.442 C 8.094 12.799 8.094 13.378 7.733 13.735 C 7.372 14.092 6.786 14.092 6.425 13.735 L 0.271 7.648 C 0.098 7.477 0 7.244 0 7.002 C 0 6.759 0.098 6.526 0.271 6.355 L 6.425 0.268 C 6.786 -0.089 7.372 -0.089 7.733 0.268 C 8.094 0.625 8.094 1.204 7.733 1.561 L 2.234 7.001 Z'
            : 'M 0.271 12.442 C -0.09 12.799 -0.09 13.378 0.271 13.735 C 0.632 14.092 1.217 14.092 1.579 13.735 L 7.732 7.648 C 7.906 7.477 8.004 7.244 8.004 7.002 C 8.004 6.759 7.906 6.526 7.732 6.355 L 1.579 0.268 C 1.217 -0.089 0.632 -0.089 0.271 0.268 C -0.09 0.625 -0.09 1.204 0.271 1.561 L 5.77 7.001 Z'
        }
      />
    </svg>
  )
}

/** Scroll position at which `slide` rests, following its CSS
 * scroll-snap-align (start / center / end), clamped to the track's range. */
function snapLeft(track: HTMLElement, slide: HTMLElement) {
  const align = getComputedStyle(slide).scrollSnapAlign.split(' ').pop()
  const start = slide.offsetLeft - track.offsetLeft
  const free = track.clientWidth - slide.offsetWidth
  const left = align === 'center' ? start - free / 2 : align === 'end' ? start - free : start
  return Math.min(track.scrollWidth - track.clientWidth, Math.max(0, left))
}

/**
 * Finite horizontal slider of every case study (the current one included,
 * in config order). Native horizontal scrolling with scroll-snap, so touch
 * swipes and trackpad scrolls work as-is; the arrows move one card and are
 * disabled at either end. Cards per view come from CSS (3 / 2 / ~1); on
 * phones the middle cards snap to the centre, the first and last to the
 * edges, so reaching either end is visible.
 */
export default function CaseStudySlider({ currentSlug, currentTarget }: CaseStudySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateEnds = () => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 1)
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 1)
  }

  // Start with the current case study at its snap position (instantly,
  // before paint).
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current
    const current = track?.querySelector<HTMLElement>('[aria-current="page"]')
    if (track && current) track.scrollLeft = snapLeft(track, current)
    updateEnds()
  }, [currentSlug])

  useEffect(() => {
    window.addEventListener('resize', updateEnds)
    return () => window.removeEventListener('resize', updateEnds)
  }, [])

  // Card by card, to the same positions the CSS snaps to (on phones the
  // middle cards are centred, so a fixed step distance wouldn't fit).
  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const slides = Array.from(track.children) as HTMLElement[]
    const positions = slides.map((slide) => snapLeft(track, slide))
    const nearest = positions.reduce(
      (best, left, i) => (Math.abs(left - track.scrollLeft) < Math.abs(positions[best] - track.scrollLeft) ? i : best),
      0,
    )
    const target = Math.min(slides.length - 1, Math.max(0, nearest + direction))
    track.scrollTo({ left: positions[target], behavior: 'smooth' })
  }

  return (
    <div className="case-study-slider">
      {/* Horizontal-dominant gestures scroll this track natively; Lenis keeps
          handling vertical page scrolling over it. */}
      <div className="case-study-slider__track" ref={trackRef} onScroll={updateEnds} data-lenis-prevent-horizontal>
        {caseStudies.map((cs) => {
          const isCurrent = cs.slug === currentSlug
          return (
            <div
              key={cs.slug}
              className="case-study-slider__slide"
              aria-current={isCurrent ? 'page' : undefined}
              onClickCapture={
                isCurrent
                  ? (e) => {
                      e.preventDefault()
                      scrollToSection(currentTarget)
                    }
                  : undefined
              }
            >
              <WorkCard
                title={cs.title}
                category={cs.category}
                rollNo={cs.rollNo}
                year={cs.year}
                href={caseStudyHref(cs.slug)}
                image={cs.image}
              />
              {isCurrent && <span className="case-study-slider__current text-preset-152twjm">(Current)</span>}
            </div>
          )
        })}
      </div>

      <div className="case-study-slider__controls">
        <button type="button" aria-label="Previous case studies" onClick={() => step(-1)} disabled={!canPrev}>
          <Arrow direction="prev" />
        </button>
        <button type="button" aria-label="Next case studies" onClick={() => step(1)} disabled={!canNext}>
          <Arrow direction="next" />
        </button>
      </div>
    </div>
  )
}
