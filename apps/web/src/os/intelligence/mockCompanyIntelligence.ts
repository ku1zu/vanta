import type { CompanyIntelligence } from './types'

/** Simulated prototype data. Replace with API/database data later; nothing else needs to change. */
export const COMPANY_INTELLIGENCE: CompanyIntelligence = {
  profile: {
    mode: 'business', name: 'Aether Coffee', industry: 'Specialty Coffee', location: 'Detroit, Michigan', founded: 2021, employees: 18,
    website: 'aethercoffee.example', products: ['Specialty coffee', 'Subscription boxes', 'Wholesale'],
    businessModel: 'Retail + subscription + wholesale', stage: 'Growth', market: 'Urban and suburban Midwest',
  },
  audience: {
    primary: { label: 'Primary audience', title: 'Young professionals', age: '24–38', fit: 92,
      traits: ['Urban / suburban', 'High interest in specialty coffee', 'Values convenience and quality', 'Willing to pay premium prices'] },
    secondary: { label: 'Secondary audience', title: 'Coffee enthusiasts', age: '28–50', fit: 74,
      traits: ['Higher average order value', 'Strong interest in equipment and specialty beans'] },
  },
  personas: [
    { id: 'p1', name: 'The Daily Professional', age: 31, goal: 'High-quality coffee without extra effort.', pains: ['Inconsistent coffee', 'Lack of time', 'Difficult subscription choices'], motivation: 'Convenience + quality', value: 'High', seed: 1 },
    { id: 'p2', name: 'The Coffee Enthusiast', age: 42, goal: 'Discover new specialty beans.', pains: ['Limited local selection', 'Hard to find trustworthy roasters'], motivation: 'Quality + discovery', value: 'Medium', seed: 2 },
    { id: 'p3', name: 'The Office Buyer', age: 36, goal: 'Reliable coffee for the workplace.', pains: ['Inconsistent supply', 'Ordering admin'], motivation: 'Reliability + value', value: 'High', seed: 3 },
  ],
  competitors: [
    { id: 'c1', tag: 'Competitor A', name: 'Ridge & Co.', position: 'Established premium brand', strength: 'Strong brand and social presence', weakness: 'Weak subscription UX', pricing: 'Premium', presence: 78, opportunity: 'Win subscribers frustrated by sign-up friction', x: 0.82, y: 0.45 },
    { id: 'c2', tag: 'Competitor B', name: 'Bean Bargain', position: 'Value-led volume seller', strength: 'Low pricing, strong SEO', weakness: 'Weak premium positioning', pricing: 'Low', presence: 64, opportunity: 'Own the premium segment they cannot credibly serve', x: 0.18, y: 0.35 },
    { id: 'c3', tag: 'Competitor C', name: 'Foundry Coffee', position: 'Product-first challenger', strength: 'Strong product', weakness: 'Weak customer retention', pricing: 'Mid', presence: 41, opportunity: 'Capture customers who churn after the first order', x: 0.58, y: 0.82 },
  ],
  position: { company: { x: 0.76, y: 0.68 }, market: { x: 0.5, y: 0.46 } },
  brand: { personality: ['Premium', 'Friendly', 'Innovative', 'Trustworthy'], tone: ['Confident', 'Clear', 'Human', 'Modern'], visual: ['Minimal', 'Warm', 'Premium'], coreMessage: 'Quality without compromise.' },
  goals: [
    { id: 'g1', label: 'Increase monthly revenue', current: '$42,000', target: '$60,000', progress: 0.7, priority: 'High' },
    { id: 'g2', label: 'Improve website conversion', current: '2.8%', target: '4.0%', progress: 0.7, priority: 'High' },
    { id: 'g3', label: 'Generate more qualified leads', current: '180 / mo', target: '300 / mo', progress: 0.6, priority: 'Medium' },
    { id: 'g4', label: 'Increase customer retention', current: '68%', target: '80%', progress: 0.85, priority: 'Medium' },
    { id: 'g5', label: 'Expand into wholesale', current: '6 accounts', target: '15 accounts', progress: 0.4, priority: 'Medium' },
    { id: 'g6', label: 'Launch new subscription tier', current: 'Planning', target: 'Launched', progress: 0.35, priority: 'Low' },
  ],
  swot: {
    strengths: ['Strong customer loyalty', 'Premium positioning', 'High repeat purchase rate'],
    weaknesses: ['Low organic traffic', 'Limited wholesale reach'],
    opportunities: ['Subscription expansion', 'Corporate coffee partnerships'],
    threats: ['Growing competition', 'Rising acquisition costs'],
  },
  opportunities: [
    { id: 'o1', title: 'Subscription expansion', impact: 'HIGH', monthly: 8400, why: 'Customers with repeat purchases show strong subscription potential.' },
    { id: 'o2', title: 'Website conversion', impact: 'HIGH', monthly: 5200, why: 'Product pages have strong traffic but weak conversion.' },
    { id: 'o3', title: 'Wholesale', impact: 'MEDIUM', monthly: 12000, why: 'Existing products are suitable for business buyers.' },
  ],
  pricing: { positioning: 'Premium', tiers: ['Single bags from $18', 'Subscriptions from $34 / month', 'Wholesale volume pricing'] },
  channels: ['Instagram', 'Email', 'Google Search', 'Farmers markets', 'Wholesale outreach'],
  note: 'Its current positioning is premium and modern, but its organic acquisition strategy appears underdeveloped.',
  completeness: [
    { label: 'Business', value: 100 }, { label: 'Audience', value: 92 }, { label: 'Competitors', value: 81 },
    { label: 'Brand', value: 88 }, { label: 'Goals', value: 94 }, { label: 'Products', value: 100 },
  ],
}

export interface IntakeForm {
  mode: 'business' | 'idea'; name: string; website: string; industry: string; products: string; location: string; customers: string
  idea: string; problem: string; target: string; offering: string; market: string; goals: string
}
export const EMPTY_FORM: IntakeForm = { mode: 'business', name: '', website: '', industry: '', products: '', location: '', customers: '', idea: '', problem: '', target: '', offering: '', market: '', goals: '' }
