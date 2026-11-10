import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
const noop = () => {}
const worldKey = (p: string) => (p.startsWith('/os') ? '/os' : p) // every /os/... page uses the OS room

export function Shell() {
  const { pathname, hash } = useLocation()
  const { tier } = useQuality()
  const landing = pathname === '/'
  // Start in the correct theme for the URL we loaded on, so a direct visit/refresh never flashes the wrong text color.
  const [dark, setDark] = useState(() => (WORLD[worldKey(location.pathname)]?.dark ?? 0) > 0.7)
  const first = useRef(true)
  useScrollSync(noop, landing)

  useEffect(() => { document.documentElement.dataset.tier = tier }, [tier]) // lets CSS glass degrade with the quality tier

  useEffect(() => {
    scroll.isDark = dark; scroll.onTheme = setDark // the 3D loop drives the UI theme from the displayed background
    document.documentElement.classList.add('page'); document.body.classList.add('page')
    return () => { scroll.onTheme = null; document.documentElement.classList.remove('page'); document.body.classList.remove('page') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => applyEnvironment(dark ? 'chamber' : 'lab'), [dark])

  useEffect(() => {
    const w = WORLD[worldKey(pathname)]
    if (w) {
      scroll.s = w.s; scroll.dkTarget = w.dark
      if (first.current) { scroll.sm = w.s; scroll.dk = w.dark } // fresh load: start in the right room, no glide
    } else scroll.dkTarget = null
    first.current = false
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const go = () => {
      const el = hash ? document.getElementById(hash.slice(1)) : null
      if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); else window.scrollTo(0, 0)
      window.dispatchEvent(new Event('scroll')) // wakes the render loop when reduced motion is on
    }
    go()
    if (hash) { const id = window.setTimeout(go, 60); return () => window.clearTimeout(id) }
  }, [pathname, hash])

  const os = pathname.startsWith('/os')
  return (
    <>
      <div className="stage-fixed" aria-hidden="true">
        <Stage lighting="white" haze={0.03} orbit={false} post={POST}><Experience /></Stage>
      </div>
      {!os && <Nav />}
      <main key={os ? '/os' : pathname} className={`sections ${os ? 'route-fade' : 'route-enter'}`}><Outlet /></main>
      {!os && !landing && <Footer />}
    </>
  )
}