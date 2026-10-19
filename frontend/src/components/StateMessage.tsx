// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { PageState } from '../layout/navigation'

export function StateMessage({ state, emptyText }: { state: PageState; emptyText: string }) {
  if (state === 'loading') return <div className="page-state">Loading…</div>
  if (state === 'error') {
    return <div className="page-state error">Something went wrong while loading this page. Please try again.</div>
  }
  return <div className="page-state card">{emptyText}</div>
}
