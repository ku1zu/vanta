import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, QuadraticBezierLine } from '@react-three/drei'
import { Vector3, type Group } from 'three'
import { palette } from '@vanta/tokens'
import { DEFAULT_PARAMS, SurfaceMaterial, useQuality } from '@vanta/stage'
import { Particles } from '../shared'

const PLANET = { ...DEFAULT_PARAMS, color: '#20252d', transmission: 0.6, roughness: 0.12, thickness: 2, ior: 1.4, clearcoat: 1 }
const LATLON: [number, number][] = [[48, 2], [40, -74], [35, 139], [-23, -46], [1, 103], [52, 13], [-34, 151], [25, 55], [37, -122], [-1, 36], [19, 73], [60, 25]]
const ARCS: [number, number][] = [[0, 1], [1, 4], [2, 6], [5, 7], [3, 9]]
const TAGS: [string, [number, number, number]][] = [['EMEA +18%', [-3.2, 1.3, 1.6]], ['APAC +31%', [3.2, -0.6, 1.2]], ['AMER +22%', [1.2, 2.7, 1.9]]]
const RINGS = [2.8, 3.4, 4.1]
const CENTER: [number, number, number] = [0, 0, 0]
const SPREAD: [number, number, number] = [11, 7, 6]

const ll = (lat: number, lon: number, r: number): [number, number, number] => {
  const a = (lat * Math.PI) / 180, b = (lon * Math.PI) / 180
  return [r * Math.cos(a) * Math.sin(b), r * Math.sin(a), r * Math.cos(a) * Math.cos(b)]
}
const mid = (a: [number, number, number], b: [number, number, number]): [number, number, number] =>
  new Vector3(...a).add(new Vector3(...b)).multiplyScalar(0.75).toArray() as [number, number, number]

/** Abstract business planet: smoked glass sphere, orbit hairlines, activity points, restrained data arcs. */
export function PlanetScene({ position }: { position: [number, number, number] }) {
  const { tier, reducedMotion } = useQuality()
  const spin = useRef<Group>(null)
  useFrame((_, dt) => { if (spin.current && !reducedMotion) spin.current.rotation.y += dt * 0.02 })
  const pts = useMemo(() => LATLON.slice(0, tier === 'low' ? 5 : LATLON.length).map(([la, lo]) => ll(la, lo, 2.02)), [tier])
  return (
    <group position={position}>
      <group ref={spin}>
        <mesh><sphereGeometry args={[2, tier === 'low' ? 48 : 96, tier === 'low' ? 48 : 96]} /><SurfaceMaterial params={PLANET} premium={tier === 'high'} /></mesh>
        {pts.map((p, i) => (
          <mesh key={i} position={p}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color={palette.cyan} toneMapped={false} /></mesh>
        ))}
        {tier !== 'low' && ARCS.map(([a, b], i) => pts[a] && pts[b] ? (
          <QuadraticBezierLine key={i} start={pts[a]} end={pts[b]} mid={mid(pts[a], pts[b])} color={palette.cyan} lineWidth={1} transparent opacity={0.45} />
        ) : null)}
      </group>
      {RINGS.map((r, i) => (
        <mesh key={r} rotation={[1.25 + i * 0.12, 0.2 * i, i * 0.4]}>
          <torusGeometry args={[r, 0.006, 8, 240]} /><meshBasicMaterial color={palette.silver} transparent opacity={0.35} />
        </mesh>
      ))}
      <Particles count={tier === 'high' ? 120 : tier === 'medium' ? 60 : 0} center={CENTER} spread={SPREAD} />
      {tier === 'high' && TAGS.map(([t, p]) => (
        <Html key={t} position={p} center zIndexRange={[5, 0]}><span className="tag mono">{t}</span></Html>
      ))}
    </group>
  )
}