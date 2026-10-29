// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { INVENTORY, VENDORS } from './inventory'
import { DISHES } from './menu'
import type { Dish, InventoryItem, Vendor } from './types'

// Fake data shared by the mockup pages. This is where API calls will replace local state later.
type MockData = {
  vendors: Vendor[]
  items: InventoryItem[]
  dishes: Dish[]
  lastSync: Date
  saveItem: (item: InventoryItem) => void
  saveVendor: (vendor: Vendor) => void
  saveDish: (dish: Dish) => void
  syncNow: () => void
}

const MockDataContext = createContext<MockData | null>(null)

function upsert<T extends { id: string }>(list: T[], next: T): T[] {
  return list.some((x) => x.id === next.id) ? list.map((x) => (x.id === next.id ? next : x)) : [...list, next]
}

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState(VENDORS)
  const [items, setItems] = useState(INVENTORY)
  const [dishes, setDishes] = useState(DISHES)
  const [lastSync, setLastSync] = useState(() => {
    const d = new Date()
    d.setHours(9, 42, 0, 0)
    return d
  })

  const value = useMemo<MockData>(() => ({
    vendors,
    items,
    dishes,
    lastSync,
    saveItem: (item) => setItems((all) => upsert(all, item)),
    saveVendor: (vendor) => setVendors((all) => upsert(all, vendor)),
    saveDish: (dish) => setDishes((all) => upsert(all, dish)),
    syncNow: () => setLastSync(new Date()),
  }), [vendors, items, dishes, lastSync])

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMockData(): MockData {
  const data = useContext(MockDataContext)
  if (!data) throw new Error('useMockData must be used inside MockDataProvider')
  return data
}
