import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionEyebrow from '../SectionEyebrow/SectionEyebrow'
import './FaqSection.css'

export interface Faq {
  question: string
  answer: string
}

// Recovered verbatim from the "FAQ List" component in script_main.CmhsiTLL.mjs.
export const DEFAULT_FAQS: Faq[] = [
  {
    question: 'What distinguishes us from other agencies?',
    answer:
      'Fuel blends structured design with purposeful clarity, moving beyond surface visuals to create refined systems that shape brands with long-term impact.',
  },
  {
    question: 'Why not hire an in-house designer or freelancer?',
    answer:
      'You get senior-level consistency without overhead. Fuel delivers focused, high-quality output with the flexibility and precision solo designers often can’t match.',
  },
  {
    question: 'Are creative requests truly unlimited?',
    answer:
      'Yes—requests flow through a structured queue. Fuel handles each task with intention, ensuring every deliverable remains polished, thoughtful, and on-brand.',
  },
  {
    question: 'How fast will I receive my work?',
    answer:
      'Fuel adapts effortlessly. Whether it’s one campaign or a full system, the same clarity, craftsmanship, and refined design process applies from start to finish.',
  },
  {
    question: 'What if I have a single project?',
    answer:
      'Most tasks are delivered within a few days. Fuel’s streamlined workflow ensures each piece is crafted with balance, detail, and dependable turnaround.',
  },
]

// "FAQ Single" variant transition: spring, bounce .2, duration .4.
const toggleSpring = { type: 'spring', bounce: 0.2, duration: 0.4 } as const
const ease = [0.44, 0, 0.34, 0.98] as const

function FaqItem({ faq, index }: { faq: Faq; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    // Each row fades in on first view, 0.8s for the first and 0.1s longer per
    // row after it (0.8 / 0.9 / 1.0 / 1.1 / 1.2 in the source).
    <motion.div
      className="faq-item"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { duration: 0.8 + index * 0.1, ease } }}
      viewport={{ once: true, amount: 0 }}
    >
      <button
        type="button"
        className={`faq-item__content${open ? ' faq-item__content--open' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="faq-item__question">
          <span className="faq-item__question-text text-preset-q70fzl">{faq.question}</span>
          <span className="faq-item__plus" aria-hidden="true">
            {/* The vertical bar turns flat when open, so + becomes − */}
            <motion.span className="faq-item__bar" animate={{ rotate: open ? 90 : 0 }} transition={toggleSpring} />
            <span className="faq-item__bar" style={{ transform: 'rotate(90deg)' }} />
          </span>
        </span>
        <AnimatePresence initial={false}>
          {open && (
            <motion.span
              className="faq-item__answer-wrap"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={toggleSpring}
            >
              <span className="faq-item__answer text-preset-152twjm">{faq.answer}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <span className="faq-item__line" />
    </motion.div>
  )
}

export interface FaqSectionProps {
  /** Element id, so a menu link ('#faq') can scroll to it. */
  id?: string
  /** Section number shown in the eyebrow, e.g. '05' -> "(05)". */
  index?: string
  faqs?: Faq[]
}

/**
 * Recovered from the shared "FAQ Section" component (.framer-jdAJs), which
 * the original reuses on About, Portfolio, Contact and every portfolio
 * detail page (here: the case study pages). Only the section number changes
 * per page; the heading is the site's standard SectionEyebrow.
 */
export default function FaqSection({
  id,
  index = '03',
  faqs = DEFAULT_FAQS,
}: FaqSectionProps) {
  return (
    <section id={id} className="faq-section">
      <div className="faq-section__container">
        <SectionEyebrow index={index} title="Frequently Asked Questions" />
        <div className="faq-section__content">
          <div className="faq-section__list">
            {faqs.map((faq, i) => (
              <FaqItem key={faq.question} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
