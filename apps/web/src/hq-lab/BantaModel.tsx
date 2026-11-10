import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useStyle, type MatKey } from './toon';
import type { LabSettings, V3 } from './settings';

/* ------------------------------------------------------------------ */
/* Geometry helpers. Everything is "baked" (no mesh scaling) so the   */
/* outline thickness stays uniform in world units.                     */
/* ------------------------------------------------------------------ */

function smooth(g: THREE.BufferGeometry): THREE.BufferGeometry {
  g.deleteAttribute('uv');
  g.deleteAttribute('normal');
  const m = mergeVertices(g, 1e-4);
  m.computeVertexNormals();
  return m;
}
const sc = (g: THREE.BufferGeometry, x: number, y: number, z: number) => {
  g.scale(x, y, z);
  return smooth(g);
};
const ball = (x: number, y: number, z: number) => sc(new THREE.SphereGeometry(1, 28, 20), x, y, z);
const caps = (r: number, len: number, sx = 1, sz = 1) =>
  sc(new THREE.CapsuleGeometry(r, len, 6, 14), sx, 1, sz);

/* ---------------- head ---------------- */

const HR = new THREE.Vector3(0.42, 0.38, 0.38); // head half-sizes
const HAIR_R = new THREE.Vector3(0.5, 0.43, 0.46);

/** Unit-sphere direction -> head surface point (round cheeks, tapered jaw, slightly flat face). */
function warp(d: THREE.Vector3): THREE.Vector3 {
  let x = d.x;
  const y = d.y;
  let z = d.z;
  if (y < 0) {
    const k = Math.pow(Math.min(1, -y), 1.3);
    x *= 1 - 0.32 * k;
    z *= 1 - 0.28 * k;
  }
  z *= 1 - 0.07 * THREE.MathUtils.smoothstep(z, 0, 0.6);
  return new THREE.Vector3(x * HR.x, y * HR.y, z * HR.z);
}

function makeHead(): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, 44, 32);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const w = warp(v);
    p.setXYZ(i, w.x, w.y, w.z);
  }
  return smooth(g);
}

const Z_AXIS = new THREE.Vector3(0, 0, 1);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

function facePoint(u: number, v: number) {
  const d = new THREE.Vector3(Math.cos(v) * Math.sin(u), Math.sin(v), Math.cos(v) * Math.cos(u));
  const pos = warp(d);
  const n = new THREE.Vector3(pos.x / (HR.x * HR.x), pos.y / (HR.y * HR.y), pos.z / (HR.z * HR.z)).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(Z_AXIS, n);
  return { pos, n, q };
}

/* ---------------- hair ---------------- */

