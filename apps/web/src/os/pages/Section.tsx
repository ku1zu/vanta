import { Navigate, useParams } from 'react-router-dom'
import { GlassButton, GlassSurface } from '../../components/glass'
import { useOS } from '../context'
import { ALL_NAV } from '../data/mockBusiness'

/** Lightweight placeholder for modules that aren't built yet. */
export default function Section() {
  const { section } = useParams()
  const { openCommand } = useOS()
  const item = ALL_NAV.find((n) => n.slug === section)
  if (!item || item.slug === 'overview') return <Navigate to="/os" replace />
  return (
    <div className="vos-over">
      <header className="vos-head"><span className="mono vos-k">Vanta OS</span><h1>{item.label}</h1><p className="vos-sub">{item.desc}</p></header>
      <div className="c7">
        <GlassSurface tone="frost" className="vos-panel">
          <span className="mono vos-k">Planned capabilities</span>
          <ul className="vos-rev">{item.caps.map((c) => <li key={c}><span>{c}</span><b className="mono vos-sub">Coming soon</b></li>)}</ul>
          <GlassButton className="sm" onClick={() => openCommand()}>Ask Vanta</GlassButton>
        </GlassSurface>
      </div>
    </div>
  )
}