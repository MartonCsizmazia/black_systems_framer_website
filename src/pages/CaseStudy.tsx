import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import SectionEyebrow from '../components/SectionEyebrow/SectionEyebrow'
import LineReveal from '../components/LineReveal/LineReveal'

import Footer from '../components/Footer/Footer'
import Contact from '../sections/Contact/Contact'
import { moreCaseStudies, caseStudyHref, type CaseStudyEntry } from '../data/caseStudiesConfig'
import './CaseStudy.css'
import Navbar from "../components/Navbar/Navbar";
import OverlapFiller from "../components/OverlapFiller/OverlapFiller";
import WorkCard from "../components/WorkCard/WorkCard";

// Every value below is copied from the detail-page template chunk
// (s1MaDFfTYJ…XDhxFXEf.mjs, CMS collection "UANVURkgl") — not approximated
// unless a comment says so.
const tweenBg = [0.44, 0, 0.56, 1] as const
const tweenIn = [0.44, 0, 0.34, 0.98] as const
const springSlow = { type: 'spring', damping: 60, mass: 1, stiffness: 300 } as const

const bgAppear = {
  initial: { opacity: 0.001, scale: 1.2 },
  animate: { opacity: 0.7, scale: 1, transition: { type: 'tween', duration: 1, ease: tweenBg } },
}

const containerAppear = {
  initial: { opacity: 0.001, y: 70 },
  animate: { opacity: 1, y: 0, transition: { ...springSlow, delay: 0.1 } },
}

// "Appear" effects on the two content columns: plain opacity 0 -> 1 the first
// time any part of them enters the viewport (threshold 0, animate once).
const fadeIn = (duration: number) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { duration, ease: tweenIn } },
  viewport: { once: true, amount: 0 },
})

function PlusMark() {
  return (
    <span className="case-study-hero__plus" aria-hidden="true">
      <span />
      <span />
    </span>
  )
}

function CaseStudyHero({ caseStudy, fadeTargetRef }: { caseStudy: CaseStudyEntry; fadeTargetRef: React.RefObject<HTMLElement> }) {
  // Same Framer parallax as the home hero (__framer__speed 110 -> 10%).
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, (v) => -v * 0.1)

  // __framer__transformTrigger "onScrollTarget" against the content
  // section's Overlap Detailing panel, viewport threshold .5: the hero fades
  // out while that panel's top travels from mid-viewport to its own bottom
  // reaching mid-viewport. Verified against the mirror (opacity starts
  // dropping at ~436px of scroll on an 873px viewport, gone by ~1280px).
  const { scrollYProgress: fadeProgress } = useScroll({
    target: fadeTargetRef,
    offset: ['start center', 'end center'],
    // The target lives in CaseStudyContent, rendered after this hero, so it
    // isn't attached yet during this component's layout effect.
    layoutEffect: false,
  })
  const opacity = useTransform(fadeProgress, [0, 1], [1, 0])

  return (
    <div className="case-study-hero-wrapper">
      <motion.section className="case-study-hero" style={{ y: parallaxY, opacity }}>
        <motion.div className="case-study-hero__bg" {...bgAppear}>
          <img src={caseStudy.image.src} alt={caseStudy.image.alt || caseStudy.title} />
        </motion.div>

        <div className="case-study-hero__spacer" />

        <motion.div className="case-study-hero__container" {...containerAppear}>
          <div className="case-study-hero__container-spacer" />

          <div className="case-study-hero__text">
            <div className="case-study-hero__detail">
              <PlusMark />
              <PlusMark />
            </div>
            <h2 className="text-preset-1gc7217 case-study-hero__title">{caseStudy.title}</h2>
            <div className="case-study-hero__detail">
              <PlusMark />
              <PlusMark />
            </div>
          </div>

          <div className="case-study-hero__bottom">
            <div className="case-study-hero__bottom-left">
              <p className="text-preset-152twjm">{caseStudy.category}</p>
              <p className="text-preset-152twjm case-study-hero__description">{caseStudy.description}</p>
            </div>
            <p className="text-preset-152twjm case-study-hero__year">{caseStudy.year}</p>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}

function CaseStudyContent({ caseStudy, fadeTargetRef }: { caseStudy: CaseStudyEntry; fadeTargetRef: React.RefObject<HTMLDivElement> }) {
  return (
    <section className="case-study-content">
      <OverlapFiller color="paper" />
      {/* Invisible stand-in for the source's Overlap Detailing section box
          (834px, top of this section) — the hero's fade-out is keyed to it. */}
      <div className="case-study-content__fade-target" ref={fadeTargetRef} aria-hidden="true" />

      <div className="case-study-content__top">
        <SectionEyebrow index="01" title="Read More" />
        <LineReveal as="h3" className="text-preset-13ruabr case-study-content__intro" text={caseStudy.intro} />
      </div>

      <div className="case-study-content__spacer" />

      <div className="case-study-content__bottom">
        <motion.div className="case-study-content__info" {...fadeIn(1.2)}>
          <div className="case-study-content__row">
            <p className="text-preset-q70fzl case-study-content__heading">(Research)</p>
            <p className="text-preset-q70fzl case-study-content__text">{caseStudy.research}</p>
          </div>
          <div className="case-study-content__row">
            <p className="text-preset-q70fzl case-study-content__heading">(Solution)</p>
            <p className="text-preset-q70fzl case-study-content__text">{caseStudy.solution}</p>
          </div>
          <div className="case-study-content__row">
            <p className="text-preset-q70fzl case-study-content__heading">(Results)</p>
            <div className="case-study-content__results">
              <div className="case-study-content__stats">
                {caseStudy.stats.map((s) => (
                  <div className="case-study-content__stat" key={s.label}>
                    <div className="case-study-content__stat-row">
                      <span className="text-preset-q70fzl">{s.label}</span>
                      <span className="text-preset-q70fzl case-study-content__stat-value">{s.value}</span>
                    </div>
                    <span className="case-study-content__stat-line" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function MoreCaseStudies({ caseStudy }: { caseStudy: CaseStudyEntry }) {
  return (
    <section className="more-case-studies">
      <SectionEyebrow index="02" title="Case Studies" />
      <div className="more-case-studies__grid">
        {moreCaseStudies(caseStudy.slug).map((p) => (
          <WorkCard
            key={p.slug}
            title={p.title}
            category={p.category}
            rollNo={p.rollNo}
            year={p.year}
            href={caseStudyHref(p.slug)}
            image={p.image}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * One template for every /case-studies/:slug route, as in the original
 * (a single Framer CMS detail page): blurred cover hero, intro paragraph,
 * research/solution/results, two other case studies, then the Contact
 * section and footer.
 */
export default function CaseStudy({ caseStudy }: { caseStudy: CaseStudyEntry }) {
  const fadeTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `${caseStudy.title} - Black Systems`
  }, [caseStudy.title])

  return (
    <main className="case-study">
      {/* Site-wide fixed navbar, outside the hero: inside it, it would drift
          and fade out with the hero's parallax. */}
      <Navbar />
      <CaseStudyHero caseStudy={caseStudy} fadeTargetRef={fadeTargetRef} />
      <CaseStudyContent caseStudy={caseStudy} fadeTargetRef={fadeTargetRef} />
      <MoreCaseStudies caseStudy={caseStudy} />
      <Contact index="03" />
      <Footer />
    </main>
  )
}
