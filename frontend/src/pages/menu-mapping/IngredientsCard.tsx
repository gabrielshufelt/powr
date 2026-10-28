// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { Badge } from '../../components/Badge'
import { Button, IconButton } from '../../components/Button'
import { NumberField, Select } from '../../components/fields'
import {
  dishCost, dishStatus, formatMoney, formatVendorPack, ingredientCost, plural, unitsFor,
} from '../../mocks/helpers'
import type { Dish, DishIngredient, InventoryItem, Unit, Vendor } from '../../mocks/types'
import { StatusBadge } from './DishList'

type Props = {
  dish: Dish
  items: InventoryItem[]
  vendors: Vendor[]
  readOnly: boolean
  onChange: (dish: Dish) => void
}

const unitOptions = (item: InventoryItem) => unitsFor(item.stockUnit).map((u) => ({ value: u, label: u }))

// Keeps the typed text (e.g. "1.") while the draft holds the parsed number.
function QuantityInput({ label, quantity, disabled, onChange }: {
  label: string
  quantity: number
  disabled: boolean
  onChange: (n: number) => void
}) {
  const [text, setText] = useState(String(quantity))
  const [prev, setPrev] = useState(quantity)
  if (quantity !== prev) {
    setPrev(quantity)
    if (Number(text) !== quantity) setText(String(quantity))
  }
  return (
    <NumberField
      label={label}
      hideLabel
      compact
      value={text}
      disabled={disabled}
      onChange={(v) => {
        setText(v)
        onChange(Number(v) || 0)
      }}
    />
  )
}

function AddIngredientBar({ dish, items, disabled, onAdd }: {
  dish: Dish
  items: InventoryItem[]
  disabled: boolean
  onAdd: (ingredient: DishIngredient) => void
}) {
  const [itemId, setItemId] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState<Unit>('g')
  const available = items.filter((i) => i.active && !dish.ingredients.some((ing) => ing.itemId === i.id))
  const item = items.find((i) => i.id === itemId)

  function add() {
    if (!item) return
    onAdd({ itemId: item.id, quantity: Number(qty) || 0, unit })
    setItemId('')
    setQty('')
  }

  return (
    <div className="add-bar">
      <Select
        className="grow"
        label="Add ingredient"
        value={itemId}
        disabled={disabled}
        options={[{ value: '', label: 'Choose an inventory item' }, ...available.map((i) => ({ value: i.id, label: i.name }))]}
        onChange={(id) => {
          setItemId(id)
          const next = items.find((i) => i.id === id)
          if (next) setUnit(unitsFor(next.stockUnit)[0])
        }}
      />
      <NumberField className="w-120" label="Quantity" placeholder="0" value={qty} disabled={disabled} onChange={setQty} />
      <Select
        className="w-100"
        label="Unit"
        value={unit}
        disabled={disabled || !item}
        options={item ? unitOptions(item) : [{ value: unit, label: unit }]}
        onChange={(u) => setUnit(u as Unit)}
      />
      <Button icon="plus" disabled={disabled || !item || !qty} onClick={add}>Add</Button>
    </div>
  )
}

export function IngredientsCard({ dish, items, vendors, readOnly, onChange }: Props) {
  const status = dishStatus(dish)
  const cost = dishCost(dish, items)

  function update(index: number, patch: Partial<DishIngredient>) {
    onChange({ ...dish, ingredients: dish.ingredients.map((ing, i) => (i === index ? { ...ing, ...patch } : ing)) })
  }

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <div className="caption">{dish.category} · from POS</div>
          <h2>{dish.name}</h2>
        </div>
        {status === 'mapped'
          ? <Badge tone="success">Mapped · {plural(dish.ingredients.length, 'ingredient')}</Badge>
          : <StatusBadge status={status} />}
      </div>

      <h3 className="section-title">Ingredients per one order</h3>
      {dish.ingredients.length === 0 ? (
        <p className="list-empty">No ingredients yet. Add the first one below so the forecast can count this dish.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Inventory item</th>
                <th className="w-120">Quantity</th>
                <th className="w-100">Unit</th>
                <th>Vendor · Pack</th>
                <th className="num w-100">Est. cost</th>
                <th className="w-44"><span className="visually-hidden">Remove</span></th>
              </tr>
            </thead>
            <tbody>
              {dish.ingredients.map((ing, index) => {
                const item = items.find((i) => i.id === ing.itemId)
                if (!item) return null
                const vendorPack = formatVendorPack(item, vendors.find((v) => v.id === item.vendorId))
                const lineCost = ingredientCost(item, ing)
                return (
                  <tr key={ing.itemId}>
                    <td className="strong nowrap">{item.name}</td>
                    <td>
                      <QuantityInput label={`Quantity of ${item.name}`} quantity={ing.quantity} disabled={readOnly}
                        onChange={(quantity) => update(index, { quantity })} />
                    </td>
                    <td>
                      <Select label={`Unit for ${item.name}`} hideLabel compact value={ing.unit} disabled={readOnly}
                        options={unitOptions(item)} onChange={(u) => update(index, { unit: u as Unit })} />
                    </td>
                    <td className={`nowrap ${vendorPack ? 'secondary' : 'missing'}`}>{vendorPack ?? 'Missing'}</td>
                    <td className="num">{lineCost === null ? '—' : formatMoney(lineCost)}</td>
                    <td>
                      <IconButton icon="bin" label={`Remove ${item.name}`} size="sm" disabled={readOnly}
                        onClick={() => onChange({ ...dish, ingredients: dish.ingredients.filter((_, i) => i !== index) })} />
                    </td>
                  </tr>
                )
              })}
              <tr className="total-row">
                <td colSpan={4}>
                  Estimated cost per order
                  {cost.missingPrice && <span className="caption"> · excludes items without a price</span>}
                </td>
                <td className="num">{formatMoney(cost.total)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <AddIngredientBar dish={dish} items={items} disabled={readOnly}
        onAdd={(ingredient) => onChange({ ...dish, ingredients: [...dish.ingredients, ingredient] })} />
    </section>
  )
}
