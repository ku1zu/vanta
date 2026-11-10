import { useState } from 'react'

const LINKS = ['Platform', 'Solutions', 'Intelligence', 'Pricing']

export function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav mono">
      <a className="nav__logo" href="#top">VANTA</a>
      <nav className="nav__links" aria-label="Primary">
        {LINKS.map((l) => <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>)}
      </nav>
      <div className="nav__right">
        <a href="#login">Log in</a>
        <a className="pill" href="#start">Start free</a>
      </div>
      <button className="nav__menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Menu'}</button>
      {open && (
        <div className="nav__sheet glass">
          {[...LINKS, 'Log in', 'Start free'].map((l) => <a key={l} href="#top" onClick={() => setOpen(false)}>{l}</a>)}
        </div>
      )}
    </header>
  )
}