/** Placeholder for the typed contract shared by OS, HQ and the future backend. Types only, no UI code. */
export interface VantaEvent<T extends string = string, P = unknown> {
  type: T
  at: string // ISO timestamp
  payload: P
}
export type OsToHqEvent = VantaEvent<'task.completed', { taskId: string }>
