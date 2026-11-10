import { useState } from 'react'
import { CommandCenter } from '../components/CommandCenter'
import { GlassButton, GlassToggle } from '../components/glass'
import { CHANNELS, RANGES, demoMetrics, type Channel, type Range } from '../lib/demoData'

export default function Demo() {
  const [range, setRange] = useState<Range>('30D')
  const [channel, setChannel] = useState<Channel>('All')
  const { score, metrics } = demoMetrics(range, channel)
  return (
    <section className="wrap demo">
      <div className="col">
        <p className="label mono">Live demo · simulated data</p>
        <h2>Touch the system</h2>
        <p className="lede">Change the window and the channel. The instrument responds.</p>
        <div className="stack"><GlassToggle label="Time range" options={RANGES} value={range} onChange={setRange} /></div>
        <div className="stack"><GlassToggle label="Channel" options={CHANNELS} value={channel} onChange={setChannel} /></div>
        <div className="cta"><GlassButton to="/signup">Start Free Trial</GlassButton><GlassButton to="/os" variant="secondary">Open the OS prototype</GlassButton></div>
      </div>
      <CommandCenter className="big" score={score} metrics={metrics} />
    </section>
  )
}