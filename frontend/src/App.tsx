// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState, type ReactNode } from 'react'
import './styles/tokens.css'
import './styles/global.css'
import { Sidebar } from './layout/Sidebar'
import { PageHeader } from './layout/PageHeader'
import { NAV, type PageId, type PageState } from './layout/navigation'
import { StateMessage } from './components/StateMessage'
import { ToastProvider } from './components/Toast'
import { Home } from './pages/Home'
import { RecommendedOrders } from './pages/RecommendedOrders'
import { Forecast } from './pages/Forecast'
import { MenuMapping } from './pages/MenuMapping'
import { Inventory } from './pages/Inventory'
import { Settings } from './pages/Settings'

// Text shown on each page when the demo switch is set to "Empty".
const EMPTY_TEXT: Record<PageId, string> = {
  home: 'Not enough sales data yet. POWR needs about 4 weeks of POS history to show results.',
  orders: 'No recommended orders yet. Check back after your next POS sync.',
  forecast: 'No forecast yet. Map at least one menu item to start forecasting.',
  menu: 'No menu items imported yet. Connect your POS in Settings.',
  inventory: 'No ingredients yet. Add your first ingredient to get started.',
  settings: '',
}

function App() {
  const [page, setPage] = useState<PageId>('home')
  const [state, setState] = useState<PageState>('ready')

  const pages: Record<PageId, ReactNode> = {
    home: <Home />,
    orders: <RecommendedOrders />,
    forecast: <Forecast />,
    menu: <MenuMapping />,
    inventory: <Inventory />,
    settings: <Settings />,
  }
  const title = NAV.find((item) => item.id === page)?.label ?? ''
  const showPage = state === 'ready' || page === 'settings'

  return (
    <ToastProvider>
    <div className="app">
      <Sidebar page={page} onNavigate={setPage} />
      <main className="content">
        {showPage ? pages[page] : (
          <>
            <PageHeader title={title} />
            <StateMessage state={state} emptyText={EMPTY_TEXT[page]} />
          </>
        )}
      </main>

      <div className="demo">
        Demo state:
        <select value={state} onChange={(e) => setState(e.target.value as PageState)} aria-label="Demo state">
          <option value="ready">Ready</option>
          <option value="empty">Empty</option>
          <option value="loading">Loading</option>
          <option value="error">Error</option>
        </select>
      </div>
    </div>
    </ToastProvider>
  )
}

export default App
