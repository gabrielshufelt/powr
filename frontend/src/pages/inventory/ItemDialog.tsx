// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { Button } from '../../components/Button'
import { Dialog } from '../../components/Dialog'
import { NumberField, Select, TextField } from '../../components/fields'
import { isIncomplete } from '../../mocks/helpers'
import type { InventoryItem, Vendor } from '../../mocks/types'

const text = (n: number | null) => (n === null ? '' : String(n))
const num = (s: string) => (s.trim() === '' || Number.isNaN(Number(s)) ? null : Number(s))

export function ItemDialog({ item, vendors, onSave, onClose }: {
  item: InventoryItem
  vendors: Vendor[]
  onSave: (item: InventoryItem) => void
  onClose: () => void
}) {
  const [stock, setStock] = useState(String(item.stockOnHand))
  const [vendorId, setVendorId] = useState(item.vendorId ?? '')
  const [packName, setPackName] = useState(item.packName ?? '')
  const [packSize, setPackSize] = useState(text(item.packSize))
  const [packPrice, setPackPrice] = useState(text(item.packPrice))
  const [orderMin, setOrderMin] = useState(text(item.orderMinPacks))
  const [leadTime, setLeadTime] = useState(text(item.leadTimeDays))
  const [active, setActive] = useState(item.active)

  function save() {
    const stockOnHand = num(stock) ?? item.stockOnHand
    onSave({
      ...item,
      stockOnHand,
      lastCounted: stockOnHand !== item.stockOnHand ? new Date().toISOString() : item.lastCounted,
      vendorId: vendorId || null,
      packName: packName.trim() || null,
      packSize: num(packSize),
      packPrice: num(packPrice),
      orderMinPacks: num(orderMin),
      leadTimeDays: num(leadTime),
      active,
    })
  }

  const packs = `${packName.trim() || 'pack'}s`
  return (
    <Dialog
      open
      width={560}
      title={`${isIncomplete(item) ? 'Complete' : 'Edit'} ${item.name}`}
      onClose={onClose}
      actions={<>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={save}>Save item</Button>
      </>}
    >
      <NumberField label="Stock on hand" unit={item.stockUnit} value={stock} onChange={setStock}
        help="Use this to correct a physical count. POWR will update it from sales later." />
      <Select
        label="Vendor"
        value={vendorId}
        options={[{ value: '', label: 'Choose a vendor' }, ...vendors.map((v) => ({ value: v.id, label: v.name }))]}
        onChange={setVendorId}
      />
      <div className="field-row">
        <TextField className="grow" label="Pack name" placeholder="e.g. case" value={packName} onChange={setPackName} />
        <NumberField className="grow" label="Pack size" unit={item.stockUnit} placeholder="0" value={packSize} onChange={setPackSize} />
      </div>
      <div className="field-row">
        <NumberField className="grow" label="Price per pack" unit="USD" placeholder="0.00" value={packPrice} onChange={setPackPrice} />
        <NumberField className="grow" label="Order minimum" unit={packs} placeholder="0" value={orderMin} onChange={setOrderMin} />
      </div>
      <NumberField label="Lead time" unit="days" placeholder="0" value={leadTime} onChange={setLeadTime}
        help="Days from placing an order to delivery." />
      <label className="checkbox">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active: include this item in forecasts and orders
      </label>
    </Dialog>
  )
}
