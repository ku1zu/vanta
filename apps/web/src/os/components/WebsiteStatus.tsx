import { GlassSurface } from '../../components/glass'
import { WEBSITE } from '../data/mockBusiness'

export function WebsiteStatus() {
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Website intelligence</span>
      <svg viewBox="0 0 160 96" className="vos-site" aria-hidden="true">
        <rect x="1" y="1" width="158" height="94" rx="8" className="g-ring" />
        <rect x="12" y="12" width="60" height="6" rx="3" className="blk" /><rect x="100" y="12" width="46" height="6" rx="3" className="blk dim" />
        <circle cx="112" cy="52" r="22" className="g-ring" /><rect x="12" y="38" width="70" height="8" rx="4" className="blk" />
        <rect x="12" y="54" width="52" height="5" rx="2.5" className="blk dim" /><rect x="12" y="66" width="28" height="9" rx="4.5" className="blk" />
        <rect x="12" y="84" width="136" height="3" rx="1.5" className="blk dim" /><rect x="1" y="1" width="158" height="2" className="scan" />
      </svg>
      <ul className="vos-scores">
        {WEBSITE.scores.map((s) => (
          <li key={s.label}><span className="mono">{s.label}</span><i className="meter"><b style={{ width: `${s.v}%` }} /></i><span>{s.v}</span></li>
        ))}
        <li><span className="mono">Security</span><i /><span>{WEBSITE.security}</span></li>
      </ul>
      <span className="mono vos-sub">Last update · {WEBSITE.updated}</span>
    </GlassSurface>
  )
}