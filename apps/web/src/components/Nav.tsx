import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassButton } from './glass'

const LINKS: [string, string][] = [['Platform', '/demo'], ['Solutions', '/#solutions'], ['Intelligence', '/#intelligence'], ['Pricing', '/pricing']]

export function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="nav">
      <div className="nav__bar gl gl--clear mono">
        <Link className="nav__logo" to="/" onClick={() => { close(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>VANTA</Link>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map(([l, to]) => <Link key={l} to={to}>{l}</Link>)}
        </nav>
        <div className="nav__right">
          <GlassButton to="/login" variant="tertiary">Log in</GlassButton>
          <GlassButton to="/signup" className="sm">Start free</GlassButton>
        </div>
        <button className="nav__menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Menu'}</button>
      </div>
      {open && (
        <div className="nav__sheet gl gl--frost mono">
          {LINKS.map(([l, to]) => <Link key={l} to={to} onClick={close}>{l}</Link>)}
          <Link to="/login" onClick={close}>Log in</Link>
          <Link to="/signup" onClick={close}>Start free</Link>
        </div>
      )}
    </header>
  )
}