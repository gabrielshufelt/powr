// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { PageHeader } from '../layout/PageHeader'
import { Segmented } from '../components/Segmented'

type Line = {
  ingredient: string
  need: string
  onHand: string
  recommended: number
  pack: string
  price: number
  edited?: number
}

type Order = {
  id: string
  vendor: string
  delivery: string
  minimum: number
  leadDays: number
  approved?: boolean
  lines: Line[]
}

const ORDERS: Order[] = [
  {
    id: 'costco', vendor: 'Costco', delivery: 'Oct 14', minimum: 400, leadDays: 2,
    lines: [
      { ingredient: 'Chicken thigh, boneless', need: '40 kg', onHand: '8 kg', recommended: 7, pack: 'case (5 kg)', price: 27 },
      { ingredient: 'Lamb leg', need: '12 kg', onHand: '5 kg', recommended: 2, pack: 'case (5 kg)', price: 55, edited: 3 },
      { ingredient: 'Ground beef', need: '15 kg', onHand: '6 kg', recommended: 2, pack: 'case (5 kg)', price: 40 },
    ],
  },
  {
    id: 'iga', vendor: 'IGA', delivery: 'Oct 15', minimum: 350, leadDays: 1,
    lines: [
      { ingredient: 'Feta, block', need: '18 kg', onHand: '2 kg', recommended: 4, pack: 'case (4 kg)', price: 48 },
      { ingredient: 'Greek yogurt', need: '22 kg', onHand: '6 kg', recommended: 4, pack: 'tub (5 kg)', price: 30 },
    ],
  },
  {
    id: 'maxi', vendor: 'Maxi', delivery: 'Oct 15', minimum: 0, leadDays: 1, approved: true,
    lines: [
      { ingredient: 'Tomatoes', need: '30 kg', onHand: '8 kg', recommended: 3, pack: 'box (10 kg)', price: 25 },
      { ingredient: 'Cucumbers', need: '12 kg', onHand: '4 kg', recommended: 1, pack: 'box (10 kg)', price: 18 },
    ],
  },
]

const qty = (line: Line) => line.edited ?? line.recommended
const total = (order: Order) => order.lines.reduce((sum, line) => sum + qty(line) * line.price, 0)
const shortBy = (order: Order) => (order.approved ? 0 : Math.max(0, order.minimum - total(order)))
function plural(n: number, word: string) {
  if (n === 1) return `${n} ${word}`
  return `${n} ${word}${word.endsWith('x') ? 'es' : 's'}`
}

// "case (5 kg)" with 3 packs -> "3 cases (5 kg)"
function packText(line: Line, n: number) {
  const space = line.pack.indexOf(' ')
  return `${plural(n, line.pack.slice(0, space))} ${line.pack.slice(space + 1)}`
}

function StatusBadge({ approved }: { approved?: boolean }) {
  return <span className={`badge ${approved ? 'success' : ''}`}>{approved ? 'APPROVED' : 'DRAFT'}</span>
}

function QtyCell({ line, approved }: { line: Line; approved?: boolean }) {
  if (approved) return <>{qty(line)}</>
  return (
    <>
      <input className="input qty" defaultValue={qty(line)} aria-label={`Order quantity for ${line.ingredient}`} />
      {line.edited !== undefined && <span className="edited-tag">Edited</span>}
    </>
  )
}

function RecommendedCell({ line }: { line: Line }) {
  return <>{packText(line, line.recommended)}</>
}

function VendorSummary({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const drafts = ORDERS.filter((o) => !o.approved).length
  return (
    <div className="list" style={{ width: 240, flex: 'none' }}>
      <div className="list-item" style={{ background: 'var(--color-bg)' }}>
        <strong>{plural(ORDERS.length, 'order')} · {drafts} to approve</strong>
        <span className="label">Total ${ORDERS.reduce((sum, o) => sum + total(o), 0)}</span>
      </div>
      {ORDERS.map((order) => (
        <button
          key={order.id}
          className={`list-item ${order.id === selectedId ? 'on' : ''}`}
          aria-pressed={order.id === selectedId}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(order.id)}
        >
          <strong>{order.vendor}</strong>
          <span className="label">{order.delivery} · ${total(order)} <StatusBadge approved={order.approved} /></span>
          {shortBy(order) > 0 && <span className="label" style={{ color: 'var(--color-warning)' }}>Below order minimum</span>}
        </button>
      ))}
    </div>
  )
}

