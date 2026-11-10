import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { DEFAULT_PARAMS, SurfaceMaterial, useQuality } from '@vanta/stage'
import { Blob } from '../material-lab/objects'
import { Drift, Particles } from '../shared'

const LIQUID = { ...DEFAULT_PARAMS, transmission: 1, roughness: 0.03, thickness: 1.4, ior: 1.3, distortion: 0.5, distortionScale: 0.5 }
const CHROME = { ...DEFAULT_PARAMS, metalness: 1, roughness: 0.05, color: '#e6e9ee', envMapIntensity: 1.5 }
const CENTER: [number, number, number] = [2, 0, -1]
const SPREAD: [number, number, number] = [14, 7, 8]

/** Hero: one large liquid-glass form, a chrome sphere in front, one thin orbital ring, sparse dust. */
export function HeroScene() {
  const { tier, settings, reducedMotion } = useQuality()
  const ring = useRef<Group>(null)
  useFrame((_, dt) => { if (ring.current && !reducedMotion) ring.current.rotation.z += dt * 0.02 })
  return (
    <group>
      <Drift position={[3.2, 0, 0]} scale={1.8}>
        <Blob seed={1} amp={0.26} seg={settings.segments}>
          <SurfaceMaterial params={LIQUID} premium={tier === 'high'} />
        </Blob>
      </Drift>
      <Drift position={[-0.8, -1.3, 3]} phase={2}>
        <mesh scale={0.5}><sphereGeometry args={[1, 64, 64]} /><SurfaceMaterial params={CHROME} /></mesh>
      </Drift>
      <group ref={ring} position={[3.2, 0.1, 0.2]} rotation={[1.2, 0.25, 0]}>
        <mesh><torusGeometry args={[3.1, 0.012, 16, 200]} /><meshStandardMaterial color="#d9dde3" metalness={1} roughness={0.15} /></mesh>
      </group>
      <Particles count={tier === 'high' ? 160 : tier === 'medium' ? 80 : 0} center={CENTER} spread={SPREAD} />
    </group>
  )
}