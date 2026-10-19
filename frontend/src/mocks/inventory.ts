// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { InventoryItem, StockUnit, Vendor } from './types'

const HOUR = 3_600_000
const DAY = 24 * HOUR

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString()
}

export const VENDORS: Vendor[] = [
  { id: 'v-costco', name: 'Costco', phone: '(561) 555-0142', email: 'orders@costco.example', location: 'Boca Raton, FL', orderByDay: 'Monday', notes: '' },
  { id: 'v-iga', name: 'IGA', phone: '(561) 555-0175', email: 'sales@iga.example', location: 'Delray Beach, FL', orderByDay: 'Wednesday', notes: 'Weekly delivery.' },
  { id: 'v-provigo', name: 'Provigo', phone: '(561) 555-0198', email: 'hello@provigo.example', location: 'Boca Raton, FL', orderByDay: 'Friday', notes: 'Delivers daily except Sunday.' },
  { id: 'v-maxi', name: 'Maxi', phone: '(561) 555-0110', email: 'orders@maxi.example', location: 'Deerfield Beach, FL', orderByDay: 'Tuesday', notes: '' },
]

type Row = [id: string, name: string, unit: StockUnit, stock: number, counted: number | null,
  vendorId: string | null, packName: string | null, packSize: number | null, packPrice: number | null,
  orderMin: number | null, lead: number | null, active?: boolean]

const ROWS: Row[] = [
  ['i-potato', 'Golden potato', 'kg', 42, 2 * HOUR, 'v-costco', 'case', 20, 88, 2, 2],
  ['i-sweet-potato', 'Sweet potato', 'kg', 12, 2 * HOUR, 'v-costco', 'case', 10, 24, 1, 2],
  ['i-oil', 'Frying oil', 'L', 36, DAY, 'v-iga', 'jug', 16, 40, 2, 5],
  ['i-salt', 'Sea salt', 'kg', 9, 3 * DAY, 'v-maxi', 'bag', 10, 12, 1, 5],
  ['i-cheese-powder', 'Cheese powder', 'kg', 3, 2 * HOUR, 'v-costco', 'tub', 2, 30, 1, 2],
  ['i-beef', 'Ground beef', 'kg', 18, 2 * HOUR, 'v-provigo', 'tray', 5, 56, 2, 1],
  ['i-cheddar', 'Cheddar', 'kg', 6.5, 2 * HOUR, 'v-provigo', 'block', 2.5, 27.5, 4, 3],
  ['i-buns', 'Burger buns', 'each', 96, DAY, null, 'bag', 12, null, null, null],
  ['i-truffle', 'Truffle oil', 'L', 0, null, null, null, null, null, null, null],
  ['i-pickles', 'Pickles', 'kg', 4, 14 * DAY, 'v-maxi', 'pail', 4, 12.4, 1, 5, false],
  ['i-lettuce', 'Romaine lettuce', 'kg', 5, 2 * HOUR, 'v-iga', 'case', 5, 15, 1, 2],
  ['i-tomato', 'Tomatoes', 'kg', 8, 2 * HOUR, 'v-iga', 'case', 10, 22, 1, 2],
  ['i-onion', 'Yellow onion', 'kg', 15, DAY, 'v-iga', 'bag', 10, 9, 1, 2],
  ['i-chicken', 'Chicken thigh', 'kg', 14, 2 * HOUR, 'v-provigo', 'case', 10, 79, 1, 1],
  ['i-tortilla', 'Flour tortillas', 'each', 60, DAY, 'v-costco', 'pack', 12, 6, 2, 2],
  ['i-curds', 'Cheese curds', 'kg', 4, DAY, 'v-provigo', 'bag', 2, 21, 2, 3],
  ['i-gravy', 'Gravy base', 'L', 6, 3 * DAY, 'v-maxi', 'tub', 4, 18, 1, 5],
  ['i-flour', 'Flour', 'kg', 20, 3 * DAY, 'v-maxi', 'bag', 20, 16, 1, 5],
  ['i-dressing', 'Caesar dressing', 'L', 3, DAY, 'v-costco', 'jug', 4, 26, 1, 2],
]

export const INVENTORY: InventoryItem[] = ROWS.map(
  ([id, name, stockUnit, stockOnHand, counted, vendorId, packName, packSize, packPrice, orderMinPacks, leadTimeDays, active = true]) => ({
    id, name, stockUnit, stockOnHand, lastCounted: counted === null ? null : ago(counted),
    vendorId, packName, packSize, packPrice, orderMinPacks, leadTimeDays, active,
  }),
)
