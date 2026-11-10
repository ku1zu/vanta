import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CommandCenter } from '../components/CommandCenter'
import { COMMANDS, FALLBACK, RESULTS, type DemoResult } from '../lib/demoCommands'

const RAIL = ['Overview', 'Command', 'Website', 'Marketing', 'Content', 'Sales', 'Customers']
const ACTIVITY: [string, string][] = [
  ['2m', 'New lead from website form'], ['14m', 'Campaign "Autumn" sent to 2,140'], ['1h', 'Pricing page draft ready'],
  ['3h', 'Competitor scan completed'], ['5h', '12 customers reactivated'],
]

/** Early OS shell. Everything is demo data; commands return simulated responses. */
export default function Os() {
  const input = useRef<HTMLInputElement>(null)
  const timer = useRef<number>()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<(DemoResult & { cmd: string }) | null>(null)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const run = (cmd: string) => {
    const c = cmd.trim()
    if (!c || busy) return
    setText(c); setBusy(true); setResult(null)
    timer.current = window.setTimeout(() => { setResult({ cmd: c, ...(RESULTS[c] ?? FALLBACK) }); setBusy(false) }, 900)
  }
  const submit = (e: FormEvent) => { e.preventDefault(); run(text) }

  return (
    <div className="os">
      <nav className="os__rail mono" aria-label="Vanta OS">
        <Link to="/" className="os__logo">VANTA</Link>
        {RAIL.map((r) => (
          <button key={r} disabled={r !== 'Overview' && r !== 'Command'} aria-current={r === 'Overview' ? 'page' : undefined}
            title={r === 'Overview' || r === 'Command' ? undefined : 'Not built in this prototype'}
            onClick={r === 'Command' ? () => input.current?.focus() : undefined}>{r}</button>
        ))}
      </nav>
      <div className="os__main">
        <div className="os__top mono"><span>DEMO WORKSPACE · PROTOTYPE</span><Link to="/">Exit</Link></div>
        <form className="cmd" onSubmit={submit}>
          <label className="mono" htmlFor="cmd">What should Vanta do?</label>
          <input id="cmd" ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a command or choose one" autoComplete="off" />
          <div className="chips">{COMMANDS.map((c) => <button type="button" key={c} onClick={() => run(c)}>{c}</button>)}</div>
        </form>
        {(busy || result) && (
          <div className="glass result rise" role="status" aria-live="polite">
            {busy ? <p className="mono">Vanta is working…</p> : result && (<>
              <p className="mono">{result.cmd}</p>
              <strong>{result.reply}</strong>
              <ul>{result.lines.map((l) => <li key={l}>{l}</li>)}</ul>
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="bars" aria-hidden="true">
                {result.bars.map((h, i) => <rect key={i} x={i * (100 / result.bars.length) + 2} y={30 - h} width={100 / result.bars.length - 4} height={h} />)}
              </svg>
            </>)}
          </div>
        )}
        <div className="os__grid">
          <CommandCenter />
          <div className="os__side">
            <div><span className="mono">ACTIVE CUSTOMERS</span><strong className="big-num">1,284</strong></div>
            <ul className="activity">{ACTIVITY.map(([t, a]) => <li key={a}><span className="mono">{t}</span>{a}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  )
}