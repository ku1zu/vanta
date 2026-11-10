import { Link } from 'react-router-dom'

const ITEMS: [string, string][] = [['Home', '/'], ['Demo', '/demo'], ['Pricing', '/pricing'], ['Log in', '/login'], ['Sign up', '/signup']]

export function Footer() {
  return (
    <footer className="footer mono">
      <span>VANTA · prototype</span>
      <nav aria-label="Footer">{ITEMS.map(([l, to]) => <Link key={l} to={to}>{l}</Link>)}</nav>
    </footer>
  )
}