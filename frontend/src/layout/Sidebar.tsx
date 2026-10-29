// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { NAV, type PageId } from './navigation'

export function Sidebar({ page, onNavigate }: { page: PageId; onNavigate: (page: PageId) => void }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <div className="wordmark">POWR</div>
      {NAV.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${item.id === page ? 'active' : ''}`}
          aria-current={item.id === page ? 'page' : undefined}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
