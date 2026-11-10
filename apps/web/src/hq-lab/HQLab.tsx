import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { HQStage } from './HQScene';
import {
  DEFAULT_SETTINGS,
  SHADING_PRESETS,
  type LabSettings,
  type NumericSettingKey,
  type ShadingPresetId,
} from './settings';

function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

const SLIDERS: { key: NumericSettingKey; label: string; min: number; max: number; step: number }[] = [
  { key: 'outlineThickness', label: 'Outline thickness', min: 0, max: 0.04, step: 0.001 },
  { key: 'outlineOpacity', label: 'Outline opacity', min: 0, max: 1, step: 0.01 },
  { key: 'shadowThreshold', label: 'Toon shadow threshold', min: 0.1, max: 0.9, step: 0.01 },
  { key: 'shadowSoftness', label: 'Toon shadow softness', min: 0, max: 0.3, step: 0.005 },
  { key: 'gradientStrength', label: 'Gradient strength', min: 0, max: 1, step: 0.01 },
  { key: 'hairGradient', label: 'Hair gradient', min: 0, max: 1, step: 0.01 },
  { key: 'faceGradient', label: 'Face gradient', min: 0, max: 1, step: 0.01 },
  { key: 'suitGradient', label: 'Suit gradient', min: 0, max: 1, step: 0.01 },
  { key: 'eyeDepth', label: 'Eye depth', min: -0.04, max: 0.04, step: 0.001 },
  { key: 'eyeScale', label: 'Eye scale', min: 0.7, max: 1.4, step: 0.01 },
  { key: 'cameraAzimuth', label: 'Camera angle', min: -180, max: 180, step: 1 },
  { key: 'lightAzimuth', label: 'Light direction (left/right)', min: -180, max: 180, step: 1 },
  { key: 'lightElevation', label: 'Light height', min: -10, max: 85, step: 1 },
  { key: 'animSpeed', label: 'Animation speed', min: 0.2, max: 2, step: 0.01 },
  { key: 'danceFrequency', label: 'Dance frequency', min: 0, max: 3, step: 0.05 },
];

const CAMERAS: { label: string; az: number }[] = [
  { label: 'Hero', az: 16 },
  { label: 'Front', az: 0 },
  { label: '3/4', az: 40 },
  { label: 'Side', az: 90 },
];

const css = {
  panel: {
    position: 'absolute', top: 12, right: 12, width: 270, maxHeight: 'calc(100% - 24px)',
    overflowY: 'auto', padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.92)',
    color: '#2a1b1d', fontSize: 12, fontFamily: 'system-ui, sans-serif',
    boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
  },
  h: { margin: '12px 0 6px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, opacity: 0.6 },
  wrap: { display: 'flex', flexWrap: 'wrap', gap: 5 },
  tag: { position: 'absolute', top: 10, left: 12, fontSize: 11, opacity: 0.6, fontFamily: 'system-ui, sans-serif', zIndex: 2 },
  missing: {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: 24, fontSize: 13, color: '#2a1b1d', opacity: 0.6,
    fontFamily: 'system-ui, sans-serif',
  },
} as const;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 9px', borderRadius: 999, cursor: 'pointer', fontSize: 11,
        border: '1px solid ' + (active ? '#2a1b1d' : 'rgba(0,0,0,0.15)'),
        background: active ? '#2a1b1d' : '#fff', color: active ? '#fff' : '#2a1b1d',
      }}
    >
      {children}
    </button>
  );
}

