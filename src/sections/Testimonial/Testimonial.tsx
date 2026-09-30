import TestimonialSlider from '../../components/TestimonialSlider/TestimonialSlider'
import SectionEyebrow from '../../components/SectionEyebrow/SectionEyebrow'
import ClientLogos from '../ClientLogos/ClientLogos'
import './Testimonial.css'
import OverlapFiller from "../../components/OverlapFiller/OverlapFiller";

export default function Testimonial() {
  return (
    <section id="testimonial" className="testimonial">
        <OverlapFiller color="paper" />
      <SectionEyebrow index="04" title="Testimonial" />
      <TestimonialSlider />
      {/* Past employers' logos — sits with the quote as one proof block. */}
      <div className="testimonial__logos">
        <ClientLogos />
      </div>
    </section>
  )
}
