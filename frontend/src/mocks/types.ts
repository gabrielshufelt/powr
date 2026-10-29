// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

// Shapes of the mockup's fake data, kept close to what the API will return later.

export type StockUnit = 'kg' | 'L' | 'each'
export type Unit = 'g' | 'kg' | 'ml' | 'L' | 'each'
export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface Vendor {
  id: string
  name: string
  phone: string
  email: string
  location: string
  orderByDay: Weekday | null
  notes: string
}

export interface InventoryItem {
  id: string
  name: string
  stockUnit: StockUnit
  stockOnHand: number
  lastCounted: string | null // ISO timestamp
  vendorId: string | null
  packName: string | null
  packSize: number | null // in stockUnit
  packPrice: number | null
  orderMinPacks: number | null
  leadTimeDays: number | null
  active: boolean
}

export interface DishIngredient {
  itemId: string
  quantity: number
  unit: Unit
}

// itemId null means the modifier came from the POS but has not been mapped yet.
export interface Modifier {
  id: string
  kind: 'add-on' | 'substitution'
  name: string
  itemId: string | null
  quantity: number | null
  unit: Unit | null
  replacesItemId: string | null
}

export interface Dish {
  id: string
  name: string
  category: string
  removedFromPos: boolean
  ingredients: DishIngredient[]
  modifiers: Modifier[]
}

export type DishStatus = 'mapped' | 'unmapped' | 'inactive'
