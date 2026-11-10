import type { IntakeForm } from './mockCompanyIntelligence'

const KEY = 'vanta.intakeDraft'
export const HANDOFF_QUERY = '?from=intelligence'

/** Temporary, per-tab storage for the user's own company setup. A real account system replaces this later. */
export function saveDraft(f: IntakeForm) {
  try { sessionStorage.setItem(KEY, JSON.stringify(f)) } catch { /* storage unavailable: carry on */ }
}
export function loadDraft(): IntakeForm | null {
  try { const s = sessionStorage.getItem(KEY); return s ? (JSON.parse(s) as IntakeForm) : null } catch { return null }
}
export function clearDraft() {
  try { sessionStorage.removeItem(KEY) } catch { /* ignore */ }
}