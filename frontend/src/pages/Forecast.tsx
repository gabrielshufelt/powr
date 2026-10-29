// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { PageHeader } from '../layout/PageHeader'
import { Fragment, useState } from 'react'
import { Badge } from '../components/Badge'
import { Icon } from '../components/Icon'
import { SearchField, Select } from '../components/fields'
import { useMockData } from '../mocks/MockDataProvider'
import { formatQty } from '../mocks/helpers'

type ForecastPoint = { label: string; actual: number; forecast: number }
type Timeframe = 7 | 14 | 31

const FORECAST_USAGE: Record<string, number> = {
  'i-chicken': 8, 'i-lamb': 3, 'i-beef': 15, 'i-feta': 3, 'i-yogurt': 22,
  'i-tomato': 30, 'i-cucumber': 12, 'i-pita': 180, 'i-tzatziki': 8,
  'i-onion': 14, 'i-rice': 24, 'i-eggs': 81, 'i-grape-leaves': 6, 'i-lemon': 9,
}

const TOP_ITEM_IDS = ['i-eggs', 'i-chicken', 'i-lamb', 'i-feta', 'i-tomato']
const FORECAST_SORT_OPTIONS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'stock', label: 'Stock on hand' },
  { value: 'difference-asc', label: 'Difference ascending' },
  { value: 'difference-desc', label: 'Difference descending' },
] as const
type ForecastSort = typeof FORECAST_SORT_OPTIONS[number]['value']

const EGGS_FORECAST: ForecastPoint[] = [
  { label: 'Mon', actual: 1, forecast: 0 },
  { label: 'Tue', actual: 0, forecast: 12 },
  { label: 'Wed', actual: 0, forecast: 24 },
  { label: 'Thu', actual: 0, forecast: 18 },
  { label: 'Fri', actual: 0, forecast: 20 },
  { label: 'Sat', actual: 0, forecast: 6 },
  { label: 'Sun', actual: 0, forecast: 3 },
]

function ForecastStatus({ stock, forecast }: { stock: number; forecast: number }) {
  if (stock === 0) return <Badge tone="error">Out of stock</Badge>
  if (forecast > stock) return <Badge tone="warning">Below forecast</Badge>
  return <Badge tone="success">Sufficient</Badge>
}

function ForecastChart({ points }: { points: ForecastPoint[] }) {
  const chartHeight = 190
  const chartWidth = points.length > 14 ? points.length * 26 + 100 : 760
  const plotLeft = 64
  const plotRight = chartWidth - 20
  const plotWidth = plotRight - plotLeft
  const max = Math.max(24, ...points.map((point) => point.actual + point.forecast))
  const barWidth = points.length > 14 ? 14 : 46
  const gap = (plotWidth - points.length * barWidth) / (points.length + 1)
  const y = (value: number) => chartHeight - (value / max) * 150

  return (
    <div className="forecast-chart-wrap">
      <svg className={`forecast-chart${points.length > 14 ? ' forecast-chart-wide' : ''}`} viewBox={`0 0 ${chartWidth} 255`} role="img" aria-label="Egg forecast by day">
        {[0, 6, 12, 18, 24].map((tick) => (
          <g key={tick}>
            <line x1={plotLeft} y1={y(tick)} x2={plotRight} y2={y(tick)} className="chart-gridline" />
            <text x={plotLeft - 10} y={y(tick) + 4} textAnchor="end" className="chart-label">{tick}</text>
          </g>
        ))}
        {points.map((point, index) => {
          const x = plotLeft + gap + index * (barWidth + gap)
          const actualHeight = (point.actual / max) * 150
          const forecastHeight = (point.forecast / max) * 150
          return (
            <g key={point.label}>
              <rect x={x} y={chartHeight - actualHeight} width={barWidth} height={actualHeight} className="chart-actual" rx="3" />
              <rect x={x} y={chartHeight - actualHeight - forecastHeight} width={barWidth} height={forecastHeight} className="chart-forecast" rx="3" />
              <text x={x + barWidth / 2} y="220" textAnchor="middle" className="chart-label">{point.label}</text>
              <text x={x + barWidth / 2} y={chartHeight - actualHeight - forecastHeight - 8} textAnchor="middle" className="chart-value">{point.actual + point.forecast}</text>
            </g>
          )
        })}
        <line x1={plotLeft} y1={chartHeight} x2={plotRight} y2={chartHeight} className="chart-axis" />
        <text x="18" y="105" textAnchor="middle" className="chart-axis-title" transform="rotate(-90 18 105)">Quantity</text>
        <text x={(plotLeft + plotRight) / 2} y="247" textAnchor="middle" className="chart-axis-title">Day</text>
      </svg>
      <div className="forecast-legend">
        <span><i className="legend-swatch actual" />Actual usage</span>
        <span><i className="legend-swatch forecast" />Forecast</span>
      </div>
    </div>
  )
}

