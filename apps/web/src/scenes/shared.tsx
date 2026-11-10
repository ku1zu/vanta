import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, type Group } from 'three'
import { DEFAULT_PARAMS, SurfaceMaterial, useQuality, type MaterialParams } from '@vanta/stage'

/** Slow, heavy float + tiny drift. Disabled for reduced motion. */
export function Drift({ position, scale = 1, phase = 0, spin = 0.03, children }: {
  position: [number, number, number]; scale?: number; phase?: number; spin?: number; children: ReactNode
}) {
  const ref = useRef<Group>(null)
  const { reducedMotion } = useQuality()
  useFrame(({ clock }, dt) => {
    const g = ref.current
    if (!g || reducedMotion) return
    g.position.y = position[1] + Math.sin(clock.elapsedTime * 0.25 + phase) * 0.07
    g.rotation.y += dt * spin
    g.rotation.x = Math.sin(clock.elapsedTime * 0.12 + phase) * 0.05
  })
  return <group ref={ref} position={position} scale={scale}>{children}</group>
}

/** Sparse static dust. Count is tier-aware (none on low). */
export function Particles({ count, center, spread }: { count: number; center: [number, number, number]; spread: [number, number, number] }) {
  const geo = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) for (let k = 0; k < 3; k++) a[i * 3 + k] = center[k] + (Math.random() - 0.5) * spread[k]
    const g = new BufferGeometry(); g.setAttribute('position', new BufferAttribute(a, 3)); return g
  }, [count, center, spread])
  if (count === 0) return null
  return <points geometry={geo}><pointsMaterial size={0.035} sizeAttenuation color="#8b93a0" transparent opacity={0.55} depthWrite={false} /></points>
}

type Spec = { kind: 'sphere' | 'ring' | 'capsule'; pos: [number, number, number]; s: number; p: Partial<MaterialParams>; premium?: boolean }
const CHROME = { metalness: 1, roughness: 0.05, color: '#e6e9ee', envMapIntensity: 1.5 }
const GLASS = { transmission: 1, roughness: 0.04, thickness: 1, ior: 1.45 }
const CERAMIC = { roughness: 0.62, color: '#ece9e4', clearcoat: 0.1 }

export const COMMAND: Spec[] = [
  { kind: 'ring', pos: [10.5, 0.4, -1], s: 1.6, p: GLASS, premium: true },
  { kind: 'sphere', pos: [17.5, -1.2, -1.5], s: 1.1, p: CERAMIC },
  { kind: 'sphere', pos: [18.6, 1.4, -3], s: 0.35, p: CHROME },
]
export const FEATURES: Spec[] = [
  { kind: 'capsule', pos: [44, 0.3, 0], s: 1.1, p: { ...GLASS, transmission: 0.9 } },
  { kind: 'sphere', pos: [46.5, -0.9, -1], s: 0.8, p: CHROME },
  { kind: 'sphere', pos: [41.2, 1.1, -2], s: 0.9, p: CERAMIC },
]
export const CTA: Spec[] = [
  { kind: 'ring', pos: [58, 0, 0], s: 2.2, p: GLASS, premium: true },
  { kind: 'sphere', pos: [55, -1.2, 2], s: 0.45, p: CHROME },
]

export function Ambient({ set }: { set: Spec[] }) {
  const { tier } = useQuality()
  return (
    <>
      {set.map((o, i) => (
        <Drift key={i} position={o.pos} scale={o.s} phase={i * 1.7}>
          <mesh>
            {o.kind === 'sphere' ? <sphereGeometry args={[1, 64, 64]} />
              : o.kind === 'ring' ? <torusGeometry args={[1, 0.14, 48, 160]} />
              : <capsuleGeometry args={[0.3, 1, 12, 32]} />}
            <SurfaceMaterial params={{ ...DEFAULT_PARAMS, ...o.p }} premium={!!o.premium && tier === 'high'} />
          </mesh>
        </Drift>
      ))}
    </>
  )
}