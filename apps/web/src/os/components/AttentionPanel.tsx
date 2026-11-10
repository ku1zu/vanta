import { useState } from 'react'
import { GlassButton, GlassSurface } from '../../components/glass'
import { useOS } from '../context'
import { ATTENTION } from '../data/mockBusiness'

export function AttentionPanel() {
  const { openCommand } = useOS()
  const [done, setDone] = useState<string[]>([])
  return (
    <GlassSurface tone="frost" className="vos-panel">
      <span className="mono vos-k">What needs attention</span>
      <ul className="vos-attn">
        {ATTENTION.map((a) => (
          <li key={a.id} className={done.includes(a.id) ? 'is-done' : ''}>
            <span className={`sev mono ${a.severity}`}>{a.severity}</span>
            <div><strong>{a.title}</strong><span className="vos-sub">{a.detail}</span></div>
            <GlassButton variant="secondary" className="sm" onClick={() => { setDone((d) => [...d, a.id]); openCommand(a.cmd) }}>
              {done.includes(a.id) ? 'Queued' : a.action}
            </GlassButton>
          </li>
        ))}
      </ul>
    </GlassSurface>
  )
}