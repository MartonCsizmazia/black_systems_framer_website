import { motion } from 'framer-motion'
import ServiceCard from '../../components/ServiceCard/ServiceCard'
import OverlapFiller from '../../components/OverlapFiller/OverlapFiller'
import SectionEyebrow from '../../components/SectionEyebrow/SectionEyebrow'
import { images } from '../../assets/images'
import { useTranslation } from '../../i18n/i18n'
import './Services.css'

// Language-independent parts of the three service cards; their texts (and
// the images' alt texts) come from services.cards in the translation files,
// in the same order.
const cardMeta = [
  { rollNo: '01', image: images.leadCapture },
  { rollNo: '02', image: images.manualWork },
  { rollNo: '03', image: images.auditCustom },
]

export default function Services() {
  const { t, tm } = useTranslation()
  const cards = tm('services.cards').map((text, i) => ({
    ...cardMeta[i],
    image: { src: cardMeta[i].image.src, alt: text.imageAlt },
    category: text.category,
    heading: text.heading,
    bodyText: text.body,
  }))
  return (
    <section id="services" className="services">
      <OverlapFiller color="ink" />

      <div className="services__top">
        <SectionEyebrow index="02" title={t('services.eyebrow')} dark />

        <div className="services__content">
          <div className="services__heading-wrap">
            {/* Original held an autoplaying looping video here; that distinct
                asset wasn't fetched during capture, so its poster frame is
                shown as a static image instead. Floated (not absolutely
                positioned) so the heading text that follows it in the DOM
                wraps around it instead of running underneath it. */}
            <motion.h2
              className="services__heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } }}
              viewport={{ once: true, amount: 0.01 }}
            >
                {t('services.heading')}
            </motion.h2>
          </div>

          <div className="services__button-detail">
            {/*<Button title="Explore More" href="/about" variant="light" />*/}
            <div className="services__details" aria-hidden="true">
              <span className="services__plus" />
              <span className="services__plus" />
              <span className="services__plus" />
            </div>
          </div>
        </div>
      </div>

      <div className="services__bottom">
        {cards.map((c) => (
          <ServiceCard key={c.rollNo} {...c} />
        ))}
      </div>
    </section>
  )
}
