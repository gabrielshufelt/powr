// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type DialogProps = {
  open: boolean
  title: string
  onClose: () => void
  actions: ReactNode
  children?: ReactNode
  width?: number
}

const FOCUSABLE = 'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])'

// Modal dialog: Esc or a click on the scrim closes it; focus moves in on open and back on close.
export function Dialog({ open, title, onClose, actions, children, width = 440 }: DialogProps) {
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [open])

  if (!open) return null
  return createPortal(
    <div className="dialog-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} style={{ width }}>
        <h3 id={titleId}>{title}</h3>
        {children && <div className="dialog-body">{children}</div>}
        <div className="dialog-actions">{actions}</div>
      </div>
    </div>,
    document.body,
  )
}
