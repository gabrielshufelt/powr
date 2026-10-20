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
import { MockDataProvider } from './mocks/MockDataProvider'
import type { PageId } from './layout/navigation'
import { Home } from './pages/Home'
import { RecommendedOrders } from './pages/RecommendedOrders'
import { Forecast } from './pages/Forecast'
import { MenuMapping } from './pages/MenuMapping'
import { Inventory } from './pages/Inventory'
import { Settings } from './pages/Settings'

function App() {
  const [page, setPage] = useState<PageId>('home')

  const pages: Record<PageId, ReactNode> = {
    home: <Home onNavigate={setPage} />,
    orders: <RecommendedOrders />,
    forecast: <Forecast />,
    menu: <MenuMapping />,
    inventory: <Inventory />,
    settings: <Settings />,
  }

  return (
    <MockDataProvider>
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
    </MockDataProvider>
    <div className="app">
      <Sidebar page={page} onNavigate={setPage} />
      <main className="content">{pages[page]}</main>
    </div>
  )
}

export default App
