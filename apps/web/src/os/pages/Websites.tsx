import { useState } from 'react'
import { GlassButton } from '../../components/glass'
import { HealthVisualization, WebsiteOverview, WebsitePreview } from '../websites/WebsiteOverview'
import { AIWebsiteIntelligence, QuickActions, WebsiteActivity } from '../websites/WebsitePanels'
import { WebsiteFlows, type Flow } from '../websites/WebsiteFlows'

export default function Websites() {
  const [flow, setFlow] = useState<Flow>(null)
  const quick = (id: string) => {
    if (id === 'create' || id === 'analyze' || id === 'seo' || id === 'performance') setFlow({ kind: id })
    else setFlow({ kind: 'fix', label: 'Improve existing website' })
  }
  return (
    <div className="vos-over">
      <header className="vos-head">
        <span className="mono vos-k">Websites</span>
        <h1>Your Websites</h1>
        <p className="vos-sub">Monitor, improve, and build the digital experiences powering your business.</p>
        <div className="cta">
          <GlassButton onClick={() => setFlow({ kind: 'create' })}>+ Create Website</GlassButton>
          <GlassButton variant="secondary" onClick={() => setFlow({ kind: 'analyze' })}>Analyze Website</GlassButton>
        </div>
      </header>
      <div className="c7"><WebsiteOverview /></div><div className="c5"><HealthVisualization /></div>
      <div className="c7"><WebsitePreview /></div><div className="c5"><WebsiteActivity /></div>
      <div className="c7"><AIWebsiteIntelligence onAction={(label) => setFlow({ kind: 'fix', label })} /></div><div className="c5"><QuickActions onAction={quick} /></div>
      <WebsiteFlows flow={flow} onClose={() => setFlow(null)} />
    </div>
  )
}