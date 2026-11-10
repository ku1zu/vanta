import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { useQuality } from './quality'

/** Damped pointer parallax. Attach the returned ref to a <group>. Disabled for reduced motion. */
export function usePointerParallax(strength = 0.25, lambda = 4) {
  const ref = useRef<Group>(null)
  const { reducedMotion } = useQuality()
  useFrame(({ pointer }, dt) => {
    const g = ref.current
    if (!g || reducedMotion) return
    g.rotation.y = MathUtils.damp(g.rotation.y, pointer.x * strength, lambda, dt)
    g.rotation.x = MathUtils.damp(g.rotation.x, -pointer.y * strength, lambda, dt)
  })
  return ref
}
