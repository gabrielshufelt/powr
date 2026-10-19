// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { PageHeader } from '../layout/PageHeader'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { FilterChips } from '../components/FilterChips'
import { Icon } from '../components/Icon'
import { SearchField } from '../components/fields'
import { SyncStatus } from '../components/SyncStatus'
import { useToast } from '../components/Toast'
import { formatTime } from '../mocks/helpers'
import { useMockData } from '../mocks/MockDataProvider'
import type { Dish, Modifier } from '../mocks/types'
import { DishList } from './menu-mapping/DishList'
import { countDishes, filterDishes, type DishFilter } from './menu-mapping/filterDishes'
import { IngredientsCard } from './menu-mapping/IngredientsCard'
import { ModifierDialog } from './menu-mapping/ModifierDialog'
import { ModifiersCard } from './menu-mapping/ModifiersCard'

export function MenuMapping() {
  const { dishes, items, vendors, lastSync, saveDish, syncNow } = useMockData()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<DishFilter>('all')
  const [selectedId, setSelectedId] = useState(dishes[0].id)
  const [draft, setDraft] = useState<Dish | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Modifier | null>(null)

  const saved = dishes.find((d) => d.id === selectedId) ?? dishes[0]
  const dish = draft ?? saved
  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(saved)
  const readOnly = dish.removedFromPos
  const counts = countDishes(dishes)

  function select(id: string) {
    if (id === selectedId) return
    if (dirty) {
      setPendingId(id)
      return
    }
    setDraft(null)
    setSelectedId(id)
  }

  function leave() {
    if (pendingId) setSelectedId(pendingId)
    setDraft(null)
    setPendingId(null)
  }

  function save() {
    if (!draft) return
    saveDish(draft)
    setDraft(null)
    showToast(`${draft.name} mapping saved`)
  }

  return (
    <>
      <PageHeader
        title="Menu Mapping"
        subtitle="Tell the forecast how much of each ingredient one order uses."
        actions={<SyncStatus text={`POS connected · last sync ${formatTime(lastSync)}`}
          onSync={() => { syncNow(); showToast('Menu synced from the POS') }} />}
      />

      <div className="split">
        <section className="card flush dish-panel" aria-label="Menu items">
          <div className="panel-filters">
            <SearchField label="Search menu items" placeholder="e.g. fries" value={query} onChange={setQuery} />
            <FilterChips
              label="Filter by status"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All', count: counts.all },
                { value: 'mapped', label: 'Mapped', count: counts.mapped },
                { value: 'unmapped', label: 'Unmapped', count: counts.unmapped },
              ]}
            />
          </div>
          <DishList dishes={filterDishes(dishes, query, filter)} selectedId={selectedId} onSelect={select} />
        </section>

        <div className="editor" aria-label="Selected menu item">
          {readOnly && (
            <div className="note"><Icon name="info" />Removed from the POS. Mapping is kept for past sales.</div>
          )}
          <IngredientsCard dish={dish} items={items} vendors={vendors} readOnly={readOnly} onChange={setDraft} />
          <ModifiersCard dish={dish} items={items} readOnly={readOnly} onEdit={setEditing} />
          <div className="editor-footer">
            <span className="caption">Changes apply to sales and forecasts from now on. Past calculations stay as they were.</span>
            <div className="actions">
              <Button disabled={!dirty} onClick={() => setDraft(null)}>Discard</Button>
              <Button variant="primary" disabled={!dirty} onClick={save}>Save mapping</Button>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <ModifierDialog
          modifier={editing}
          dish={dish}
          items={items}
          onClose={() => setEditing(null)}
          onApply={(m) => {
            setDraft({ ...dish, modifiers: dish.modifiers.map((x) => (x.id === m.id ? m : x)) })
            setEditing(null)
          }}
        />
      )}

      <Dialog
        open={pendingId !== null}
        title="Leave without saving?"
        onClose={() => setPendingId(null)}
        actions={<>
          <Button onClick={() => setPendingId(null)}>Keep editing</Button>
          <Button variant="danger" onClick={leave}>Discard changes</Button>
        </>}
      >
        You have unsaved changes to {saved.name}. If you leave, they'll be lost.
      </Dialog>
    </>
  )
}
