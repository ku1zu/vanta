import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, MathUtils } from 'three'
import { LIGHTING, useQuality } from '@vanta/stage'
import { scroll } from '../lib/scroll'
import { HeroScene } from './hero/HeroScene'
import { PlanetScene } from './global-business/PlanetScene'
import { Ambient, COMMAND, CTA, FEATURES } from './shared'

const PALE = new Color(LIGHTING.white.bg)
const DARK = new Color(LIGHTING.graphite.bg)
const bg = new Color()

/** The whole landing world. The camera rides a rail along x as you scroll; the room fades pale to graphite. */
export function Experience() {
  const { reducedMotion } = useQuality()
  const invalidate = useThree((s) => s.invalidate)
  const ptr = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!reducedMotion) return
    const f = () => invalidate()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [reducedMotion, invalidate])

  useFrame(({ camera, scene, pointer }, dt) => {
    scroll.sm = reducedMotion ? scroll.s : MathUtils.damp(scroll.sm, scroll.s, 3, dt)
    const s = scroll.sm
    ptr.current.x = reducedMotion ? 0 : MathUtils.damp(ptr.current.x, pointer.x, 2, dt)
    ptr.current.y = reducedMotion ? 0 : MathUtils.damp(ptr.current.y, pointer.y, 2, dt)
    const cx = s * 14
    camera.position.set(
      cx + ptr.current.x * 0.3,
      0.3 - MathUtils.smoothstep(s, 0, 4) * 0.4 + ptr.current.y * 0.1,
      12 + MathUtils.smoothstep(s, 1, 2) * 1.5 - MathUtils.smoothstep(s, 2.8, 4) * 1.5,
    )
    camera.lookAt(cx + ptr.current.x * 0.4, 0.1 + ptr.current.y * 0.2, 0)

    const target = scroll.dkTarget ?? MathUtils.smoothstep(s, 1.2, 2.2)
    scroll.dk = reducedMotion ? target : MathUtils.damp(scroll.dk, target, 2.5, dt)
    const t = scroll.dk
    // UI text theme follows the displayed background, with hysteresis so it never flickers.
    const next = t > 0.55 ? true : t < 0.45 ? false : scroll.isDark
    if (next !== scroll.isDark) { scroll.isDark = next; scroll.onTheme?.(next) }

    bg.copy(PALE).lerp(DARK, t)
    if (scene.background instanceof Color) scene.background.copy(bg)
    if (scene.fog) scene.fog.color.copy(bg)
    scene.environmentIntensity = MathUtils.lerp(1, 0.4, t)
  })

  return (
    <>
      <HeroScene />
      <Ambient set={COMMAND} />
      <PlanetScene position={[25.5, 0, 0]} />
      <Ambient set={FEATURES} />
      <Ambient set={CTA} />
    </>
  )
}