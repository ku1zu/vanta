import { GlassSurface } from '../../components/glass'
import { EMPLOYEES } from '../data/mockEmployees'

function Glyph({ n }: { n: number }) {
  const sides = 3 + (n % 5)
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2
    return `${16 + 9 * Math.cos(a)},${16 + 9 * Math.sin(a)}`
  }).join(' ')
  return <svg viewBox="0 0 32 32" className="vos-glyph" aria-hidden="true"><circle cx="16" cy="16" r="14" className="g-ring" /><polygon points={pts} className="g-poly" /></svg>
}

export function AIEmployees() {
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k">AI employees</span>
      <ul className="vos-emp">
        {EMPLOYEES.map((e, i) => (
          <li key={e.name}>
            <Glyph n={i} />
            <div><strong>{e.name}</strong><span className="vos-sub">{e.task}</span></div>
            <span className={`status mono ${e.status}`}><i />{e.status}</span>
          </li>
        ))}
      </ul>
    </GlassSurface>
  )
}