const C = 2 * Math.PI * 54
const METRICS: [string, string, string][] = [
  ['Revenue', '+53%', 'M0 30 L20 26 L40 28 L60 18 L80 13 L100 4'],
  ['Leads', '+31%', 'M0 28 L25 24 L45 25 L65 17 L85 15 L100 9'],
  ['Conversion', '+22%', 'M0 24 L20 25 L40 20 L60 21 L80 14 L100 12'],
]

/** A glass instrument, not a dashboard: one panel, one dial, three hairline traces. Static demo data. */
export function CommandCenter() {
  return (
    <div className="instrument glass" role="img" aria-label="Command center preview: Growth Score 94, revenue up 53 percent, leads up 31 percent, conversion up 22 percent">
      <div className="inst__head mono"><span>COMMAND · LIVE</span><span>SYNC 00:00:12</span></div>
      <div className="inst__score">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="54" className="ring-bg" />
          <circle cx="60" cy="60" r="54" className="ring" strokeDasharray={`${C * 0.94} ${C}`} transform="rotate(-90 60 60)" />
        </svg>
        <div><span className="mono">GROWTH SCORE</span><strong>94</strong></div>
      </div>
      <ul className="inst__rows">
        {METRICS.map(([n, v, d]) => (
          <li key={n}><span className="mono">{n}</span><svg viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><path d={d} /></svg><b>{v}</b></li>
        ))}
      </ul>
    </div>
  )
}