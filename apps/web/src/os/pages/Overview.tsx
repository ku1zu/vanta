import { MetricInstrument } from '../components/MetricInstrument'
import { BusinessHealth } from '../components/BusinessHealth'
import { LiveActivity } from '../components/LiveActivity'
import { AIEmployees } from '../components/AIEmployees'
import { AttentionPanel } from '../components/AttentionPanel'
import { RevenueOpportunity } from '../components/RevenueOpportunity'
import { WebsiteStatus } from '../components/WebsiteStatus'
import { MarketingOverview } from '../components/MarketingOverview'
import { BUSINESS } from '../data/mockBusiness'
import { PRIMARY } from '../data/mockMetrics'

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }

export default function Overview() {
  return (
    <div className="vos-over">
      <header className="vos-head">
        <h1>{greeting()}, {BUSINESS.name}</h1>
        <p className="vos-sub">Here's what Vanta found.</p>
      </header>
      {PRIMARY.map((m) => <div key={m.id} className="c3"><MetricInstrument m={m} /></div>)}
      <div className="c7"><BusinessHealth /></div>
      <div className="c5"><LiveActivity /></div>
      <div className="c6"><AttentionPanel /></div>
      <div className="c6"><RevenueOpportunity /></div>
      <div className="c7"><AIEmployees /></div>
      <div className="c5"><WebsiteStatus /></div>
      <div className="c12"><MarketingOverview /></div>
    </div>
  )
}