// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { Button } from '../../components/Button'
import { SearchField } from '../../components/fields'
import { plural } from '../../mocks/helpers'
import type { InventoryItem, Vendor } from '../../mocks/types'

export function VendorsSection({ vendors, items, onAdd, onEdit }: {
  vendors: Vendor[]
  items: InventoryItem[]
  onAdd: () => void
  onEdit: (vendor: Vendor) => void
}) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = vendors.filter((v) => v.name.toLowerCase().includes(q))

  return (
    <section className="vendors" aria-labelledby="vendors-title">
      <h2 id="vendors-title">Vendors</h2>
      <div className="vendor-toolbar">
        <SearchField className="vendor-search" label="Search vendors" hideLabel placeholder="Search vendors" value={query} onChange={setQuery} />
        <Button variant="primary" icon="plus" onClick={onAdd}>Add vendor</Button>
      </div>
      {shown.length === 0 ? (
        <p className="list-empty card">No vendors match your search.</p>
      ) : (
        <div className="vendor-grid">
          {shown.map((v) => {
            const supplied = items.filter((i) => i.active && i.vendorId === v.id).length
            const contact = [v.phone, v.email].filter(Boolean).join(' · ')
            return (
              <article key={v.id} className="card vendor-card">
                <div className="vendor-head">
                  <span className="avatar" aria-hidden="true">{v.name.charAt(0).toUpperCase()}</span>
                  <h3>{v.name}</h3>
                </div>
                <div className="vendor-details">
                  {contact && <div className="caption">{contact}</div>}
                  {v.location && <div className="caption">{v.location}</div>}
                </div>
                <div className="vendor-terms">
                  <div>Supplies {plural(supplied, 'item')}</div>
                  <div className="caption">Next order by: <strong className="secondary">{v.orderByDay ?? 'Not set'}</strong></div>
                  {v.notes && <div className="caption">{v.notes}</div>}
                </div>
                <Button size="sm" icon="pencil" className="vendor-edit" onClick={() => onEdit(v)}>Edit</Button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
