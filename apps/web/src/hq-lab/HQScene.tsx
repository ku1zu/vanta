import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { BantaModel } from './BantaModel';
import { BantaGLB } from './BantaGLB';
import { applySettings, createStyle, StyleCtx } from './toon';
import type { LabSettings, V3 } from './settings';

const TARGET: V3 = [0, 0.92, 0];

function GroundShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
      <circleGeometry args={[0.75, 32]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.2, 0.12, 0.12, 0.28 * smoothstep(1.0, 0.0, d)); }`}
      />
    </mesh>
  );
}

interface StageProps {
  settings: LabSettings;
  reduced: boolean;
  danceTrigger: number;
  useGLB: boolean;
}

export function HQStage({ settings, reduced, danceTrigger, useGLB }: StageProps) {
  const style = useMemo(createStyle, []);
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  const controls = useRef<{ target: THREE.Vector3; update: () => void } | null>(null);

  useEffect(() => () => style.dispose(), [style]);
  useEffect(() => {
    applySettings(style, settings);
    invalidate();
  }, [style, settings, invalidate]);

  useEffect(() => {
    const a = THREE.MathUtils.degToRad(settings.cameraAzimuth);
    camera.position.set(Math.sin(a) * 5.2, 1.25, Math.cos(a) * 5.2);
    controls.current?.target.set(...TARGET);
    controls.current?.update();
  }, [settings.cameraAzimuth, camera]);

  return (
    <StyleCtx.Provider value={style}>
      <color attach="background" args={['#f6f3ef']} />
      <GroundShadow />
      {useGLB ? (
        <Suspense fallback={null}>
          <BantaGLB />
        </Suspense>
      ) : (
        <BantaModel settings={settings} reduced={reduced} danceTrigger={danceTrigger} />
      )}
      <OrbitControls
        ref={(c) => { controls.current = c; }}
        target={TARGET}
        enablePan={false}
        enableDamping
        minDistance={2.5}
        maxDistance={10}
      />
    </StyleCtx.Provider>
  );
}
