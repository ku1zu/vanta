import { AnimatedNumber, GlassSurface } from '../../components/glass'
import { useIntelligence } from './IntelligenceContext'

export function IntelligenceSummary() {
  const { intel } = useIntelligence()
  const p = intel.profile
  const opp = intel.opportunities.map((o) => o.title.toLowerCase())
  return (
    <GlassSurface tone="frost" className="vos-panel ci-summary">
      <span className="mono vos-k">Vanta's understanding</span>
      <p>{p.name} is a premium {p.industry.toLowerCase()} company focused on convenience, quality, and recurring customer relationships.</p>
      <p>Its strongest growth opportunities appear to be {opp.slice(0, -1).join(', ')}{opp.length > 1 ? ', and ' : ''}{opp[opp.length - 1]}.</p>
      <p>{intel.note}</p>
    </GlassSurface>
  )
}

export function IntelligenceCompleteness() {
  const { intel } = useIntelligence()
  const cats = intel.completeness
  const overall = Math.round(cats.reduce((a, c) => a + c.value, 0) / cats.length)
  return (
    <GlassSurface tilt tone="clear" className="vos-panel">
      <span className="mono vos-k">Intelligence completeness</span>
      <div className="ci-comp">
        <svg viewBox="0 0 180 180" role="img" aria-label={`Intelligence completeness ${overall} percent`}>
          {cats.map((c, i) => {
            const r = 82 - i * 11, C = 2 * Math.PI * r
            return (
              <g key={c.label}>
                <circle cx="90" cy="90" r={r} className="ring-bg" />
                <circle cx="90" cy="90" r={r} className="ring" style={{ opacity: 1 - i * 0.1, transition: 'stroke-dasharray 1.2s var(--v-ease)' }}
                  strokeDasharray={`${C * (c.value / 100)} ${C}`} transform="rotate(-90 90 90)" />
              </g>
            )
          })}
          <text x="90" y="98" textAnchor="middle" className="hc" fontSize="30"><tspan>{overall}</tspan><tspan fontSize="13">%</tspan></text>
        </svg>
        <ul>{cats.map((c) => <li key={c.label}><span className="mono vos-sub">{c.label}</span><b><AnimatedNumber value={c.value} />%</b></li>)}</ul>
      </div>
    </GlassSurface>
  )
}

const SYSTEMS: [string, string][] = [
  ['Website', 'brand, products'], ['Marketing', 'audience, brand, goals'], ['Sales', 'products, pricing, audience'], ['Content', 'brand voice, audience'],
  ['Analytics', 'business goals'], ['AI Employees', 'full profile'], ['Automations', 'goals, channels'],
]

/** Shows the architecture: one profile, many readers. */
export function IntelligencePowers() {
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Powers across Vanta</span>
      <ul className="ci-powers">{SYSTEMS.map(([s, r]) => <li key={s}><strong>{s}</strong><span className="mono vos-sub">reads {r}</span></li>)}</ul>
    </GlassSurface>
  )
}