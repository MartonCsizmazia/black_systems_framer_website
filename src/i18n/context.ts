import { createContext } from 'react'
import type { Lang, PathValue, TextKey, TranslationPath, Translations, Vars } from './i18n'

// The context object lives in its own module, so a hot reload of
// the i18n modules during development doesn't create a second context (which
// left the already-mounted components outside the new provider).

export interface I18nContextValue {
  lang: Lang
  /** The visitor picked a language (the language switch): remembers it
   * (localStorage 'lang'), switches the texts in place and changes the
   * address to the same page in that language (no reload). */
  setLang: (lang: Lang) => void
  /** A single text by key, with optional {{placeholders}}. */
  t: (key: TextKey, vars?: Vars) => string
  /** A whole object or list by key (FAQ items, stats, cards...). */
  tm: <P extends TranslationPath>(key: P) => PathValue<Translations, P>
  /** All texts of the current language. */
  texts: Translations
}

export const I18nContext = createContext<I18nContextValue | null>(null)
