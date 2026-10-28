// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { Button } from '../../components/Button'
import { Dialog } from '../../components/Dialog'
import { Select, TextField } from '../../components/fields'
import { newId } from '../../mocks/helpers'
import type { Vendor, Weekday } from '../../mocks/types'

const DAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// vendor null means "Add vendor".
export function VendorDialog({ vendor, onSave, onClose }: {
  vendor: Vendor | null
  onSave: (vendor: Vendor) => void
  onClose: () => void
}) {
  const [name, setName] = useState(vendor?.name ?? '')
  const [phone, setPhone] = useState(vendor?.phone ?? '')
  const [email, setEmail] = useState(vendor?.email ?? '')
  const [location, setLocation] = useState(vendor?.location ?? '')
  const [orderByDay, setOrderByDay] = useState<string>(vendor?.orderByDay ?? '')
  const [notes, setNotes] = useState(vendor?.notes ?? '')

  function save() {
    onSave({
      id: vendor?.id ?? newId('v'),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      location: location.trim(),
      orderByDay: (orderByDay || null) as Weekday | null,
      notes: notes.trim(),
    })
  }

  return (
    <Dialog
      open
      width={560}
      title={vendor ? `Edit ${vendor.name}` : 'Add vendor'}
      onClose={onClose}
      actions={<>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" disabled={!name.trim()} onClick={save}>{vendor ? 'Save vendor' : 'Add vendor'}</Button>
      </>}
    >
      <TextField label="Vendor name" placeholder="e.g. Costco" value={name} onChange={setName}
        help="Shown on orders and the vendor list" />
      <div className="field-row">
        <TextField className="grow" label="Phone" type="tel" value={phone} onChange={setPhone} />
        <TextField className="grow" label="Email" type="email" value={email} onChange={setEmail} />
      </div>
      <div className="field-row">
        <TextField className="grow" label="Location" placeholder="City, State" value={location} onChange={setLocation} />
        <Select
          className="grow"
          label="Order by"
          value={orderByDay}
          options={[{ value: '', label: 'Not set' }, ...DAYS.map((d) => ({ value: d, label: d }))]}
          onChange={setOrderByDay}
        />
      </div>
      <TextField label="Ordering notes" placeholder="e.g. Order by 2 PM for next truck" value={notes} onChange={setNotes} />
    </Dialog>
  )
}
