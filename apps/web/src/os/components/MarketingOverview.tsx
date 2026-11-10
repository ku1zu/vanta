import { GlassSurface } from '../../components/glass'
import { linePath } from '../viz'
import { MARKETING as M } from '../data/mockMetrics'

const C = 2 * Math.PI * 18

export function MarketingOverview() {
  const top = M.funnel[0].v
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">Marketing</span>
      <div className="vos-mkt">
        <figure><svg viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true">
          <path d={linePath(M.campaign.a, 120, 50)} className="stroke" /><path d={linePath(M.campaign.b, 120, 50)} className="stroke alt" /></svg>
          <figcaption className="mono">Campaign performance</figcaption></figure>
        <figure><svg viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true">
          {M.social.map((v, i) => <rect key={i} x={i * 17 + 2} width="10" y={50 - v * 3} height={v * 3} className="bar" />)}</svg>
          <figcaption className="mono">Social activity</figcaption></figure>
        <figure><svg viewBox="0 0 44 44" className="vos-dial" aria-hidden="true">
          <circle cx="22" cy="22" r="18" className="ring-bg" />
          <circle cx="22" cy="22" r="18" className="ring" strokeDasharray={`${C * M.email.open} ${C}`} transform="rotate(-90 22 22)" /></svg>
          <figcaption className="mono">Email · {Math.round(M.email.open * 100)}% open · {Math.round(M.email.click * 100)}% click</figcaption></figure>
        <figure><ul className="vos-funnel">
          {M.funnel.map((f) => <li key={f.label}><i style={{ width: `${Math.max(8, (f.v / top) * 100)}%` }} /><span className="mono">{f.label} · {f.v.toLocaleString('en-US')}</span></li>)}</ul>
          <figcaption className="mono">Lead generation</figcaption></figure>
      </div>
    </GlassSurface>
  )
}