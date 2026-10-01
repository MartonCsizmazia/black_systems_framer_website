import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export { PRERENDER_PATHS, pageMeta, SITE_URL } from './seo'
export { LANGS } from './i18n/i18n'
export { localizePath } from './i18n/paths'

/** Render one page to HTML for the build-time prerender. `pathname` is the
 * full address, language prefix included ('/hu/case-studies/x'). */
export function render(pathname: string) {
  return renderToString(
    <React.StrictMode>
      <App pathname={pathname} />
    </React.StrictMode>,
  )
}
