import { useLenis } from './hooks/useLenis'
import { useCalEmbed } from './hooks/useCalEmbed'
import Navbar from './components/Navbar/Navbar'
import Hero from './sections/Hero/Hero'
import About from './sections/About/About'
import ClientLogos from './sections/ClientLogos/ClientLogos'
import CaseStudies from './sections/CaseStudies/CaseStudies'
import Services from './sections/Services/Services'
import Testimonial from './sections/Testimonial/Testimonial'
import Stats from './sections/Stats/Stats'
// import Article from './sections/Article/Article'
import Contact from './sections/Contact/Contact'
import Footer from './components/Footer/Footer'

export default function App() {
  useLenis()
  useCalEmbed()

  return (
    <main style={{ background: 'var(--color-ink)', minHeight: '550vh' }}>
      <Navbar />
      <Hero />
      <About />
      <ClientLogos />
      <CaseStudies />
      <Services />
      {/*<Pricing />*/}
      <Testimonial />
      {/*<Archive />*/}
      <Stats />
      {/*<Article />*/}
      <Contact />
      <Footer />
    </main>
  )
}
