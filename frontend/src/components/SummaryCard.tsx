// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

export function SummaryCard({ label, value, note, trend }: { label: string; value: string; note?: string; trend?: string }) {
  const isDown = trend?.startsWith('−')
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="big">{value}</div>
      {trend && <div className={isDown ? 'down' : 'up'}>{isDown ? '↓' : '↑'} {trend}</div>}
      {note && <div className="label">{note}</div>}
    </div>
  )
}
