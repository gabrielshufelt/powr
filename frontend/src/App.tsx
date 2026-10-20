// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState, type ReactNode } from 'react'
import './styles/tokens.css'
import './styles/global.css'
import { Sidebar } from './layout/Sidebar'
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
    <div className="app">
      <Sidebar page={page} onNavigate={setPage} />
      <main className="content">{pages[page]}</main>
    </div>
  )
}

export default App
