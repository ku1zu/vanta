import { useEffect } from 'react'
import { useControls } from 'leva'
import { DEFAULT_PARAMS, type CameraKind, type LightingId, type MaterialParams, type PostSettings } from '@vanta/stage'
import { OBJECTS } from './objects'

const num = (value: number, min: number, max: number, step = 0.01) => ({ value, min, max, step })
const ids = OBJECTS.map((o) => o.id)

/** Developer-only panel (hidden in production builds). Material sliders edit the selected object. */
export function useLabControls() {
  const scene = useControls('Scene', {
    lighting: { value: 'white' as LightingId, options: ['white', 'silver', 'cyan', 'blue', 'violet', 'graphite'] as LightingId[] },
    envIntensity: num(1, 0, 3, 0.05), haze: num(0.025, 0, 0.12, 0.002), grain: num(0.07, 0, 0.3, 0.005),
  })
  const cam = useControls('Camera', {
    type: { value: 'perspective' as CameraKind, options: ['perspective', 'orthographic'] as CameraKind[] },
    follow: true, drift: num(0.02, 0, 0.1, 0.005), mouseParallax: num(0.4, 0, 2, 0.05), objectParallax: num(0.5, 0, 2, 0.05),
  })
  const post = useControls('Post', {
    bloom: num(0.12, 0, 1.5), dof: false, dofDistance: num(13, 1, 40, 0.5), dofRange: num(6, 0.5, 20, 0.5), bokeh: num(3, 0, 10, 0.1),
  })
  const [mat, setMat] = useControls('Material', () => ({
    target: { value: 'Liquid glass', options: ids },
    color: '#ffffff', roughness: num(0.3, 0, 1), metalness: num(0, 0, 1), transmission: num(0, 0, 1),
    thickness: num(0.5, 0, 4), ior: num(1.45, 1, 2.4), chromaticAberration: num(0.02, 0, 0.3), distortion: num(0, 0, 1.5),
    distortionScale: num(0.3, 0.05, 1.5), opacity: num(1, 0, 1), clearcoat: num(0, 0, 1), envMapIntensity: num(1, 0, 3, 0.05),
  }))

  // Loading an object's preset into the sliders when the target changes.
  useEffect(() => {
    const o = OBJECTS.find((x) => x.id === mat.target)
    if (o) setMat({ ...DEFAULT_PARAMS, ...o.p })
  }, [mat.target, setMat])

  const { target, ...params } = mat
  return { scene, cam, post: post as PostSettings, target, params: params as MaterialParams }
}
export type LabControls = ReturnType<typeof useLabControls>