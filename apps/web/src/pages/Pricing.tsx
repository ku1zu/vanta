import { useEffect, useState, type CSSProperties } from 'react'
import { scroll } from '../lib/scroll'
import { AnimatedNumber, GlassButton, GlassSurface, GlassToggle } from '../components/glass'

type Billing = 'Monthly' | 'Yearly'
const BILLING: Billing[] = ['Monthly', 'Yearly']

// yearly = the explicit price per YEAR. Savings are always monthly x 12 - yearly, so edit a price here and everything updates.
const PLANS = [
  { name: 'Starter', monthly: 49, yearly: 490, note: 'For a single business getting started' },
  { name: 'Growth', monthly: 149, yearly: 1490, note: 'Includes Vanta HQ' },
  { name: 'Pro', monthly: 399, yearly: 3990, note: 'For teams scaling operations' },
  { name: 'Enterprise', monthly: 999, yearly: 9990, note: 'For organizations with custom needs' },
]
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('Monthly')
  const yearly = billing === 'Yearly'

  // The 3D studio behind the page shifts slightly: monthly = deeper graphite, yearly = lighter silver-graphite.
  useEffect(() => {
    scroll.dkTarget = yearly ? 0.98 : 0.95
    window.dispatchEvent(new Event('scroll'))
  }, [yearly])

  return (
    <section className="wrap pricing2" data-billing={billing.toLowerCase()}>
      <div className="price-light" aria-hidden="true" />
      <header className="pricing2__head">
        <p className="label mono">Pricing</p>
        <h2>Choose how much of Vanta to run</h2>
        <GlassToggle label="Billing period" options={BILLING} value={billing} onChange={setBilling} />
      </header>
      <div className="slabs">
        {PLANS.map((p, i) => {
          const hero = p.name === 'Growth'
          const savings = p.monthly * 12 - p.yearly
          return (
            <GlassSurface key={p.name} tilt tone={hero ? 'frost' : 'clear'} className={`slab ${hero ? 'slab--hero' : ''}`} style={{ '--d': i } as CSSProperties}>
              <span className="mono slab__name">{p.name}</span>
              <div className="slab__price">
                <span>$<AnimatedNumber value={yearly ? p.yearly : p.monthly} /></span>
                <small className="mono">{yearly ? '/ year' : '/ month'}</small>
              </div>
              <p className="mono slab__bill swap" key={billing}>{yearly ? 'billed annually' : 'billed monthly'}</p>
              <p className="mono slab__save">{yearly ? `Save ${usd.format(savings)}` : '\u00a0'}</p>
              <p className="slab__note">{p.note}</p>
              <GlassButton to={`/signup?plan=${p.name.toLowerCase()}&billing=${billing.toLowerCase()}`} variant={hero ? 'primary' : 'secondary'}>Start with {p.name}</GlassButton>
            </GlassSurface>
          )
        })}
      </div>
      <p className="proto mono">Prototype · no payments are processed</p>
    </section>
  )
}