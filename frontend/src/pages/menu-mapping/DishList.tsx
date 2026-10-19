// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { Badge } from '../../components/Badge'
import { dishStatus, plural } from '../../mocks/helpers'
import type { Dish, DishStatus } from '../../mocks/types'

function describe(dish: Dish): string {
  if (dish.removedFromPos) return `${dish.category} · removed from POS`
  if (dish.ingredients.length === 0) return `${dish.category} · no ingredients yet`
  const parts = [dish.category, plural(dish.ingredients.length, 'ingredient')]
  if (dish.modifiers.length > 0) parts.push(plural(dish.modifiers.length, 'modifier'))
  return parts.join(' · ')
}

export function StatusBadge({ status }: { status: DishStatus }) {
  if (status === 'mapped') return <Badge tone="success">Mapped</Badge>
  if (status === 'unmapped') return <Badge tone="warning">Unmapped</Badge>
  return <Badge tone="neutral">Inactive</Badge>
}

export function DishList({ dishes, selectedId, onSelect }: {
  dishes: Dish[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  if (dishes.length === 0) return <p className="list-empty">No menu items match your filters.</p>
  return (
    <ul className="dish-list">
      {dishes.map((dish) => {
        const status = dishStatus(dish)
        const on = dish.id === selectedId
        return (
          <li key={dish.id}>
            <button
              type="button"
              className={`dish-row${on ? ' on' : ''}${status === 'inactive' ? ' muted' : ''}`}
              aria-current={on ? 'true' : undefined}
              onClick={() => onSelect(dish.id)}
            >
              <span className="dish-text">
                <span className="dish-name">{dish.name}</span>
                <span className="caption">{describe(dish)}</span>
              </span>
              <StatusBadge status={status} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
