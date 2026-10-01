import { useId } from 'react'
import { motion } from 'framer-motion'
import { LANGS, useTranslation, type Lang } from '../../i18n/i18n'
import './LanguageSwitch.css'

/** Each language named in itself, so it's recognisable whatever language the
 * page is currently in. */
const NATIVE_NAMES: Record<Lang, string> = { en: 'English', hu: 'Magyar' }

/**
 * Two-option language switch (EN | HU). The active option gets a white pill
 * that slides across on change. With two languages it acts as one toggle: a
 * click anywhere on it (the active side included) switches to the other
 * language. A radio group for assistive tech; arrow keys move between the
 * options like native radio buttons.
 *
 * `size="small"`: a slimmer version that fits the scrolled navbar.
 * `tabbable={false}`: takes it out of the tab order while it's faded out.
 */
export default function LanguageSwitch({
  className,
  size,
  tabbable = true,
}: {
  className?: string
  size?: 'small'
  tabbable?: boolean
}) {
  const { lang, setLang, t } = useTranslation()
  // Own pill id per switch, so two switches on one page (hero and navbar)
  // don't animate their pills into each other.
  const pillId = useId()
  const other = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return
    e.preventDefault()
    const step = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1
    const next = LANGS[(LANGS.indexOf(lang) + step + LANGS.length) % LANGS.length]
    setLang(next)
    // Keep focus on the option that is now selected.
    ;(e.currentTarget.querySelector(`[data-lang="${next}"]`) as HTMLButtonElement | null)?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={t('common.language')}
      className={['language-switch', size && `language-switch--${size}`, className].filter(Boolean).join(' ')}
      onKeyDown={onKeyDown}
      onClick={() => setLang(other)}
    >
      {LANGS.map((option) => {
        const active = option === lang
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={NATIVE_NAMES[option]}
            lang={option}
            data-lang={option}
            // Only the selected option is in the tab order (radio-group behaviour).
            tabIndex={active && tabbable ? 0 : -1}
            className={`language-switch__option${active ? ' language-switch__option--active' : ''}`}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                className="language-switch__pill"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="language-switch__label text-preset-152twjm">{option.toUpperCase()}</span>
          </button>
        )
      })}
    </div>
  )
}
