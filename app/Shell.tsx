import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { applyEnvironment } from '@vanta/tokens'
import { Stage, useQuality } from '@vanta/stage'
import { Experience } from '../scenes/Experience'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { scroll, useScrollSync } from '../lib/scroll'

/** Where the 3D camera rests (viewport-heights along the rail) and how dark the room is, per route. */
const WORLD: Record<string, { s: number; dark: number }> = {
  '/demo': { s: 1, dark: 1 }, '/login': { s: 3, dark: 1 }, '/signup': { s: 3, dark: 1 },
  '/os': { s: 2, dark: 1 }, '/pricing': { s: 4, dark: 0.95 },
}
const POST = { bloom: 0.1, dof: false, dofDistance: 13, dofRange: 6, bokeh: 3 }

export function Shell() {
  const { pathname, hash } = useLocation()
  const { tier } = useQuality()
  const landing = pathname === '/'
  const [dark, setDark] = useState(false)
  const onScroll = useCallback((s: number) => setDark((d) => (d ? s > 1.4 : s > 1.7)), [])
  useScrollSync(onScroll, landing)

  useEffect(() => { document.documentElement.dataset.tier = tier }, [tier]) // lets CSS glass degrade with the quality tier

  useEffect(() => {
    document.documentElement.classList.add('page'); document.body.classList.add('page')
    return () => { document.documentElement.classList.remove('page'); document.body.classList.remove('page') }
  }, [])

  useEffect(() => {
    const w = WORLD[pathname]
    if (w) { scroll.s = w.s; scroll.dkTarget = w.dark; setDark(w.dark > 0.5) } else { scroll.dkTarget = null; setDark(false) }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const go = () => {
      const el = hash ? document.getElementById(hash.slice(1)) : null
      if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); else window.scrollTo(0, 0)
      window.dispatchEvent(new Event('scroll')) // wakes the render loop when reduced motion is on
    }
    go()
    if (hash) { const id = window.setTimeout(go, 60); return () => window.clearTimeout(id) }
  }, [pathname, hash])

  useEffect(() => applyEnvironment(dark ? 'chamber' : 'lab'), [dark])

  const os = pathname === '/os'
  return (
    <>
      <div className="stage-fixed" aria-hidden="true">
        <Stage lighting="white" haze={0.03} orbit={false} post={POST}><Experience /></Stage>
      </div>
      {!os && <Nav />}
      <main key={pathname} className={`sections ${os ? 'route-fade' : 'route-enter'}`}><Outlet /></main>
      {!os && !landing && <Footer />}
    </>
  )
}