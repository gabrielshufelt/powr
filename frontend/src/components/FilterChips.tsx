// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { Icon } from './Icon'

type ChipOption<T extends string> = { value: T; label: string; count?: number }

// Single-select filter pills; the selected one gets a check so state never relies on colour.
export function FilterChips<T extends string>({ label, options, value, onChange }: {
  label: string
  options: ChipOption<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((option) => {
        const on = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            className={`chip${on ? ' on' : ''}`}
            aria-pressed={on}
            onClick={() => onChange(option.value)}
          >
            {on && <Icon name="check" size={14} />}
            {option.label}
            {option.count !== undefined && <span className="chip-count">{option.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
