import { useEffect, useState } from 'react'
import { GlassButton, GlassSurface } from '../../components/glass'
import { useIntelligence } from './IntelligenceContext'
import { getPath, setPath } from './path'
import type { CompanyIntelligence } from './types'

type Field = { path: string; label: string; kind?: 'text' | 'list' | 'area' }
const SECTIONS: { id: string; label: string; fields: Field[] }[] = [
  { id: 'business', label: 'Business', fields: [
    { path: 'profile.name', label: 'Company name' }, { path: 'profile.industry', label: 'Industry' }, { path: 'profile.location', label: 'Location' },
    { path: 'profile.website', label: 'Website' }, { path: 'profile.businessModel', label: 'Business model' }] },
  { id: 'audience', label: 'Audience', fields: [
    { path: 'audience.primary.title', label: 'Primary audience' }, { path: 'audience.primary.age', label: 'Primary age range' },
    { path: 'audience.secondary.title', label: 'Secondary audience' }, { path: 'audience.secondary.age', label: 'Secondary age range' }] },
  { id: 'products', label: 'Products', fields: [{ path: 'profile.products', label: 'Products and services (comma-separated)', kind: 'list' }] },
  { id: 'competitors', label: 'Competitors', fields: [
    { path: 'competitors.0.name', label: 'Competitor A' }, { path: 'competitors.1.name', label: 'Competitor B' }, { path: 'competitors.2.name', label: 'Competitor C' }] },
  { id: 'goals', label: 'Goals', fields: [
    { path: 'goals.0.target', label: 'Monthly revenue target' }, { path: 'goals.1.target', label: 'Website conversion target' }, { path: 'goals.2.target', label: 'Qualified leads target' }] },
  { id: 'brand', label: 'Brand', fields: [
    { path: 'brand.coreMessage', label: 'Core message', kind: 'area' }, { path: 'brand.tone', label: 'Tone (comma-separated)', kind: 'list' },
    { path: 'brand.personality', label: 'Personality (comma-separated)', kind: 'list' }] },
  { id: 'pricing', label: 'Pricing', fields: [
    { path: 'pricing.positioning', label: 'Price positioning' }, { path: 'pricing.tiers', label: 'Price points (comma-separated)', kind: 'list' }] },
]

/** Edits a draft copy; Save writes it back to the shared (in-memory) profile. */
export function UpdateCompanyModal({ onClose }: { onClose: () => void }) {
  const { intel, setIntel } = useIntelligence()
  const [draft, setDraft] = useState<CompanyIntelligence>(() => structuredClone(intel))
  const [tab, setTab] = useState(SECTIONS[0].id)
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])

  const section = SECTIONS.find((s) => s.id === tab) ?? SECTIONS[0]
  const save = () => {
    let out = draft
    SECTIONS.forEach((s) => s.fields.forEach((f) => {
      if (f.kind === 'list') out = setPath(out, f.path, (getPath(out, f.path) as string[]).map((x) => x.trim()).filter(Boolean))
    }))
    setIntel(out); onClose()
  }
  return (
    <>
      <div className="vos-scrim" onClick={onClose} />
      <GlassSurface tone="frost" className="vos-palette ci-modal" role="dialog" aria-modal="true" aria-label="Update Vanta's understanding">
        <span className="mono vos-k">Update Vanta's understanding</span>
        <div className="ci-tabs mono" role="tablist">
          {SECTIONS.map((s) => <button key={s.id} role="tab" aria-selected={tab === s.id} onClick={() => setTab(s.id)}>{s.label}</button>)}
        </div>
        <div className="ci-fields">
          {section.fields.map((f) => {
            const raw = getPath(draft, f.path)
            const value = f.kind === 'list' ? (raw as string[]).join(', ') : String(raw ?? '')
            const set = (v: string) => setDraft((d) => setPath(d, f.path, f.kind === 'list' ? v.split(',') : v))
            return (
              <label key={f.path} className="field"><span className="mono">{f.label}</span>
                {f.kind === 'area' ? <textarea value={value} onChange={(e) => set(e.target.value)} rows={3} /> : <input value={value} onChange={(e) => set(e.target.value)} />}
              </label>
            )
          })}
        </div>
        <p className="proto mono">Prototype · changes live in this session only</p>
        <div className="cta"><GlassButton onClick={save}>Save changes</GlassButton><GlassButton variant="secondary" onClick={onClose}>Cancel</GlassButton></div>
      </GlassSurface>
    </>
  )
}