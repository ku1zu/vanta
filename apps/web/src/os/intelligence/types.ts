export type Level = 'High' | 'Medium' | 'Low'

export interface CompanyProfile {
  mode: 'business' | 'idea'; name: string; industry: string; location: string; founded: number; employees: number
  website: string; products: string[]; businessModel: string; stage: string; market: string
}
export interface AudienceProfile { label: string; title: string; age: string; traits: string[]; fit: number }
export interface Persona { id: string; name: string; age: number; goal: string; pains: string[]; motivation: string; value: Level; seed: number }
/** x: 0 accessible to 1 premium. y: 0 traditional to 1 innovative. Simulated data, not researched companies. */
export interface Competitor {
  id: string; tag: string; name: string; position: string; strength: string; weakness: string
  pricing: 'Low' | 'Mid' | 'Premium'; presence: number; opportunity: string; x: number; y: number
}
export interface Brand { personality: string[]; tone: string[]; visual: string[]; coreMessage: string }
export interface Goal { id: string; label: string; current: string; target: string; progress: number; priority: Level }
export interface Swot { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }
export interface Opportunity { id: string; title: string; impact: 'HIGH' | 'MEDIUM' | 'LOW'; monthly: number; why: string }

/** The shared context layer. Website, Marketing, Sales, Content, Analytics, AI Employees, etc. all read this one object. */
export interface CompanyIntelligence {
  profile: CompanyProfile
  audience: { primary: AudienceProfile; secondary: AudienceProfile }
  personas: Persona[]
  competitors: Competitor[]
  position: { company: { x: number; y: number }; market: { x: number; y: number } }
  brand: Brand
  goals: Goal[]
  swot: Swot
  opportunities: Opportunity[]
  pricing: { positioning: string; tiers: string[] }
  channels: string[]
  note: string
  completeness: { label: string; value: number }[]
}