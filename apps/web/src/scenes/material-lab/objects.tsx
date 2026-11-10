import { useMemo, type ReactNode } from 'react'
import { RoundedBox } from '@react-three/drei'
import { IcosahedronGeometry, Vector3 } from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { MaterialParams } from '@vanta/stage'

export interface LabObject {
  id: string
  pos: [number, number, number]
  p: Partial<MaterialParams>
  premium?: boolean
  build: (mat: ReactNode, seg: number) => ReactNode
}

/** Smooth organic blob: merged icosphere displaced by low-frequency sines. */
export function Blob({ seed, amp, seg, scale = [1, 1, 1], children }: {
  seed: number; amp: number; seg: number; scale?: [number, number, number]; children: ReactNode
}) {
  const geo = useMemo(() => {
    let g = new IcosahedronGeometry(1, seg)
    g.deleteAttribute('normal'); g.deleteAttribute('uv')
    g = mergeVertices(g)
    const pos = g.attributes.position, v = new Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize()
      const n = Math.sin(v.x * 2.1 + seed) * 0.5 + Math.sin(v.y * 2.7 + seed * 1.7) * 0.3 + Math.sin(v.z * 3.1 + seed * 0.6) * 0.2
      v.multiplyScalar(1 + n * amp); pos.setXYZ(i, v.x, v.y, v.z)
    }
    g.computeVertexNormals()
    return g
  }, [seed, amp, seg])
  return <mesh geometry={geo} scale={scale}>{children}</mesh>
}

const glass = { transmission: 1, roughness: 0.03, thickness: 0.6, ior: 1.45 }
const slab = (m: ReactNode) => <RoundedBox args={[1.6, 2.2, 0.35]} radius={0.12} smoothness={4}>{m}</RoundedBox>

/** Spread along x in one long, empty room. Positions are deliberately uneven. */
export const OBJECTS: LabObject[] = [
  { id: 'Clear glass', pos: [-8, 0.5, 0], premium: true, p: { ...glass, roughness: 0.02, thickness: 0.5, chromaticAberration: 0.02 }, build: slab },
  { id: 'Frosted glass', pos: [-5.5, -0.8, -2], p: { ...glass, roughness: 0.55, thickness: 0.6, ior: 1.4 }, build: slab },
  { id: 'Thick refractive glass', pos: [-3, 0.9, 1], premium: true, p: { ...glass, thickness: 2.2, ior: 1.6, chromaticAberration: 0.1 },
    build: (m) => <mesh><dodecahedronGeometry args={[1.1, 0]} />{m}</mesh> },
  { id: 'Liquid glass', pos: [-0.5, -0.4, -1], premium: true, p: { ...glass, thickness: 1.2, ior: 1.3, distortion: 0.6, distortionScale: 0.5 },
    build: (m, s) => <Blob seed={1} amp={0.28} seg={s}>{m}</Blob> },
  { id: 'Chrome', pos: [2.2, 0.8, 0.5], p: { metalness: 1, roughness: 0.04, color: '#e6e9ee', envMapIntensity: 1.6 },
    build: (m) => <mesh><torusKnotGeometry args={[0.7, 0.24, 220, 32]} />{m}</mesh> },
  { id: 'Matte ceramic', pos: [4.2, -0.9, -1.5], p: { roughness: 0.62, color: '#ece9e4', clearcoat: 0.1 },
    build: (m) => <mesh><sphereGeometry args={[1, 64, 64]} />{m}</mesh> },
  { id: 'Translucent ceramic', pos: [6.5, 0.6, 0], p: { transmission: 0.4, thickness: 1.4, roughness: 0.5, ior: 1.3, color: '#f4f1ec' },
    build: (m) => <mesh scale={[1, 0.7, 1]}><sphereGeometry args={[1.1, 64, 64]} />{m}</mesh> },
  { id: 'Soft stone', pos: [9, -0.5, -2], p: { roughness: 1, color: '#b4aea5' },
    build: (m, s) => <Blob seed={4} amp={0.35} seg={s} scale={[1.1, 0.8, 0.9]}>{m}</Blob> },
  { id: 'Crystal', pos: [11.5, 0.8, 0.5], premium: true, p: { ...glass, roughness: 0, thickness: 1.6, ior: 2, chromaticAberration: 0.14, color: '#eaf6ff' },
    build: (m) => <mesh scale={[0.65, 1.2, 0.65]}><octahedronGeometry args={[1, 0]} />{m}</mesh> },
  { id: 'Thin glass sheets', pos: [14, 0, -1], p: { ...glass, roughness: 0.04, thickness: 0.05, ior: 1.5 },
    build: (m) => (<>
      <group rotation={[0, 0.35, 0]}><RoundedBox args={[1.8, 2.4, 0.04]} radius={0.02}>{m}</RoundedBox></group>
      <group rotation={[0, -0.35, 0]} position={[0.5, 0.1, 0.5]}><RoundedBox args={[1.8, 2.4, 0.04]} radius={0.02}>{m}</RoundedBox></group>
    </>) },
  { id: 'Glass spheres', pos: [16.5, -0.7, 0.5], p: { ...glass, roughness: 0, thickness: 1, ior: 1.5 },
    build: (m) => (<>
      <mesh><sphereGeometry args={[0.9, 64, 64]} />{m}</mesh>
      <mesh position={[1.1, -0.5, 0.6]}><sphereGeometry args={[0.4, 48, 48]} />{m}</mesh>
      <mesh position={[-1, 0.7, 0.5]}><sphereGeometry args={[0.25, 48, 48]} />{m}</mesh>
    </>) },
  { id: 'Glass rings', pos: [19, 0.7, -1], p: { ...glass, thickness: 0.4 },
    build: (m) => (<>
      <mesh><torusGeometry args={[1, 0.12, 48, 160]} />{m}</mesh>
      <mesh rotation={[1.2, 0.3, 0]}><torusGeometry args={[0.65, 0.09, 48, 128]} />{m}</mesh>
    </>) },
  { id: 'Floating capsules', pos: [21.5, -0.4, 0], p: { transmission: 0.9, thickness: 0.8, roughness: 0.2, ior: 1.4 },
    build: (m) => (<>
      <mesh rotation={[0, 0, 0.6]}><capsuleGeometry args={[0.3, 1, 12, 32]} />{m}</mesh>
      <mesh rotation={[0, 0, -0.5]} position={[0.9, 0.3, -0.3]}><capsuleGeometry args={[0.22, 0.7, 12, 32]} />{m}</mesh>
    </>) },
  { id: 'Soft organic blob', pos: [24, 0.5, -1.5], p: { roughness: 0.35, color: '#e8e9ec', clearcoat: 0.4 },
    build: (m, s) => <Blob seed={7} amp={0.3} seg={s}>{m}</Blob> },
]