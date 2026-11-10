import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CompanyIntelligence } from './types'
import { COMPANY_INTELLIGENCE } from './mockCompanyIntelligence'

type Status = 'ready' | 'setup'
interface Ctx { intel: CompanyIntelligence; status: Status; setIntel: (i: CompanyIntelligence) => void; startSetup: () => void; exitSetup: () => void }

const C = createContext<Ctx | null>(null)
export const useIntelligence = () => {
  const c = useContext(C)
  if (!c) throw new Error('useIntelligence must be used inside <IntelligenceProvider>')
  return c
}

/** Holds the DEMO company only (Aether Coffee). A user's own company is never merged into it. */
export function IntelligenceProvider({ children }: { children: ReactNode }) {
  const [intel, setIntel] = useState<CompanyIntelligence>(COMPANY_INTELLIGENCE)
  const [status, setStatus] = useState<Status>('ready')
  const value = useMemo(() => ({ intel, status, setIntel, startSetup: () => setStatus('setup'), exitSetup: () => setStatus('ready') }), [intel, status])
  return <C.Provider value={value}>{children}</C.Provider>
}