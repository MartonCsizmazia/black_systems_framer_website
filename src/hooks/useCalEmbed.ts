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

/** Plain booking page URL - the fallback href if embed.js fails to load. */
export const CAL_URL = `https://cal.com/${CAL_LINK}`

/** Attributes that make a link open the booking popup (pair with href={CAL_URL}). */
export const calTriggerProps = {
  'data-cal-link': CAL_LINK,
  'data-cal-namespace': CAL_NAMESPACE,
  'data-cal-config': JSON.stringify({ layout: 'month_view' }),
}

// Set once embed.js has actually loaded (__calEmbedFailed: it could not load).
// Kept on window so it survives hot reloads of this module in dev.
export const isCalEmbedReady = () => window.__calEmbedReady === true

/**
 * Click handler for booking triggers. Once embed.js is loaded it opens the
 * modal from its own document-level listener but never cancels the link's
 * navigation, so do that here. Before it has loaded (a click with no hover
 * or focus first), load it now and open the modal through the queued API.
 * If embed.js failed to load, the link simply navigates to CAL_URL.
 */
export function preventCalNavigation(e: { preventDefault: () => void }) {
  if (window.__calEmbedFailed) return
  e.preventDefault()
  if (isCalEmbedReady()) return
  window.__calEmbedPending = true
  loadCalEmbed()
  window.Cal!.ns[CAL_NAMESPACE]('modal', { calLink: CAL_LINK, config: { layout: 'month_view' } })
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
    __calEmbedFailed?: boolean
    __calEmbedPending?: boolean
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

/** Sets up the embed and starts loading embed.js (only the first call counts). */
function loadCalEmbed() {
  if (window.Cal?.ns?.[CAL_NAMESPACE]) return
  installCalLoader(window, EMBED_SRC, 'init')
  const Cal = window.Cal!
  Cal('init', CAL_NAMESPACE, { origin: 'https://app.cal.com' })
  const script = document.querySelector(`script[src="${EMBED_SRC}"]`)
  script?.addEventListener('load', () => { window.__calEmbedReady = true })
  script?.addEventListener('error', () => {
    window.__calEmbedFailed = true
    // A click made before loading finished was cancelled; go to the page instead.
    if (window.__calEmbedPending) window.location.assign(CAL_URL)
  })
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
}

/**
 * Loads Cal.com only when a visitor heads for a booking button (hover, focus
 * or touch), so its script and cookies stay off the page for everyone else.
 */
export function useCalEmbed() {
  useEffect(() => {
    const events = ['pointerover', 'focusin', 'touchstart'] as const
    const onIntent = (e: Event) => {
      if (!(e.target instanceof Element) || !e.target.closest('[data-cal-link]')) return
      loadCalEmbed()
      events.forEach((type) => document.removeEventListener(type, onIntent))
    }
    events.forEach((type) => document.addEventListener(type, onIntent, { passive: true }))
    return () => events.forEach((type) => document.removeEventListener(type, onIntent))
  }, [])
}
