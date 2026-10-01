import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { currentPathIn, parseLangPath } from './paths'
import { I18nContext } from './context'
import { DEFAULT_LANG, STORAGE_KEY, getTexts, lookup, preferredLang, translate, type Lang, type PathValue, type TextKey, type TranslationPath, type Translations, type Vars } from './i18n'

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
  const texts = getTexts(lang)

  // On load: the visitor's preferred language (saved choice, or a Hungarian
  // browser on a first visit), switched in place. replaceState, so it doesn't
  // add a history entry.
  useEffect(() => {
    const target = preferredLang(initialLang)
    if (!target) return
    // Deliberately after mount, not in the initial state: the first render
    // must match the prerendered HTML (the address's language) to hydrate.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <P extends TranslationPath>(key: P) => (lookup(texts, key) ?? lookup(getTexts(DEFAULT_LANG), key)) as PathValue<Translations, P>,
    [texts],
  )

  // Keeps <html lang> in sync (screen readers, browser translation, SEO).
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t, tm, texts }), [lang, setLang, t, tm, texts])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
