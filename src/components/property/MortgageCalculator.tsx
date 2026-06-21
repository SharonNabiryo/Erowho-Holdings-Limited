'use client'
import { useMemo, useState } from 'react'
import { calcMortgage } from '@/lib/utils'
import { Info } from 'lucide-react'

interface Props { defaultPrice?: number }

export function MortgageCalculator({ defaultPrice = 1_000_000 }: Props) {
  const [price,    setPrice]    = useState(defaultPrice)
  const [downPct,  setDownPct]  = useState(20)
  const [rate,     setRate]     = useState(5.5)
  const [years,    setYears]    = useState(25)

  const down       = price * downPct / 100
  const principal  = price - down
  const monthly    = useMemo(() => calcMortgage(price, downPct, rate, years), [price, downPct, rate, years])
  const totalPaid  = monthly * years * 12
  const totalInt   = totalPaid - principal

  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="field-label">Home Price</label>
          <input
            type="number"
            value={price}
            min={50000} step={25000}
            onChange={e => setPrice(+e.target.value)}
            className="field-input"
          />
        </div>

        {/* Down Payment */}
        <div>
          <label className="field-label flex items-center justify-between">
            Down Payment
            <span className="text-emerald-700 normal-case tracking-normal font-semibold">
              {fmt(down)} ({downPct}%)
            </span>
          </label>
          <input type="range" min={5} max={50} step={1} value={downPct}
            onChange={e => setDownPct(+e.target.value)}
            className="w-full accent-emerald-700" />
          <div className="flex justify-between text-2xs text-charcoal-400 font-dm mt-1">
            <span>5%</span><span>50%</span>
          </div>
        </div>

        {/* Rate */}
        <div>
          <label className="field-label flex items-center justify-between">
            Interest Rate
            <span className="text-emerald-700 normal-case tracking-normal font-semibold">{rate.toFixed(1)}%</span>
          </label>
          <input type="range" min={1} max={12} step={0.1} value={rate}
            onChange={e => setRate(+e.target.value)}
            className="w-full accent-emerald-700" />
          <div className="flex justify-between text-2xs text-charcoal-400 font-dm mt-1">
            <span>1%</span><span>12%</span>
          </div>
        </div>

        {/* Amortization */}
        <div>
          <label className="field-label flex items-center justify-between">
            Amortization
            <span className="text-emerald-700 normal-case tracking-normal font-semibold">{years} years</span>
          </label>
          <input type="range" min={5} max={30} step={5} value={years}
            onChange={e => setYears(+e.target.value)}
            className="w-full accent-emerald-700" />
          <div className="flex justify-between text-2xs text-charcoal-400 font-dm mt-1">
            <span>5 yr</span><span>30 yr</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-section-dark rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <p className="text-2xs font-dm uppercase tracking-[0.15em] text-white/50 mb-1">
            Estimated Monthly Payment
          </p>
          <p className="font-playfair text-5xl font-bold text-gold">
            {fmt(monthly)}
          </p>
          <p className="text-xs text-white/40 font-dm mt-1">Principal &amp; Interest only</p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/10">
          {[
            { label: 'Loan Amount',   value: fmt(principal) },
            { label: 'Total Interest',value: fmt(totalInt)  },
            { label: 'Total Cost',    value: fmt(totalPaid) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-playfair text-lg font-bold text-white">{value}</p>
              <p className="text-2xs font-dm uppercase tracking-[0.12em] text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="flex items-start gap-2 text-xs font-dm text-charcoal-400">
        <Info size={13} className="text-emerald-500 mt-0.5 shrink-0" />
        Estimates are for information only. Connect with an Erowho advisor for a personalised pre-approval.
      </p>
    </div>
  )
}
