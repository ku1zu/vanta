import { useEffect } from 'react'

/** s = camera rail position in viewport heights (0 hero, 1 command, 2 planet, 3 features, 4 closing). sm = damped copy.
 *  dk = damped darkness of the *displayed* background (0 pale, 1 graphite); dkTarget overrides the scroll-derived value on non-landing routes.
 *  isDark/onTheme: the UI text theme, which follows dk (not the route) so text never mismatches mid-transition. */
export const scroll = {
  s: 0, sm: 0, dk: 0, dkTarget: null as number | null,
  isDark: false, onTheme: null as ((dark: boolean) => void) | null,
}

export function useScrollSync(onChange: (s: number) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const f = () => { scroll.s = window.scrollY / window.innerHeight; onChange(scroll.s) }
    f()
    window.addEventListener('scroll', f, { passive: true })
    window.addEventListener('resize', f)
    return () => { window.removeEventListener('scroll', f); window.removeEventListener('resize', f) }
  }, [onChange, enabled])
}