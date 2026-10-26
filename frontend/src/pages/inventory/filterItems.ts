// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { isIncomplete } from '../../mocks/helpers'
import type { InventoryItem } from '../../mocks/types'
import { isLowStock } from './lowStock'

export type ItemSort = 'name' | 'stock' | 'lead' | 'counted'

export const SORT_OPTIONS: { value: ItemSort; label: string }[] = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'stock', label: 'Stock on hand' },
  { value: 'lead', label: 'Lead time' },
  { value: 'counted', label: 'Last counted' },
]

// Missing values sort last whichever direction the column runs.
const COMPARE: Record<ItemSort, (a: InventoryItem, b: InventoryItem) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  stock: (a, b) => b.stockOnHand - a.stockOnHand,
  lead: (a, b) => (a.leadTimeDays ?? Infinity) - (b.leadTimeDays ?? Infinity),
  counted: (a, b) => (b.lastCounted ?? '').localeCompare(a.lastCounted ?? ''),
}

export function filterItems(items: InventoryItem[], opts: {
  query: string
  vendorId: string
  sort: ItemSort
  incompleteOnly: boolean
  lowStockOnly?: boolean
}): InventoryItem[] {
  const q = opts.query.trim().toLowerCase()
  return items
    .filter((i) => i.name.toLowerCase().includes(q))
    .filter((i) => opts.vendorId === 'all' || i.vendorId === opts.vendorId)
    .filter((i) => !opts.incompleteOnly || isIncomplete(i))
    .filter((i) => !opts.lowStockOnly || isLowStock(i))
    .sort(COMPARE[opts.sort])
}
