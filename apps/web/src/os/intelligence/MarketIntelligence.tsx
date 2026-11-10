import { useState } from 'react'
import { GlassSurface } from '../../components/glass'
import { useIntelligence } from './IntelligenceContext'

const ANGLES = [-70, 40, 170, 100, -150]

export function CompetitorLandscape() {
  const { intel } = useIntelligence()
  const [sel, setSel] = useState(0)
  const c = intel.competitors[Math.min(sel, intel.competitors.length - 1)]
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Competitor intelligence</span>
      <svg viewBox="0 0 400 340" className="ci-orbit" role="img" aria-label="Competitive landscape around your company">
        {[90, 120, 150].map((r) => <circle key={r} cx="200" cy="170" r={r} className="hring" />)}
        {intel.competitors.map((k, i) => {
          const r = 150 - k.presence * 0.8, a = (ANGLES[i % ANGLES.length] * Math.PI) / 180
          const x = 200 + r * Math.cos(a), y = 170 + r * Math.sin(a)
          return (
            <g key={k.id} className={`cn ${sel === i ? 'on' : ''}`} tabIndex={0} role="button" aria-label={k.name}
              onClick={() => setSel(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSel(i) }}>
              <line x1="200" y1="170" x2={x} y2={y} className="hline" />
              <circle cx={x} cy={y} r={8 + k.presence / 8} className="cnode" />
              <text x={x} y={y + 24 + k.presence / 8} textAnchor="middle" className="hl">{k.name}</text>
            </g>
          )
        })}
        <circle cx="200" cy="170" r="26" className="cself" />
        <text x="200" y="174" textAnchor="middle" className="hl">You</text>
      </svg>
      <dl className="ci-dl">
        <dt className="mono">{c.tag} · simulated</dt><dd><strong>{c.name}</strong></dd>
        <dt className="mono">Position</dt><dd>{c.position}</dd>
        <dt className="mono">Strength</dt><dd>{c.strength}</dd>
        <dt className="mono">Weakness</dt><dd>{c.weakness}</dd>
        <dt className="mono">Pricing</dt><dd>{c.pricing}</dd>
        <dt className="mono">Market presence</dt><dd>{c.presence} / 100</dd>
        <dt className="mono">Opportunity</dt><dd>{c.opportunity}</dd>
      </dl>
    </GlassSurface>
  )
}

const px = (x: number) => 30 + x * 300
const py = (y: number) => 270 - y * 240

export function MarketPosition() {
  const { intel } = useIntelligence()
  const { company, market } = intel.position
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Market position</span>
      <svg viewBox="0 0 360 300" className="ci-map" role="img" aria-label="Positioning map: accessible to premium, traditional to innovative">
        <line x1="30" y1="150" x2="330" y2="150" className="hline" /><line x1="180" y1="30" x2="180" y2="270" className="hline" />
        {[40, 80, 120].map((r) => <circle key={r} cx={px(market.x)} cy={py(market.y)} r={r} className="hring dashed" />)}
        <text x="30" y="144" className="hl">Accessible</text><text x="330" y="144" textAnchor="end" className="hl">Premium</text>
        <text x="186" y="40" className="hl">Innovative</text><text x="186" y="266" className="hl">Traditional</text>
        <circle cx={px(market.x)} cy={py(market.y)} r="5" className="cnode" strokeDasharray="2 2" />
        <text x={px(market.x) + 10} y={py(market.y) + 14} className="hl">Market avg</text>
        {intel.competitors.map((k) => (
          <g key={k.id}><circle cx={px(k.x)} cy={py(k.y)} r="6" className="cnode" /><text x={px(k.x) + 10} y={py(k.y) + 4} className="hl">{k.name}</text></g>
        ))}
        <circle cx={px(company.x)} cy={py(company.y)} r="8" className="cself" />
        <text x={px(company.x) + 12} y={py(company.y) + 4} className="hv" fontSize="13">{intel.profile.name}</text>
      </svg>
    </GlassSurface>
  )
}