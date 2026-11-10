export type Range = '7D' | '30D' | '90D'
export type Channel = 'All' | 'Web' | 'Email' | 'Social'
export const RANGES: Range[] = ['7D', '30D', '90D']
export const CHANNELS: Channel[] = ['All', 'Web', 'Email', 'Social']

const PATHS: Record<Range, [string, string, string]> = {
  '7D': ['M0 26 L25 24 L50 20 L75 18 L100 12', 'M0 28 L25 27 L50 22 L75 20 L100 16', 'M0 24 L25 25 L50 22 L75 21 L100 18'],
  '30D': ['M0 30 L20 26 L40 28 L60 18 L80 13 L100 4', 'M0 28 L25 24 L45 25 L65 17 L85 15 L100 9', 'M0 24 L20 25 L40 20 L60 21 L80 14 L100 12'],
  '90D': ['M0 32 L20 28 L40 22 L60 14 L80 8 L100 2', 'M0 30 L20 27 L40 21 L60 17 L80 10 L100 6', 'M0 28 L20 26 L40 22 L60 16 L80 12 L100 8'],
}
const BASE: Record<Range, { score: number; m: [number, number, number] }> = {
  '7D': { score: 88, m: [18, 12, 8] }, '30D': { score: 94, m: [53, 31, 22] }, '90D': { score: 97, m: [121, 64, 39] },
}
const FACTOR: Record<Channel, number> = { All: 1, Web: 0.8, Email: 0.6, Social: 0.45 }
const NAMES = ['Revenue', 'Leads', 'Conversion']

/** Static demo numbers only. */
export function demoMetrics(r: Range, c: Channel) {
  const b = BASE[r]
  return {
    score: b.score,
    metrics: NAMES.map((n, i) => [n, `+${Math.round(b.m[i] * FACTOR[c])}%`, PATHS[r][i]] as [string, string, string]),
  }
}