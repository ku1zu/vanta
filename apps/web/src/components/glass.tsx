import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type PointerEvent as PE, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

/** Smooth, damped cursor tilt (max ~3deg) + moving highlight. Mouse only; off for touch and reduced motion. */
export function useGlassTilt<T extends HTMLElement>(max = 3) {
  const ref = useRef<T>(null)
  const st = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0, on: false })
  const enabled = useRef(false)
  useEffect(() => {
    enabled.current = matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
    return () => cancelAnimationFrame(st.current.raf)
  }, [])
  const tick = () => {
    const s = st.current, el = ref.current
    if (!el) { s.on = false; return }
    s.x += (s.tx - s.x) * 0.12; s.y += (s.ty - s.y) * 0.12
    el.style.setProperty('--ry', `${s.x * max}deg`); el.style.setProperty('--rx', `${-s.y * max}deg`)
    el.style.setProperty('--mx', `${50 + s.x * 40}%`); el.style.setProperty('--my', `${50 + s.y * 40}%`)
    if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) > 0.001) s.raf = requestAnimationFrame(tick); else s.on = false
  }
  const kick = () => { const s = st.current; if (!s.on) { s.on = true; s.raf = requestAnimationFrame(tick) } }
  const onPointerMove = (e: PE<T>) => {
    if (!enabled.current || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    st.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
    st.current.ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    kick()
  }
  const onPointerLeave = () => { st.current.tx = 0; st.current.ty = 0; kick() }
  return { ref, onPointerMove, onPointerLeave }
}

/** A thin glass sheet. tone: clear (almost transparent) or frost. */
export function GlassSurface({ tone = 'clear', tilt = false, className = '', children, ...rest }:
  { tone?: 'clear' | 'frost'; tilt?: boolean; className?: string; children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const t = useGlassTilt<HTMLDivElement>()
  const h = tilt ? { onPointerMove: t.onPointerMove, onPointerLeave: t.onPointerLeave } : {}
  return <div ref={t.ref} className={`gl gl--${tone} ${tilt ? 'gl--tilt' : ''} ${className}`} {...h} {...rest}>{children}</div>
}

/** primary = stronger glass, secondary = clearer glass, tertiary = text only. Renders a Link when `to` is given. */
export function GlassButton({ to, variant = 'primary', className = '', children, ...rest }:
  { to?: string; variant?: 'primary' | 'secondary' | 'tertiary'; className?: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const t = useGlassTilt<HTMLElement>(2)
  const glass = variant !== 'tertiary'
  const cls = `gb gb--${variant} ${glass ? 'gl gl--tilt' : ''} ${className}`
  const h = glass ? { onPointerMove: t.onPointerMove, onPointerLeave: t.onPointerLeave } : {}
  if (to) return <Link ref={t.ref as never} to={to} className={cls} {...h}>{children}</Link>
  return <button ref={t.ref as never} className={cls} {...h} {...rest}>{children}</button>
}

/** Glass capsule with a raised thumb that slides under the selected option. */
export function GlassToggle<T extends string>({ options, value, onChange, label }:
  { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="gt gl gl--clear mono" role="radiogroup" aria-label={label}
      style={{ '--n': options.length, '--i': options.indexOf(value) } as CSSProperties}>
      <span className="gt__thumb" aria-hidden="true" />
      {options.map((o) => <button key={o} role="radio" aria-checked={o === value} onClick={() => onChange(o)}>{o}</button>)}
    </div>
  )
}

/** Eases between numbers (instant for reduced motion). */
export function AnimatedNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { from.current = value; setShown(value); return }
    const start = from.current, t0 = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 700)
      const v = start + (value - start) * (1 - Math.pow(1 - k, 3))
      from.current = v; setShown(v)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{Math.round(shown)}</>
}