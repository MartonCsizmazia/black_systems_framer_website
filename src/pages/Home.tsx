import Navbar from '../components/Navbar/Navbar'
import Hero from '../sections/Hero/Hero'
import About from '../sections/About/About'
import CaseStudiesPreview from '../sections/CaseStudiesPreview/CaseStudiesPreview'
import Services from '../sections/Services/Services'
import Testimonial from '../sections/Testimonial/Testimonial'
import FaqSection from '../components/FaqSection/FaqSection'
import Contact from '../sections/Contact/Contact'
import Footer from '../components/Footer/Footer'

/** The one-page home: this project's own section list (moved out of App.tsx). */
export default function Home() {
  return (
    <main style={{ background: 'var(--color-ink)', minHeight: '550vh' }}>
      <Navbar />
      <Hero />
      <About />
      <CaseStudiesPreview />
      <Services />
      {/*<Pricing />*/}
      <Testimonial />
      {/*<Archive />*/}
      {/*<Stats />*/}
      <FaqSection id="faq" index="05" />
      {/*<Article />*/}
      <Contact />
      <Footer />
    </main>
  )
}
