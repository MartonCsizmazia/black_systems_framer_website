// Languages, texts and the useTranslation hook. The <I18nProvider>
// component itself is in I18nProvider.tsx (a component-only file, so it
// hot-reloads cleanly during development).
import { useContext } from 'react'
import en from './en.json'
import hu from './hu.json'
import { I18nContext } from './context'

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

export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
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

export type Vars = Record<string, string | number>

export function lookup(dict: Translations, path: string): unknown {
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

export const STORAGE_KEY = 'lang'

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

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used inside <I18nProvider>')
  return ctx
}
