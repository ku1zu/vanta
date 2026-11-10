import { usd } from '../viz'

export const BUSINESS = { name: 'Aether Coffee', owner: 'Alex Morgan', initials: 'AC' }

export interface NavItem { slug: string; label: string; desc: string; caps: string[] }
export const NAV_PRIMARY: NavItem[] = [
  { slug: 'overview', label: 'Overview', desc: '', caps: [] },
  { slug: 'intelligence', label: 'Intelligence', desc: 'Signals, forecasts, and answers about your whole business.', caps: ['Forecasts and anomaly detection', 'Ask anything about your numbers', 'Weekly intelligence briefings'] },
  { slug: 'employees', label: 'AI Employees', desc: 'Specialists that work across marketing, sales, support, and more.', caps: ['Assign and review work', 'Per-employee activity history', 'Approval rules'] },
  { slug: 'websites', label: 'Websites', desc: 'Build, monitor, and improve your sites.', caps: ['Website builder', 'Performance and SEO monitoring', 'Conversion experiments'] },
  { slug: 'marketing', label: 'Marketing', desc: 'Campaigns, social, and email in one view.', caps: ['Campaign workspace', 'Audience insights', 'Scheduling'] },
  { slug: 'leads', label: 'Leads', desc: 'Every lead, scored and followed up.', caps: ['Lead scoring', 'Follow-up sequences', 'Source attribution'] },
  { slug: 'customers', label: 'Customers', desc: 'Relationships, history, and retention.', caps: ['Customer timeline', 'Retention signals', 'Support inbox'] },
  { slug: 'analytics', label: 'Analytics', desc: 'Deep analysis of growth and performance.', caps: ['Custom reports', 'Cohorts and funnels', 'Goal tracking'] },
  { slug: 'content', label: 'Content', desc: 'Generate, edit, and schedule content.', caps: ['Content generation', 'Brand voice', 'Publishing calendar'] },
  { slug: 'automations', label: 'Automations', desc: 'Workflows that run without you.', caps: ['Visual workflow builder', 'Triggers and conditions', 'Run history'] },
]
export const NAV_SECONDARY: NavItem[] = [
  { slug: 'settings', label: 'Settings', desc: 'Workspace, team, and preferences.', caps: ['Workspace profile', 'Team access', 'Notifications'] },
  { slug: 'help', label: 'Help', desc: 'Guides and support.', caps: ['Guides', 'Contact support', 'Shortcuts'] },
]
export const ALL_NAV = [...NAV_PRIMARY, ...NAV_SECONDARY]

export interface Attention { id: string; severity: 'high' | 'medium' | 'low'; title: string; detail: string; action: string; cmd: string }
export const ATTENTION: Attention[] = [
  { id: 'a1', severity: 'high', title: 'Website conversion dropped 8% this week', detail: 'Most of the drop is on the pricing page, on mobile.', action: 'Analyze', cmd: 'Analyze my sales' },
  { id: 'a2', severity: 'high', title: "3 high-value leads haven't been contacted", detail: 'Combined estimated value of $6,200.', action: 'Open', cmd: 'Find hidden revenue' },
  { id: 'a3', severity: 'medium', title: 'Your competitor launched a new offer', detail: 'A 20% introductory discount, live since Monday.', action: 'Review', cmd: 'Research competitors' },
  { id: 'a4', severity: 'medium', title: 'Abandoned checkout rate increased', detail: 'Up 5 points, concentrated on returning visitors.', action: 'Fix', cmd: 'Show me what needs attention' },
  { id: 'a5', severity: 'low', title: '14 unanswered customer messages', detail: 'Oldest is 2 days old.', action: 'Open', cmd: 'Show me what needs attention' },
]

export const REVENUE = [
  { label: 'Uncontacted leads', amount: 6200 }, { label: 'Abandoned customers', amount: 4800 },
  { label: 'Upsell opportunities', amount: 4100 }, { label: 'Underperforming campaigns', amount: 3320 },
]
export const REVENUE_TOTAL = REVENUE.reduce((a, r) => a + r.amount, 0)

export const WEBSITE = {
  scores: [{ label: 'Health', v: 98 }, { label: 'Performance', v: 94 }, { label: 'SEO', v: 91 }, { label: 'Conversion', v: 87 }],
  security: 'Protected', updated: '2 minutes ago',
}

export interface CommandDef { label: string; working: string; done: string; insights: string[] }
export const COMMANDS: CommandDef[] = [
  { label: 'Build me a website', working: 'Vanta is preparing a website workspace…', done: 'Website workspace ready.', insights: ['Brand palette and tone detected', '5-page structure drafted', 'Conversion-focused hero generated'] },
  { label: 'Analyze my sales', working: 'Analyzing sales performance…', done: 'Sales analysis complete.', insights: ['Revenue is up 53% over 30 days', 'Strongest channel: organic search', '3 high-value leads are stalling'] },
  { label: 'Create a campaign', working: 'Creating campaign…', done: 'Campaign workspace created.', insights: ['Audience: 2,140 contacts selected', '3 subject-line variants drafted', 'Scheduled: not sent'] },
  { label: 'Generate content', working: 'Generating content…', done: 'Content batch generated.', insights: ['4 posts and 1 article drafted', 'Tone matched to your brand', 'Ready for approval'] },
  { label: 'Research competitors', working: 'Initializing competitor intelligence…', done: 'Competitor Intelligence initialized.', insights: ['6 competitors profiled', '2 pricing gaps found', 'Weekly monitoring enabled'] },
  { label: 'Find hidden revenue', working: 'Scanning for untapped revenue…', done: 'Vanta identified new revenue opportunities.', insights: [`${usd.format(REVENUE_TOTAL)} in estimated untapped revenue`, `Largest: uncontacted leads (${usd.format(REVENUE[0].amount)})`, `Abandoned customers: ${usd.format(REVENUE[1].amount)}`] },
  { label: 'Show me what needs attention', working: 'Reviewing your business…', done: 'Attention review complete.', insights: ['2 high-severity items', 'Website conversion needs a look', '14 customer messages are waiting'] },
]

export function findCommand(text: string): CommandDef {
  const q = text.trim().toLowerCase()
  return (
    COMMANDS.find((c) => c.label.toLowerCase() === q) ??
    COMMANDS.find((c) => q.length > 3 && c.label.toLowerCase().includes(q)) ??
    { label: text.trim(), working: 'Working on it…', done: 'Command received.', insights: ['Prototype mode: no real AI is connected yet', 'Nothing was changed'] }
  )
}