import { GlassButton, GlassSurface } from '../../components/glass'
import { ACTIVITY, FINDINGS, QUICK_ACTIONS } from './mockWebsites'

export function AIWebsiteIntelligence({ onAction }: { onAction: (label: string) => void }) {
  return (
    <GlassSurface tone="frost" className="vos-panel">
      <span className="mono vos-k">AI website intelligence · sample findings</span>
      <ul className="ws-finds">
        {FINDINGS.map((f) => (
          <li key={f.id}>
            <div>
              <span className="mono vos-sub">{f.area}</span>
              <p>{f.text}</p>
              {f.opportunity && <span className="mono ws-opp">Opportunity · {f.opportunity}</span>}
            </div>
            <GlassButton variant="secondary" className="sm" onClick={() => onAction(f.action)}>{f.action}</GlassButton>
          </li>
        ))}
      </ul>
      <p className="proto mono">Sample findings, not from a real scan</p>
    </GlassSurface>
  )
}

export function WebsiteActivity() {
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k"><i className="pulse" /> Website activity</span>
      <ul className="vos-feed">
        {ACTIVITY.map((e) => (
          <li key={e.id} data-kind={e.kind}><i className="kdot" /><span>{e.text}</span><span className="mono vos-sub">{e.when}</span></li>
        ))}
      </ul>
    </GlassSurface>
  )
}

export function QuickActions({ onAction }: { onAction: (id: string) => void }) {
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Quick actions</span>
      <ul className="vos-suggest">
        {QUICK_ACTIONS.map((a) => <li key={a.id}><button onClick={() => onAction(a.id)}>{a.label}</button></li>)}
      </ul>
    </GlassSurface>
  )
}