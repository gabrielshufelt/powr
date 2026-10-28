// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'sm'
  icon?: IconName
}

export function Button({ variant = 'secondary', size = 'md', icon, className, children, ...rest }: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className].filter(Boolean).join(' ')
  return (
    <button type="button" className={classes} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: IconName
  label: string
  variant?: 'ghost' | 'secondary'
  size?: 'md' | 'sm'
}

// Square button with only an icon; the label becomes its accessible name and tooltip.
export function IconButton({ icon, label, variant = 'ghost', size = 'md', className, ...rest }: IconButtonProps) {
  const classes = ['btn', 'btn-icon', `btn-${variant}`, size === 'sm' && 'btn-sm', className].filter(Boolean).join(' ')
  return (
    <button type="button" className={classes} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={20} />
    </button>
  )
}
