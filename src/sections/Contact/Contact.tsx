import { motion } from 'framer-motion'
import { images } from '../../assets/images'
import OverlapFiller from '../../components/OverlapFiller/OverlapFiller'
import SectionEyebrow from '../../components/SectionEyebrow/SectionEyebrow'
import { useTranslation } from '../../i18n/i18n'
import { localizePath } from '../../i18n/paths'
import './Contact.css'

/**
 * Recovered from the original site's "Contact" page - reached via the
 * navbar's Contact link, which (like About and Case Studies) is client-side
 * routed with no URL change, so it was never captured as a separate mirror
 * entry. Measured directly by clicking through the live mirror instead: a
 * full-bleed black section, a two-column row (a tall portrait photo, then
 * the heading + short description + form, 127px gap, 574x940 measured photo
 * size), borderless inputs with a label above each one and no visible
 * underline/box - confirmed by checking border/box-shadow at every level of
 * the DOM chain, all transparent. The photo itself (alt "Men Orange BG")
 * wasn't in the mirror capture at all - it loads straight from Framer's own
 * CDN on the live site, so it was fetched separately (see assets/images).
 * The FAQ section that follows this on the original page is reused across
 * About/Case Studies/Contact and isn't part of this component; it doesn't
 * exist elsewhere in this project yet either.
 *
 * Standalone by design (only imports Contact.css and the shared images
 * module) so it can be copied directly into another project alongside its
 * stylesheet - just bring the men-orange-bg-bfbeq6 image file too, or swap
 * in your own.
 */
/** `index`: the section number in its eyebrow, which differs per page. */
export default function Contact({ index = '05' }: { index?: string }) {
  const { lang, t } = useTranslation()
  // Hungarian names put the family name first, so the form asks for it first.
  const nameFields = lang === 'hu' ? (['lastName', 'firstName'] as const) : (['firstName', 'lastName'] as const)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // No real backend wired up - the original is a Framer-hosted form.
  }

  return (
    <section id="contact" className="contact">
      <OverlapFiller color="ink" />

      <SectionEyebrow index={index} title={t('contact.eyebrow')} dark />

      <div className="contact__layout">
        <div className="contact__photo">
          <img src={images.menOrangeBgBfbeq6.src} alt={images.menOrangeBgBfbeq6.alt || ''} />
        </div>

        <div className="contact__inner">
          <motion.h2
            className="contact__heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } }}
            viewport={{ once: true, amount: 0.01 }}
          >
            {t('contact.heading')}
          </motion.h2>

          <p className="text-preset-q70fzl contact__description">{t('contact.description')}</p>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__row">
              {nameFields.map((field) => (
                <label key={field} className="contact__field">
                  <span className="text-preset-152twjm contact__label">{t(`contact.${field}`)}</span>
                  <input className="text-preset-152twjm" type="text" name={field} placeholder={t(`contact.${field}Placeholder`)} required />
                </label>
              ))}
            </div>

            <label className="contact__field">
              <span className="text-preset-152twjm contact__label">{t('contact.email')}</span>
              <input className="text-preset-152twjm" type="email" name="email" placeholder={t('contact.emailPlaceholder')} required />
            </label>

            <label className="contact__field">
              <span className="text-preset-152twjm contact__label">{t('contact.message')}</span>
              <textarea className="text-preset-152twjm" name="message" placeholder={t('contact.messagePlaceholder')} rows={4} />
            </label>

            <p className="text-preset-152twjm contact__privacy">
              {t('contact.privacyNote')}{' '}
              <a href={`${localizePath('/legal', lang)}#privacy`} className="contact__privacy-link">
                {t('contact.privacyLink')}
              </a>
              .
            </p>

            <button type="submit" className="text-preset-q70fzl contact__submit">
              {t('contact.submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
