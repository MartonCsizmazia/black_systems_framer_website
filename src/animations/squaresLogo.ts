/**
 * Animated squares logo — vector, runs at the display's refresh rate (60/120/144 Hz).
 *
 * ES-module port of the standalone squares-logo.js (which set a global
 * `window.mountSquaresLogo`). Animation data and logic are unchanged; only
 * the module format and TypeScript types differ. Use via <SquaresLogo />.
 *
 * Squares use `currentColor`, so set the colour with CSS `color` on the container.
 * Returns a function that stops the animation and removes the SVG.
 */

type Square = [x: number, y: number, size: number]

export interface SquaresLogoOptions {
  /** ms each arrangement stays still */
  hold?: number
  /** ms per transition */
  move?: number
  /** max shrink mid-move (keeps squares from colliding) */
  shrink?: number
  /** becomes the SVG's aria-label */
  label?: string
}

// Layouts in play order: [x, y, size] per square, smallest -> largest.
// Coordinates are centred on (0,0); identical to the APNG.
const LAYOUTS: Square[][] = [
  [[-56.5, -44.0, 18], [-68.5, -16.0, 24], [-32.5, -30.0, 30], [-36.5, 8.0, 36], [7.5, -42.0, 61]],
  [[-73.5, -28.5, 18], [-63.5, -2.5, 24], [-47.5, -46.5, 30], [-31.5, -4.5, 36], [12.5, -14.5, 61]],
  [[-81.5, -9.5, 18], [-53.5, 0.5, 24], [-37.5, -37.5, 30], [-23.5, -1.5, 36], [20.5, -23.5, 61]],
  [[-71.5, -42.0, 18], [-65.5, -16.0, 24], [-35.5, -32.0, 30], [-33.5, 6.0, 36], [10.5, -26.0, 61]],
  [[-76.5, -10.0, 18], [-60.5, 16.0, 24], [-50.5, -34.0, 30], [-24.5, 4.0, 36], [15.5, -40.0, 61]],
]
const HALF_W = 91.5, HALF_H = 56.5

const DEFAULTS = {
  hold: 4000,       // ms each arrangement stays still
  move: 733,        // ms per transition
  shrink: 0.3,      // max shrink mid-move (keeps squares from colliding)
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const radius = (s: number) => Math.max(3, s * 0.1)

export function mountSquaresLogo(container: HTMLElement, options: SquaresLogoOptions = {}): () => void {
  const opt = { ...DEFAULTS, ...options }
  const NS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', `${-HALF_W} ${-HALF_H} ${2 * HALF_W} ${2 * HALF_H}`)
  svg.setAttribute('role', 'img')
  svg.setAttribute('aria-label', options.label || 'Logo')
  svg.style.display = 'block'
  svg.style.width = '100%'
  svg.style.height = 'auto'

  const rects = LAYOUTS[0].map(() => {
    const r = document.createElementNS(NS, 'rect')
    r.setAttribute('fill', 'currentColor')
    svg.appendChild(r)
    return r
  })
  container.appendChild(svg)

  const draw = (squares: Square[]) => {
    squares.forEach(([x, y, s], i) => {
      const r = rects[i], rr = radius(s)
      r.setAttribute('x', String(x))
      r.setAttribute('y', String(y))
      r.setAttribute('width', String(s))
      r.setAttribute('height', String(s))
      r.setAttribute('rx', String(rr))
      r.setAttribute('ry', String(rr))
    })
  }

  const interpolate = (A: Square[], B: Square[], t: number): Square[] => {
    const e = easeInOutCubic(t)
    const k = 1 - opt.shrink * Math.sin(Math.PI * t)
    return A.map(([ax, ay, s], i) => {
      const [bx, by] = B[i]
      const cx = ax + s / 2 + (bx - ax) * e
      const cy = ay + s / 2 + (by - ay) * e
      const ss = s * k
      return [cx - ss / 2, cy - ss / 2, ss]
    })
  }

  draw(LAYOUTS[0])

  // Respect the OS "reduce motion" setting: show the first arrangement only.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => svg.remove()
  }

  const step = opt.hold + opt.move
  const cycle = step * LAYOUTS.length
  let start: number | null = null, raf = 0

  const tick = (now: number) => {
    if (start === null) start = now
    const t = (now - start) % cycle
    const idx = Math.floor(t / step)
    const local = t - idx * step
    if (local < opt.hold) {
      draw(LAYOUTS[idx])
    } else {
      const next = (idx + 1) % LAYOUTS.length
      draw(interpolate(LAYOUTS[idx], LAYOUTS[next], (local - opt.hold) / opt.move))
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf)
    svg.remove()
  }
}
