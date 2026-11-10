import { useEffect, useRef, useState } from 'react'
import { GlassButton, GlassSurface } from '../../components/glass'
import { COMMANDS, findCommand, type CommandDef } from '../data/mockBusiness'
import { useIntelligence } from '../intelligence/IntelligenceContext'
import { usesFor } from '../intelligence/commandContext'

/** Simulated command interface. No AI: it plays a progress state, then reveals canned insights. */
export function CommandPalette({ initial, onClose }: { initial?: string; onClose: () => void }) {
  const [text, setText] = useState(initial ?? '')
  const [phase, setPhase] = useState<'idle' | 'working' | 'done'>('idle')
  const [pct, setPct] = useState(0)
  const [cmd, setCmd] = useState<CommandDef | null>(null)
  const timer = useRef<number>()
  const { intel } = useIntelligence()

  const run = (t: string) => {
    if (!t.trim()) return
    window.clearInterval(timer.current)
    setText(t); setCmd(findCommand(t)); setPhase('working'); setPct(0)
    let p = 0
    timer.current = window.setInterval(() => {
      p += 8 + Math.random() * 10
      if (p >= 100) { window.clearInterval(timer.current); setPct(100); setPhase('done') } else setPct(p)
    }, 140)
  }

  useEffect(() => {
    if (initial) run(initial)
    return () => window.clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])

  return (
    <>
      <div className="vos-scrim" onClick={onClose} />
      <GlassSurface tone="frost" className="vos-palette" role="dialog" aria-modal="true" aria-label="Command interface">
        <form onSubmit={(e) => { e.preventDefault(); run(text) }}>
          <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="What do you want Vanta to do?" autoComplete="off" />
        </form>
        {phase === 'idle' && (
          <ul className="vos-suggest">
            {COMMANDS.map((c) => <li key={c.label}><button onClick={() => run(c.label)}>{c.label}</button></li>)}
          </ul>
        )}
        {phase !== 'idle' && cmd && (
          <div className="vos-run" aria-live="polite">
            <p className="mono">{phase === 'working' ? cmd.working : cmd.done}</p>
            <p className="mono vos-uses">Using Company Intelligence · {intel.profile.name} · {usesFor(cmd.label).join(' · ')}</p>
            <div className="vos-progress"><span style={{ width: `${pct}%` }} /></div>
            {phase === 'done' && (
              <>
                <ul className="vos-insights">{cmd.insights.map((i) => <li key={i}>{i}</li>)}</ul>
                <GlassButton variant="secondary" className="sm" onClick={() => { setPhase('idle'); setText('') }}>Run another</GlassButton>
              </>
            )}
          </div>
        )}
        <p className="proto mono">Prototype · simulated responses</p>
      </GlassSurface>
    </>
  )
}