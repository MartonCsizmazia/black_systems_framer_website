import TestimonialSlider from '../../components/TestimonialSlider/TestimonialSlider'
import SectionEyebrow from '../../components/SectionEyebrow/SectionEyebrow'
import './Testimonial.css'

export default function Testimonial() {
  return (
    <section className="testimonial">
      <SectionEyebrow index="05" title="Testimonial" />
      <TestimonialSlider />
    </section>
  )
}
