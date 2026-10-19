// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { PageHeader } from '../layout/PageHeader'
import { Alert } from '../components/Alert'
import { Button } from '../components/Button'
import { SearchField, Select } from '../components/fields'
import { SyncStatus } from '../components/SyncStatus'
import { useToast } from '../components/Toast'
import { formatTime, isIncomplete, plural } from '../mocks/helpers'
import { useMockData } from '../mocks/MockDataProvider'
import type { InventoryItem, Vendor } from '../mocks/types'
import { filterItems, SORT_OPTIONS, type ItemSort } from './inventory/filterItems'
import { ItemDialog } from './inventory/ItemDialog'
import { ItemsTable } from './inventory/ItemsTable'
import { VendorDialog } from './inventory/VendorDialog'
import { VendorsSection } from './inventory/VendorsSection'

export function Inventory() {
  const { items, vendors, lastSync, saveItem, saveVendor, syncNow } = useMockData()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [vendorId, setVendorId] = useState('all')
  const [sort, setSort] = useState<ItemSort>('name')
  const [incompleteOnly, setIncompleteOnly] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  // undefined = closed, null = adding a new vendor
  const [editingVendor, setEditingVendor] = useState<Vendor | null | undefined>(undefined)

  const incomplete = items.filter(isIncomplete).length
  // Once nothing is incomplete the filter would only show an empty table.
  const showIncomplete = incompleteOnly && incomplete > 0
  const shown = filterItems(items, { query, vendorId, sort, incompleteOnly: showIncomplete })

  function clearFilters() {
    setQuery('')
    setVendorId('all')
    setIncompleteOnly(false)
  }

  return (
    <>
      <PageHeader
        title="Inventory & Vendors"
        subtitle="What you have, how you buy it, and how long it takes to arrive."
        actions={<SyncStatus text={`Items synced ${formatTime(lastSync)}`}
          onSync={() => { syncNow(); showToast('Inventory synced') }} />}
      />

      {incomplete > 0 && (
        <Alert
          title={`${plural(incomplete, 'item')} ${incomplete === 1 ? 'is' : 'are'} missing purchasing details.`}
          action={<Button size="sm" onClick={() => setIncompleteOnly(!showIncomplete)}>
            {showIncomplete ? 'Show all items' : 'Show incomplete only'}
          </Button>}
        >
          The forecast can't suggest orders for {incomplete === 1 ? 'it' : 'them'} yet.
        </Alert>
      )}

      <section className="card flush" aria-label="Inventory items">
        <div className="filter-bar">
          <SearchField className="w-320" label="Search items" placeholder="e.g. potato" value={query} onChange={setQuery} />
          <Select
            className="w-200"
            label="Vendor"
            value={vendorId}
            options={[{ value: 'all', label: 'All vendors' }, ...vendors.map((v) => ({ value: v.id, label: v.name }))]}
            onChange={setVendorId}
          />
          <Select className="w-200" label="Sort by" value={sort} options={SORT_OPTIONS} onChange={(s) => setSort(s as ItemSort)} />
        </div>
        {shown.length === 0 ? (
          <p className="list-empty">
            No items match your filters. <button type="button" className="link" onClick={clearFilters}>Clear filters</button>
          </p>
        ) : (
          <ItemsTable items={shown} vendors={vendors} onEdit={setEditingItem} />
        )}
      </section>

      <VendorsSection vendors={vendors} items={items} onAdd={() => setEditingVendor(null)} onEdit={setEditingVendor} />

      {editingItem && (
        <ItemDialog
          item={editingItem}
          vendors={vendors}
          onClose={() => setEditingItem(null)}
          onSave={(item) => {
            saveItem(item)
            setEditingItem(null)
            showToast(`${item.name} saved`)
          }}
        />
      )}
      {editingVendor !== undefined && (
        <VendorDialog
          vendor={editingVendor}
          onClose={() => setEditingVendor(undefined)}
          onSave={(vendor) => {
            saveVendor(vendor)
            setEditingVendor(undefined)
            showToast(`${vendor.name} saved`)
          }}
        />
      )}
    </>
  )
}
