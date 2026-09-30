import { useCallback, useSyncExternalStore } from 'react'

/**
 * Whether the given media query matches (e.g. mediaQueries.phone from
 * styles/breakpoints), kept in sync on resize.
 *
 * Returns null while the viewport isn't known yet: during the build-time
 * prerender, and during the browser's first (hydration) render, so it
 * matches the prerendered HTML. React re-renders with the real value
 * immediately after hydrating.
 */
export function useMediaQuery(query: string): boolean | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  )
}
