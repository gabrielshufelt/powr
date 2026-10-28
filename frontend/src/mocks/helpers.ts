// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { Dish, DishIngredient, DishStatus, InventoryItem, StockUnit, Unit, Vendor } from './types'

const UNITS: Record<StockUnit, Unit[]> = { kg: ['g', 'kg'], L: ['ml', 'L'], each: ['each'] }

// Recipe units that can be converted to the item's stock unit.
export function unitsFor(stockUnit: StockUnit): Unit[] {
  return UNITS[stockUnit]
}

export function toStockUnits(quantity: number, unit: Unit): number {
  return unit === 'g' || unit === 'ml' ? quantity / 1000 : quantity
}

export function pricePerStockUnit(item: InventoryItem): number | null {
  if (item.packPrice === null || !item.packSize) return null
  return item.packPrice / item.packSize
}

export function ingredientCost(item: InventoryItem, ingredient: DishIngredient): number | null {
  const price = pricePerStockUnit(item)
  return price === null ? null : price * toStockUnits(ingredient.quantity, ingredient.unit)
}

export function dishCost(dish: Dish, items: InventoryItem[]): { total: number; missingPrice: boolean } {
  let total = 0
  let missingPrice = false
  for (const ingredient of dish.ingredients) {
    const item = items.find((i) => i.id === ingredient.itemId)
    const cost = item ? ingredientCost(item, ingredient) : null
    if (cost === null) missingPrice = true
    else total += cost
  }
  return { total, missingPrice }
}

export function dishStatus(dish: Dish): DishStatus {
  if (dish.removedFromPos) return 'inactive'
  return dish.ingredients.length > 0 ? 'mapped' : 'unmapped'
}

// Without these the forecast can't recommend an order for the item.
export function isIncomplete(item: InventoryItem): boolean {
  return [item.vendorId, item.packSize, item.packPrice, item.orderMinPacks, item.leadTimeDays].some((v) => v === null)
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Tiny per-order costs (a pinch of salt) read better as "< $0.01" than "$0.00".
export function formatMoney(n: number): string {
  return n > 0 && n < 0.005 ? `< ${money.format(0.01)}` : money.format(n)
}

export function formatQty(n: number, unit: string): string {
  return `${Number(n.toFixed(2))} ${unit}`
}

export function formatPack(item: InventoryItem): string | null {
  if (!item.packName || item.packSize === null) return null
  return `1 ${item.packName} = ${formatQty(item.packSize, item.stockUnit)}`
}

export function formatPricePerUnit(item: InventoryItem): string | null {
  const price = pricePerStockUnit(item)
  return price === null ? null : `${formatMoney(price)} / ${item.stockUnit}`
}

export function formatVendorPack(item: InventoryItem, vendor: Vendor | undefined): string | null {
  if (!vendor || item.packPrice === null || item.packSize === null) return null
  return `${vendor.name} · ${formatMoney(item.packPrice)} / ${formatQty(item.packSize, item.stockUnit)}`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const DAY = 86_400_000

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function formatLastCounted(iso: string | null, now: Date): string {
  if (!iso) return 'Never'
  const date = new Date(iso)
  if (now.getTime() - date.getTime() < 60_000) return 'Just now'
  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY)
  if (days === 0) return `Today, ${formatTime(date)}`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

let counter = 0

export function newId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}
