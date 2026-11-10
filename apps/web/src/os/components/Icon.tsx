const P: Record<string, string> = {
  overview: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  intelligence: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  employees: 'M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 20a7 7 0 0 1 14 0',
  websites: 'M3 6h18v12H3zM3 10h18',
  marketing: 'M4 10v4l12 5V5L4 10z',
  leads: 'M4 5h16l-6 8v6l-4-2v-4L4 5z',
  customers: 'M8 8a3 3 0 1 0 .01 0M3 19a5 5 0 0 1 10 0M16 9a2.5 2.5 0 1 0 .01 0M14 19a4 4 0 0 1 7 0',
  analytics: 'M5 20V11M12 20V4M19 20v-6',
  content: 'M5 4h14v16H5zM8 9h8M8 13h8M8 17h5',
  automations: 'M13 3L5 14h6l-1 7 8-11h-6l1-7z',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3',
  help: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01',
}

export function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={P[name] ?? P.overview} /></svg>
}