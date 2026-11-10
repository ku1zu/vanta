export function getPath(o: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((a, k) => (a == null ? undefined : (a as Record<string, unknown>)[k]), o)
}
export function setPath<T>(o: T, path: string, v: unknown): T {
  const ks = path.split('.')
  const clone = structuredClone(o) as Record<string, unknown>
  let cur = clone
  ks.slice(0, -1).forEach((k) => { cur = cur[k] as Record<string, unknown> })
  cur[ks[ks.length - 1]] = v
  return clone as T
}