// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useEffect, useRef, useState, type UIEvent } from 'react'
import './EulaDialog.css'

interface EulaDialogProps {
  onAccept: () => void
  onDecline: () => void
  onDismiss: () => void
}

// Within this many pixels of the bottom counts as having read to the end.
const END_TOLERANCE_PX = 8

function hasReachedEnd(element: HTMLElement): boolean {
  return element.scrollTop + element.clientHeight >= element.scrollHeight - END_TOLERANCE_PX
}

// EULA version to be changed whenever the agreement text changes.
export const EULA_VERSION = '1.0'

// ***Just a placeholder until actual EULA is written.***
function AgreementText() {
  return (
    <div className="eula-placeholder" aria-label="Agreement text coming soon">
      <span className="eula-line eula-line--heading" style={{ width: '55%' }} />
      <span className="eula-line" />
      <span className="eula-line" />
      <span className="eula-line" style={{ width: '85%' }} />
      <span className="eula-line eula-line--heading eula-line--section" style={{ width: '40%' }} />
      <span className="eula-line" />
      <span className="eula-line" style={{ width: '70%' }} />
    </div>
  )
}

// Modal showing the End User License Agreement.
function EulaDialog({ onAccept, onDecline, onDismiss }: EulaDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [readToEnd, setReadToEnd] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement
    dialog.showModal()
    if (bodyRef.current && hasReachedEnd(bodyRef.current)) setReadToEnd(true)
    return () => {
      dialog.close()
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [])

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    if (!readToEnd && hasReachedEnd(event.currentTarget)) setReadToEnd(true)
  }

  return (
    <dialog
      ref={dialogRef}
      className="eula-dialog"
      aria-labelledby="eula-title"
      onCancel={(event) => {
        event.preventDefault()
        onDismiss()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss()
      }}
    >
      <div className="eula-content">
        <h2 id="eula-title" className="eula-title">End User License Agreement</h2>

        <div
          ref={bodyRef}
          className="eula-body"
          tabIndex={0}
          role="region"
          aria-label="Agreement text"
          onScroll={handleScroll}
        >
          <AgreementText />
        </div>

        {!readToEnd && <p className="eula-hint">Scroll to the end to accept.</p>}

        <div className="eula-actions">
          <button type="button" className="eula-button eula-button--secondary" onClick={onDecline}>
            Decline
          </button>
          <button
            type="button"
            className="eula-button eula-button--primary"
            disabled={!readToEnd}
            onClick={onAccept}
          >
            Accept
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default EulaDialog
