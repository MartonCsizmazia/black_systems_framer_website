import Navbar from '../components/Navbar/Navbar'
import Hero from '../sections/Hero/Hero'
import About from '../sections/About/About'
import CaseStudiesPreview from '../sections/CaseStudiesPreview/CaseStudiesPreview'
import Services from '../sections/Services/Services'
import FaqSection from '../components/FaqSection/FaqSection'
import Contact from '../sections/Contact/Contact'
import Footer from '../components/Footer/Footer'

/** The one-page home, section by section. */
export default function Home() {
  return (
    <main style={{ background: 'var(--color-ink)' }}>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <CaseStudiesPreview />
      <FaqSection id="faq" index="04" />
      <Contact />
      <Footer />
    </main>
  )
}
