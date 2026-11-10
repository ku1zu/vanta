export interface Metric {
  id: string; label: string; value: number; prefix?: string; suffix?: string; note?: string
  kind: 'trend' | 'activity' | 'arc' | 'score'; series?: number[]; progress?: number
}

export const PRIMARY: Metric[] = [
  { id: 'revenue', label: 'Revenue', value: 53, prefix: '+', suffix: '%', note: 'vs previous 30 days', kind: 'trend', series: [12, 14, 13, 17, 19, 18, 23, 26, 25, 31, 36, 41] },
  { id: 'leads', label: 'Leads', value: 31, prefix: '+', suffix: '%', note: '412 captured this month', kind: 'activity', series: [4, 7, 5, 9, 8, 12, 10, 14, 11, 15, 13, 17] },
  { id: 'conversion', label: 'Conversion', value: 22, prefix: '+', suffix: '%', note: '3.4% visitor rate', kind: 'arc', progress: 0.64 },
  { id: 'growth', label: 'Growth Score', value: 94, note: 'Excellent', kind: 'score', progress: 0.94 },
]

export const HEALTH = {
  score: 94,
  nodes: [
    { label: 'Revenue', value: '+53%' }, { label: 'Leads', value: '+31%' },
    { label: 'Conversion', value: '+22%' }, { label: 'Customer activity', value: 'High' },
  ],
}

export const MARKETING = {
  campaign: { a: [10, 14, 12, 18, 22, 21, 28, 33], b: [8, 9, 12, 11, 15, 17, 16, 21] },
  social: [6, 9, 7, 12, 10, 15, 13],
  email: { open: 0.42, click: 0.11 },
  funnel: [{ label: 'Visitors', v: 12400 }, { label: 'Leads', v: 1860 }, { label: 'Qualified', v: 640 }, { label: 'Customers', v: 212 }],
}