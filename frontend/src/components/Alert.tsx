// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { ReactNode } from 'react'
import { Icon } from './Icon'

// Warning banner: what is wrong, why it matters, and one action.
export function Alert({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="alert-banner" role="status">
      <Icon name="warning" size={20} />
      <div className="alert-text"><strong>{title}</strong> {children}</div>
      {action}
    </div>
  )
}
