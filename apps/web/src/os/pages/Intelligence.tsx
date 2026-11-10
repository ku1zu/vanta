import { useState } from 'react'
import { GlassButton } from '../../components/glass'
import { useIntelligence } from '../intelligence/IntelligenceContext'
import { AudienceIntelligence, CompanyOverview, PersonaPanel } from '../intelligence/CompanyOverview'
import { CompetitorLandscape, MarketPosition } from '../intelligence/MarketIntelligence'
import { BrandIntelligence, BusinessAnalysis, BusinessGoals, GrowthOpportunities } from '../intelligence/StrategyPanels'
import { IntelligenceCompleteness, IntelligencePowers, IntelligenceSummary } from '../intelligence/IntelligenceSummary'
import { UpdateCompanyModal } from '../intelligence/UpdateCompanyModal'
import { IntakeForm } from '../intelligence/IntakeAndGeneration'

export default function Intelligence() {
  const { status, startSetup } = useIntelligence()
  const [modal, setModal] = useState(false)
  if (status === 'setup') return <IntakeForm />
  return (
    <div className="vos-over">
      <header className="vos-head">
        <span className="mono vos-k">Company intelligence · example company</span>
        <h1>Vanta understands your business.</h1>
        <p className="vos-sub">Your company profile powers the decisions, recommendations, and AI systems across Vanta.</p>
        <p className="mono vos-sub">Demo content: this is a sample company, not your data.</p>
        <div className="cta">
          <GlassButton onClick={() => setModal(true)}>Update Vanta's understanding</GlassButton>
          <GlassButton variant="secondary" onClick={startSetup}>Build your own</GlassButton>
        </div>
      </header>
      <div className="c7"><CompanyOverview /></div><div className="c5"><IntelligenceCompleteness /></div>
      <div className="c12"><IntelligenceSummary /></div>
      <div className="c6"><AudienceIntelligence /></div><div className="c6"><PersonaPanel /></div>
      <div className="c7"><CompetitorLandscape /></div><div className="c5"><MarketPosition /></div>
      <div className="c5"><BrandIntelligence onEdit={() => setModal(true)} /></div><div className="c7"><BusinessGoals /></div>
      <div className="c6"><BusinessAnalysis /></div><div className="c6"><GrowthOpportunities /></div>
      <div className="c12"><IntelligencePowers /></div>
      {modal && <UpdateCompanyModal onClose={() => setModal(false)} />}
    </div>
  )
}