import { motion, type MotionValue } from 'framer-motion'
import './WorkCard.css'

export interface WorkCardProps {
  title: string
  category: string
  rollNo: string
  year: string
  href: string
  image: { src: string; alt?: string }
  /** The home page's stacked cards fade their caption out as they get
   * covered (see CaseStudiesPreview.tsx), so it doesn't stay legibly under
   * the next card's caption. Omitted elsewhere: an always-opaque caption. */
  captionOpacity?: MotionValue<number>
}

/**
 * Recovered from the "Work Card" component (.framer-MRFEw) - a blurred,
 * oversized copy of the image sits behind a sharp centered crop, giving a
 * soft glow/vignette around the card art.
 */
export default function WorkCard({
  title,
  category,
  rollNo,
  year,
  href,
  image,
  captionOpacity,
}: WorkCardProps) {
  return (
    <a href={href} className="work-card">
      <div className="work-card__art">
        <img src={image.src} alt={image.alt || ''} className="work-card__art-bg" aria-hidden="true" />
        <div className="work-card__art-inner">
          <img src={image.src} alt={image.alt || title} />
        </div>
      </div>
      <motion.div className="work-card__bottom" style={captionOpacity ? { opacity: captionOpacity } : undefined}>
        <span className="work-card__roll text-preset-152twjm">{rollNo}</span>
        <div className="work-card__text-year">
          <div className="work-card__title-category">
            <h3 className="text-preset-152twjm work-card__title">{title}</h3>
            <span className="text-preset-152twjm work-card__category">{category}</span>
          </div>
          <span className="text-preset-152twjm work-card__year">{year}</span>
        </div>
      </motion.div>
    </a>
  )
}
