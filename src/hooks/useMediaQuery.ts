import { useEffect, useState } from 'react'

/**
 * True while the given media query matches (e.g. mediaQueries.phone from
 * styles/breakpoints). Read synchronously on first render so the initial
 * markup already matches the viewport, then kept in sync on resize.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
