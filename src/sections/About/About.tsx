import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import OverlapFiller from '../../components/OverlapFiller/OverlapFiller'
import SectionEyebrow from '../../components/SectionEyebrow/SectionEyebrow'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import ClientLogos from '../ClientLogos/ClientLogos'
import { NAME } from '../../data/contact'
import { useTranslation } from '../../i18n/I18nProvider'
import { images } from '../../assets/images'
import './About.css'

// The portrait's own container stays put; scrolling instead pans the
// (deliberately oversized, `height:150%`) image linearly inside it — no
// spring, a direct 1:1 function of scroll progress, slower than the page's
// own scroll speed since it only covers this many px against a full
// viewport-heights-tall scroll range. Range must stay within the safe
// [-220, 0] window (220px = the 150%-height image's total overflow inside
// its 440px-tall container) or the container would show empty space at an
// edge. -170 shows more of the subject's legs at entry; push further toward
// -220 for even more, or back toward 0 for less.
const ABOUT_IMAGE_PARALLAX_START = -170

// Recovered inline transitions (local consts in the "Home" page chunk, not
// the global appear-animations table): simple opacity fades triggered
// on-scroll-into-view (threshold 0, animate once).
const fadeIn = (duration: number) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { duration, ease: [0.44, 0, 0.34, 0.98] } },
  viewport: { once: false, amount: 0.01 },
})

export default function About() {
  const { t, tm } = useTranslation()
  const stats = tm('about.results.stats')
  const moreParagraphs = tm('about.founder.more')
  const imageRef = useRef<HTMLDivElement>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(imageScrollProgress, [0, 1], [ABOUT_IMAGE_PARALLAX_START, 0])

  return (
    <section id="about" className="about">
      <OverlapFiller color="paper" />

      {/* Past employers' logos, right under the slanted edge and above the
          eyebrow: the first thing seen when scrolling past the hero. Not a
          numbered section, so no menu link. */}
      <div className="about__logos">
        <ClientLogos />
      </div>

      <div className="about__top">
        <SectionEyebrow index="01" title={t('about.eyebrow')} />
        <motion.p
          className="about__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } }}
          viewport={{ once: true, amount: 0.01 }}
        >
            {t('about.heading')}
        </motion.p>
      </div>

      <div className="about__bottom">
        <div className="about__portrait">
          <motion.div className="about__image" ref={imageRef} {...fadeIn(0.6)}>
            {/* TODO: replace with the founder's own photo (also used in the navbar's CEO card). */}
            <motion.img src={images.assetMrongf.src} alt={NAME} style={{ y: imageY }} />
          </motion.div>

        </div>

        <motion.div className="about__columns" {...fadeIn(1.2)}>
          <div className="about__column">
            <span className="about__column-heading text-preset-q70fzl">{t('about.pre.label')}</span>
            <p className="about__column-text text-preset-q70fzl">{t('about.pre.text')}</p>
          </div>
          <div className="about__column">
            <span className="about__column-heading text-preset-q70fzl">{t('about.post.label')}</span>
            <p className="about__column-text text-preset-q70fzl">{t('about.post.text')}</p>
          </div>
          <div className="about__column">
            <span className="about__column-heading text-preset-q70fzl">{t('about.results.label')}</span>
            <div className="about__results-content">
              <div className="about__stats">
                {stats.map((s) => (
                  <div className="about__stat" key={s.label}>
                    <div className="about__stat-row">
                      <span className="text-preset-q70fzl">{s.label}</span>
                      <span className="text-preset-q70fzl about__stat-value">{s.value}</span>
                    </div>
                    <span className="about__stat-line" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Founder intro, attached to the CTA banner below it (whose
          photo + "Let's talk" complete it). id="founder" is the target of
          the navbar's "Meet the CEO" card. */}
      <div id="founder" className="about__cta">
        <motion.div className="about__founder" {...fadeIn(1.2)}>
          {/* Same row structure as (Pre) / (+Post) / (=Results): the label in
              the heading position, name + role + intro in the text column. */}
          <div className="about__founder-row">
            <div className="about__column">
              <span className="about__column-heading text-preset-q70fzl">{t('about.founder.label')}</span>
              <div className="about__founder-content">
                <h3 className="about__founder-name">{NAME}</h3>
                <span className="text-preset-q70fzl about__founder-role">{t('about.founder.role')}</span>
                <p className="text-preset-q70fzl about__founder-text">{t('about.founder.intro')}</p>

                {/* Longer background, revealed on demand so the intro stays short. */}
                <AnimatePresence initial={false}>
                  {moreOpen && (
                    <motion.div
                      id="founder-more"
                      className="about__founder-more"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.44, 0, 0.34, 0.98] }}
                    >
                      {moreParagraphs.map((paragraph) => (
                        <p key={paragraph} className="text-preset-q70fzl about__founder-text">
                          {paragraph}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  className="about__founder-toggle text-preset-q70fzl"
                  aria-expanded={moreOpen}
                  aria-controls="founder-more"
                  onClick={() => setMoreOpen((v) => !v)}
                >
                  {moreOpen ? t('about.founder.lessToggle') : t('about.founder.moreToggle')}{' '}
                  <span aria-hidden="true">{moreOpen ? '↑' : '↓'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        <CtaBanner />
      </div>
    </section>
  )
}
