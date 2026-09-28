import TestimonialSlider from '../../components/TestimonialSlider/TestimonialSlider'
import SectionEyebrow from '../../components/SectionEyebrow/SectionEyebrow'
import './Testimonial.css'
import OverlapFiller from "../../components/OverlapFiller/OverlapFiller";

export default function Testimonial() {
  return (
    <section className="testimonial">
        <OverlapFiller color="paper" />
      <SectionEyebrow index="05" title="Testimonial" />
      <TestimonialSlider />
    </section>
  )
}
