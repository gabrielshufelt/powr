// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { InventoryItem, StockUnit, Vendor } from './types'

// Names, packs and prices match the Home and Recommended Orders mockups; values those pages
// don't give (e.g. how Pita is bought) are realistic fill-ins.

const HOUR = 3_600_000
const DAY = 24 * HOUR

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString()
}

export const VENDORS: Vendor[] = [
  { id: 'v-costco', name: 'Costco', phone: '(561) 555-0142', email: 'orders@costco.example', location: 'Boca Raton, FL', orderByDay: 'Monday', notes: '$400 order minimum.' },
  { id: 'v-iga', name: 'IGA', phone: '(561) 555-0175', email: 'sales@iga.example', location: 'Delray Beach, FL', orderByDay: 'Tuesday', notes: '$350 order minimum.' },
  { id: 'v-maxi', name: 'Maxi', phone: '(561) 555-0110', email: 'orders@maxi.example', location: 'Deerfield Beach, FL', orderByDay: 'Tuesday', notes: 'No order minimum.' },
]

type Row = [id: string, name: string, unit: StockUnit, stock: number, counted: number | null,
  vendorId: string | null, packName: string | null, packSize: number | null, packPrice: number | null,
  orderMin: number | null, lead: number | null]

const ROWS: Row[] = [
  // From Recommended Orders
  ['i-chicken', 'Chicken thigh, boneless', 'kg', 8, 2 * HOUR, 'v-costco', 'case', 5, 27, 1, 2],
  ['i-lamb', 'Lamb leg', 'kg', 5, 2 * HOUR, 'v-costco', 'case', 5, 55, 1, 2],
  ['i-beef', 'Ground beef', 'kg', 6, 2 * HOUR, 'v-costco', 'case', 5, 40, 1, 2],
  ['i-feta', 'Feta, block', 'kg', 2, 2 * HOUR, 'v-iga', 'case', 4, 48, 1, 1],
  ['i-yogurt', 'Greek yogurt', 'kg', 6, 2 * HOUR, 'v-iga', 'tub', 5, 30, 1, 1],
  ['i-tomato', 'Tomatoes', 'kg', 8, DAY, 'v-maxi', 'box', 10, 25, 1, 1],
  ['i-cucumber', 'Cucumbers', 'kg', 4, DAY, 'v-maxi', 'box', 10, 18, 1, 1],
  // Named on Home; purchasing details filled in
  ['i-pita', 'Pita', 'each', 140, DAY, 'v-costco', 'pack', 24, 9, 2, 2],
  ['i-tzatziki', 'Tzatziki', 'kg', 3, DAY, 'v-iga', 'tub', 2, 14, 1, 1],
  ['i-onion', 'Red onion', 'kg', 9, 3 * DAY, 'v-maxi', 'bag', 10, 12, 1, 1],
  ['i-rice', 'Rice', 'kg', 18, 3 * DAY, 'v-costco', 'bag', 10, 16, 1, 2],
  ['i-eggs', 'Eggs', 'each', 60, 2 * HOUR, 'v-costco', 'case', 180, 54, 1, 2],
  // Left incomplete on purpose to show the Missing state
  ['i-grape-leaves', 'Grape leaves', 'kg', 1.5, 14 * DAY, null, 'jar', 1, null, null, null],
  ['i-lemon', 'Lemon', 'kg', 0, null, null, null, null, null, null, null],
]

export const INVENTORY: InventoryItem[] = ROWS.map(
  ([id, name, stockUnit, stockOnHand, counted, vendorId, packName, packSize, packPrice, orderMinPacks, leadTimeDays]) => ({
    id, name, stockUnit, stockOnHand, lastCounted: counted === null ? null : ago(counted),
    vendorId, packName, packSize, packPrice, orderMinPacks, leadTimeDays, active: true,
  }),
)
