import { AnimatedNumber, GlassSurface } from '../../components/glass'
import { WEBSITE } from './mockWebsites'

export function WebsiteOverview() {
  return (
    <GlassSurface tilt tone="frost" className="vos-panel">
      <span className="mono vos-k"><i className="pulse" /> Monitored website · sample data</span>
      <div><h2 className="ci-name">{WEBSITE.name}</h2><span className="mono vos-sub">{WEBSITE.domain}</span></div>
      <div className="ws-health">
        <div className="vos-total"><AnimatedNumber value={WEBSITE.health} /></div>
        <span className="mono vos-sub">Website health</span>
      </div>
      <ul className="vos-scores">
        {WEBSITE.scores.map((s) => (
          <li key={s.key}><span className="mono">{s.key}</span><i className="meter"><b style={{ width: `${s.value}%` }} /></i><span>{s.value}</span></li>
        ))}
      </ul>
      <div className="ci-row">
        <span className="mono vos-sub">Last scanned · {WEBSITE.lastScanned}</span>
        <span className="status mono active"><i />{WEBSITE.status}</span>
      </div>
    </GlassSurface>
  )
}

export function HealthVisualization() {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Website health</span>
      <div className="ci-comp">
        <svg viewBox="0 0 220 220" role="img" aria-label={`Website health ${WEBSITE.health}`}>
          {WEBSITE.scores.map((s, i) => {
            const r = 98 - i * 20, C = 2 * Math.PI * r
            return (
              <g key={s.key}>
                <circle cx="110" cy="110" r={r} className="ring-bg" />
                <circle cx="110" cy="110" r={r} className="ring" style={{ opacity: 1 - i * 0.15, transition: 'stroke-dasharray 1.2s var(--v-ease)' }}
                  strokeDasharray={`${C * (s.value / 100)} ${C}`} transform="rotate(-90 110 110)" />
              </g>
            )
          })}
          <g>
            <circle cx="110" cy="6" r="2.5" className="hp" />
            {!still && <animateTransform attributeName="transform" type="rotate" from="0 110 110" to="360 110 110" dur="90s" repeatCount="indefinite" />}
          </g>
          <text x="110" y="120" textAnchor="middle" className="hc" fontSize="38">{WEBSITE.health}</text>
        </svg>
        <ul>{WEBSITE.scores.map((s) => <li key={s.key}><span className="mono vos-sub">{s.key}</span><b>{s.value}</b></li>)}</ul>
      </div>
    </GlassSurface>
  )
}

/** Abstract site inside a glass browser frame. Layers sit at different depths and shift with the cursor tilt. */
export function WebsitePreview() {
  return (
    <GlassSurface tilt tone="clear" className="vos-panel ws-browser">
      <span className="mono vos-k">Live preview · abstract</span>
      <div className="ws-frame">
        <div className="ws-bar"><i /><i /><i /><span className="mono">{WEBSITE.domain}</span></div>
        <div className="ws-page">
          <div className="ws-nav ws-l1"><b /><span /><span /><span /></div>
          <div className="ws-hero ws-l2">
            <div><i className="w60" /><i className="w40" /><em /></div>
            <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" className="g-ring" /><circle cx="46" cy="36" r="18" className="g-ring ci-accent" /></svg>
          </div>
          <div className="ws-grid ws-l1"><i /><i /><i /></div>
        </div>
      </div>
    </GlassSurface>
  )
}