export default function HQLab() {
  const [settings, setSettings] = useState<LabSettings>(DEFAULT_SETTINGS);
  const [compare, setCompare] = useState(true);
  const [useGLB, setUseGLB] = useState(false);
  const [glbOk, setGlbOk] = useState(false);
  const [refOk, setRefOk] = useState(true);
  const [danceTrigger, setDanceTrigger] = useState(0);
  const [simReduce, setSimReduce] = useState(false);
  const [open, setOpen] = useState(true);

  const reduced = usePrefersReducedMotion() || simReduce;

  useEffect(() => {
    fetch('/banta.glb', { method: 'HEAD' })
      .then((r) => setGlbOk(r.ok && !(r.headers.get('content-type') ?? '').includes('text/html')))
      .catch(() => setGlbOk(false));
  }, []);

  const setNum = (key: NumericSettingKey, v: number) => setSettings((s) => ({ ...s, [key]: v }));
  const setShading = (id: ShadingPresetId) => setSettings((s) => ({ ...s, shading: id }));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#f6f3ef', display: 'flex' }}>
      {compare && (
        <div style={{ flex: 1, position: 'relative', background: '#ffffff', borderRight: '1px solid rgba(0,0,0,0.12)' }}>
          <div style={css.tag}>2D DRAWING (reference)</div>
          {refOk ? (
            <img
              src="/banta-reference.png"
              alt="Banta reference"
              onError={() => setRefOk(false)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div style={css.missing}>
              Put your drawing at apps/web/public/banta-reference.png, then refresh.
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <div style={css.tag}>3D BANTA (drag to rotate)</div>
        <Canvas
          flat
          dpr={[1, 2]}
          frameloop={reduced ? 'demand' : 'always'}
          camera={{ position: [Math.sin(0.28) * 5.2, 1.35, Math.cos(0.28) * 5.2], fov: 30 }}
        >
          <HQStage settings={settings} reduced={reduced} danceTrigger={danceTrigger} useGLB={useGLB && glbOk} />
        </Canvas>
      </div>

      <div style={css.panel}>
        <button onClick={() => setOpen((o) => !o)} style={{ all: 'unset', cursor: 'pointer', fontWeight: 700 }}>
          {open ? '▾' : '▸'} Banta lab
        </button>

        {open && (
          <>
            <div style={css.h}>Shading preset</div>
            <div style={css.wrap}>
              {(Object.keys(SHADING_PRESETS) as ShadingPresetId[]).map((id) => (
                <Chip key={id} active={settings.shading === id} onClick={() => setShading(id)}>
                  {SHADING_PRESETS[id].label}
                </Chip>
              ))}
            </div>

            <div style={css.h}>Camera</div>
            <div style={css.wrap}>
              {CAMERAS.map((c) => (
                <Chip key={c.label} active={settings.cameraAzimuth === c.az} onClick={() => setNum('cameraAzimuth', c.az)}>
                  {c.label}
                </Chip>
              ))}
              <Chip active={false} onClick={() => setDanceTrigger((n) => n + 1)}>Dance now</Chip>
            </div>

            <div style={css.h}>View</div>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
              <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
              Side-by-side with 2D drawing
            </label>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, opacity: glbOk ? 1 : 0.5 }}>
              <input type="checkbox" checked={useGLB && glbOk} disabled={!glbOk} onChange={(e) => setUseGLB(e.target.checked)} />
              Use public/banta.glb {glbOk ? '' : '(not found)'}
            </label>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="checkbox" checked={simReduce} onChange={(e) => setSimReduce(e.target.checked)} />
              Simulate reduced motion
            </label>

            <div style={css.h}>Tuning</div>
            {SLIDERS.map(({ key, label, min, max, step }) => (
              <label key={key} style={{ display: 'block', marginBottom: 8 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{label}</span>
                  <span style={{ opacity: 0.6 }}>{settings[key].toFixed(step < 0.01 ? 3 : step < 1 ? 2 : 0)}</span>
                </span>
                <input
                  type="range" min={min} max={max} step={step} value={settings[key]}
                  onChange={(e) => setNum(key, Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
            ))}

            <button
              onClick={() => setSettings(DEFAULT_SETTINGS)}
              style={{ marginTop: 4, padding: '6px 10px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)', background: '#fff', cursor: 'pointer' }}
            >
              Reset all
            </button>
          </>
        )}
      </div>
    </div>
  );
}
