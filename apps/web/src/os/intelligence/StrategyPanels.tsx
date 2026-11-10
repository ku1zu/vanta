import { useEffect, useRef, useState } from 'react'
import { GlassButton, GlassSurface } from '../../components/glass'
import { usd } from '../viz'
import { useIntelligence } from './IntelligenceContext'

const ALT_MESSAGES = ['Great coffee, effortlessly yours.', 'Crafted slowly. Delivered simply.', 'Where quality meets ritual.']

export function BrandIntelligence({ onEdit }: { onEdit: () => void }) {
  const { intel, setIntel } = useIntelligence()
  const [busy, setBusy] = useState<'' | 'regen' | 'analyze'>('')
  const [report, setReport] = useState('')
  const n = useRef(0)
  const t = useRef<number>()
  useEffect(() => () => window.clearTimeout(t.current), [])
  const b = intel.brand
  const regen = () => {
    setBusy('regen'); setReport('')
    t.current = window.setTimeout(() => { setIntel({ ...intel, brand: { ...b, coreMessage: ALT_MESSAGES[n.current++ % ALT_MESSAGES.length] } }); setBusy('') }, 1100)
  }
  const analyze = () => {
    setBusy('analyze'); setReport('')
    t.current = window.setTimeout(() => { setReport('Brand consistency 91 · Tone alignment strong · Website voice slightly formal'); setBusy('') }, 1100)
  }
  const row = (k: string, v: string[]) => <div className="ci-row"><span className="mono vos-sub">{k}</span><span>{v.join(' · ')}</span></div>
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Brand intelligence</span>
      <blockquote className="ci-quote">{busy === 'regen' ? 'Regenerating…' : b.coreMessage}</blockquote>
      {row('Personality', b.personality)}{row('Tone', b.tone)}{row('Visual direction', b.visual)}
      {report && <p className="mono vos-sub" role="status">{report}</p>}
      <div className="cta">
        <GlassButton variant="secondary" className="sm" onClick={onEdit}>Edit</GlassButton>
        <GlassButton variant="secondary" className="sm" onClick={regen} disabled={!!busy}>Regenerate</GlassButton>
        <GlassButton variant="secondary" className="sm" onClick={analyze} disabled={!!busy}>{busy === 'analyze' ? 'Analyzing…' : 'Analyze'}</GlassButton>
      </div>
    </GlassSurface>
  )
}

export function BusinessGoals() {
  const { intel } = useIntelligence()
  return (
    <GlassSurface tone="frost" className="vos-panel">
      <span className="mono vos-k">Business goals</span>
      <ul className="ci-goals">
        {intel.goals.map((g) => (
          <li key={g.id}>
            <div className="ci-row"><strong>{g.label}</strong><span className="mono vos-sub">{g.priority} priority</span></div>
            <div className="ci-row"><span className="vos-sub">{g.current} → {g.target}</span><span className="mono">{Math.round(g.progress * 100)}%</span></div>
            <i className="meter"><b style={{ width: `${g.progress * 100}%` }} /></i>
          </li>
        ))}
      </ul>
    </GlassSurface>
  )
}

export function BusinessAnalysis() {
  const { intel } = useIntelligence()
  const q: [string, string[], string][] = [
    ['Strengths', intel.swot.strengths, 'S'], ['Weaknesses', intel.swot.weaknesses, 'W'],
    ['Opportunities', intel.swot.opportunities, 'O'], ['Threats', intel.swot.threats, 'T'],
  ]
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Business analysis · simulated</span>
      <div className="ci-swot">
        {q.map(([t, items, k]) => (
          <div key={t} data-q={k}><span className="mono">{t}</span><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul></div>
        ))}
      </div>
    </GlassSurface>
  )
}

export function GrowthOpportunities() {
  const { intel } = useIntelligence()
  const total = intel.opportunities.reduce((a, o) => a + o.monthly, 0)
  return (
    <GlassSurface tilt tone="frost" className="vos-panel">
      <span className="mono vos-k">Vanta found · simulated</span>
      <div className="vos-total">+{usd.format(total)}<small className="mono"> / mo</small></div>
      <ul className="ci-opps">
        {intel.opportunities.map((o, i) => (
          <li key={o.id}>
            <span className="mono vos-sub">0{i + 1}</span>
            <div><strong>{o.title}</strong><p className="vos-sub">{o.why}</p><span className="mono vos-sub">Impact {o.impact}</span></div>
            <b>+{usd.format(o.monthly)}<small className="mono"> / mo</small></b>
          </li>
        ))}
      </ul>
    </GlassSurface>
  )
}