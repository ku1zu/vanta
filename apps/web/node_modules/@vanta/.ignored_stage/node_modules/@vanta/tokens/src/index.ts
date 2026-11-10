/** Vanta design tokens. Platform-neutral: safe for web, OS, and (later) HQ. */
export type VantaEnvironment = 'lab' | 'chamber'

export const palette = {
  black: '#050607',
  graphite: '#14161a',
  graphiteSoft: '#1d2026',
  silver: '#c9ced6',
  mist: '#e6e9ed',
  white: '#f6f7f9',
  cyan: '#7fd8ff',
  blue: '#4d7cff',
  violet: '#9b8cff',
} as const

/** Lab = pale silver room. Chamber = black/graphite room. Same materials, different light. */
export const environments = {
  lab: {
    bg: palette.mist, fg: '#0b0c0e', muted: '#6b717b',
    hairline: 'rgba(11,12,14,0.14)', glass: 'rgba(255,255,255,0.42)', accent: palette.cyan,
  },
  chamber: {
    bg: palette.black, fg: '#eef0f3', muted: '#7b828d',
    hairline: 'rgba(238,240,243,0.14)', glass: 'rgba(255,255,255,0.06)', accent: palette.blue,
  },
} as const

export const motion = {
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  duration: { fast: 0.18, base: 0.6, slow: 1.4 },
} as const

export const font = {
  display: '"Inter Tight", ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const

/** Writes the tokens to CSS variables so DOM and WebGL read from one source. */
export function applyEnvironment(env: VantaEnvironment, root: HTMLElement = document.documentElement) {
  const e = environments[env]
  const set = (k: string, v: string) => root.style.setProperty(`--v-${k}`, v)
  set('bg', e.bg); set('fg', e.fg); set('muted', e.muted)
  set('hairline', e.hairline); set('glass', e.glass); set('accent', e.accent)
  set('cyan', palette.cyan); set('blue', palette.blue); set('violet', palette.violet)
  set('ease', motion.ease)
  set('font-display', font.display); set('font-mono', font.mono)
  root.dataset.env = env
}
