import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlassButton, GlassSurface, GlassToggle } from '../../components/glass'
import { useIntelligence } from './IntelligenceContext'
import { EMPTY_FORM, type IntakeForm as Form } from './mockCompanyIntelligence'
import { HANDOFF_QUERY, saveDraft } from './intakeDraft'

const MODES = ['I have a business', 'I have an idea'] as const
const BUSINESS: [keyof Form, string][] = [['name', 'Company name'], ['website', 'Website'], ['industry', 'Industry'], ['products', 'Products (comma-separated)'], ['location', 'Location'], ['customers', 'Current customers']]
const IDEA: [keyof Form, string][] = [['idea', 'Business idea'], ['problem', 'Problem being solved'], ['target', 'Target customer'], ['offering', 'Potential product or service'], ['market', 'Desired market'], ['goals', 'Goals']]
const REQUIRED: Record<Form['mode'], (keyof Form)[]> = { business: ['name', 'industry'], idea: ['idea', 'target'] }

export function IntakeForm() {
  const { exitSetup } = useIntelligence()
  const nav = useNavigate()
  const [form, setForm] = useState<Form>(EMPTY_FORM)
  const [missing, setMissing] = useState<(keyof Form)[]>([])
  const idea = form.mode === 'idea'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const miss = REQUIRED[form.mode].filter((k) => !(form[k] as string).trim())
    setMissing(miss)
    if (miss.length) return
    saveDraft(form) // kept for the future account flow; never merged with the demo company
    nav(`/login${HANDOFF_QUERY}`)
  }

  return (
    <div className="vos-over">
      <header className="vos-head">
        <span className="mono vos-k">Company intelligence</span>
        <h1>Tell Vanta about your business.</h1>
        <GlassToggle label="Business or idea" options={MODES} value={MODES[idea ? 1 : 0]} onChange={(v) => { setMissing([]); setForm({ ...form, mode: v === MODES[1] ? 'idea' : 'business' }) }} />
      </header>
      <div className="c7">
        <GlassSurface tone="frost" className="vos-panel">
          <form className="ci-fields" onSubmit={submit} noValidate>
            {(idea ? IDEA : BUSINESS).map(([k, label]) => {
              const req = REQUIRED[form.mode].includes(k), bad = missing.includes(k)
              return (
                <label key={k} className={`field ${bad ? 'err' : ''}`}><span className="mono">{label}{req ? ' *' : ''}</span>
                  <input value={form[k] as string} aria-invalid={bad} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  {bad && <span className="field-msg mono">Required</span>}
                </label>
              )
            })}
            {missing.length > 0 && <p className="field-msg mono" role="alert">Please complete the highlighted fields.</p>}
            <p className="vos-sub">Create an account to build and save your Company Intelligence.</p>
            <div className="cta">
              <GlassButton type="submit">Build company intelligence</GlassButton>
              <GlassButton type="button" variant="secondary" onClick={exitSetup}>Back to example</GlassButton>
            </div>
          </form>
        </GlassSurface>
      </div>
    </div>
  )
}