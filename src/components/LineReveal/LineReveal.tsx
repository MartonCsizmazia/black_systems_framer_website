import { useRef, useState, type ElementType } from 'react'
import { motion, useInView } from 'framer-motion'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'

export interface LineRevealProps {
  text: string
  className?: string
  as?: ElementType
}

// Recovered verbatim from the detail page's intro paragraph text effect:
// { type: "appear", trigger: "onInView", threshold: .5, tokenization: "line",
//   effect: { opacity: .001, y: 10 }, transition: spring 60/300, delay .075 }.
const LINE_STAGGER = 0.075
const spring = { type: 'spring', damping: 60, mass: 1, stiffness: 300 } as const

/**
 * Framer's "appear by line" text effect: each rendered line rises 10px and
 * fades in, one after another, the first time half the block is visible.
 * Lines depend on the wrap at the current width, so words are measured
 * after layout (and again on resize) and grouped by their offsetTop - 
 * offsetTop ignores transforms, so the animation itself doesn't disturb it.
 */
export default function LineReveal({ text, className, as = 'p' }: LineRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [lineOf, setLineOf] = useState<number[]>([])
  const words = text.split(' ')
  const Tag = as

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      let line = -1
      let lastTop = -Infinity
      const next = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'), (w) => {
        if (w.offsetTop > lastTop + 1) {
          line++
          lastTop = w.offsetTop
        }
        return line
      })
      setLineOf((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text])

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            data-word=""
            // text-indent is inherited, and an inline-block applies it to its
            // own first line - without the reset every word would be indented.
            style={{ display: 'inline-block', textIndent: 0 }}
            initial={{ opacity: 0.001, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ ...spring, delay: (lineOf[i] ?? 0) * LINE_STAGGER }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}
