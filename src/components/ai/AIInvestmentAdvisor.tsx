'use client'
import { useState } from 'react'
import { Loader2, TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react'

const RATING_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'Strong Buy': { color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', label: '🟢 Strong Buy' },
  'Buy':        { color: 'text-blue-700',    bg: 'bg-blue-100 border-blue-200',       label: '🔵 Buy'        },
  'Hold':       { color: 'text-amber-700',   bg: 'bg-amber-100 border-amber-200',     label: '🟡 Hold'       },
  'Caution':    { color: 'text-orange-700',  bg: 'bg-orange-100 border-orange-200',   label: '🟠 Caution'    },
  'Avoid':      { color: 'text-red-700',     bg: 'bg-red-100 border-red-200',         label: '🔴 Avoid'      },
}

export function AIInvestmentAdvisor() {
  const [price,      setPrice]      = useState(900000)
  const [downPct,    setDownPct]    = useState(25)
  const [rent,       setRent]       = useState(3500)
  const [expenses,   setExpenses]   = useState(1200)
  const [appreciation,setAppreciation] = useState(4)
  const [city,       setCity]       = useState('Toronto')
  const [country,    setCountry]    = useState<'CA'|'US'>('CA')
  const [type,       setType]       = useState('Residential')
  const [result,     setResult]     = useState<any>(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  const analyse = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/investment-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { price, downPct, monthlyRent: rent, expenses, appreciation, city, country, type },
        }),
      })
      const data = await res.json()
      if (data.result) setResult(data.result)
      else setError('Analysis failed. Please try again.')
    } catch {
      setError('Could not connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fmt    = (n: number) => `$${Math.round(n).toLocaleString()}`
  const fmtPct = (n: number) => `${Number(n).toFixed(1)}%`

  return (
    <div className="card p-7">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gold-100 border border-gold-200 flex items-center justify-center">
          <Zap size={17} className="text-gold-700" />
        </div>
        <div>
          <h3 className="font-playfair text-lg font-bold text-charcoal-950">AI Investment Advisor</h3>
          <p className="text-2xs font-dm text-charcoal-400">Powered by Claude</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Purchase Price</label>
              <input type="number" value={price} onChange={e => setPrice(+e.target.value)} className="field-input" step={25000} min={100000} />
            </div>
            <div>
              <label className="field-label flex justify-between">
                Down Payment <span className="text-emerald-700 normal-case tracking-normal font-semibold">{downPct}%</span>
              </label>
              <input type="range" min={10} max={60} step={5} value={downPct} onChange={e => setDownPct(+e.target.value)} className="w-full accent-emerald-700 mt-2" />
            </div>
            <div>
              <label className="field-label">Monthly Rental Income</label>
              <input type="number" value={rent} onChange={e => setRent(+e.target.value)} className="field-input" step={100} min={0} />
            </div>
            <div>
              <label className="field-label">Monthly Expenses</label>
              <input type="number" value={expenses} onChange={e => setExpenses(+e.target.value)} className="field-input" step={50} min={0} />
            </div>
            <div>
              <label className="field-label">City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="field-input" placeholder="Toronto, Miami…" />
            </div>
            <div>
              <label className="field-label">Country</label>
              <select value={country} onChange={e => setCountry(e.target.value as 'CA'|'US')} className="field-select">
                <option value="CA">🇨🇦 Canada</option>
                <option value="US">🇺🇸 USA</option>
              </select>
            </div>
            <div>
              <label className="field-label flex justify-between">
                Annual Appreciation <span className="text-emerald-700 normal-case tracking-normal font-semibold">{appreciation}%</span>
              </label>
              <input type="range" min={0} max={12} step={0.5} value={appreciation} onChange={e => setAppreciation(+e.target.value)} className="w-full accent-emerald-700 mt-2" />
            </div>
            <div>
              <label className="field-label">Property Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="field-select">
                {['Residential','Condo','Multi-Family','Commercial','Industrial'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 font-dm">{error}</p>}

          <button onClick={analyse} disabled={loading} className="btn-lg btn-primary w-full justify-center">
            {loading ? <><Loader2 size={16} className="animate-spin" />Analysing Investment…</> : <><Zap size={15} />Generate AI Analysis</>}
          </button>
          <p className="text-center text-2xs font-dm text-charcoal-400">
            Powered by Anthropic Claude · For informational purposes only
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Rating */}
          {result.rating && (
            <div className={`p-4 rounded-2xl border ${RATING_CONFIG[result.rating]?.bg ?? 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xs font-dm uppercase tracking-[0.12em] text-charcoal-500 mb-1">Investment Verdict</p>
                  <p className={`font-playfair text-2xl font-bold ${RATING_CONFIG[result.rating]?.color ?? 'text-charcoal-900'}`}>
                    {RATING_CONFIG[result.rating]?.label ?? result.rating}
                  </p>
                </div>
                {result.headline && (
                  <p className="text-xs font-dm text-charcoal-600 max-w-[55%] text-right italic">"{result.headline}"</p>
                )}
              </div>
            </div>
          )}

          {/* Metrics */}
          {result.metrics && (
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { l: 'Cap Rate',       v: fmtPct(result.metrics.capRate)    },
                { l: 'Cash-on-Cash',   v: fmtPct(result.metrics.cashOnCash) },
                { l: 'Annual ROI',     v: fmtPct(result.metrics.annualROI)  },
                { l: 'Monthly NOI',    v: fmt(result.metrics.monthlyNOI)    },
              ].map(({ l, v }) => (
                <div key={l} className="bg-ivory-100 border border-ivory-200 rounded-xl p-3 text-center">
                  <p className="font-playfair text-xl font-bold text-emerald-700">{v}</p>
                  <p className="text-2xs font-dm text-charcoal-400 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          )}

          {/* Analysis */}
          {result.analysis && (
            <div>
              <p className="text-2xs font-dm uppercase tracking-[0.12em] text-charcoal-400 mb-2">Analysis</p>
              <p className="text-sm font-dm text-charcoal-700 leading-relaxed">{result.analysis}</p>
            </div>
          )}

          {/* Risks & Opportunities */}
          <div className="grid grid-cols-2 gap-4">
            {result.risks && (
              <div>
                <p className="text-2xs font-dm uppercase tracking-[0.12em] text-red-500 mb-2">Key Risks</p>
                <ul className="space-y-1.5">
                  {result.risks.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-dm text-charcoal-600">
                      <AlertCircle size={12} className="text-red-400 shrink-0 mt-0.5" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.opportunities && (
              <div>
                <p className="text-2xs font-dm uppercase tracking-[0.12em] text-emerald-600 mb-2">Opportunities</p>
                <ul className="space-y-1.5">
                  {result.opportunities.map((o: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-dm text-charcoal-600">
                      <CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />{o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.recommendation && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-2xs font-dm uppercase tracking-[0.12em] text-emerald-600 mb-1">Recommendation</p>
              <p className="text-sm font-dm text-charcoal-800 font-medium">{result.recommendation}</p>
            </div>
          )}

          <button onClick={() => setResult(null)} className="btn-md btn-outline w-full justify-center">
            <TrendingUp size={15} /> Analyse Another Property
          </button>
        </div>
      )}
    </div>
  )
}
