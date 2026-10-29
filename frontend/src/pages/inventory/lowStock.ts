// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { InventoryItem } from '../../mocks/types'

export type StockLevel = 'out' | 'low' | 'ok'

// Reorder point per item, in its stock unit: enough to last until the next delivery.
// Mock values for now; the forecast will provide these later. Items not listed only warn at zero.
const REORDER_POINT: Record<string, number> = {
  'i-feta': 5,
  'i-eggs': 216,
  'i-chicken': 6,
  'i-lamb': 2,
  'i-beef': 3,
  'i-yogurt': 3,
  'i-tomato': 4,
  'i-cucumber': 2,
}

export function stockLevel(item: InventoryItem): StockLevel {
  if (!item.active) return 'ok'
  if (item.stockOnHand <= 0) return 'out'
  const reorderPoint = REORDER_POINT[item.id]
  if (reorderPoint !== undefined && item.stockOnHand < reorderPoint) return 'low'
  return 'ok'
}

export function isLowStock(item: InventoryItem): boolean {
  return stockLevel(item) !== 'ok'
}
