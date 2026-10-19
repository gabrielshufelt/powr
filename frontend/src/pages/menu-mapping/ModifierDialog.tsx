// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { Button } from '../../components/Button'
import { Dialog } from '../../components/Dialog'
import { NumberField, Select } from '../../components/fields'
import { unitsFor } from '../../mocks/helpers'
import type { Dish, InventoryItem, Modifier, Unit } from '../../mocks/types'

// Applies to the dish draft; the page's Save mapping commits it.
export function ModifierDialog({ modifier, dish, items, onApply, onClose }: {
  modifier: Modifier
  dish: Dish
  items: InventoryItem[]
  onApply: (modifier: Modifier) => void
  onClose: () => void
}) {
  const [itemId, setItemId] = useState(modifier.itemId ?? '')
  const [replacesItemId, setReplacesItemId] = useState(modifier.replacesItemId ?? dish.ingredients[0]?.itemId ?? '')
  const [qty, setQty] = useState(modifier.quantity === null ? '' : String(modifier.quantity))
  const [unit, setUnit] = useState<Unit>(modifier.unit ?? 'g')
  const item = items.find((i) => i.id === itemId)
  const isSwap = modifier.kind === 'substitution'

  const itemOptions = [{ value: '', label: 'Choose an inventory item' },
    ...items.filter((i) => i.active).map((i) => ({ value: i.id, label: i.name }))]
  const replaceOptions = dish.ingredients.map((ing) => ({
    value: ing.itemId,
    label: items.find((i) => i.id === ing.itemId)?.name ?? ing.itemId,
  }))

  function apply() {
    onApply({ ...modifier, itemId, quantity: Number(qty) || 0, unit, replacesItemId: isSwap ? replacesItemId : null })
  }

  return (
    <Dialog
      open
      width={520}
      title={`${modifier.itemId === null ? 'Map' : 'Edit'} “${modifier.name}”`}
      onClose={onClose}
      actions={<>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" disabled={!item || !qty} onClick={apply}>Apply</Button>
      </>}
    >
      <p className="caption">
        {isSwap ? 'When ordered, this swaps one base ingredient for another.' : 'When ordered, this adds an ingredient on top of the base recipe.'}
      </p>
      {isSwap && <Select label="Replaces" value={replacesItemId} options={replaceOptions} onChange={setReplacesItemId} />}
      <Select
        label={isSwap ? 'With' : 'Inventory item'}
        value={itemId}
        options={itemOptions}
        onChange={(id) => {
          setItemId(id)
          const next = items.find((i) => i.id === id)
          if (next && !unitsFor(next.stockUnit).includes(unit)) setUnit(unitsFor(next.stockUnit)[0])
        }}
      />
      <div className="field-row">
        <NumberField className="grow" label="Quantity per order" placeholder="0" value={qty} onChange={setQty} />
        <Select
          className="w-100"
          label="Unit"
          value={unit}
          disabled={!item}
          options={(item ? unitsFor(item.stockUnit) : [unit]).map((u) => ({ value: u, label: u }))}
          onChange={(u) => setUnit(u as Unit)}
        />
      </div>
    </Dialog>
  )
}
