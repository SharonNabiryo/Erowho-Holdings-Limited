'use client'
import { useState, useMemo } from 'react'
import { Info, CheckCircle, AlertCircle } from 'lucide-react'

export function AffordabilityCalc() {
  const [income,     setIncome]     = useState(150000)
  const [coIncome,   setCoIncome]   = useState(0)
  const [debts,      setDebts]      = useState(500)
  const [downPct,    setDownPct]    = useState(20)
  const [rate,       setRate]       = useState(5.5)
  const [country,    setCountry]    = useState<'CA'|'US'>('CA')
  const [condoFees,  setCondoFees]  = useState(0)
  const [propTaxPct, setPropTaxPct] = useState(0.75)

  const totalIncome = income + coIncome
  const monthlyIncome = totalIncome / 12

  // GDS/TDS (Canada) or DTI (USA)
  const results = useMemo(() => {
    const r         = rate / 100 / 12
    const n         = country === 'CA' ? 25 * 12 : 30 * 12
    const maxGDS    = country === 'CA' ? 0.32 : 0.28
    const maxTDS    = country === 'CA' ? 0.44 : 0.43

    // Work backwards: what mortgage P gives monthly payment = maxGDS * monthlyIncome - taxes - condo?
    // First solve for max PITH
    const maxGDSPayment  = monthlyIncome * maxGDS
    const estimatedTax   = 0 // we'll calculate after
    const maxPrincipalPI = maxGDSPayment - condoFees - 200 // rough heat/property tax placeholder

    // Max mortgage from GDS
    const maxMortgageGDS = r === 0
      ? maxPrincipalPI * n
      : maxPrincipalPI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))

    // Max mortgage from TDS (includes existing debts)
    const maxTDSPayment  = monthlyIncome * maxTDS - debts - condoFees - 200
    const maxMortgageTDS = r === 0
      ? maxTDSPayment * n
      : maxTDSPayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))

    const maxMortgage    = Math.max(0, Math.min(maxMortgageGDS, maxMortgageTDS))
    const downPayment    = (downPct / (100 - downPct)) * maxMortgage // down% of purchase price
    const maxPrice       = maxMortgage + downPayment
    const propTaxMonthly = (maxPrice * propTaxPct / 100) / 12

    const monthlyPI  = r === 0 ? maxMortgage / n : maxMortgage * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1)
    const monthlyGDS = monthlyPI + condoFees + propTaxMonthly + 150 // heat estimate
    const gdsRatio   = monthlyGDS / monthlyIncome
    const tdsRatio   = (monthlyGDS + debts) / monthlyIncome

    return {
      maxPrice:    Math.max(0, Math.round(maxPrice)),
      maxMortgage: Math.max(0, Math.round(maxMortgage)),
      downPayment: Math.max(0, Math.round(downPayment)),
      monthlyPI:   Math.max(0, Math.round(monthlyPI)),
      gdsRatio:    Math.round(gdsRatio * 100),
      tdsRatio:    Math.round(tdsRatio * 100),
      maxGDS:      Math.round(maxGDS * 100),
      maxTDS:      Math.round(maxTDS * 100),
      propTaxMonthly: Math.round(propTaxMonthly),
    }
  }, [income, coIncome, debts, downPct, rate, country, condoFees, propTaxPct])

  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`
  const fmtPct = (n: number) => `${n}%`

  const gdsOk  = results.gdsRatio <= results.maxGDS
  const tdsOk  = results.tdsRatio <= results.maxTDS

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-2">
        {(['CA','US'] as const).map(c => (
          <button key={c} onClick={() => setCountry(c)}
            className={`flex-1 py-2.5 text-sm font-dm font-semibold rounded-xl border transition-all ${country===c?'bg-emerald-700 text-white border-emerald-700':'border-ivory-300 text-charcoal-600 hover:border-emerald-400'}`}>
            {c==='CA' ? '🇨🇦 Canada (GDS/TDS)' : '🇺🇸 USA (DTI)'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Annual Gross Income</label>
          <input type="number" value={income} onChange={e => setIncome(+e.target.value)} className="field-input" step={5000} min={0} />
        </div>
        <div>
          <label className="field-label">Co-Borrower Income (optional)</label>
          <input type="number" value={coIncome} onChange={e => setCoIncome(+e.target.value)} className="field-input" step={5000} min={0} />
        </div>
        <div>
          <label className="field-label">Monthly Debt Payments (car, student loans, etc.)</label>
          <input type="number" value={debts} onChange={e => setDebts(+e.target.value)} className="field-input" step={50} min={0} />
        </div>
        <div>
          <label className="field-label">Monthly Condo/HOA Fees</label>
          <input type="number" value={condoFees} onChange={e => setCondoFees(+e.target.value)} className="field-input" step={50} min={0} />
        </div>
        <div>
          <label className="field-label flex items-center justify-between">
            Down Payment <span className="text-emerald-700 normal-case tracking-normal font-semibold">{downPct}%</span>
          </label>
          <input type="range" min={5} max={50} step={1} value={downPct} onChange={e => setDownPct(+e.target.value)} className="w-full accent-emerald-700" />
        </div>
        <div>
          <label className="field-label flex items-center justify-between">
            Interest Rate <span className="text-emerald-700 normal-case tracking-normal font-semibold">{rate}%</span>
          </label>
          <input type="range" min={2} max={12} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-emerald-700" />
        </div>
      </div>

      {/* Results */}
      <div className="bg-section-dark rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <p className="text-2xs font-dm uppercase tracking-[0.15em] text-white/50 mb-1">Maximum Purchase Price</p>
          <p className="font-playfair text-5xl font-bold text-gold">{fmt(results.maxPrice)}</p>
          <p className="text-xs font-dm text-white/40 mt-1">Based on your income and debt profile</p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/10 mb-5">
          {[
            { l: 'Max Mortgage',    v: fmt(results.maxMortgage) },
            { l: 'Down Payment',    v: fmt(results.downPayment) },
            { l: 'Monthly Payment', v: fmt(results.monthlyPI)   },
          ].map(({ l, v }) => (
            <div key={l} className="text-center">
              <p className="font-playfair text-xl font-bold text-white">{v}</p>
              <p className="text-2xs font-dm uppercase tracking-[0.12em] text-white/40 mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {/* Ratio indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-xl border ${gdsOk ? 'bg-emerald-900/40 border-emerald-700' : 'bg-red-900/40 border-red-700'}`}>
            <div className="flex items-center gap-2 mb-1">
              {gdsOk ? <CheckCircle size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-red-400" />}
              <span className="text-xs font-dm text-white/70">{country==='CA'?'GDS Ratio':'Front-End DTI'}</span>
            </div>
            <p className="font-playfair text-xl font-bold text-white">{fmtPct(results.gdsRatio)}</p>
            <p className="text-2xs font-dm text-white/40">Max: {fmtPct(results.maxGDS)}</p>
          </div>
          <div className={`p-3 rounded-xl border ${tdsOk ? 'bg-emerald-900/40 border-emerald-700' : 'bg-red-900/40 border-red-700'}`}>
            <div className="flex items-center gap-2 mb-1">
              {tdsOk ? <CheckCircle size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-red-400" />}
              <span className="text-xs font-dm text-white/70">{country==='CA'?'TDS Ratio':'Back-End DTI'}</span>
            </div>
            <p className="font-playfair text-xl font-bold text-white">{fmtPct(results.tdsRatio)}</p>
            <p className="text-2xs font-dm text-white/40">Max: {fmtPct(results.maxTDS)}</p>
          </div>
        </div>
      </div>

      <p className="flex items-start gap-2 text-xs font-dm text-charcoal-400">
        <Info size={13} className="text-emerald-500 mt-0.5 shrink-0" />
        Estimates are based on standard {country==='CA' ? 'Canadian (GDS/TDS)' : 'US (DTI)'} qualification guidelines. Lenders may apply additional criteria. Get pre-approved with an Erowho mortgage partner for a precise figure.
      </p>
    </div>
  )
}
