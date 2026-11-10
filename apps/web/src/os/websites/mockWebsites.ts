/** Sample data for the Websites module. Isolated from Company Intelligence. Nothing here comes from a real scan. */
export const WEBSITE = {
  name: 'Aether Coffee', domain: 'aethercoffee.com', status: 'Healthy', lastScanned: 'Today, 2:14 PM', health: 92,
  scores: [{ key: 'Performance', value: 94 }, { key: 'SEO', value: 89 }, { key: 'Conversion', value: 91 }, { key: 'Security', value: 98 }],
}

export interface Finding { id: string; area: string; text: string; opportunity?: string; action: string }
export const FINDINGS: Finding[] = [
  { id: 'f1', area: 'Conversion opportunity', text: 'Your primary call-to-action is not visually prominent enough on mobile.', opportunity: '+8–14% potential conversion improvement', action: 'Improve with Vanta' },
  { id: 'f2', area: 'SEO', text: 'Several service pages have missing meta descriptions.', action: 'Fix with Vanta' },
  { id: 'f3', area: 'Performance', text: 'Large media assets are increasing homepage load time.', action: 'Optimize with Vanta' },
]

export const ACTIVITY = [
  { id: 'a1', text: 'Website scanned', when: '2 minutes ago', kind: 'site' },
  { id: 'a2', text: 'SEO analysis completed', when: '18 minutes ago', kind: 'ai' },
  { id: 'a3', text: 'Homepage content updated', when: '1 hour ago', kind: 'campaign' },
  { id: 'a4', text: 'Performance improved', when: 'Today', kind: 'visit' },
]

export const QUICK_ACTIONS = [
  { id: 'create', label: 'Create Website' }, { id: 'analyze', label: 'Analyze Website' },
  { id: 'improve', label: 'Improve Existing Website' }, { id: 'seo', label: 'Run SEO Scan' }, { id: 'performance', label: 'Run Performance Scan' },
]

export const SITE_TYPES = ['Business Website', 'Online Store', 'Service Business', 'Portfolio', 'Landing Page', 'Other']
export const CREATE_STEPS = ['Understanding business…', 'Analyzing audience…', 'Planning site structure…']
export const ANALYZE_STEPS = ['Connecting to website…', 'Analyzing structure…', 'Checking performance…', 'Analyzing SEO…', 'Evaluating conversion experience…']
export const SCAN_STEPS = {
  seo: ['Crawling pages…', 'Checking meta descriptions…', 'Reviewing headings and links…'],
  performance: ['Measuring load time…', 'Reviewing media assets…', 'Checking caching…'],
  fix: ['Reviewing the finding…', 'Preparing suggested changes…'],
}