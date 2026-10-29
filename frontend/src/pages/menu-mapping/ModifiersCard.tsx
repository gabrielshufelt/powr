// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { formatQty } from '../../mocks/helpers'
import type { Dish, InventoryItem, Modifier } from '../../mocks/types'

function ModifierEffect({ modifier, dish, items }: { modifier: Modifier; dish: Dish; items: InventoryItem[] }) {
  const name = (id: string | null) => items.find((i) => i.id === id)?.name ?? ''
  const amount = modifier.quantity !== null && modifier.unit ? formatQty(modifier.quantity, modifier.unit) : ''
  if (modifier.kind === 'add-on') {
    return <>Adds <strong className="num">{amount}</strong> {name(modifier.itemId)}</>
  }
  const replaced = dish.ingredients.find((i) => i.itemId === modifier.replacesItemId)
  return (
    <>
      Replaces <s className="secondary">{name(modifier.replacesItemId)}{replaced && ` ${formatQty(replaced.quantity, replaced.unit)}`}</s>
      {' '}with <strong className="num">{amount}</strong> {name(modifier.itemId)}
    </>
  )
}

export function ModifiersCard({ dish, items, readOnly, onEdit }: {
  dish: Dish
  items: InventoryItem[]
  readOnly: boolean
  onEdit: (modifier: Modifier) => void
}) {
  return (
    <section className="card">
      <h3>Modifiers &amp; substitutions</h3>
      <p className="caption card-intro">Synced from the POS. Applied on top of the base ingredients when ordered.</p>
      {dish.modifiers.length === 0 ? (
        <p className="list-empty">No modifiers for this dish in the POS.</p>
      ) : (
        <ul className="modifier-list">
          {dish.modifiers.map((m) => {
            const unmapped = m.itemId === null
            const kind = m.kind === 'add-on' ? 'Add-on' : 'Substitution'
            return (
              <li key={m.id} className={`modifier-row${unmapped ? ' unmapped' : ''}`}>
                <div className="modifier-name">
                  <div className="kicker">{unmapped && <Icon name="warning" size={14} />}{kind}{unmapped && ' · unmapped'}</div>
                  <div className="strong">{m.name}</div>
                </div>
                <div className="modifier-effect">
                  {unmapped
                    ? "New from the POS. Orders with this modifier won't count toward forecasts yet."
                    : <ModifierEffect modifier={m} dish={dish} items={items} />}
                </div>
                {unmapped
                  ? <Button size="sm" variant="primary" disabled={readOnly} onClick={() => onEdit(m)}>Map ingredients</Button>
                  : <Button size="sm" icon="pencil" disabled={readOnly} onClick={() => onEdit(m)}>Edit</Button>}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
