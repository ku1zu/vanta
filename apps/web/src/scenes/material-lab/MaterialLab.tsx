import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CanvasTexture, MathUtils, Vector3, type Group } from 'three'
import { DEFAULT_PARAMS, LIGHTING, SurfaceMaterial, useQuality } from '@vanta/stage'
import { OBJECTS } from './objects'
import type { LabControls } from './controls'

// Scale creates hierarchy: a few large presences, several small ones.
const SCALE: Record<string, number> = {
  'Liquid glass': 1.35, 'Thick refractive glass': 1.1, Crystal: 1.15, Chrome: 0.9,
  'Soft stone': 1.25, 'Soft organic blob': 1.3, 'Glass rings': 1.2, 'Glass spheres': 0.9,
}
const LINES: [number, number, number][] = [[-1.9, -4.5, 1], [1.6, -4.8, 0.35], [3.2, -5, 0.2]] // y, z, opacity
const FLOOR = -3

let shadowTex: CanvasTexture | null = null
function getShadowTex() {
  if (shadowTex) return shadowTex
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.5, 'rgba(255,255,255,0.35)'); grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128)
  return (shadowTex = new CanvasTexture(c))
}

/** Cheap soft floor shadow (no shadow maps): a radial-gradient disc on an invisible floor. */
function SoftShadow({ y, color, opacity }: { y: number; color: string; opacity: number }) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[2.4, 2.4, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={getShadowTex()} color={color} transparent opacity={opacity} depthWrite={false} fog={false} toneMapped={false} />
    </mesh>
  )
}

/** Heavy, slow, physical. Everything moves a few centimetres per minute and is damped. */
export function MaterialLab({ c }: { c: LabControls }) {
  const { reducedMotion, settings, tier } = useQuality()
  const controls = useThree((s) => s.controls) as unknown as { target: Vector3 } | null
  const root = useRef<Group>(null)
  const refs = useRef<Record<string, Group | null>>({})
  const tmp = useMemo(() => new Vector3(), [])
  const room = LIGHTING[c.scene.lighting]
  const lineColor = c.scene.lighting === 'graphite' ? '#4d7cff' : '#7fd8ff'

  useFrame(({ pointer, clock, camera }, dt) => {
    const t = clock.elapsedTime
    if (root.current && !reducedMotion) {
      root.current.position.x = MathUtils.damp(root.current.position.x, -pointer.x * c.cam.mouseParallax, 2, dt)
      root.current.rotation.y = Math.sin(t * 0.05) * c.cam.drift
      OBJECTS.forEach((o, i) => {
        const g = refs.current[o.id]
        if (!g) return
        const tx = o.pos[0] + pointer.x * c.cam.objectParallax * (o.pos[2] + 6) * 0.05
        g.position.x = MathUtils.damp(g.position.x, tx, 1.5, dt)
        g.position.y = o.pos[1] + Math.sin(t * 0.25 + i) * 0.06
        g.rotation.y += dt * 0.03
        g.rotation.x = Math.sin(t * 0.12 + i * 2) * 0.05
      })
    }
    const sel = OBJECTS.find((o) => o.id === c.target)
    if (controls && sel && c.cam.follow) {
      tmp.set(...sel.pos).sub(controls.target).multiplyScalar(1 - Math.exp(-2 * dt))
      controls.target.add(tmp); camera.position.add(tmp)
    }
  })

  return (
    <group ref={root}>
      {/* Faint hairlines far behind the objects: something for the glass to bend. */}
      {LINES.map(([y, z, o], i) => (
        <mesh key={i} position={[11, y, z]}>
          <boxGeometry args={[70, 0.02, 0.02]} />
          <meshBasicMaterial color={lineColor} transparent opacity={o} toneMapped={false} />
        </mesh>
      ))}
      {OBJECTS.map((o) => {
        const selected = o.id === c.target
        const params = selected ? c.params : { ...DEFAULT_PARAMS, ...o.p }
        const premium = selected || (!!o.premium && tier === 'high')
        const sc = SCALE[o.id] ?? 1
        return (
          <group key={o.id} ref={(g) => { refs.current[o.id] = g }} position={o.pos} scale={sc}>
            {settings.post !== 'none' || room.shadow[1] > 0 ? (
              <SoftShadow y={(FLOOR - o.pos[1]) / sc} color={room.shadow[0]} opacity={room.shadow[1]} />
            ) : null}
            {o.build(<SurfaceMaterial params={params} premium={premium} />, settings.segments)}
          </group>
        )
      })}
    </group>
  )
}