import { useEffect } from 'react'

/**
 * Cal.com popup booking embed. Any element carrying the data-cal-* attributes
 * from `calTriggerProps` opens the booking calendar in a modal (see
 * <Button booking />). embed.js listens for clicks at the document level, so
 * triggers rendered later by React work too. No backend or API key involved.
 */

/** Change these to point at a different Cal.com event type. */
export const CAL_LINK = 'marton-csizmazia-avnndf/30min'
export const CAL_NAMESPACE = '30min'

/** Plain booking page URL — the fallback href if embed.js fails to load. */
export const CAL_URL = `https://cal.com/${CAL_LINK}`

/** Attributes that make a link open the booking popup (pair with href={CAL_URL}). */
export const calTriggerProps = {
  'data-cal-link': CAL_LINK,
  'data-cal-namespace': CAL_NAMESPACE,
  'data-cal-config': JSON.stringify({ layout: 'month_view' }),
}

// Set once embed.js has actually loaded. Until then (or if it's blocked),
// booking links fall back to navigating to CAL_URL.
// Kept on window so it survives hot reloads of this module in dev.
export const isCalEmbedReady = () => window.__calEmbedReady === true

/**
 * Click handler for booking triggers. embed.js opens the modal from its own
 * document-level listener but never cancels the link's navigation, so do
 * that here — only when the embed is ready, keeping the href fallback.
 */
export function preventCalNavigation(e: { preventDefault: () => void }) {
  if (isCalEmbedReady()) e.preventDefault()
}

type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean
  ns: Record<string, (...args: unknown[]) => void>
  q?: unknown[][]
}

declare global {
  interface Window {
    Cal?: CalApi
    __calEmbedReady?: boolean
  }
}

// Cal.com's official loader snippet, typed: defines window.Cal, queues calls,
// and lazy-loads embed.js on first use.
function installCalLoader(C: Window, A: string, L: string) {
  const p = (a: { q: unknown[][] }, ar: unknown) => { a.q.push(ar as unknown[]) }
  const d = C.document
  C.Cal = C.Cal || (function (this: unknown, ...ar: unknown[]) {
    const cal = C.Cal as CalApi & { q: unknown[][] }
    if (!cal.loaded) {
      cal.ns = {}
      cal.q = cal.q || []
      d.head.appendChild(d.createElement('script')).src = A
      cal.loaded = true
    }
    if (ar[0] === L) {
      const api = Object.assign(function (...args: unknown[]) { p(api, args) }, { q: [] as unknown[][] })
      const namespace = ar[1]
      if (typeof namespace === 'string') {
        cal.ns[namespace] = cal.ns[namespace] || api
        p(cal.ns[namespace] as unknown as { q: unknown[][] }, ar)
        p(cal, ['initNamespace', namespace])
      } else p(cal, ar)
      return
    }
    p(cal, ar)
  } as CalApi)
}

const EMBED_SRC = 'https://app.cal.com/embed/embed.js'

export function useCalEmbed() {
  useEffect(() => {
    // Only set up once (React StrictMode runs effects twice in dev).
    if (window.Cal?.ns?.[CAL_NAMESPACE]) return
    installCalLoader(window, EMBED_SRC, 'init')
    const Cal = window.Cal!
    Cal('init', CAL_NAMESPACE, { origin: 'https://app.cal.com' })
    document.querySelector(`script[src="${EMBED_SRC}"]`)?.addEventListener('load', () => { window.__calEmbedReady = true })
    Cal.ns[CAL_NAMESPACE]('ui', {
      theme: 'dark',
      hideEventTypeDetails: false,
      layout: 'month_view',
      // Monochrome to match the site's black/white palette.
      cssVarsPerTheme: {
        light: { 'cal-brand': '#111111' },
        dark: { 'cal-brand': '#ffffff' },
      },
    })
  }, [])
}
