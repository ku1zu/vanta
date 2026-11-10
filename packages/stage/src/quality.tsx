import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type QualityTier = 'high' | 'medium' | 'low'
export interface QualitySettings {
  dpr: [number, number]
  glass: 'transmission' | 'simple'
  samples: number
  resolution: number
  backside: boolean
  post: 'full' | 'bloom' | 'none'
  segments: number
  envRes: number
}

export const QUALITY: Record<QualityTier, QualitySettings> = {
  high: { dpr: [1, 2], glass: 'transmission', samples: 6, resolution: 512, backside: true, post: 'full', segments: 20, envRes: 512 },
  medium: { dpr: [1, 1.5], glass: 'transmission', samples: 3, resolution: 256, backside: false, post: 'bloom', segments: 12, envRes: 256 },
  low: { dpr: [1, 1], glass: 'simple', samples: 0, resolution: 128, backside: false, post: 'none', segments: 6, envRes: 128 },
}

export function detectTier(): QualityTier {
  const forced = new URLSearchParams(location.search).get('tier')
  if (forced === 'high' || forced === 'medium' || forced === 'low') return forced
  const coarse = matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency ?? 4
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  if (coarse && (cores <= 4 || mem <= 3)) return 'low'
  if (coarse || cores <= 4 || mem <= 4) return 'medium'
  return 'high'
}

export interface QualityContextValue {
  tier: QualityTier
  settings: QualitySettings
  reducedMotion: boolean
  /** Manual choice. Locks the tier so adaptive degrading stops overriding it. */
  setTier: (t: QualityTier) => void
  /** Called by the performance monitor; steps down one tier unless locked. */
  degrade: () => void
}

export const QualityContext = createContext<QualityContextValue | null>(null)

export function useQuality(): QualityContextValue {
  const ctx = useContext(QualityContext)
  if (!ctx) throw new Error('useQuality must be used inside <QualityProvider> / <Stage>')
  return ctx
}

export function QualityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => ({ tier: detectTier(), locked: false }))
  const reducedMotion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const value = useMemo<QualityContextValue>(
    () => ({
      tier: state.tier,
      settings: QUALITY[state.tier],
      reducedMotion,
      setTier: (tier) => setState({ tier, locked: true }),
      degrade: () =>
        setState((s) =>
          s.locked ? s : { ...s, tier: s.tier === 'high' ? 'medium' : 'low' },
        ),
    }),
    [state, reducedMotion],
  )
  return <QualityContext.Provider value={value}>{children}</QualityContext.Provider>
}