function VendorOrder({ order }: { order: Order }) {
  const missing = shortBy(order)
  return (
    <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="header" style={{ alignItems: 'flex-start', padding: '16px 20px', borderBottom: '1px solid var(--color-divider)' }}>
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 4 }}>{order.vendor} <StatusBadge approved={order.approved} /></h2>
          <div className="label">
            Delivery {order.delivery} · {order.minimum ? `Order minimum $${order.minimum}` : 'No order minimum'} · Lead time {plural(order.leadDays, 'day')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="label">Order total</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>${total(order)}</div>
        </div>
      </div>

      <div style={{ padding: '0 12px' }}>
        <table>
          <thead><tr><th>Ingredient</th><th>14-day need</th><th>On hand</th><th>Recommended</th><th>Order qty</th><th style={{ textAlign: 'right' }}>Line total</th></tr></thead>
          <tbody>
            {order.lines.map((line) => (
              <tr key={line.ingredient} className={line.edited !== undefined ? 'edited' : ''}>
                <td>{line.ingredient}</td>
                <td>{line.need}</td>
                <td>{line.onHand}</td>
                <td><RecommendedCell line={line} /></td>
                <td><QtyCell line={line} approved={order.approved} /></td>
                <td style={{ textAlign: 'right' }}>${qty(line) * line.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="header" style={{ alignItems: 'center', padding: '14px 20px' }}>
        {missing > 0
          ? <div className="alert warning" style={{ padding: '8px 12px' }}><strong>${missing} below the ${order.minimum} order minimum</strong></div>
          : <span className="label">{order.approved ? 'Approved on Oct 12 · locked' : 'Meets the order minimum'}</span>}
        {!order.approved && (
          <div className="actions">
            <button className="btn btn-secondary">Reset to recommended</button>
            <button className="btn btn-primary">Approve order</button>
          </div>
        )}
      </div>
    </section>
  )
}

// One vendor's table at a time: the first vendor is shown by default, clicking another switches to it.
function ByVendor() {
  const [selectedId, setSelectedId] = useState(ORDERS[0].id)
  const selected = ORDERS.find((o) => o.id === selectedId) ?? ORDERS[0]
  return (
    <div className="row">
      <VendorSummary selectedId={selected.id} onSelect={setSelectedId} />
      <div style={{ flex: '1 1 560px', minWidth: 0 }}>
        <VendorOrder order={selected} />
      </div>
    </div>
  )
}

function ByIngredient() {
  const rows = ORDERS.flatMap((order) => order.lines.map((line) => ({ order, line })))
    .sort((a, b) => a.line.ingredient.localeCompare(b.line.ingredient))
  const belowMinimum = ORDERS.filter((o) => shortBy(o) > 0)
  return (
    <div className="card">
      <h2>All ingredients <span className="label">· {plural(rows.length, 'ingredient')} · {plural(ORDERS.length, 'vendor')}</span></h2>
      <table>
        <thead><tr><th>Ingredient</th><th>Vendor</th><th>14-day need</th><th>On hand</th><th>Recommended</th><th>Order qty</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map(({ order, line }) => (
            <tr key={line.ingredient} className={line.edited !== undefined ? 'edited' : ''}>
              <td>{line.ingredient}</td>
              <td>{order.vendor}</td>
              <td>{line.need}</td>
              <td>{line.onHand}</td>
              <td><RecommendedCell line={line} /></td>
              <td><QtyCell line={line} approved={order.approved} /></td>
              <td><StatusBadge approved={order.approved} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="header" style={{ marginTop: 16, alignItems: 'center' }}>
        {belowMinimum.map((o) => (
          <div key={o.id} className="alert warning" style={{ padding: '8px 12px' }}>
            <strong>{o.vendor} order is ${shortBy(o)} below its ${o.minimum} minimum</strong>
          </div>
        ))}
        <button className="btn btn-primary">Approve all drafts</button>
      </div>
    </div>
  )
}

export function RecommendedOrders() {
  const [view, setView] = useState('By vendor')
  return (
    <>
      <PageHeader
        title="Recommended Orders"
        subtitle="Based on the 14-day forecast and your current stock · week of Oct 13"
        actions={<Segmented options={['By vendor', 'By ingredient']} value={view} onChange={setView} />}
      />
      {view === 'By vendor' ? <ByVendor /> : <ByIngredient />}
    </>
  )
}
