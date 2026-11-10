import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { GlassButton, GlassSurface } from '../components/glass'
import { loadDraft } from '../os/intelligence/intakeDraft'

/** Where a successful login or signup lands. Later this becomes the user's real dashboard. */
const POST_AUTH_ROUTE = '/os'

/** Mocked: no account is created and nothing is sent anywhere. */
function useFakeSubmit() {
  const nav = useNavigate()
  const [busy, setBusy] = useState(false)
  const timer = useRef<number>()
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const submit = (e: FormEvent) => {
    e.preventDefault(); setBusy(true)
    timer.current = window.setTimeout(() => nav(POST_AUTH_ROUTE), 700)
  }
  return { busy, submit }
}

const Field = ({ label, ...p }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="field"><span className="mono">{label}</span><input {...p} /></label>
)

const GoogleG = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
  </svg>
)

/** Shown only when the user arrived from Company Intelligence (?from=intelligence). */
function IntakeNotice({ signup }: { signup: boolean }) {
  const { search } = useLocation()
  if (new URLSearchParams(search).get('from') !== 'intelligence') return null
  const d = loadDraft()
  const who = d ? (d.mode === 'idea' ? d.idea : d.name) : ''
  return (
    <p className="intake-note mono" role="status">
      {signup ? 'Create your Vanta account to continue building your Company Intelligence' : 'Log in to build and save your Company Intelligence'}
      {who ? ` · ${who}` : ''}
    </p>
  )
}

function Panel({ label, title, signup = false, children }: { label: string; title: string; signup?: boolean; children: ReactNode }) {
  return (
    <section className="wrap auth">
      <GlassSurface tilt tone="frost" className="panel">
        <p className="label mono">{label}</p>
        <h2>{title}</h2>
        <IntakeNotice signup={signup} />
        {children}
        <p className="proto mono">Prototype · no account is created</p>
      </GlassSurface>
    </section>
  )
}

export function Login() {
  const { busy, submit } = useFakeSubmit()
  const { search } = useLocation()
  const [note, setNote] = useState('')
  return (
    <Panel label="Access" title="Log in to Vanta">
      <form onSubmit={submit}>
        <Field label="Email" type="email" required autoComplete="email" />
        <Field label="Password" type="password" required autoComplete="current-password" />
        <GlassButton type="submit" className="wide" disabled={busy}>{busy ? 'Entering…' : 'Log In'}</GlassButton>
      </form>
      <GlassButton type="button" variant="secondary" className="wide" onClick={() => setNote('Google sign-in is not connected in this prototype.')}>
        <GoogleG /> Continue with Google
      </GlassButton>
      <div className="row mono">
        <GlassButton type="button" variant="tertiary" onClick={() => setNote('Password reset is not connected in this prototype.')}>Forgot password</GlassButton>
        <GlassButton to={`/signup${search}`} variant="tertiary">Create account</GlassButton>
      </div>
      {note && <p className="proto mono" role="status">{note}</p>}
    </Panel>
  )
}

export function Signup() {
  const { busy, submit } = useFakeSubmit()
  const { search } = useLocation()
  const plan = useSearchParams()[0].get('plan')
  return (
    <Panel label={plan ? `Start trial · ${plan}` : 'Start trial'} title="Create your Vanta account" signup>
      <form onSubmit={submit}>
        <Field label="Name" type="text" required autoComplete="name" />
        <Field label="Email" type="email" required autoComplete="email" />
        <Field label="Password" type="password" required autoComplete="new-password" />
        <GlassButton type="submit" className="wide" disabled={busy}>{busy ? 'Entering…' : 'Start Free Trial'}</GlassButton>
      </form>
      <div className="row mono"><GlassButton to={`/login${search}`} variant="tertiary">Already have an account? Log in</GlassButton></div>
    </Panel>
  )
}