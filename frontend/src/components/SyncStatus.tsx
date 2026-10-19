// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { Button } from './Button'
import { Icon } from './Icon'

export function SyncStatus({ text, onSync }: { text: string; onSync: () => void }) {
  return (
    <div className="sync-status">
      <span className="sync-text"><Icon name="check" />{text}</span>
      <Button size="sm" icon="refresh" onClick={onSync}>Sync now</Button>
    </div>
  )
}
