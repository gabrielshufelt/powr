// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import type { Dish, DishIngredient, Modifier, Unit } from './types'

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
    id: 'd-fries', name: 'Classic Fries', category: 'Sides', removedFromPos: false,
    ingredients: [ing('i-potato', 200, 'g'), ing('i-oil', 30, 'ml'), ing('i-salt', 2, 'g')],
    modifiers: [
      addOn('m-fries-cheese', 'Cheese powder', 'i-cheese-powder', 30, 'g'),
      swap('m-fries-sweet', 'Sweet potato fries', 'i-potato', 'i-sweet-potato', 200, 'g'),
      addOn('m-fries-truffle', 'Truffle oil drizzle', null, null, null),
    ],
  },
  {
    id: 'd-burger', name: 'Cheeseburger', category: 'Mains', removedFromPos: false,
    ingredients: [ing('i-beef', 150, 'g'), ing('i-buns', 1, 'each'), ing('i-cheddar', 40, 'g'),
      ing('i-lettuce', 20, 'g'), ing('i-tomato', 30, 'g'), ing('i-onion', 15, 'g')],
    modifiers: [
      addOn('m-burger-cheese', 'Extra cheese', 'i-cheddar', 30, 'g'),
      addOn('m-burger-patty', 'Double patty', 'i-beef', 150, 'g'),
      addOn('m-burger-pickles', 'Add pickles', 'i-pickles', 20, 'g'),
      swap('m-burger-wrap', 'Lettuce wrap', 'i-buns', 'i-lettuce', 60, 'g'),
    ],
  },
  {
    id: 'd-poutine', name: 'Poutine', category: 'Mains', removedFromPos: false,
    ingredients: [ing('i-potato', 250, 'g'), ing('i-oil', 35, 'ml'), ing('i-curds', 80, 'g'), ing('i-gravy', 120, 'ml')],
    modifiers: [],
  },
  {
    id: 'd-salad', name: 'Garden Salad', category: 'Sides', removedFromPos: false,
    ingredients: [ing('i-lettuce', 120, 'g'), ing('i-tomato', 60, 'g'), ing('i-onion', 20, 'g'),
      ing('i-dressing', 30, 'ml'), ing('i-salt', 1, 'g')],
    modifiers: [
      addOn('m-salad-chicken', 'Add chicken', 'i-chicken', 100, 'g'),
      addOn('m-salad-dressing', 'Extra dressing', 'i-dressing', 30, 'ml'),
    ],
  },
  { id: 'd-wrap', name: 'Chicken Wrap', category: 'Mains', removedFromPos: false, ingredients: [], modifiers: [] },
  {
    id: 'd-rings', name: 'Onion Rings', category: 'Sides', removedFromPos: false,
    ingredients: [ing('i-onion', 150, 'g'), ing('i-flour', 40, 'g'), ing('i-oil', 40, 'ml')],
    modifiers: [],
  },
  { id: 'd-soup', name: 'Seasonal Soup', category: 'Starters', removedFromPos: false, ingredients: [], modifiers: [] },
  { id: 'd-tea', name: 'Iced Tea', category: 'Drinks', removedFromPos: false, ingredients: [], modifiers: [] },
  {
    id: 'd-tacos', name: 'Fish Tacos', category: 'Mains', removedFromPos: true,
    ingredients: [ing('i-tortilla', 3, 'each'), ing('i-lettuce', 30, 'g')],
    modifiers: [],
  },
]
