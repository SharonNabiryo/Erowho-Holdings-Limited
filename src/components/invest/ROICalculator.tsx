'use client'
import { useMemo, useState } from 'react'
import { calcROI } from '@/lib/utils'
import { TrendingUp, BarChart3, DollarSign, Info } from 'lucide-react'

export function ROICalculator() {
  const [price,      setPrice]      = useState(800_000)
  const [downPct,    setDownPct]    = useState(25)
  const [rent,       setRent]       = useState(3_200)
  const [expenses,   setExpenses]   = useState(1_100)
  const [apprecPct,  setApprecPct]  = useState(4)

  const down    = price * downPct / 100
  const results = useMemo(
    () => calcROI(price, downPct, rent, expenses, apprecPct),
    [price, downPct, rent, expenses, apprecPct],
  )

  const fmt    = (n: number) => `$${Math.round(n).toLocaleString()}`
  const fmtPct = (n: number) => `${n.toFixed(1)}%`

  const metrics = [
    { Icon: TrendingUp,  label: 'Annual ROI',     value: fmtPct(results.annualROI),   color: 'text-emerald-700', bg: 'bg-emerald-50  border-emerald-100' },
    { Icon: BarChart3,   label: 'Cap Rate',        value: fmtPct(results.capRate),     color: 'text-gold-700',    bg: 'bg-gold-50     border-gold-100'    },
    { Icon: DollarSign,  label: 'Cash-on-Cash',    value: fmtPct(results.cashOnCash),  color: 'text-blue-700',    bg: 'bg-blue-50     border-blue-100'    },
    { Icon: DollarSign,  label: 'Monthly Cash Flow',value: fmt(results.cashFlow),      color: 'text-clay-700',    bg: 'bg-clay-50     border-clay-100'    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Purchase price */}
        <div>
          <label className="field-label">Purchase Price</label>
          <input type="number" value={price} min={100000} step={25000}
            onChange={e => setPrice(+e.target.value)} className="field-input" />
        </div>

        {/* Down */}
        <div>
          <label className="field-label flex items-center justify-between">
            Down Payment
            <span className="normal-case tracking-normal font-semibold text-emerald-700">
              {fmt(down)} ({downPct}%)
            </span>
          </label>
          <input type="range" min={10} max={60} step={5} value={downPct}
            onChange={e => setDownPct(+e.target.value)} className="w-full accent-emerald-700" />
        </div>

        {/* Rent */}
        <div>
          <label className="field-label">Monthly Rental Income</label>
          <input type="number" value={rent} min={0} step={100}
            onChange={e => setRent(+e.target.value)} className="field-input" />
        </div>

        {/* Expenses */}
        <div>
          <label className="field-label">Monthly Expenses (taxes, insurance, mgmt)</label>
          <input type="number" value={expenses} min={0} step={50}
            onChange={e => setExpenses(+e.target.value)} className="field-input" />
        </div>

        {/* Appreciation */}
        <div className="md:col-span-2">
          <label className="field-label flex items-center justify-between">
            Annual Appreciation
            <span className="normal-case tracking-normal font-semibold text-emerald-700">
              {fmtPct(apprecPct)}
            </span>
          </label>
          <input type="range" min={0} max={15} step={0.5} value={apprecPct}
            onChange={e => setApprecPct(+e.target.value)} className="w-full accent-emerald-700" />
          <div className="flex justify-between text-2xs text-charcoal-400 font-dm mt-1">
            <span>0%</span><span>15%</span>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(({ Icon, label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon size={14} className={color} />
              <span className={`text-2xs font-dm font-bold uppercase tracking-[0.1em] ${color}`}>{label}</span>
            </div>
            <p className={`font-playfair text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* NOI breakdown */}
      <div className="bg-ivory-100 border border-ivory-200 rounded-2xl p-5 space-y-2.5">
        {[
          { label: 'Annual Rental Income',    value: fmt(rent * 12),            positive: true },
          { label: 'Annual Expenses',         value: `–${fmt(expenses * 12)}`,  positive: false },
          { label: 'Net Operating Income',    value: fmt(results.noi),          positive: true, bold: true },
          { label: 'Appreciation (yr 1)',     value: `+${fmt(price * apprecPct / 100)}`, positive: true },
        ].map(({ label, value, positive, bold }) => (
          <div key={label} className={`flex items-center justify-between ${bold ? 'pt-2.5 border-t border-ivory-300' : ''}`}>
            <span className={`text-sm font-dm ${bold ? 'font-semibold text-charcoal-800' : 'text-charcoal-500'}`}>{label}</span>
            <span className={`text-sm font-dm font-semibold ${bold ? 'text-emerald-700' : positive ? 'text-charcoal-700' : 'text-red-600'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <p className="flex items-start gap-2 text-xs font-dm text-charcoal-400">
        <Info size={13} className="text-emerald-500 mt-0.5 shrink-0" />
        Projections are estimates only. Consult an Erowho investment advisor for a full due-diligence report.
      </p>
    </div>
  )
}
