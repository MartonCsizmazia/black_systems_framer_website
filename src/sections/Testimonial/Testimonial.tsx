import TestimonialSlider from '../../components/TestimonialSlider/TestimonialSlider'
import SectionEyebrow from '../../components/SectionEyebrow/SectionEyebrow'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import './Testimonial.css'
import OverlapFiller from "../../components/OverlapFiller/OverlapFiller";

export default function Testimonial() {
  return (
    <section id="testimonial" className="testimonial">
        <OverlapFiller color="paper" />
      <SectionEyebrow index="04" title="Testimonial" />
      <TestimonialSlider />
      <CtaBanner />
    </section>
  )
}
