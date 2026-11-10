import { useEffect, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls, OrthographicCamera, PerformanceMonitor, PerspectiveCamera } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { QualityContext, useQuality } from './quality'

type Strip = { i: number; p: [number, number, number]; s: [number, number, number]; c: string }

const SOFT: Strip[] = [
  { i: 3, p: [0, 6, -4], s: [14, 5, 1], c: '#ffffff' },
  { i: 1.2, p: [-6, 1, 2], s: [2, 8, 1], c: '#f4f7fb' },
  { i: 0.5, p: [0, -6, 0], s: [30, 30, 1], c: '#e8ecf2' },
  { i: 0.3, p: [0, 1, 11], s: [30, 14, 1], c: '#f2f4f8' },
]
const tint = (c: string): Strip => ({ i: 0.7, p: [6, -1, 3], s: [0.8, 8, 1], c })

export const LIGHTING = {
  white: { bg: '#e9ecef', dom: 'lab', key: 0.7, shadow: ['#1b2430', 0.2], strips: SOFT },
  silver: { bg: '#c8cdd4', dom: 'lab', key: 0.6, shadow: ['#141a22', 0.22], strips: [
    { i: 2.2, p: [0, 6, -4], s: [14, 5, 1], c: '#e3e7ee' }, { i: 1, p: [6, 0, 2], s: [2, 8, 1], c: '#cfd6e0' },
    { i: 0.5, p: [0, -6, 0], s: [30, 30, 1], c: '#c9d0da' }, { i: 0.3, p: [0, 1, 11], s: [30, 14, 1], c: '#dde2ea' }] as Strip[] },
  cyan: { bg: '#e3edf0', dom: 'lab', key: 0.7, shadow: ['#16262c', 0.2], strips: [...SOFT, tint('#7fd8ff')] },
  blue: { bg: '#e2e7f0', dom: 'lab', key: 0.7, shadow: ['#161c2c', 0.2], strips: [...SOFT, tint('#4d7cff')] },
  violet: { bg: '#e8e5f0', dom: 'lab', key: 0.7, shadow: ['#1d182c', 0.2], strips: [...SOFT, tint('#9b8cff')] },
  graphite: { bg: '#0a0b0d', dom: 'chamber', key: 0.25, shadow: ['#9fb4d0', 0.05], strips: [
    { i: 1, p: [0, 6, -4], s: [14, 2, 1], c: '#cfd8e6' }, { i: 2.2, p: [-6, 0, 1], s: [0.6, 9, 1], c: '#dfe6f0' },
    { i: 0.6, p: [6, 0, 2], s: [0.6, 9, 1], c: '#9b8cff' }, { i: 0.25, p: [0, -6, 0], s: [30, 30, 1], c: '#4a5566' }] as Strip[] },
} as const
export type LightingId = keyof typeof LIGHTING

export interface PostSettings { bloom: number; dof: boolean; dofDistance: number; dofRange: number; bokeh: number }
export type CameraKind = 'perspective' | 'orthographic'

function Rig({ camera, orbit }: { camera: CameraKind; orbit: boolean }) {
  const w = useThree((s) => s.size.width)
  return (
    <>
      {camera === 'perspective'
        ? <PerspectiveCamera makeDefault position={[0, 0.3, 12]} fov={w < 700 ? 50 : w < 1100 ? 40 : 32} />
        : <OrthographicCamera makeDefault position={[0, 0.3, 12]} zoom={w / 16} near={0.1} far={200} />}
      {orbit && (
        <OrbitControls key={camera} makeDefault enableDamping dampingFactor={0.06} rotateSpeed={0.35}
          minPolarAngle={1.1} maxPolarAngle={1.9} minAzimuthAngle={-0.6} maxAzimuthAngle={0.6} />
      )}
    </>
  )
}

function TierGL() {
  const gl = useThree((s) => s.gl)
  const { tier } = useQuality()
  useEffect(() => {
    ;(gl as unknown as { transmissionResolutionScale?: number }).transmissionResolutionScale = tier === 'high' ? 1 : 0.5
  }, [gl, tier])
  return null
}

export interface StageProps {
  children: ReactNode; lighting?: LightingId; envIntensity?: number; haze?: number
  camera?: CameraKind; post?: PostSettings; orbit?: boolean
}

export function Stage({ children, lighting = 'white', envIntensity = 1, haze = 0.025, camera = 'perspective', orbit = true,
  post = { bloom: 0.12, dof: false, dofDistance: 13, dofRange: 6, bokeh: 3 } }: StageProps) {
  const quality = useQuality()
  const room = LIGHTING[lighting]
  const mode = quality.settings.post
  return (
    <Canvas dpr={quality.settings.dpr} gl={{ powerPreference: 'high-performance' }}
      frameloop={quality.reducedMotion ? 'demand' : 'always'}>
      <QualityContext.Provider value={quality}>
        <color attach="background" args={[room.bg]} />
        <fogExp2 attach="fog" args={[room.bg, haze]} />
        <PerformanceMonitor onDecline={quality.degrade} />
        <TierGL />
        <Rig camera={camera} orbit={orbit} />
        <Environment resolution={quality.settings.envRes} environmentIntensity={envIntensity}>
          {room.strips.map((l, n) => (
            <Lightformer key={n} form="rect" intensity={l.i} position={l.p} scale={l.s} color={l.c} target={[0, 0, 0]} />
          ))}
        </Environment>
        <directionalLight position={[-6, 8, 8]} intensity={room.key} />
        <directionalLight position={[8, 3, -6]} intensity={room.key * 0.4} color="#dbe7ff" />
        {children}
        {mode === 'full' && post.dof ? (
          <EffectComposer multisampling={0}>
            <Bloom intensity={post.bloom} luminanceThreshold={0.85} mipmapBlur />
            <DepthOfField worldFocusDistance={post.dofDistance} worldFocusRange={post.dofRange} bokehScale={post.bokeh} />
          </EffectComposer>
        ) : mode !== 'none' ? (
          <EffectComposer multisampling={0}>
            <Bloom intensity={post.bloom} luminanceThreshold={0.85} mipmapBlur />
          </EffectComposer>
        ) : null}
      </QualityContext.Provider>
    </Canvas>
  )
}