import { useEffect } from 'react'
import { scrollToSection, useLenis } from './hooks/useLenis'
import { useCalEmbed } from './hooks/useCalEmbed'
import Home from './pages/Home'
import CaseStudy from './pages/CaseStudy'
import { findCaseStudy } from './data/caseStudiesConfig'

// Minimal path-based routing: every link in the site is a plain <a href>, so
// navigation is a full page load and the route only needs resolving once.
// Vite's dev server and `vite preview` both fall back to index.html for
// unknown paths, so /case-studies/<slug> works without extra config.
function resolveRoute(pathname: string) {
  const match = pathname.replace(/\/+$/, '').match(/^\/case-studies\/([^/]+)$/)
  const caseStudy = match ? findCaseStudy(match[1]) : undefined
  return caseStudy ? <CaseStudy caseStudy={caseStudy} /> : <Home />
}

export default function App() {
  useLenis()
  useCalEmbed()

  // Arriving from a sub-page menu link like "/#services": the browser's own
  // anchor jump runs before React has rendered the section, so scroll once
  // the page is mounted instead.
  useEffect(() => {
    if (!window.location.hash) return
    const id = window.location.hash
    const t = window.setTimeout(() => scrollToSection(id), 100)
    return () => window.clearTimeout(t)
  }, [])

  return resolveRoute(window.location.pathname)
}
