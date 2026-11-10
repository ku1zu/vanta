import { GlassSurface } from '../../components/glass'
import { useIntelligence } from './IntelligenceContext'
import type { AudienceProfile } from './types'

export function CompanyOverview() {
  const { intel } = useIntelligence()
  const p = intel.profile
  const facts: [string, string][] = [
    ['Industry', p.industry], ['Business model', p.businessModel], ['Company size', `${p.employees} ${p.employees === 1 ? 'person' : 'people'}`],
    ['Location', p.location], ['Growth stage', p.stage], ['Primary market', p.market], ['Founded', String(p.founded)], ['Website', p.website],
  ]
  return (
    <GlassSurface tilt tone="frost" className="vos-panel">
      <span className="mono vos-k">Company profile</span>
      <h2 className="ci-name">{p.name}</h2>
      <ul className="ci-facts">{facts.map(([k, v]) => <li key={k}><span className="mono vos-sub">{k}</span><span>{v}</span></li>)}</ul>
      <div className="ci-tags">{p.products.map((x) => <span key={x} className="mono tag-pill">{x}</span>)}</div>
    </GlassSurface>
  )
}

function Profile({ a }: { a: AudienceProfile }) {
  return (
    <div className="ci-aud">
      <span className="mono vos-sub">{a.label}</span>
      <h3>{a.title}</h3>
      <span className="mono vos-sub">Age {a.age}</span>
      <ul>{a.traits.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="ci-fit mono"><span>Audience fit</span><i className="meter"><b style={{ width: `${a.fit}%` }} /></i><span>{a.fit}</span></div>
    </div>
  )
}

export function AudienceIntelligence() {
  const { intel } = useIntelligence()
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Target audience</span>
      <Profile a={intel.audience.primary} /><Profile a={intel.audience.secondary} />
    </GlassSurface>
  )
}

function Mark({ seed }: { seed: number }) {
  const sides = 3 + (seed % 4)
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2
    return `${32 + 13 * Math.cos(a)},${32 + 13 * Math.sin(a)}`
  }).join(' ')
  return (
    <svg viewBox="0 0 64 64" className="ci-mark" aria-hidden="true">
      <circle cx="32" cy="32" r="29" className="g-ring" />
      <circle cx={26 + seed * 4} cy={38 - seed * 3} r={12 + seed * 2} className="g-ring ci-accent" />
      <polygon points={pts} className="g-poly" />
    </svg>
  )
}

export function PersonaPanel() {
  const { intel } = useIntelligence()
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Customer personas</span>
      <ul className="ci-personas">
        {intel.personas.map((p) => (
          <li key={p.id}>
            <Mark seed={p.seed} />
            <div>
              <strong>{p.name}</strong> <span className="mono vos-sub">Age {p.age} · {p.value} value</span>
              <p className="vos-sub">{p.goal}</p>
              <p className="vos-sub">Pain points: {p.pains.join(' · ')}</p>
              <p className="mono vos-sub">Motivation: {p.motivation}</p>
            </div>
          </li>
        ))}
      </ul>
    </GlassSurface>
  )
}