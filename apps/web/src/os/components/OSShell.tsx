import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Icon } from './Icon'
import { CommandPalette } from './CommandPalette'
import { BUSINESS, NAV_PRIMARY, NAV_SECONDARY, type NavItem } from '../data/mockBusiness'

const to = (n: NavItem) => (n.slug === 'overview' ? '/os' : `/os/${n.slug}`)

export function OSShell() {
  const [palette, setPalette] = useState<{ open: boolean; initial?: string }>({ open: false })
  const [drawer, setDrawer] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const openCommand = useCallback((initial?: string) => setPalette({ open: true, initial }), [])
  const closeCommand = useCallback(() => setPalette({ open: false }), [])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => ({ open: !p.open })) }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const mac = /Mac/i.test(navigator.platform)
  const item = (n: NavItem) => (
    <NavLink key={n.slug} to={to(n)} end={n.slug === 'overview'} onClick={() => setDrawer(false)}
      className={({ isActive }) => `vos-item mono ${isActive ? 'on' : ''}`}>
      <Icon name={n.slug} /><span className="lbl">{n.label}</span>
    </NavLink>
  )

  return (
    <div className={`vos ${collapsed ? 'is-collapsed' : ''}`}>
      {drawer && <div className="vos-scrim vos-scrim--nav" onClick={() => setDrawer(false)} />}
      <nav className={`vos-rail gl gl--clear ${drawer ? 'open' : ''}`} aria-label="Vanta OS">
        <Link className="vos-logo mono" to="/">VANTA</Link>
        {NAV_PRIMARY.map(item)}
        <div className="vos-spacer" />
        {NAV_SECONDARY.map(item)}
        <div className="vos-user">
          <span className="vos-avatar mono">{BUSINESS.initials}</span><span className="lbl">{BUSINESS.name}</span>
        </div>
        <button className="vos-collapse mono" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>{collapsed ? '»' : '«'}</button>
      </nav>
      <div className="vos-main">
        <header className="vos-top">
          <button className="vos-menu mono" onClick={() => setDrawer(true)}>Menu</button>
          <button className="vos-cmdbar gl gl--clear" onClick={() => openCommand()}>
            <span>What do you want Vanta to do?</span><kbd className="mono">{mac ? '⌘ K' : 'Ctrl K'}</kbd>
          </button>
          <Link className="vos-exit mono" to="/">Exit</Link>
        </header>
        <div className="vos-scroll"><Outlet context={{ openCommand }} /></div>
      </div>
      {palette.open && <CommandPalette key={palette.initial ?? 'blank'} initial={palette.initial} onClose={closeCommand} />}
    </div>
  )
}