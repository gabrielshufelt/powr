// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange?: (option: string) => void }) {
  return (
    <div className="segmented" role="group">
      {options.map((option) => (
        <button
          key={option}
          className={option === value ? 'on' : ''}
          aria-pressed={option === value}
          onClick={() => onChange?.(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
