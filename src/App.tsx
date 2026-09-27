import { useLenis } from './hooks/useLenis'
import { useCalEmbed } from './hooks/useCalEmbed'
import Hero from './sections/Hero/Hero'
import About from './sections/About/About'
import ClientLogos from './sections/ClientLogos/ClientLogos'
import Portfolio from './sections/Portfolio/Portfolio'
import Services from './sections/Services/Services'
import Pricing from './sections/Pricing/Pricing'
import Testimonial from './sections/Testimonial/Testimonial'
import Archive from './sections/Archive/Archive'
import Stats from './sections/Stats/Stats'
import Article from './sections/Article/Article'

export default function App() {
  useLenis()
  useCalEmbed()

  return (
    <main style={{ background: 'var(--color-ink)', minHeight: '550vh' }}>
      <Hero />
      <About />
      <ClientLogos />
      <Portfolio />
      <Services />
      <Pricing />
      <Testimonial />
      <Archive />
      <Stats />
      <Article />
    </main>
  )
}
