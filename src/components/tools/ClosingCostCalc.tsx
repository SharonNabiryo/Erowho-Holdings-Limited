'use client'
import { useState, useMemo } from 'react'
import { Info } from 'lucide-react'

// ── CLOSING COST CALCULATOR ───────────────────────────────────

export function ClosingCostCalc() {
  const [price,     setPrice]     = useState(1000000)
  const [country,   setCountry]   = useState<'CA'|'US'>('CA')
  const [province,  setProvince]  = useState('ON')
  const [firstTime, setFirstTime] = useState(false)
  const [isNew,     setIsNew]     = useState(false)

  const costs = useMemo(() => {
    const items: { label: string; amount: number; note: string }[] = []

    if (country === 'CA') {
      // Land Transfer Tax by province
      let lttBase = 0
      if (province === 'ON') {
        lttBase = price <= 55000 ? price * 0.005
          : price <= 250000 ? 275  + (price - 55000)  * 0.01
          : price <= 400000 ? 2225 + (price - 250000) * 0.015
          : price <= 2000000? 4475 + (price - 400000) * 0.02
          :                  36475 + (price - 2000000)* 0.025
        const lttRebate = firstTime ? Math.min(lttBase, 4000) : 0
        items.push({ label: 'Ontario Land Transfer Tax', amount: Math.round(lttBase - lttRebate), note: firstTime ? `Rebate applied (max $4,000)` : '' })
        // Toronto Municipal LTT
        let torontoLTT = lttBase
        if (firstTime) torontoLTT = Math.max(0, torontoLTT - 4475)
        items.push({ label: 'Toronto Municipal LTT (if applicable)', amount: Math.round(torontoLTT * 0.5), note: 'Only if buying within Toronto city limits' })
      } else if (province === 'BC') {
        lttBase = price <= 200000 ? price * 0.01
          : price <= 2000000 ? 2000 + (price - 200000) * 0.02
          : 38000 + (price - 2000000) * 0.03
        const bcRebate = firstTime && price <= 500000 ? lttBase : firstTime && price <= 525000 ? lttBase * (525000 - price) / 25000 : 0
        items.push({ label: 'BC Property Transfer Tax', amount: Math.round(lttBase - bcRebate), note: firstTime && price <= 500000 ? 'First-time buyer exemption applied' : '' })
      } else if (province === 'QC') {
        lttBase = price <= 51700 ? price * 0.005
          : price <= 258600 ? 258.5 + (price - 51700) * 0.01
          : price <= 517100 ? 2325.5 + (price - 258600) * 0.015
          : price <= 1034200 ? 6203  + (price - 517100) * 0.02
          :                   16545  + (price - 1034200) * 0.025
        items.push({ label: 'Quebec Welcome Tax (Droits de mutation)', amount: Math.round(lttBase), note: 'Municipal welcome tax' })
      } else {
        items.push({ label: 'Land Transfer Tax', amount: Math.round(price * 0.01), note: 'Provincial estimate' })
      }
      items.push({ label: 'Legal / Notary Fees', amount: 1800, note: 'Estimate — varies by lawyer/notary' })
      items.push({ label: 'Title Insurance', amount: 350, note: 'One-time premium' })
      items.push({ label: 'Home Inspection', amount: 550, note: 'Strongly recommended' })
      items.push({ label: 'Appraisal Fee', amount: 400, note: 'If required by lender' })
      if (isNew) items.push({ label: 'HST/GST on New Build', amount: Math.round(price * 0.05), note: 'GST on new construction; partial rebate may apply' })
      items.push({ label: 'Property Tax Adjustment', amount: Math.round(price * 0.0075 / 2), note: 'Pro-rated to your closing date' })
      items.push({ label: 'Moving & Misc.', amount: 3000, note: 'Estimate for local move' })
    } else {
      // USA
      items.push({ label: 'Origination / Lender Fees', amount: Math.round(price * 0.01), note: 'Typically 0.5–1% of loan' })
      items.push({ label: 'Appraisal', amount: 600, note: 'Required by lender' })
      items.push({ label: 'Home Inspection', amount: 500, note: 'Strongly recommended' })
      items.push({ label: 'Title Search & Insurance', amount: Math.round(price * 0.005), note: 'Lender and owner policy' })
      items.push({ label: 'Escrow / Settlement Fees', amount: 1500, note: 'Varies by state and escrow company' })
      items.push({ label: 'Prepaid Interest', amount: Math.round(price * 0.003), note: 'Interest from closing to first payment' })
      items.push({ label: 'Property Tax Escrow', amount: Math.round(price * 0.015 / 2), note: '3–6 months upfront to escrow' })
      items.push({ label: 'Homeowners Insurance', amount: 1500, note: 'First-year premium upfront' })
      items.push({ label: 'Transfer Taxes', amount: Math.round(price * 0.002), note: 'Varies by state/county' })
      items.push({ label: 'Attorney Fee (if required)', amount: 1000, note: 'Required in some states' })
      items.push({ label: 'Moving & Misc.', amount: 3500, note: 'Estimate' })
    }

    const total = items.reduce((s, i) => s + i.amount, 0)
    return { items, total }
  }, [price, country, province, firstTime, isNew])

  const fmt = (n: number) => `$${n.toLocaleString()}`

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['CA','US'] as const).map(c => (
          <button key={c} onClick={() => setCountry(c)}
            className={`flex-1 py-2.5 text-sm font-dm font-semibold rounded-xl border transition-all ${country===c?'bg-emerald-700 text-white border-emerald-700':'border-ivory-300 text-charcoal-600 hover:border-emerald-400'}`}>
            {c==='CA' ? '🇨🇦 Canada' : '🇺🇸 USA'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Purchase Price</label>
          <input type="number" value={price} onChange={e => setPrice(+e.target.value)} className="field-input" step={25000} min={100000} />
        </div>
        {country === 'CA' && (
          <div>
            <label className="field-label">Province</label>
            <select value={province} onChange={e => setProvince(e.target.value)} className="field-select">
              <option value="ON">Ontario</option>
              <option value="BC">British Columbia</option>
              <option value="QC">Québec</option>
              <option value="AB">Alberta</option>
              <option value="MB">Manitoba</option>
              <option value="SK">Saskatchewan</option>
            </select>
          </div>
        )}
        {country === 'CA' && (
          <div className="flex items-center gap-3">
            <input type="checkbox" id="firstTime" checked={firstTime} onChange={e => setFirstTime(e.target.checked)} className="accent-emerald-700 w-4 h-4" />
            <label htmlFor="firstTime" className="text-sm font-dm text-charcoal-700 cursor-pointer">First-time buyer (LTT rebate)</label>
          </div>
        )}
        {country === 'CA' && (
          <div className="flex items-center gap-3">
            <input type="checkbox" id="newBuild" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="accent-emerald-700 w-4 h-4" />
            <label htmlFor="newBuild" className="text-sm font-dm text-charcoal-700 cursor-pointer">New construction (HST/GST applies)</label>
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div className="bg-ivory-100 border border-ivory-200 rounded-2xl p-5 space-y-2.5">
        {costs.items.map(item => (
          <div key={item.label} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-dm text-charcoal-700">{item.label}</p>
              {item.note && <p className="text-2xs font-dm text-charcoal-400 mt-0.5">{item.note}</p>}
            </div>
            <p className="text-sm font-dm font-semibold text-charcoal-900 shrink-0">{fmt(item.amount)}</p>
          </div>
        ))}
        <div className="pt-3 border-t border-ivory-300 flex items-center justify-between">
          <p className="font-dm font-bold text-charcoal-900">Estimated Total Closing Costs</p>
          <p className="font-playfair text-xl font-bold text-emerald-700">{fmt(costs.total)}</p>
        </div>
        <p className="text-2xs font-dm text-charcoal-400">
          ({((costs.total / price) * 100).toFixed(1)}% of purchase price)
        </p>
      </div>

      <p className="flex items-start gap-2 text-xs font-dm text-charcoal-400">
        <Info size={13} className="text-emerald-500 mt-0.5 shrink-0" />
        Estimates only. Actual closing costs vary by lender, province/state, and specific circumstances. Consult an Erowho advisor or lawyer for a precise cost schedule.
      </p>
    </div>
  )
}

// ── DOWN PAYMENT PLANNER ──────────────────────────────────────

export function DownPaymentCalc() {
  const [targetPrice,   setTargetPrice]   = useState(800000)
  const [currentSavings,setCurrentSavings]= useState(80000)
  const [monthlySavings,setMonthlySavings]= useState(3000)
  const [country,       setCountry]       = useState<'CA'|'US'>('CA')
  const [fhsaBalance,   setFhsaBalance]   = useState(0)
  const [rrspBalance,   setRrspBalance]   = useState(0)

  const results = useMemo(() => {
    const minPct   = targetPrice >= 1000000 ? 20 : targetPrice >= 500000 ? 10 : 5
    const minDown  = targetPrice >= 1000000 ? targetPrice * 0.20
      : targetPrice >= 500000 ? 25000 + (targetPrice - 500000) * 0.10
      : targetPrice * 0.05
    const rec20Pct = targetPrice * 0.20 // avoid CMHC

    const totalAvailable = currentSavings + (country === 'CA' ? fhsaBalance + Math.min(rrspBalance, 35000) : 0)
    const gapToMin  = Math.max(0, minDown - totalAvailable)
    const gapTo20   = Math.max(0, rec20Pct - totalAvailable)
    const moToMin   = monthlySavings > 0 ? Math.ceil(gapToMin / monthlySavings) : Infinity
    const moTo20    = monthlySavings > 0 ? Math.ceil(gapTo20 / monthlySavings) : Infinity

    const cmhcPct  = totalAvailable / targetPrice < 0.10 ? 4.00
      : totalAvailable / targetPrice < 0.15 ? 3.10
      : totalAvailable / targetPrice < 0.20 ? 2.80 : 0
    const cmhcAmt  = (targetPrice - totalAvailable) * cmhcPct / 100

    return {
      minDown: Math.round(minDown), minPct,
      rec20Pct: Math.round(rec20Pct),
      totalAvailable, gapToMin, gapTo20,
      moToMin, moTo20,
      cmhcAmt: Math.round(cmhcAmt), cmhcPct,
      downPct: Math.round((totalAvailable / targetPrice) * 100 * 10) / 10,
    }
  }, [targetPrice, currentSavings, monthlySavings, country, fhsaBalance, rrspBalance])

  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['CA','US'] as const).map(c => (
          <button key={c} onClick={() => setCountry(c)}
            className={`flex-1 py-2.5 text-sm font-dm font-semibold rounded-xl border transition-all ${country===c?'bg-emerald-700 text-white border-emerald-700':'border-ivory-300 text-charcoal-600 hover:border-emerald-400'}`}>
            {c==='CA' ? '🇨🇦 Canada' : '🇺🇸 USA'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Target Purchase Price</label>
          <input type="number" value={targetPrice} onChange={e => setTargetPrice(+e.target.value)} className="field-input" step={25000} min={100000} />
        </div>
        <div>
          <label className="field-label">Current Savings</label>
          <input type="number" value={currentSavings} onChange={e => setCurrentSavings(+e.target.value)} className="field-input" step={5000} min={0} />
        </div>
        <div>
          <label className="field-label">Monthly Savings Contribution</label>
          <input type="number" value={monthlySavings} onChange={e => setMonthlySavings(+e.target.value)} className="field-input" step={250} min={0} />
        </div>
        {country === 'CA' && (
          <>
            <div>
              <label className="field-label">FHSA Balance (First Home Savings Account)</label>
              <input type="number" value={fhsaBalance} onChange={e => setFhsaBalance(+e.target.value)} className="field-input" step={1000} min={0} max={40000} />
            </div>
            <div>
              <label className="field-label">RRSP Balance (Home Buyers' Plan, max $35K)</label>
              <input type="number" value={rrspBalance} onChange={e => setRrspBalance(+e.target.value)} className="field-input" step={1000} min={0} />
            </div>
          </>
        )}
      </div>

      {/* Results */}
      <div className="bg-section-dark rounded-2xl p-6 text-white space-y-4">
        <div className="text-center">
          <p className="text-2xs font-dm uppercase tracking-[0.15em] text-white/50 mb-1">Current Down Payment Position</p>
          <p className="font-playfair text-4xl font-bold text-gold">{fmt(results.totalAvailable)}</p>
          <p className="text-xs font-dm text-white/40 mt-1">{results.downPct}% of target price</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          <div className="bg-white/8 rounded-xl p-3">
            <p className="text-2xs font-dm text-white/50 uppercase tracking-[0.1em]">Min Required ({results.minPct}%)</p>
            <p className="font-playfair text-xl font-bold text-white mt-1">{fmt(results.minDown)}</p>
            {results.gapToMin > 0
              ? <p className="text-2xs text-red-400 mt-1">Gap: {fmt(results.gapToMin)} ({results.moToMin < 999 ? `~${results.moToMin} mo` : '—'})</p>
              : <p className="text-2xs text-emerald-400 mt-1">✓ You have enough</p>}
          </div>
          <div className="bg-white/8 rounded-xl p-3">
            <p className="text-2xs font-dm text-white/50 uppercase tracking-[0.1em]">Ideal (20% — no CMHC)</p>
            <p className="font-playfair text-xl font-bold text-white mt-1">{fmt(results.rec20Pct)}</p>
            {results.gapTo20 > 0
              ? <p className="text-2xs text-amber-400 mt-1">Gap: {fmt(results.gapTo20)} ({results.moTo20 < 999 ? `~${results.moTo20} mo` : '—'})</p>
              : <p className="text-2xs text-emerald-400 mt-1">✓ No CMHC needed</p>}
          </div>
        </div>

        {country === 'CA' && results.cmhcAmt > 0 && (
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-3">
            <p className="text-xs font-dm text-amber-300 font-semibold">CMHC Insurance Premium</p>
            <p className="text-xs font-dm text-white/65 mt-0.5">
              {fmt(results.cmhcAmt)} ({results.cmhcPct}% of mortgage) added to loan. Avoid by reaching 20% down ({fmt(results.rec20Pct)}).
            </p>
          </div>
        )}
      </div>

      <p className="flex items-start gap-2 text-xs font-dm text-charcoal-400">
        <Info size={13} className="text-emerald-500 mt-0.5 shrink-0" />
        {country === 'CA' && "FHSA contributions are tax-deductible (max $8,000/yr, $40,000 lifetime). RRSP Home Buyers' Plan allows $35,000 withdrawal, repayable over 15 years."}
        {country === 'US' && 'Down payment assistance programs are available in many states. FHA allows 3.5% with a credit score of 580+.'}
      </p>
    </div>
  )
}
