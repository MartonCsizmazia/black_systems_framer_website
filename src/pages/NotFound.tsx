import Navbar from '../components/Navbar/Navbar'
import SectionEyebrow from '../components/SectionEyebrow/SectionEyebrow'
import Button from '../components/Button/Button'
import Footer from '../components/Footer/Footer'
import './NotFound.css'

/**
 * Shown for any address that isn't a page (prerendered as dist/404.html,
 * which the host serves with a 404 status). Same navbar and footer as the
 * rest of the site; the menu links lead back to the home page's sections.
 */
export default function NotFound() {
  return (
    <main className="not-found">
      <Navbar />
      <section className="not-found__section">
        <SectionEyebrow index="404" title="Page not found" dark />
        <div className="not-found__content">
          <h1 className="not-found__heading">This page doesn't exist.</h1>
          <p className="text-preset-q70fzl not-found__text">
            The link may be broken, or the page may have moved. Everything else is one click away.
          </p>
          <Button title="Back to home" href="/" variant="light" solid />
        </div>
      </section>
      <Footer />
    </main>
  )
}
