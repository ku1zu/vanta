import { useEffect } from 'react'
import { Leva } from 'leva'
import { applyEnvironment } from '@vanta/tokens'
import { LIGHTING, Stage, useQuality, type QualityTier } from '@vanta/stage'
import { MaterialLab } from '../scenes/material-lab/MaterialLab'
import { useLabControls } from '../scenes/material-lab/controls'

export default function Lab() {
  const c = useLabControls()
  const { tier, settings, setTier } = useQuality()
  useEffect(() => {
    applyEnvironment(LIGHTING[c.scene.lighting].dom)
    document.documentElement.style.setProperty('--v-grain', String(c.scene.grain))
  }, [c.scene.lighting, c.scene.grain])

  return (
    <main className="lab">
      <Leva hidden={!import.meta.env.DEV} collapsed={false} titleBar={{ title: 'material lab · dev' }} />
      <div className="lab__stage">
        <Stage lighting={c.scene.lighting} envIntensity={c.scene.envIntensity} haze={c.scene.haze} camera={c.cam.type} post={c.post}>
          <MaterialLab c={c} />
        </Stage>
      </div>
      <header className="lab__label mono"><span>VANTA</span><span>MATERIAL LAB / 01</span></header>
      <p className="lab__caption mono">{c.target}</p>
      <nav className="lab__controls glass mono" aria-label="Quality tier">
        <div className="group">
          {(['high', 'medium', 'low'] as QualityTier[]).map((t) => (
            <button key={t} aria-pressed={tier === t} onClick={() => setTier(t)}>{t}</button>
          ))}
        </div>
        <p className="readout">dpr ≤{settings.dpr[1]} · glass {settings.glass} · post {settings.post}</p>
      </nav>
    </main>
  )
}