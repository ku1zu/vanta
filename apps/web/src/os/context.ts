import { useOutletContext } from 'react-router-dom'

export interface OsContext { openCommand: (initial?: string) => void }
export const useOS = () => useOutletContext<OsContext>()