import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en from './en.json'
import hu from './hu.json'
import { currentPathIn, parseLangPath } from './paths'

/** The English texts define the shape every language must match: a missing or
 * extra key in hu.json is a type error here. */
export type Translations = typeof en
export type Lang = 'en' | 'hu'

export const LANGS: Lang[] = ['en', 'hu']
export const DEFAULT_LANG: Lang = 'en'

const dictionaries: Record<Lang, Translations> = { en, hu }

/** Every dotted path into the texts ('about.heading', 'faq.items', ...). */
type Paths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends readonly unknown[]
      ? K
      : K | `${K}.${Paths<T[K]>}`
}[keyof T & string]

type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never

export type TranslationPath = Paths<Translations>
/** Paths that lead to a single string (what `t` accepts). */
export type TextKey = {
  [P in TranslationPath]: PathValue<Translations, P> extends string ? P : never
}[TranslationPath]

type Vars = Record<string, string | number>

function lookup(dict: Translations, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], dict)
}

/** Replaces {{name}} placeholders with values from `vars`. */
function interpolate(text: string, vars?: Vars) {
  if (!vars) return text
  return text.replace(/\{\{(\w+)}}/g, (match, name) => (name in vars ? String(vars[name]) : match))
}

/** `t` for any language without React (e.g. the build-time prerender). */
export function translate(lang: Lang, key: TextKey, vars?: Vars): string {
  const value = lookup(dictionaries[lang], key) ?? lookup(dictionaries[DEFAULT_LANG], key)
  return typeof value === 'string' ? interpolate(value, vars) : key
}

export function getTexts(lang: Lang): Translations {
  return dictionaries[lang]
}

const STORAGE_KEY = 'lang'

const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang)

/** The language the visitor picked earlier with the switch, if any. */
export function savedLang(): Lang | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return isLang(saved) ? saved : null
  } catch {
    return null // storage blocked (private mode, disabled cookies)
  }
}

/** Where a visitor should be on page load, if not on `current`: a choice saved
 * earlier wins; on a first visit, a Hungarian browser (any 'hu…', e.g. hu-HU)
 * is sent from an English page to the Hungarian one. Otherwise null (stay).
 * Crawlers browse with English settings, so they are never redirected. */
export function preferredLang(current: Lang): Lang | null {
  const saved = savedLang()
  if (saved) return saved === current ? null : saved
  if (current === 'en' && navigator.language?.toLowerCase().startsWith('hu')) return 'hu'
  return null
}

interface I18nContextValue {
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

const I18nContext = createContext<I18nContextValue | null>(null)

/**
 * Provides the page's language. It starts from the address (/hu/... is
 * Hungarian, see i18n/paths.ts), so prerendered HTML and the browser agree;
 * after that, switching languages happens in place: the texts change and the
 * address is updated with the History API, without reloading the page.
 * Every language version still has its own prerendered file, so opening or
 * refreshing an address loads that language directly.
 */
export function I18nProvider({ lang: initialLang, children }: { lang: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const texts = dictionaries[lang]

  // On load: the visitor's preferred language (saved choice, or a Hungarian
  // browser on a first visit), switched in place. replaceState, so it doesn't
  // add a history entry.
  useEffect(() => {
    const target = preferredLang(initialLang)
    if (!target) return
    setLangState(target)
    window.history.replaceState(window.history.state, '', currentPathIn(target))
  }, [initialLang])

  // Back / forward between the language versions this page pushed.
  useEffect(() => {
    const onPopState = () => setLangState(parseLangPath(window.location.pathname).lang)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const setLang = useCallback(
    (next: Lang) => {
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Storage blocked: still switch, just not remembered.
      }
      if (next === lang) return
      setLangState(next)
      window.history.pushState(window.history.state, '', currentPathIn(next))
    },
    [lang],
  )

  const t = useCallback((key: TextKey, vars?: Vars) => translate(lang, key, vars), [lang])
  const tm = useCallback(
    <P extends TranslationPath>(key: P) => (lookup(texts, key) ?? lookup(dictionaries[DEFAULT_LANG], key)) as PathValue<Translations, P>,
    [texts],
  )

  // Keeps <html lang> in sync (screen readers, browser translation, SEO).
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t, tm, texts }), [lang, setLang, t, tm, texts])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used inside <I18nProvider>')
  return ctx
}
