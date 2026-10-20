// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { dishStatus } from '../../mocks/helpers'
import type { Dish } from '../../mocks/types'

export type DishFilter = 'all' | 'mapped' | 'unmapped'

export function filterDishes(dishes: Dish[], query: string, filter: DishFilter): Dish[] {
  const q = query.trim().toLowerCase()
  return dishes.filter((d) => (filter === 'all' || dishStatus(d) === filter) && d.name.toLowerCase().includes(q))
}

// Inactive dishes count toward "All" only.
export function countDishes(dishes: Dish[]): Record<DishFilter, number> {
  const statuses = dishes.map(dishStatus)
  return {
    all: dishes.length,
    mapped: statuses.filter((s) => s === 'mapped').length,
    unmapped: statuses.filter((s) => s === 'unmapped').length,
  }
}
