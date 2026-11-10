import { createContext, useContext } from 'react';
import * as THREE from 'three';
import { PALETTE as P, SHADING_PRESETS, type LabSettings } from './settings';

export type GradGroup = 'hair' | 'face' | 'suit' | 'none';
export type MatKey =
  | 'skin' | 'hair' | 'suit' | 'scarf' | 'pack' | 'paper' | 'shoe' | 'sole'
  | 'eyeWhite' | 'iris' | 'pupil' | 'line' | 'highlight' | 'nose' | 'blush';

export interface Shared {
  threshold: THREE.IUniform<number>;
  softness: THREE.IUniform<number>;
  lightDir: THREE.IUniform<THREE.Vector3>;
  outlineThickness: THREE.IUniform<number>;
  outlineOpacity: THREE.IUniform<number>;
  grad: Record<GradGroup, THREE.IUniform<number>>;
}

export interface ToonDef {
  base: string;
  tint: string;
  top?: string;
  bottom?: string;
  range?: [number, number];
  group: GradGroup;
}

export interface Style {
  shared: Shared;
  mats: Record<MatKey, THREE.Material>;
  hull: THREE.ShaderMaterial;
  dispose: () => void;
}

/** Shared vertex shader: supports skinning, and pushes vertices along the normal for the outline hull. */
const VERT = /* glsl */ `
#include <common>
#include <skinning_pars_vertex>
uniform float uPush;
varying vec3 vN;
varying vec2 vUv;
varying float vWorldY;
void main() {
  #include <beginnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  transformed += normalize(objectNormal) * uPush;
  vN = normalize(mat3(modelMatrix) * objectNormal);
  vUv = uv;
  vec4 wp = modelMatrix * vec4(transformed, 1.0);
  vWorldY = wp.y;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const TOON_FRAG = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uShadeTint;
uniform vec3 uGradTop;
uniform vec3 uGradBottom;
uniform float uGradStrength;
uniform vec2 uGradRange;
uniform vec3 uLightDir;
uniform float uThreshold;
uniform float uSoftness;
uniform sampler2D uMap;
uniform float uUseMap;
varying vec3 vN;
varying vec2 vUv;
varying float vWorldY;
void main() {
  vec3 base = uBase;
  if (uUseMap > 0.5) base *= texture2D(uMap, vUv).rgb;
  float g = smoothstep(uGradRange.x, uGradRange.y, vWorldY);
  base = mix(base, mix(uGradBottom, uGradTop, g), uGradStrength);
  float ndl = dot(normalize(vN), normalize(uLightDir)) * 0.5 + 0.5;
  float lit = smoothstep(uThreshold - uSoftness, uThreshold + uSoftness, ndl);
  vec3 col = mix(base * uShadeTint, base, lit);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

const HULL_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(uColor, uOpacity);
  #include <colorspace_fragment>
}
`;

export function makeToon(def: ToonDef, shared: Shared): THREE.ShaderMaterial {
  const [y0, y1] = def.range ?? [0, 2];
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: TOON_FRAG,
    uniforms: {
      uBase: { value: new THREE.Color(def.base) },
      uShadeTint: { value: new THREE.Color(def.tint) },
      uGradTop: { value: new THREE.Color(def.top ?? def.base) },
      uGradBottom: { value: new THREE.Color(def.bottom ?? def.base) },
      uGradStrength: shared.grad[def.group],
      uGradRange: { value: new THREE.Vector2(y0, y1) },
      uLightDir: shared.lightDir,
      uThreshold: shared.threshold,
      uSoftness: shared.softness,
      uMap: { value: null },
      uUseMap: { value: 0 },
      uPush: { value: 0 },
    },
  });
}

export function createStyle(): Style {
  const shared: Shared = {
    threshold: { value: 0.48 },
    softness: { value: 0.02 },
    lightDir: { value: new THREE.Vector3(-0.5, 0.6, 0.7) },
    outlineThickness: { value: 0.014 },
    outlineOpacity: { value: 1 },
    grad: { hair: { value: 0 }, face: { value: 0 }, suit: { value: 0 }, none: { value: 0 } },
  };
  const t = (d: ToonDef) => makeToon(d, shared);

  const mats: Record<MatKey, THREE.Material> = {
    skin: t({ base: P.skin, tint: P.skinShade, top: P.skinTop, bottom: P.skinBottom, range: [1.1, 1.82], group: 'face' }),
    hair: t({ base: P.hair, tint: P.hairShade, top: P.hairTop, bottom: P.hairBottom, range: [1.45, 2.0], group: 'hair' }),
    suit: t({ base: P.suit, tint: P.suitShade, top: P.suitTop, bottom: P.suitBottom, range: [0.1, 1.1], group: 'suit' }),
    scarf: t({ base: P.scarf, tint: P.scarfShade, group: 'none' }),
    pack: t({ base: P.pack, tint: P.packShade, group: 'none' }),
    paper: t({ base: P.paper, tint: P.paperShade, group: 'none' }),
    shoe: t({ base: P.shoe, tint: P.shoeShade, group: 'none' }),
    sole: t({ base: P.sole, tint: P.soleShade, group: 'none' }),
    eyeWhite: t({ base: P.eyeWhite, tint: P.eyeWhiteShade, group: 'none' }),
    iris: t({ base: P.iris, tint: P.irisShade, top: P.irisTop, bottom: P.irisBottom, range: [1.3, 1.54], group: 'face' }),
    pupil: new THREE.MeshBasicMaterial({ color: P.pupil }),
    line: new THREE.MeshBasicMaterial({ color: P.line }),
    highlight: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    nose: new THREE.MeshBasicMaterial({ color: P.nose }),
    blush: new THREE.MeshBasicMaterial({ color: P.blush, transparent: true, opacity: 0.55 }),
  };

  const hull = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: HULL_FRAG,
    side: THREE.BackSide,
    transparent: true,
    uniforms: {
      uPush: shared.outlineThickness,
      uColor: { value: new THREE.Color(P.line) },
      uOpacity: shared.outlineOpacity,
    },
  });

  return {
    shared,
    mats,
    hull,
    dispose: () => {
      Object.values(mats).forEach((m) => m.dispose());
      hull.dispose();
    },
  };
}

export function lightVector(azDeg: number, elDeg: number): THREE.Vector3 {
  const a = THREE.MathUtils.degToRad(azDeg);
  const e = THREE.MathUtils.degToRad(elDeg);
  return new THREE.Vector3(Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a));
}

export function applySettings(style: Style, s: LabSettings) {
  const p = SHADING_PRESETS[s.shading];
  const sh = style.shared;
  sh.threshold.value = s.shadowThreshold;
  sh.softness.value = Math.max(0.002, s.shadowSoftness);
  sh.lightDir.value.copy(lightVector(s.lightAzimuth, s.lightElevation));
  sh.outlineThickness.value = s.outlineThickness * p.outlineScale;
  sh.outlineOpacity.value = s.outlineOpacity;
  const g = p.gradients ? s.gradientStrength : 0;
  sh.grad.hair.value = Math.min(1, g * s.hairGradient);
  sh.grad.face.value = Math.min(1, g * s.faceGradient);
  sh.grad.suit.value = Math.min(1, g * s.suitGradient);
  sh.grad.none.value = 0;
}

export const StyleCtx = createContext<Style | null>(null);
export function useStyle(): Style {
  const v = useContext(StyleCtx);
  if (!v) throw new Error('useStyle must be used inside <StyleCtx.Provider>');
  return v;
}
