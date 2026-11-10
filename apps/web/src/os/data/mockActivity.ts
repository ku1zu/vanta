export type ActivityKind = 'lead' | 'visit' | 'ai' | 'campaign' | 'customer' | 'invoice' | 'site' | 'review'
export interface ActivityEvent { id: string; text: string; kind: ActivityKind; agoSec: number }

export const SEED: ActivityEvent[] = [
  { id: 's1', text: 'New lead captured: Harper & Co.', kind: 'lead', agoSec: 0 },
  { id: 's2', text: 'AI employee completed task: weekly report', kind: 'ai', agoSec: 120 },
  { id: 's3', text: 'Website visitor converted', kind: 'visit', agoSec: 480 },
  { id: 's4', text: 'Customer replied to your proposal', kind: 'customer', agoSec: 840 },
  { id: 's5', text: 'Campaign generated: Autumn offer', kind: 'campaign', agoSec: 1500 },
  { id: 's6', text: 'Invoice created: INV-2041', kind: 'invoice', agoSec: 2400 },
]

export const POOL: Omit<ActivityEvent, 'id' | 'agoSec'>[] = [
  { text: 'New lead captured: Northfield Dental', kind: 'lead' },
  { text: 'Review received: 5 stars', kind: 'review' },
  { text: 'Website update published', kind: 'site' },
  { text: 'Website visitor converted', kind: 'visit' },
  { text: 'AI employee completed task: lead follow-ups', kind: 'ai' },
  { text: 'Customer replied to your email', kind: 'customer' },
  { text: 'Invoice created: INV-2042', kind: 'invoice' },
  { text: 'Campaign generated: Retention series', kind: 'campaign' },
]