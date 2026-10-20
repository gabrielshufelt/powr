// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { IconButton } from './Button'

type ToastTone = 'success' | 'error' | 'info'
type ToastItem = { id: number; message: string; tone: ToastTone }
type ToastApi = { showToast: (message: string, tone?: ToastTone) => void }

const ICONS: Record<ToastTone, IconName> = { success: 'check', error: 'alert-circle', info: 'info' }
const SUCCESS_TIMEOUT_MS = 5000

const ToastContext = createContext<ToastApi | null>(null)
let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), [])

  // Success toasts hide on their own; errors stay until closed.
  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = nextId++
    setToasts((all) => [...all, { id, message, tone }])
    if (tone === 'success') setTimeout(() => dismiss(id), SUCCESS_TIMEOUT_MS)
  }, [dismiss])

  const api = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.tone}`} role="status">
            <span className="toast-icon"><Icon name={ICONS[t.tone]} size={14} /></span>
            <span className="toast-message">{t.message}</span>
            <IconButton icon="x" label="Dismiss" size="sm" onClick={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used inside ToastProvider')
  return api
}
