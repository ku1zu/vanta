export const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function ago(ms: number) {
  const m = Math.floor(ms / 60000)
  return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.floor(m / 60)} hr ago`
}

export function linePath(s: number[], w: number, h: number, pad = 2) {
  if (s.length < 2) return ''
  const max = Math.max(...s), min = Math.min(...s)
  const y = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
  return s.map((v, i) => `${i ? 'L' : 'M'}${((i / (s.length - 1)) * w).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
}
export const areaPath = (s: number[], w: number, h: number) => (s.length < 2 ? '' : `${linePath(s, w, h)} L${w} ${h} L0 ${h} Z`)