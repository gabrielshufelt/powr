// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type BadgeTone = 'success' | 'warning' | 'error' | 'neutral' | 'info'

const DEFAULT_ICON: Partial<Record<BadgeTone, IconName>> = {
  success: 'check',
  warning: 'warning',
  error: 'alert-circle',
}

export function Badge({ tone, icon, children }: { tone: BadgeTone; icon?: IconName; children: ReactNode }) {
  const name = icon ?? DEFAULT_ICON[tone]
  return (
    <span className={`badge ${tone}`}>
      {name && <Icon name={name} size={14} />}
      {children}
    </span>
  )
}
