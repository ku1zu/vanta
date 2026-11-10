import { AnimatedNumber, GlassSurface } from '../../components/glass'
import { areaPath, linePath } from '../viz'
import type { Metric } from '../data/mockMetrics'

const C = 2 * Math.PI * 18

export function MetricInstrument({ m }: { m: Metric }) {
  const s = m.series ?? []
  const dial = m.kind === 'arc' || m.kind === 'score'
  return (
    <GlassSurface tilt tone="clear" className="vos-metric">
      <span className="mono vos-k">{m.label}</span>
      <div className="vos-row">
        <div className="vos-big">{m.prefix}<AnimatedNumber value={m.value} />{m.suffix}</div>
        {dial && (
          <svg viewBox="0 0 44 44" className="vos-dial" aria-hidden="true">
            <circle cx="22" cy="22" r="18" className="ring-bg" />
            <circle cx="22" cy="22" r="18" className="ring" strokeDasharray={`${C * (m.progress ?? 0)} ${C}`} transform="rotate(-90 22 22)" />
          </svg>
        )}
      </div>
      {m.note && <span className="mono vos-sub">{m.note}</span>}
      {m.kind === 'trend' && (
        <svg viewBox="0 0 120 44" preserveAspectRatio="none" className="vos-viz" aria-hidden="true">
          <path d={areaPath(s, 120, 44)} className="fill" /><path d={linePath(s, 120, 44)} className="stroke" /><path d={linePath(s, 120, 44)} className="flowline" />
        </svg>
      )}
      {m.kind === 'activity' && (
        <svg viewBox="0 0 120 44" preserveAspectRatio="none" className="vos-viz" aria-hidden="true">
          {s.map((v, i) => <rect key={i} x={i * 10 + 1} width="6" y={44 - v * 2.4} height={v * 2.4} className="bar" />)}
        </svg>
      )}
    </GlassSurface>
  )
}