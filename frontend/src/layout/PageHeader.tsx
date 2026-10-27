// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { ReactNode } from 'react'

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="header">
      <div>
        <button className="switcher">Mykonos Grill · Boca Raton, FL ▾</button>
        <h1>{title}</h1>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  )
}
