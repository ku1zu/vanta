import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { GlassButton, GlassSurface } from '../../components/glass'
import { ANALYZE_STEPS, CREATE_STEPS, SCAN_STEPS, SITE_TYPES } from './mockWebsites'

export type Flow = { kind: 'create' | 'analyze' | 'fix' | 'seo' | 'performance'; label?: string } | null

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <>
      <div className="vos-scrim" onClick={onClose} />
      <GlassSurface tone="frost" className="vos-palette ci-modal" role="dialog" aria-modal="true" aria-label={title}>
        <span className="mono vos-k">{title}</span>
        {children}
      </GlassSurface>
    </>
  )
}

function Sequence({ steps, onDone }: { steps: string[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const ms = matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : 900
    let n = 0
    const t = window.setInterval(() => { n++; if (n >= steps.length) { window.clearInterval(t); onDone() } else setI(n) }, ms)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <ol className="ws-seq mono" role="status" aria-live="polite">{steps.map((s, k) => <li key={s} className={k < i ? 'done' : k === i ? 'now' : ''}>{s}</li>)}</ol>
}

function Result({ title, text, detail, onClose }: { title: string; text: string; detail?: string; onClose: () => void }) {
  return (
    <div className="ws-result">
      <strong>{title}</strong>
      {detail && <p className="mono vos-sub">{detail}</p>}
      <p className="vos-sub">{text}</p>
      <p className="proto mono">Prototype · nothing was created, scanned, or changed</p>
      <div className="cta"><GlassButton onClick={onClose}>Done</GlassButton></div>
    </div>
  )
}

function Scan({ title, steps, doneTitle, doneText, onClose }: { title: string; steps: string[]; doneTitle: string; doneText: string; onClose: () => void }) {
  const [done, setDone] = useState(false)
  return (
    <Modal title={title} onClose={onClose}>
      {done ? <Result title={doneTitle} text={doneText} onClose={onClose} /> : <Sequence steps={steps} onDone={() => setDone(true)} />}
    </Modal>
  )
}

function CreateFlow({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'form' | 'working' | 'done'>('form')
  const [type, setType] = useState(SITE_TYPES[0])
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [err, setErr] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); if (!name.trim()) { setErr(true); return } setErr(false); setPhase('working') }
  return (
    <Modal title="Create website" onClose={onClose}>
      {phase === 'form' && (
        <form className="ci-fields" onSubmit={submit} noValidate>
          <h3 className="ws-q">What kind of website are you building?</h3>
          <div className="ws-types" role="radiogroup" aria-label="Website type">
            {SITE_TYPES.map((t) => <button type="button" key={t} role="radio" aria-checked={type === t} onClick={() => setType(t)}>{t}</button>)}
          </div>
          <label className={`field ${err ? 'err' : ''}`}><span className="mono">Business name *</span>
            <input value={name} aria-invalid={err} onChange={(e) => setName(e.target.value)} />
            {err && <span className="field-msg mono">Required</span>}</label>
          <label className="field"><span className="mono">Describe what you want the website to accomplish</span>
            <textarea rows={3} value={goal} onChange={(e) => setGoal(e.target.value)} /></label>
          <div className="cta"><GlassButton type="submit">Continue</GlassButton><GlassButton type="button" variant="secondary" onClick={onClose}>Cancel</GlassButton></div>
        </form>
      )}
      {phase === 'working' && <Sequence steps={CREATE_STEPS} onDone={() => setPhase('done')} />}
      {phase === 'done' && (
        <Result title="Your brief is ready" detail={`${type} · ${name.trim()}`} onClose={onClose}
          text="Website generation will be connected to Vanta's AI engine in a future phase." />
      )}
    </Modal>
  )
}

function AnalyzeFlow({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'form' | 'working' | 'done'>('form')
  const [url, setUrl] = useState('')
  const [err, setErr] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); if (!url.trim().includes('.')) { setErr(true); return } setErr(false); setPhase('working') }
  return (
    <Modal title="Analyze website" onClose={onClose}>
      {phase === 'form' && (
        <form className="ci-fields" onSubmit={submit} noValidate>
          <label className={`field ${err ? 'err' : ''}`}><span className="mono">Website URL</span>
            <input value={url} placeholder="https://example.com" aria-invalid={err} onChange={(e) => setUrl(e.target.value)} autoFocus />
            {err && <span className="field-msg mono">Enter a website address, e.g. https://example.com</span>}</label>
          <div className="cta"><GlassButton type="submit">Analyze Website</GlassButton><GlassButton type="button" variant="secondary" onClick={onClose}>Cancel</GlassButton></div>
        </form>
      )}
      {phase === 'working' && <Sequence steps={ANALYZE_STEPS} onDone={() => setPhase('done')} />}
      {phase === 'done' && (
        <Result title="Simulated analysis complete" detail={url.trim()} onClose={onClose}
          text="Real website scanning will be connected in a future phase. The findings on the Websites page are sample data and are not from this address." />
      )}
    </Modal>
  )
}

export function WebsiteFlows({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  if (!flow) return null
  if (flow.kind === 'create') return <CreateFlow onClose={onClose} />
  if (flow.kind === 'analyze') return <AnalyzeFlow onClose={onClose} />
  if (flow.kind === 'fix')
    return <Scan title={flow.label ?? 'Improve with Vanta'} steps={SCAN_STEPS.fix} doneTitle="Suggestion prepared (simulated)" onClose={onClose}
      doneText="Vanta will apply improvements like this once website editing is connected in a future phase." />
  const seo = flow.kind === 'seo'
  return <Scan title={seo ? 'SEO scan' : 'Performance scan'} steps={SCAN_STEPS[seo ? 'seo' : 'performance']} onClose={onClose}
    doneTitle="Simulated scan complete" doneText="Real scans will be connected in a future phase. The findings on the Websites page are sample data." />
}