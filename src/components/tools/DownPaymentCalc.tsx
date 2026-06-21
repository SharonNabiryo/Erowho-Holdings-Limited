'use client'
import { useState } from 'react'
import { Info } from 'lucide-react'

interface Props { defaultPrice?: number }

export function DownPaymentCalc({ defaultPrice = 750000 }: Props) {
  const [price,   setPrice]   = useState(defaultPrice)
  const [downPct, setDownPct] = useState(20)
  const [savings, setSavings] = useState(0)
  const [monthly, setMonthly] = useState(2000)
  const [country, setCountry] = useState<'CA'|'US'>('CA')

  const down       = price * downPct / 100
  const remaining  = Math.max(0, down - savings)
  const months     = monthly > 0 ? Math.ceil(remaining / monthly) : 0
  const yrs        = Math.floor(months / 12)
  const mo         = months % 12
  const cmhcRate   = country==='CA' && downPct<20 ? (downPct>=15?0.028 : downPct>=10?0.031 : 0.04) : 0
  const cmhcAmt    = cmhcRate > 0 ? (price - down) * cmhcRate : 0
  const minDown    = country==='CA' ? price<=500000 ? price*0.05 : price<=999999 ? 25000+(price-500000)*0.10 : price*0.20 : price*0.03
  const fmt        = (n:number) => `$${Math.round(n).toLocaleString()}`

  const SCENARIOS = [
    { l:'5% Down',  p:5,  n:country==='CA'?'CMHC insurance required':'Conventional' },
    { l:'10% Down', p:10, n:country==='CA'?'Lower CMHC premium':'Lower PMI' },
    { l:'20% Down', p:20, n:'No insurance required' },
    { l:'25% Down', p:25, n:'Stronger offer position' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['CA','US'] as const).map(c=>(
          <button key={c} onClick={()=>setCountry(c)}
            className={`flex-1 py-2.5 text-sm font-dm font-semibold rounded-xl border transition-all ${country===c?'bg-emerald-700 text-white border-emerald-700':'bg-white text-charcoal-600 border-ivory-300 hover:border-emerald-300'}`}>
            {c==='CA'?'🇨🇦 Canada':'🇺🇸 United States'}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="field-label">Property Price</label><input type="number" value={price} min={100000} step={25000} onChange={e=>setPrice(+e.target.value)} className="field-input"/></div>
        <div>
          <label className="field-label flex items-center justify-between">Down Payment <span className="normal-case tracking-normal font-semibold text-emerald-700">{downPct}% = {fmt(down)}</span></label>
          <input type="range" min={country==='CA'?5:3} max={50} step={1} value={downPct} onChange={e=>setDownPct(+e.target.value)} className="w-full accent-emerald-700 mt-2"/>
          <div className="flex justify-between text-2xs text-charcoal-400 font-dm mt-1"><span>Min</span><span>50%</span></div>
        </div>
        <div><label className="field-label">Current Savings</label><input type="number" value={savings} min={0} step={5000} onChange={e=>setSavings(+e.target.value)} className="field-input"/></div>
        <div><label className="field-label">Monthly Savings Capacity</label><input type="number" value={monthly} min={0} step={100} onChange={e=>setMonthly(+e.target.value)} className="field-input"/></div>
      </div>
      {/* Results */}
      <div className="bg-section-dark rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center"><p className="text-2xs font-dm uppercase tracking-[0.15em] text-white/50 mb-1">Down Payment</p><p className="font-playfair text-3xl font-bold text-gold">{fmt(down)}</p></div>
          <div className="text-center"><p className="text-2xs font-dm uppercase tracking-[0.15em] text-white/50 mb-1">Still to Save</p><p className="font-playfair text-3xl font-bold text-white">{fmt(remaining)}</p></div>
        </div>
        {remaining>0 && monthly>0 && (
          <div className="bg-white/10 rounded-xl px-4 py-2.5 mb-4 text-center">
            <p className="text-sm font-dm text-white/70">At {fmt(monthly)}/mo → <span className="font-bold text-white">{yrs>0?`${yrs}yr `:''}{mo>0?`${mo}mo`:''}</span> to reach goal</p>
          </div>
        )}
        {cmhcAmt>0 && <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl px-4 py-2.5 text-sm font-dm text-amber-200 mb-4"><strong>CMHC:</strong> {fmt(cmhcAmt)} ({(cmhcRate*100).toFixed(1)}%) added to mortgage</div>}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          <div><p className="text-2xs font-dm text-white/50 mb-0.5">Min Required</p><p className="text-sm font-dm font-bold text-white">{fmt(minDown)}</p></div>
          <div><p className="text-2xs font-dm text-white/50 mb-0.5">Loan Amount</p><p className="text-sm font-dm font-bold text-white">{fmt(price-down)}</p></div>
        </div>
      </div>
      {/* Scenarios */}
      <div className="space-y-2">
        <p className="text-xs font-dm font-bold uppercase tracking-[0.12em] text-charcoal-500">Scenarios</p>
        {SCENARIOS.map(s=>{
          const active = s.p===downPct
          return (
            <button key={s.p} onClick={()=>setDownPct(s.p)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${active?'bg-emerald-50 border-emerald-300':'bg-white border-ivory-200 hover:border-emerald-200'}`}>
              <div><p className={`text-sm font-dm font-semibold ${active?'text-emerald-800':'text-charcoal-700'}`}>{s.l}</p><p className="text-2xs font-dm text-charcoal-400">{s.n}</p></div>
              <p className={`font-playfair text-lg font-bold ${active?'text-emerald-700':'text-charcoal-600'}`}>{fmt(price*s.p/100)}</p>
            </button>
          )
        })}
      </div>
      <p className="flex items-start gap-2 text-xs font-dm text-charcoal-400"><Info size={13} className="text-emerald-500 mt-0.5 shrink-0"/>
        {country==='CA'?'CMHC mortgage insurance applies to all insured mortgages with under 20% down. The premium is added to the mortgage balance.':'US PMI typically applies to conventional loans under 20% down at ~0.5–1% per year of the loan amount.'}
      </p>
    </div>
  )
}
