import { MeshTransmissionMaterial } from '@react-three/drei'
import { useQuality } from './quality'

export interface MaterialParams {
  color: string; roughness: number; metalness: number; transmission: number; thickness: number
  ior: number; chromaticAberration: number; distortion: number; distortionScale: number
  opacity: number; clearcoat: number; envMapIntensity: number
}
export const DEFAULT_PARAMS: MaterialParams = {
  color: '#ffffff', roughness: 0.3, metalness: 0, transmission: 0, thickness: 0.5, ior: 1.45,
  chromaticAberration: 0.02, distortion: 0, distortionScale: 0.3, opacity: 1, clearcoat: 0, envMapIntensity: 1,
}

const ATT = '#d4e4ee' // faint cool absorption: gives glass volume as light passes through it

/**
 * premium = drei's refractive material (chromatic aberration, distortion; an extra render pass each).
 * Otherwise three's native physical material, which shares one transmission pass. Low tier never uses transmission.
 */
export function SurfaceMaterial({ params: p, premium = false }: { params: MaterialParams; premium?: boolean }) {
  const { settings } = useQuality()
  const simple = settings.glass === 'simple'
  if (premium && !simple && p.transmission > 0.5) {
    return (
      <MeshTransmissionMaterial
        color={p.color} transmission={p.transmission} thickness={p.thickness} roughness={p.roughness}
        ior={p.ior} chromaticAberration={p.chromaticAberration} distortion={p.distortion}
        distortionScale={p.distortionScale} temporalDistortion={p.distortion > 0 ? 0.08 : 0}
        anisotropicBlur={0.2} samples={settings.samples} resolution={settings.resolution}
        backside={settings.backside} transparent opacity={p.opacity} envMapIntensity={p.envMapIntensity}
        metalness={p.metalness} clearcoat={p.clearcoat} attenuationColor={ATT} attenuationDistance={2.5}
      />
    )
  }
  const glassy = p.transmission > 0.3
  const soft = p.metalness < 0.5 && !glassy // ceramic, stone, blobs: a touch of sheen reads as soft, not plastic
  return (
    <meshPhysicalMaterial
      color={p.color} roughness={p.roughness} metalness={p.metalness}
      transmission={simple ? 0 : p.transmission} thickness={p.thickness} ior={p.ior}
      attenuationColor={glassy ? ATT : '#ffffff'} attenuationDistance={glassy ? 2.5 : Infinity}
      sheen={soft ? 0.35 : 0} sheenRoughness={0.6} sheenColor="#ffffff"
      opacity={simple && glassy ? Math.min(p.opacity, 0.5) : p.opacity}
      transparent={p.opacity < 1 || (simple && glassy)} clearcoat={p.clearcoat} envMapIntensity={p.envMapIntensity}
    />
  )
}