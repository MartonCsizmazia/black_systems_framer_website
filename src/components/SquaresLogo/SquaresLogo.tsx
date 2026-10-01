import { useEffect, useRef } from 'react'
import { mountSquaresLogo, type SquaresLogoOptions } from '../../animations/squaresLogo'
import './SquaresLogo.css'

export interface SquaresLogoProps extends SquaresLogoOptions {
  className?: string
}

/**
 * Animated five-squares brand mark (inline SVG, requestAnimationFrame).
 * Size it with the container's width (height follows the ~183:113 aspect
 * ratio) and colour it with CSS `color` - the squares use currentColor.
 */
export default function SquaresLogo({ className, hold, move, shrink, label }: SquaresLogoProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // Only pass options that were actually set, so the module's defaults apply.
    const options: SquaresLogoOptions = { label }
    if (hold !== undefined) options.hold = hold
    if (move !== undefined) options.move = move
    if (shrink !== undefined) options.shrink = shrink
    return mountSquaresLogo(ref.current, options)
  }, [hold, move, shrink, label])

  return <span ref={ref} className={className ? `squares-logo ${className}` : 'squares-logo'} />
}
