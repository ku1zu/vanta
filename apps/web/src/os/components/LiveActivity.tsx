import { useEffect, useRef, useState } from 'react'
import { GlassSurface } from '../../components/glass'
import { ago } from '../viz'
import { POOL, SEED, type ActivityKind } from '../data/mockActivity'

interface Live { id: string; text: string; kind: ActivityKind; at: number; fresh?: boolean }

/** Simulated stream: a new mock event arrives every few seconds. */
export function LiveActivity() {
  const [items, setItems] = useState<Live[]>(() => SEED.map((e) => ({ id: e.id, text: e.text, kind: e.kind, at: Date.now() - e.agoSec * 1000 })))
  const [, tick] = useState(0)
  const n = useRef(0)
  useEffect(() => {
    const a = window.setInterval(() => {
      const p = POOL[n.current++ % POOL.length]
      setItems((l) => [{ ...p, id: `l${Date.now()}`, at: Date.now(), fresh: true }, ...l].slice(0, 7))
    }, 7000)
    const b = window.setInterval(() => tick((x) => x + 1), 30000)
    return () => { window.clearInterval(a); window.clearInterval(b) }
  }, [])
  return (
    <GlassSurface tone="clear" className="vos-panel">
      <span className="mono vos-k"><i className="pulse" /> Live activity</span>
      <ul className="vos-feed" aria-live="polite">
        {items.map((e) => (
          <li key={e.id} data-kind={e.kind} className={e.fresh ? 'fresh' : ''}>
            <i className="kdot" /><span>{e.text}</span><span className="mono vos-sub">{ago(Date.now() - e.at)}</span>
          </li>
        ))}
      </ul>
    </GlassSurface>
  )
}