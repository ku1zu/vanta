import { AnimatedNumber, GlassButton, GlassSurface } from '../../components/glass'
import { useOS } from '../context'
import { REVENUE, REVENUE_TOTAL } from '../data/mockBusiness'
import { usd } from '../viz'

export function RevenueOpportunity() {
  const { openCommand } = useOS()
  return (
    <GlassSurface tilt tone="frost" className="vos-panel">
      <span className="mono vos-k">Hidden revenue</span>
      <p className="vos-sub">Vanta found an estimated</p>
      <div className="vos-total">$<AnimatedNumber value={REVENUE_TOTAL} /></div>
      <div className="vos-seg" aria-hidden="true">
        {REVENUE.map((r, i) => <span key={r.label} style={{ flex: r.amount, opacity: 1 - i * 0.2 }} />)}
      </div>
      <ul className="vos-rev">
        {REVENUE.map((r) => <li key={r.label}><span>{r.label}</span><b>{usd.format(r.amount)}</b></li>)}
      </ul>
      <GlassButton className="sm" onClick={() => openCommand('Find hidden revenue')}>Find hidden revenue</GlassButton>
    </GlassSurface>
  )
}