import { motion } from 'framer-motion'
import ServiceCard from '../../components/ServiceCard/ServiceCard'
import OverlapFiller from '../../components/OverlapFiller/OverlapFiller'
import SectionEyebrow from '../../components/SectionEyebrow/SectionEyebrow'
import { images } from '../../assets/images'
import './Services.css'

const cards = [
  {
    rollNo: '01',
    category: 'Lead Capture & Response',
    heading: 'Instant follow-up',
    bodyText:
      'Every inquiry from your website, forms, email or ads gets an answer within minutes, day or night. The system qualifies the lead, answers common questions and books the call straight into your calendar.',
    image: images.assetGwbdxr, // "Woman Beach" — default image (no override for card 1 in the source)
  },
  {
    rollNo: '02',
    category: 'Manual Work Automation',
    heading: 'Hands-off operations',
    bodyText:
      'Copy-pasting, data entry, CRM updates, follow-up emails and reports run automatically between your tools, so your team spends its time on clients, not admin.',
    image: images.womanStaircaseBchnf0,
  },
  {
    rollNo: '03',
    category: 'Audit & Custom Systems',
    heading: 'Built around your process',
    bodyText:
      'We map how your business actually runs, find where time and leads are lost, and build tailored automations for everything in between, tested, integrated and supported after launch.',
    image: images.womanBeach7ug4bh,
  },
]

export default function Services() {
  return (
    <section id="services" className="services">
      <OverlapFiller color="ink" />

      <div className="services__top">
        <SectionEyebrow index="02" title="Premium Services" dark />

        <div className="services__content">
          <div className="services__heading-wrap">
            {/* Original held an autoplaying looping video here; that distinct
                asset wasn't fetched during capture, so its poster frame is
                shown as a static image instead. Floated (not absolutely
                positioned) so the heading text that follows it in the DOM
                wraps around it instead of running underneath it. */}
            <motion.p
              className="services__heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } }}
              viewport={{ once: true, amount: 0.01 }}
            >
                Process-driven agency delivering custom-built automation - we map how your business really runs, then design,
                integrate and maintain systems that fit it exactly.
            </motion.p>
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