/** Tapered, bent, slightly flattened hair clump growing along +y from the origin. */
function makeClump(len: number, w: number, bend: number): THREE.BufferGeometry {
  const rings = 9;
  const seg = 10;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const r = w * Math.pow(1 - t, 0.75) * (1 + 0.35 * t);
    const cx = bend * len * t * t;
    const cy = len * t;
    for (let j = 0; j < seg; j++) {
      const a = (j / seg) * Math.PI * 2;
      pos.push(cx + Math.cos(a) * r, cy, Math.sin(a) * r * 0.65);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * seg + j;
      const b = i * seg + ((j + 1) % seg);
      const c = (i + 1) * seg + j;
      const d = (i + 1) * seg + ((j + 1) % seg);
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return smooth(g);
}

interface ClumpDef {
  phi: number; elev: number; len: number; w: number; bend: number;
  mode: 'down' | 'out'; swing: number; lift: number; roll: number;
}
const c = (
  phi: number, elev: number, len: number, w: number, bend: number,
  mode: 'down' | 'out', swing: number, lift: number, roll = 0,
): ClumpDef => ({ phi, elev, len, w, bend, mode, swing, lift, roll });

/**
 * phi: 0 = front, + = toward screen right, PI = back. elev: radians above the equator.
 * 'down' clumps hug the head going downward and flick out by `lift`.
 * 'out' clumps stick out of the head (spikes). Tweak these to match the drawing.
 */
const HAIR_DEFS: ClumpDef[] = [
  // bangs: wide, chunky, covering the forehead
  c(-0.98, 0.95, 0.34, 0.13, -0.15, 'down', -0.2, 0.18),
  c(-0.64, 1.0, 0.38, 0.13, 0.1, 'down', 0.1, 0.2),
  c(-0.3, 1.03, 0.34, 0.13, -0.1, 'down', -0.15, 0.22),
  c(0.05, 1.04, 0.38, 0.13, 0.12, 'down', 0.2, 0.18),
  c(0.4, 1.02, 0.33, 0.13, -0.1, 'down', 0.12, 0.22),
  c(0.75, 0.98, 0.37, 0.13, 0.1, 'down', 0.25, 0.18),
  c(1.05, 0.9, 0.33, 0.12, -0.1, 'down', 0.2, 0.2),
  // side locks
  c(-1.35, 0.6, 0.42, 0.12, 0.1, 'down', 0, 0.18),
  c(1.35, 0.6, 0.42, 0.12, -0.1, 'down', 0, 0.18),
  c(-1.55, 0.25, 0.32, 0.1, 0.1, 'down', 0, 0.3),
  c(1.55, 0.25, 0.32, 0.1, -0.1, 'down', 0, 0.3),
  // back
  c(-2.2, 0.6, 0.4, 0.14, 0.15, 'down', 0, 0.4),
  c(-2.7, 0.35, 0.4, 0.14, -0.15, 'down', 0, 0.45),
  c(3.14, 0.15, 0.36, 0.14, 0.1, 'down', 0, 0.4),
  c(2.7, 0.35, 0.4, 0.14, 0.15, 'down', 0, 0.45),
  c(2.2, 0.6, 0.4, 0.14, -0.15, 'down', 0, 0.4),
  // short fluffy top tufts (no tall spikes)
  c(-0.4, 1.2, 0.26, 0.11, 0.3, 'out', -0.6, 0.5, 0.4),
  c(0.3, 1.22, 0.22, 0.11, -0.2, 'out', 0.4, 0.5),
  c(-1.0, 1.1, 0.24, 0.11, 0.2, 'out', -0.3, 0.5),
  c(0.95, 1.1, 0.24, 0.11, -0.25, 'out', 0.5, 0.5),
  c(2.0, 1.05, 0.24, 0.11, 0.2, 'out', 0.2, 0.5),
  c(-2.0, 1.05, 0.24, 0.11, -0.2, 'out', -0.2, 0.5),
];

function makeHair() {
  const R = HAIR_R;
  return HAIR_DEFS.map((d) => {
    const e = d.elev;
    const s = Math.sin(d.phi);
    const co = Math.cos(d.phi);
    const root = new THREE.Vector3(R.x * Math.cos(e) * s, R.y * Math.sin(e), R.z * Math.cos(e) * co);
    const n = new THREE.Vector3(root.x / (R.x * R.x), root.y / (R.y * R.y), root.z / (R.z * R.z)).normalize();
    const tDown = new THREE.Vector3(R.x * Math.sin(e) * s, -R.y * Math.cos(e), R.z * Math.sin(e) * co).normalize();
    const tPhi = new THREE.Vector3(R.x * Math.cos(e) * co, 0, -R.z * Math.cos(e) * s);
    if (tPhi.lengthSq() < 1e-6) tPhi.set(1, 0, 0);
    tPhi.normalize();
    const dir =
      d.mode === 'down'
        ? tDown.clone().addScaledVector(tPhi, d.swing).addScaledVector(n, d.lift)
        : n.clone().addScaledVector(tPhi, d.swing).addScaledVector(tDown, d.lift);
    dir.normalize();
    const q = new THREE.Quaternion()
      .setFromUnitVectors(Y_AXIS, dir)
      .multiply(new THREE.Quaternion().setFromAxisAngle(Y_AXIS, d.roll));
    const p = root.addScaledVector(n, -0.015);
    return { geo: makeClump(d.len, d.w, d.bend), pos: [p.x, p.y, p.z] as V3, q };
  });
}

/* ---------------- fixed parts ---------------- */

function makeGeos() {
  const lid = new THREE.SphereGeometry(1, 24, 16);
  lid.scale(0.105, 0.133, 0.082);
  lid.translate(0, -0.133, 0);

  const scarf = new THREE.TorusGeometry(0.15, 0.055, 12, 28);
  scarf.rotateX(Math.PI / 2);

  const torsoPts = [
    [0, 0], [0.27, 0], [0.3, 0.05], [0.34, 0.2], [0.34, 0.36], [0.29, 0.46], [0.17, 0.52], [0, 0.54],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  return {
    head: makeHead(),
    cap: sc(new THREE.SphereGeometry(1, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), HAIR_R.x, HAIR_R.y, HAIR_R.z),
    ear: ball(0.045, 0.075, 0.05),
    // eyes
    ball: ball(0.095, 0.12, 0.075),
    iris: ball(0.082, 0.108, 0.032),
    pupil: ball(0.05, 0.07, 0.02),
    hl1: ball(0.026, 0.032, 0.012),
    hl2: ball(0.012, 0.012, 0.009),
    lid: smooth(lid),
    lash: sc(new THREE.TorusGeometry(1, 0.26, 8, 24, Math.PI), 0.092, 0.112, 0.04),
    brow: caps(0.011, 0.07),
    nose: ball(0.016, 0.012, 0.012),
    mouth: sc(new THREE.TorusGeometry(1, 0.12, 6, 16, Math.PI), 0.045, 0.03, 0.012),
    blush: ball(0.07, 0.04, 0.008),
    // body
    torso: sc(new THREE.LatheGeometry(torsoPts, 28), 1, 1, 0.68),
    scarf: smooth(scarf),
    knot: ball(0.07, 0.06, 0.06),
    tail: caps(0.035, 0.16, 1, 0.45),
    upperArm: caps(0.062, 0.16),
    foreArm: caps(0.055, 0.13),
    hand: ball(0.082, 0.082, 0.078),
    leg: caps(0.075, 0.25),
    shoe: ball(0.105, 0.07, 0.17),
    sole: ball(0.112, 0.028, 0.178),
    bow: smooth(new THREE.TorusGeometry(0.035, 0.012, 6, 14)),
    pack: ball(0.24, 0.28, 0.12),
    paper: ball(0.12, 0.1, 0.06),
    strap: caps(0.028, 0.34, 1, 0.4),
  };
}

/* ------------------------------------------------------------------ */
/* Part: mesh + outline hull                                           */
/* ------------------------------------------------------------------ */

interface PartProps {
  geo: THREE.BufferGeometry;
  mat: THREE.Material;
  p?: V3;
  r?: V3;
  q?: THREE.Quaternion;
  hull?: boolean;
}
function Part({ geo, mat, p = [0, 0, 0], r, q, hull = true }: PartProps) {
  const style = useStyle();
  const xf = q ? { quaternion: q } : { rotation: r ?? ([0, 0, 0] as V3) };
  return (
    <group position={p} {...xf}>
      <mesh geometry={geo} material={mat} />
      {hull && <mesh geometry={geo} material={style.hull} />}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Animation                                                           */
/* ------------------------------------------------------------------ */

const ss = (e0: number, e1: number, x: number) => {
  const k = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return k * k * (3 - 2 * k);
};
const nextDanceDelay = (f: number) => (f < 0.01 ? Infinity : (5 + Math.random() * 5) / f);

const REST_SH = [-1.6, 0.22];
const REST_EL = [-1.3, -0.12];
const UP_SH = [-2.7, 2.7];
const UP_EL = [-0.25, 0.25];
const BASE_YAW = 0.25;

interface AnimState {
  t: number; nextDance: number; dance: number | null; danceDur: number; danceDir: number;
  nextBlink: number; blinkT: number | null; nextLook: number;
  glance: THREE.Vector2; look: THREE.Vector2;
}
const makeAnim = (): AnimState => ({
  t: 0, nextDance: 3 + Math.random() * 3, dance: null, danceDur: 3, danceDir: 1,
  nextBlink: 1.5 + Math.random() * 2, blinkT: null, nextLook: 2 + Math.random() * 3,
  glance: new THREE.Vector2(), look: new THREE.Vector2(),
});

const useG = () => useRef<THREE.Group | null>(null);
const useGs = (n: number) => useRef<(THREE.Group | null)[]>(Array.from({ length: n }, () => null));

interface Props {
  settings: LabSettings;
  reduced: boolean;
  danceTrigger: number;
}

export function BantaModel({ settings: cfg, reduced, danceTrigger }: Props) {
  const style = useStyle();
  const m = style.mats as Record<MatKey, THREE.Material>;
  const invalidate = useThree((s) => s.invalidate);

  const g = useMemo(makeGeos, []);
  const hair = useMemo(makeHair, []);
  const anim = useMemo(makeAnim, []);
  const face = useMemo(
    () => ({
      eyeL: facePoint(-0.42, -0.1), eyeR: facePoint(0.42, -0.1),
      browL: facePoint(-0.4, 0.33), browR: facePoint(0.4, 0.33),
      nose: facePoint(0, -0.33), mouth: facePoint(0, -0.47),
      blushL: facePoint(-0.66, -0.27), blushR: facePoint(0.66, -0.27),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(g).forEach((x) => x.dispose());
      hair.forEach((h) => h.geo.dispose());
    },
    [g, hair],
  );
  useEffect(() => {
    if (danceTrigger > 0) anim.nextDance = -1;
  }, [danceTrigger, anim]);
  useEffect(() => {
    if (anim.dance === null) anim.nextDance = anim.t + nextDanceDelay(cfg.danceFrequency);
  }, [cfg.danceFrequency, anim]);
  useEffect(() => invalidate(), [cfg, invalidate]);

  const rootRef = useG();
  const torsoRef = useG();
  const neckRef = useG();
  const legRefs = useGs(2);
  const shRefs = useGs(2);
  const elRefs = useGs(2);
  const eyeRefs = useGs(2);
  const irisRefs = useGs(2);
  const blinkRefs = useGs(2);

  useFrame((state, rawDt) => {
    const root = rootRef.current;
    const torso = torsoRef.current;
    const neck = neckRef.current;
    if (!root || !torso || !neck) return;
    const a = anim;
    const calm = reduced;
    const dt = Math.min(rawDt, 0.05) * cfg.animSpeed;
    if (!calm) a.t += dt;
    const t = a.t;

    if (!calm) {
      if (a.dance === null && t >= a.nextDance) {
        a.dance = 0;
        a.danceDur = 3 + Math.random() * 1.2;
        a.danceDir = Math.random() < 0.5 ? -1 : 1;
      } else if (a.dance !== null) {
        a.dance += dt;
        if (a.dance >= a.danceDur) {
          a.dance = null;
          a.nextDance = t + nextDanceDelay(cfg.danceFrequency);
        }
      }
      if (a.blinkT === null && t >= a.nextBlink) a.blinkT = 0;
      if (t >= a.nextLook) {
        a.nextLook = t + 2.5 + Math.random() * 4;
        if (Math.random() < 0.4) a.glance.set(0, 0);
        else a.glance.set((Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 0.6);
      }
    }

    const breathe = calm ? 0 : Math.sin(t * 1.7);
    const shift = calm ? 0 : Math.sin(t * 0.45) * 0.6 + Math.sin(t * 0.19 + 1) * 0.4;

    let bounce = 0, hipX = 0, roll = 0, yaw = 0, squash = 0, up = 0, flap = 0;
    let liftL = 0, liftR = 0;

    if (a.dance !== null) {
      const p = a.dance / a.danceDur;
      const env = ss(0, 0.1, p) * ss(1, 0.9, p);
      const w = a.dance * Math.PI * 4;
      const s1 = Math.sin(w);
      bounce = Math.abs(s1) * 0.07 * env;
      squash = (1 - Math.abs(s1)) * 0.03 * env;
      up = ss(0.2, 0.4, p) * ss(0.92, 0.78, p);
      flap = s1 * 0.2 * up;
      const sway = ss(0.3, 0.45, p) * ss(0.85, 0.7, p);
      hipX = Math.sin(w / 2) * 0.07 * sway * a.danceDir;
      roll = -Math.sin(w / 2) * 0.1 * sway * a.danceDir;
      const shuffle = ss(0.55, 0.65, p) * ss(0.92, 0.8, p);
      liftL = Math.max(0, s1) * 0.05 * shuffle;
      liftR = Math.max(0, -s1) * 0.05 * shuffle;
      yaw = Math.sin(w / 2) * 0.25 * shuffle;
    }

    let blink = 0;
    if (a.blinkT !== null) {
      a.blinkT += dt;
      const p = a.blinkT / 0.18;
      if (p >= 1) {
        a.blinkT = null;
        a.nextBlink = t + (Math.random() < 0.2 ? 0.25 : 2 + Math.random() * 3.5);
      } else blink = Math.sin(p * Math.PI);
    }

    const px = calm ? 0 : state.pointer.x;
    const py = calm ? 0 : state.pointer.y;
    a.look.x = THREE.MathUtils.damp(a.look.x, THREE.MathUtils.clamp(px * 0.9 + a.glance.x, -1, 1), 5, rawDt);
    a.look.y = THREE.MathUtils.damp(a.look.y, THREE.MathUtils.clamp(py * 0.6 + a.glance.y, -1, 1), 5, rawDt);

    root.position.set(hipX + shift * 0.01, bounce, 0);
    root.rotation.set(0, BASE_YAW + yaw + a.look.x * 0.08, roll + shift * 0.015);
    torso.scale.set(1 + breathe * 0.005 + squash * 0.5, 1 + breathe * 0.01 - squash, 1 + breathe * 0.005 + squash * 0.5);
    neck.position.y = 1.0 + breathe * 0.004 - squash * 0.1;
    neck.rotation.set(-a.look.y * 0.25, a.look.x * 0.45, 0);

    const lL = legRefs.current[0];
    const lR = legRefs.current[1];
    if (lL) lL.position.y = 0.5 + liftL;
    if (lR) lR.position.y = 0.5 + liftR;

    for (let i = 0; i < 2; i++) {
      const wig = i === 0 && !calm ? Math.sin(t * 1.3) * 0.03 : 0;
      shRefs.current[i]?.rotation.set(0, 0, THREE.MathUtils.lerp(REST_SH[i], UP_SH[i], up) + flap * (i === 0 ? 1 : -1));
      elRefs.current[i]?.rotation.set(0, 0, THREE.MathUtils.lerp(REST_EL[i], UP_EL[i], up) + wig);

      eyeRefs.current[i]?.scale.set(cfg.eyeScale, cfg.eyeScale, 1);
      irisRefs.current[i]?.position.set(a.look.x * 0.02, a.look.y * 0.018, 0);
      const bl = blinkRefs.current[i];
      if (bl) {
        bl.visible = blink > 0.03;
        bl.scale.y = Math.max(0.001, blink);
      }
    }
  });

  return (
    <group ref={rootRef}>
      {/* legs + shoes */}
      {[-1, 1].map((side, i) => (
        <group key={side} ref={(gr) => { legRefs.current[i] = gr; }} position={[side * 0.1, 0.5, 0]}>
          <Part geo={g.leg} mat={m.suit} p={[0, -0.2, 0]} />
          <Part geo={g.shoe} mat={m.shoe} p={[0, -0.43, 0.05]} />
          <Part geo={g.sole} mat={m.sole} p={[0, -0.47, 0.05]} />
          <Part geo={g.bow} mat={m.sole} p={[0, -0.37, 0.13]} r={[1.2, 0, 0]} hull={false} />
        </group>
      ))}

      {/* torso with arms, scarf, backpack */}
      <group ref={torsoRef} position={[0, 0.5, 0]}>
        <Part geo={g.torso} mat={m.suit} />
        <Part geo={g.scarf} mat={m.scarf} p={[0, 0.52, 0]} />
        <Part geo={g.knot} mat={m.scarf} p={[-0.04, 0.45, 0.2]} />
        <Part geo={g.tail} mat={m.scarf} p={[-0.07, 0.33, 0.21]} r={[0, 0, 0.15]} />
        <Part geo={g.tail} mat={m.scarf} p={[0.0, 0.34, 0.215]} r={[0, 0, -0.2]} />
        <Part geo={g.pack} mat={m.pack} p={[0, 0.3, -0.2]} />
        <Part geo={g.paper} mat={m.paper} p={[0.06, 0.56, -0.2]} />
        
        

        {[-1, 1].map((side, i) => (
          <group key={side} ref={(gr) => { shRefs.current[i] = gr; }} position={[side * 0.35, 0.44, 0]}>
            <Part geo={g.upperArm} mat={m.suit} p={[0, -0.142, 0]} />
            <group ref={(gr) => { elRefs.current[i] = gr; }} position={[0, -0.27, 0]}>
              <Part geo={g.foreArm} mat={m.suit} p={[0, -0.12, 0]} />
              <Part geo={g.hand} mat={m.skin} p={[0, -0.255, 0]} />
            </group>
          </group>
        ))}
      </group>

      {/* head */}
      <group ref={neckRef} position={[0, 1.0, 0]}>
        <group position={[0, 0.36, 0]}>
          <Part geo={g.head} mat={m.skin} />
          <Part geo={g.ear} mat={m.skin} p={[-0.43, -0.03, -0.02]} />
          <Part geo={g.ear} mat={m.skin} p={[0.43, -0.03, -0.02]} />

          {[0, 1].map((i) => {
            const fp = i === 0 ? face.eyeL : face.eyeR;
            const pos = fp.pos.clone().addScaledVector(fp.n, -0.065 + cfg.eyeDepth);
            return (
              <group key={i} position={[pos.x, pos.y, pos.z]} quaternion={fp.q}>
                <group ref={(gr) => { eyeRefs.current[i] = gr; }}>
                  <Part geo={g.ball} mat={m.eyeWhite} />
                  <group ref={(gr) => { irisRefs.current[i] = gr; }}>
                    <Part geo={g.iris} mat={m.iris} p={[0, 0, 0.058]} hull={false} />
                    <Part geo={g.pupil} mat={m.pupil} p={[0, 0, 0.075]} hull={false} />
                    <Part geo={g.hl1} mat={m.highlight} p={[0.032, 0.045, 0.088]} hull={false} />
                    <Part geo={g.hl2} mat={m.highlight} p={[-0.03, -0.045, 0.086]} hull={false} />
                  </group>
                  <group ref={(gr) => { blinkRefs.current[i] = gr; }} position={[0, 0.12, 0]} scale={[1, 0.001, 1]} visible={false}>
                    <Part geo={g.lid} mat={m.skin} />
                  </group>
                  <Part geo={g.lash} mat={m.line} p={[0, 0.004, 0.03]} hull={false} />
                </group>
              </group>
            );
          })}

          {[face.browL, face.browR].map((fp, i) => (
            <group key={i} position={[fp.pos.x, fp.pos.y, fp.pos.z]} quaternion={fp.q}>
              <Part geo={g.brow} mat={m.line} r={[0, 0, Math.PI / 2]} hull={false} />
            </group>
          ))}
          <group position={[face.nose.pos.x, face.nose.pos.y, face.nose.pos.z]} quaternion={face.nose.q}>
            <Part geo={g.nose} mat={m.nose} hull={false} />
          </group>
          <group position={[face.mouth.pos.x, face.mouth.pos.y + 0.01, face.mouth.pos.z]} quaternion={face.mouth.q}>
            <Part geo={g.mouth} mat={m.line} r={[0, 0, Math.PI]} hull={false} />
          </group>
          {[face.blushL, face.blushR].map((fp, i) => (
            <group key={i} position={[fp.pos.x, fp.pos.y, fp.pos.z]} quaternion={fp.q}>
              <Part geo={g.blush} mat={m.blush} hull={false} />
            </group>
          ))}

          {/* hair: tilted cap for the base mass + chunky clumps */}
          <Part geo={g.cap} mat={m.hair} p={[0, 0.04, -0.04]} r={[-0.75, 0, 0]} />
          {hair.map((h, i) => (
            <Part key={i} geo={h.geo} mat={m.hair} p={h.pos} q={h.q} />
          ))}
        </group>
      </group>
    </group>
  );
}
