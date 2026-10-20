// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { Badge } from '../../components/Badge'
import { Button } from '../../components/Button'
import { formatLastCounted, formatPack, formatPricePerUnit, formatQty, isIncomplete, plural } from '../../mocks/helpers'
import type { InventoryItem, Vendor } from '../../mocks/types'

function Cell({ value, num }: { value: string | null; num?: boolean }) {
  const classes = [num && 'num', value === null && 'missing'].filter(Boolean).join(' ')
  return <td className={classes || undefined}>{value ?? 'Missing'}</td>
}

// Stock is read-only here: it will come from sales and recipes, and is corrected through Edit.
export function ItemsTable({ items, vendors, onEdit }: {
  items: InventoryItem[]
  vendors: Vendor[]
  onEdit: (item: InventoryItem) => void
}) {
  const now = new Date()
  return (
    <div className="table-scroll">
      <table className="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th className="num">Stock on hand</th>
            <th>Last counted</th>
            <th>Vendor</th>
            <th>Pack size</th>
            <th className="num">Price / unit</th>
            <th>Order min</th>
            <th>Lead time</th>
            <th><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const incomplete = isIncomplete(item)
            const vendor = vendors.find((v) => v.id === item.vendorId)
            const rowClass = incomplete ? 'incomplete' : item.active ? undefined : 'inactive'
            return (
              <tr key={item.id} className={rowClass}>
                <td>
                  <span className="item-name">
                    <span className="strong">{item.name}</span>
                    {incomplete && <Badge tone="warning">Incomplete</Badge>}
                    {!item.active && <Badge tone="neutral">Inactive</Badge>}
                  </span>
                </td>
                <td className="num">{formatQty(item.stockOnHand, item.stockUnit)}</td>
                <td className="caption nowrap">{formatLastCounted(item.lastCounted, now)}</td>
                <Cell value={vendor?.name ?? null} />
                <Cell value={formatPack(item)} />
                <Cell value={formatPricePerUnit(item)} num />
                <Cell value={item.orderMinPacks === null ? null : plural(item.orderMinPacks, item.packName ?? 'pack')} />
                <Cell value={item.leadTimeDays === null ? null : plural(item.leadTimeDays, 'day')} />
                <td className="row-action">
                  {incomplete
                    ? <Button size="sm" variant="primary" onClick={() => onEdit(item)}>Complete</Button>
                    : <Button size="sm" icon="pencil" onClick={() => onEdit(item)}>Edit</Button>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
