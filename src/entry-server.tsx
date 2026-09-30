import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export { PRERENDER_PATHS, pageMeta, SITE_URL } from './seo'

/** Render one page to HTML for the build-time prerender. */
export function render(path: string) {
  return renderToString(
    <React.StrictMode>
      <App path={path} />
    </React.StrictMode>,
  )
}
