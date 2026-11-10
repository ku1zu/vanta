export const COMMANDS = ['Build me a website', 'Analyze my sales', 'Create a campaign', 'Generate content', 'Research competitors']

export interface DemoResult { reply: string; lines: string[]; bars: number[] }

export const RESULTS: Record<string, DemoResult> = {
  'Build me a website': { reply: 'Website draft ready.', lines: ['5 pages generated', 'Brand palette applied', 'Awaiting your review'], bars: [8, 14, 11, 20, 24] },
  'Analyze my sales': { reply: 'Sales analysis complete.', lines: ['Revenue up 53% this month', 'Strongest channel: Web', '3 stalled deals flagged'], bars: [10, 12, 15, 19, 25, 28] },
  'Create a campaign': { reply: 'Campaign drafted.', lines: ['Audience: 2,140 contacts', 'Subject lines: 3 variants', 'Scheduled: not sent'], bars: [6, 9, 14, 12, 18] },
  'Generate content': { reply: 'Content batch generated.', lines: ['4 posts, 1 article', 'Tone matched to brand', 'Ready for approval'], bars: [12, 8, 16, 10, 20] },
  'Research competitors': { reply: 'Competitor scan complete.', lines: ['6 competitors profiled', 'Pricing gaps found: 2', 'Report saved'], bars: [20, 16, 22, 11, 14, 9] },
}
export const FALLBACK: DemoResult = { reply: 'Command received.', lines: ['Prototype mode: nothing was changed'], bars: [8, 10, 9, 11] }