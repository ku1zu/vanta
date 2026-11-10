import { GlassSurface } from '../../components/glass'
import { HEALTH } from '../data/mockMetrics'

const POS = [[180, 40, 'middle', -14], [320, 180, 'start', 14], [180, 320, 'middle', 34], [40, 180, 'end', -14]] as const

export function BusinessHealth() {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <GlassSurface tilt tone="frost" className="vos-panel vos-health">
      <span className="mono vos-k">Business health</span>
      <svg viewBox="-70 -10 500 380" role="img" aria-label={`Business health: Growth Score ${HEALTH.score}`}>
        <circle cx="180" cy="180" r="140" className="hring" /><circle cx="180" cy="180" r="100" className="hring" /><circle cx="180" cy="180" r="62" className="hring" />
        <g className="hdash">
          <circle cx="180" cy="180" r="120" className="hring dashed" />
          {!still && <animateTransform attributeName="transform" type="rotate" from="0 180 180" to="360 180 180" dur="180s" repeatCount="indefinite" />}
        </g>
        <g>
          <circle cx="180" cy="60" r="2.5" className="hp" /><circle cx="284" cy="240" r="2" className="hp" /><circle cx="86" cy="232" r="2" className="hp" />
          {!still && <animateTransform attributeName="transform" type="rotate" from="0 180 180" to="-360 180 180" dur="120s" repeatCount="indefinite" />}
        </g>
        {HEALTH.nodes.map((n, i) => {
          const [x, y, anchor, dy] = POS[i]
          return (
            <g key={n.label}>
              <line x1="180" y1="180" x2={x} y2={y} className="hline" /><circle cx={x} cy={y} r="4" className="hdot" />
              <text x={x + (anchor === 'start' ? 12 : anchor === 'end' ? -12 : 0)} y={y + dy} textAnchor={anchor} className="hl">{n.label}</text>
              <text x={x + (anchor === 'start' ? 12 : anchor === 'end' ? -12 : 0)} y={y + dy + 18} textAnchor={anchor} className="hv">{n.value}</text>
            </g>
          )
        })}
        <text x="180" y="196" textAnchor="middle" className="hc">{HEALTH.score}</text>
        <text x="180" y="222" textAnchor="middle" className="hl">Growth Score</text>
      </svg>
    </GlassSurface>
  )
}