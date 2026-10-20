// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { Dish, DishIngredient, Modifier, Unit } from './types'

// The dishes on the Home mockup, with their main ingredients; quantities are realistic fill-ins.

function ing(itemId: string, quantity: number, unit: Unit): DishIngredient {
  return { itemId, quantity, unit }
}

function addOn(id: string, name: string, itemId: string | null, quantity: number | null, unit: Unit | null): Modifier {
  return { id, kind: 'add-on', name, itemId, quantity, unit, replacesItemId: null }
}

function swap(id: string, name: string, replacesItemId: string, itemId: string, quantity: number, unit: Unit): Modifier {
  return { id, kind: 'substitution', name, itemId, quantity, unit, replacesItemId }
}

export const DISHES: Dish[] = [
  {
    id: 'd-souvlaki', name: 'Chicken Souvlaki Plate', category: 'Mains', removedFromPos: false,
    ingredients: [ing('i-chicken', 200, 'g'), ing('i-pita', 1, 'each'), ing('i-tzatziki', 60, 'g')],
    modifiers: [
      addOn('m-souvlaki-tzatziki', 'Extra tzatziki', 'i-tzatziki', 40, 'g'),
      swap('m-souvlaki-rice', 'Rice instead of pita', 'i-pita', 'i-rice', 150, 'g'),
      addOn('m-souvlaki-lemon', 'Lemon wedges', null, null, null),
    ],
  },
  {
    id: 'd-gyro', name: 'Doner Gyro Pita', category: 'Mains', removedFromPos: false,
    ingredients: [ing('i-lamb', 150, 'g'), ing('i-pita', 1, 'each'), ing('i-onion', 20, 'g')],
    modifiers: [
      addOn('m-gyro-feta', 'Add feta', 'i-feta', 30, 'g'),
      swap('m-gyro-chicken', 'Chicken instead of lamb', 'i-lamb', 'i-chicken', 150, 'g'),
    ],
  },
  {
    id: 'd-horiatiki', name: 'Horiatiki Salad', category: 'Salads', removedFromPos: false,
    ingredients: [ing('i-tomato', 150, 'g'), ing('i-cucumber', 100, 'g'), ing('i-feta', 60, 'g')],
    modifiers: [addOn('m-horiatiki-chicken', 'Add grilled chicken', 'i-chicken', 120, 'g')],
  },
  {
    id: 'd-dolmades', name: 'Dolmades', category: 'Starters', removedFromPos: false,
    ingredients: [ing('i-grape-leaves', 40, 'g'), ing('i-rice', 60, 'g'), ing('i-lemon', 15, 'g')],
    modifiers: [addOn('m-dolmades-yogurt', 'Yogurt dip', 'i-yogurt', 50, 'g')],
  },
]
