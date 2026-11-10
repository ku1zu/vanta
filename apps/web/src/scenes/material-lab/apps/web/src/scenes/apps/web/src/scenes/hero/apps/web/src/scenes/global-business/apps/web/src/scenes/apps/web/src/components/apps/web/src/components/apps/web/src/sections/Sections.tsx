import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CommandCenter } from '../components/CommandCenter'

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${on ? 'on' : ''} ${className}`}>{children}</div>
}

const Label = ({ children }: { children: ReactNode }) => <p className="label mono">{children}</p>

export function Hero() {
  return (
    <section className="sec" id="top">
      <Reveal className="col">
        <Label>AI Operating System · V.01</Label>
        <h1>The AI Operating System For Modern Businesses</h1>
        <p className="lede">Manage your website, marketing, automation, content, sales, customers, and AI employees from one intelligent system.</p>
        <div className="cta">
          <a className="btn solid" href="#start">Start Free Trial</a>
          <a className="btn ghost" href="#demo">Watch Live Demo</a>
        </div>
      </Reveal>
    </section>
  )
}

export function CommandSection() {
  return (
    <section className="sec right" id="platform">
      <Reveal className="col wide">
        <Label>01 / Command</Label>
        <h2>One quiet surface for everything that moves</h2>
        <CommandCenter />
      </Reveal>
    </section>
  )
}

export function GlobalSection() {
  return (
    <section className="sec right" id="intelligence">
      <Reveal className="col">
        <Label>02 / Global</Label>
        <h2>Your business, seen from orbit</h2>
        <p className="lede">Every market, channel, and customer signal resolved into a single living model.</p>
      </Reveal>
    </section>
  )
}

const FEATURES = ['Website', 'Marketing', 'Automation', 'Content', 'Sales', 'Customers', 'AI employees']

export function FeatureSection() {
  return (
    <section className="sec" id="solutions">
      <Reveal className="col">
        <Label>03 / Platform</Label>
        <h2>Everything connected. Nothing loud.</h2>
        <ul className="feature-list mono">{FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
      </Reveal>
    </section>
  )
}

export function ClosingCta() {
  return (
    <section className="sec" id="start">
      <Reveal className="col">
        <Label>04 / Begin</Label>
        <h2>Enter Vanta</h2>
        <div className="cta">
          <a className="btn solid" href="#start">Start Free Trial</a>
          <a className="btn ghost" href="#demo">Watch Live Demo</a>
        </div>
      </Reveal>
    </section>
  )
}