function IngredientForecast({ itemId, stock, unit, forecast }: {
  itemId: string
  stock: number
  unit: string
  forecast: number
}) {
  const [timeframe, setTimeframe] = useState<Timeframe>(7)
  const points = Array.from({ length: timeframe }, (_, index) => {
    const source = EGGS_FORECAST[index % EGGS_FORECAST.length]
    if (itemId === 'i-eggs' && timeframe === 7) return source
    return {
      label: timeframe === 7 ? source.label : `${index + 1}`,
      actual: index === 0 ? Math.min(stock, 5) : 0,
      forecast: Math.max(1, Math.round(forecast / 7 * (0.7 + (index % 7) / 10))),
    }
  })
  const forecastTotal = points.reduce((sum, point) => sum + point.forecast, 0)

  return (
    <div className="forecast-expanded">
      <div className="forecast-detail-head">
        <div>
          <h2>Projected usage</h2>
          <div className="label">Next {timeframe} days · {unit} · Current stock: {formatQty(stock, unit)}</div>
        </div>
        <div className="forecast-controls">
          <label className="label" htmlFor={`forecast-timeframe-${itemId}`}>Timeframe</label>
          <select
            id={`forecast-timeframe-${itemId}`}
            className="select input-compact"
            value={timeframe}
            onChange={(event) => setTimeframe(Number(event.target.value) as Timeframe)}
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={31}>31 days</option>
          </select>
        </div>
        <div className="forecast-total"><strong>{forecastTotal} {unit}</strong><span className="label">expected usage</span></div>
      </div>
      <ForecastChart points={points} />
      <div className="forecast-reason">
        <div>
          <span className="label">Reason for forecast</span>
          <strong>Seasonal demand + recent sales</strong>
        </div>
        <div className="forecast-order">
          <span className="label">Suggested order</span>
          <strong>{Math.max(0, Math.ceil(forecastTotal - stock))} {unit}</strong>
        </div>
      </div>
    </div>
  )
}

export function Forecast() {
  const { items } = useMockData()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [topExpandedId, setTopExpandedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ForecastSort>('name')
  const topItems = TOP_ITEM_IDS
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is typeof items[number] => item !== undefined)
  const shown = [...items]
    .filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => {
      const difference = (item: typeof a) => item.stockOnHand - (FORECAST_USAGE[item.id] ?? 0)
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'stock') return b.stockOnHand - a.stockOnHand
      return sort === 'difference-asc' ? difference(a) - difference(b) : difference(b) - difference(a)
    })

  return (
    <>
      <PageHeader title="Forecast" subtitle="Predicted ingredient needs" />
      <section className="forecast-top-items" aria-label="Top forecast ingredients">
        <div className="forecast-section-heading">
          <div>
            <h2>Top items</h2>
            <div className="label">Open an ingredient forecast</div>
          </div>
        </div>
        <div className="forecast-item-cards">
          {topItems.map((item) => {
            const expanded = topExpandedId === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`forecast-item-card${expanded ? ' selected' : ''}`}
                aria-expanded={expanded}
                onClick={() => setTopExpandedId(expanded ? null : item.id)}
              >
                <strong>{item.name}</strong>
                <span className="label">Stock {formatQty(item.stockOnHand, item.stockUnit)}</span>
              </button>
            )
          })}
        </div>
        {topExpandedId && (() => {
          const item = topItems.find((candidate) => candidate.id === topExpandedId)
          if (!item) return null
          return (
            <div className="forecast-top-dropdown">
              <IngredientForecast
                itemId={item.id}
                stock={item.stockOnHand}
                unit={item.stockUnit}
                forecast={FORECAST_USAGE[item.id] ?? 0}
              />
            </div>
          )
        })()}
      </section>
      <section className="card flush" aria-label="Ingredient forecast">
        <div className="card-head" style={{ padding: '20px 20px 0' }}>
          <div>
            <h2>All ingredients</h2>
            <p className="card-intro label">Projected usage for the next 7 days based on recent sales.</p>
          </div>
        </div>
        <div className="filter-bar">
          <SearchField className="w-320" label="Search items" placeholder="e.g. feta" value={query} onChange={setQuery} />
          <Select className="w-240" label="Sort by" value={sort} options={[...FORECAST_SORT_OPTIONS]} onChange={(value) => setSort(value as ForecastSort)} />
        </div>
        <div className="table-scroll">
          <table className="items-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th className="num">Stock on hand</th>
                <th className="num">7-day forecast</th>
                <th className="num">Difference</th>
                <th>Status</th>
                <th><span className="visually-hidden">Ingredient menu</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((item) => {
                const forecast = FORECAST_USAGE[item.id] ?? 0
                const difference = item.stockOnHand - forecast
                const expanded = expandedId === item.id
                return (
                  <Fragment key={item.id}>
                  <tr>
                    <td><span className="strong">{item.name}</span></td>
                    <td className="num">{formatQty(item.stockOnHand, item.stockUnit)}</td>
                    <td className="num">{formatQty(forecast, item.stockUnit)}</td>
                    <td className={`num ${difference < 0 ? 'missing' : ''}`}>
                      {difference > 0 ? '+' : ''}{formatQty(difference, item.stockUnit)}
                    </td>
                    <td><ForecastStatus stock={item.stockOnHand} forecast={forecast} /></td>
                    <td className="row-action">
                      <button
                        type="button"
                        className="btn btn-icon btn-ghost btn-sm"
                        aria-label={`${expanded ? 'Collapse' : 'Expand'} forecast for ${item.name}`}
                        aria-expanded={expanded}
                        onClick={() => setExpandedId(expanded ? null : item.id)}
                      >
                        <Icon name="chevron-down" size={20} />
                      </button>
                    </td>
                  </tr>
                  {expanded && (
                    <tr className="forecast-expanded-row">
                      <td colSpan={6}>
                        <IngredientForecast itemId={item.id} stock={item.stockOnHand} unit={item.stockUnit} forecast={forecast} />
                      </td>
                    </tr>
                  )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
          {shown.length === 0 && (
            <p className="list-empty">
              No ingredients match your filters. <button type="button" className="link" onClick={() => { setQuery(''); setSort('difference-asc') }}>Clear filters</button>
            </p>
          )}
        </div>
      </section>
    </>
  )
}
