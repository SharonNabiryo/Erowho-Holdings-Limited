'use client'
import { useState } from 'react'
import { useRouter }   from 'next/navigation'
import { Sparkles, Search, Loader2, ArrowRight, MapPin, DollarSign, Home } from 'lucide-react'

const EXAMPLE_PROMPTS = [
  "3-bed condo near downtown Toronto under $900K, walking distance to transit",
  "Waterfront property in Miami for short-term rental, budget $2M, strong ROI",
  "Investment duplex in Toronto or Montreal, fully tenanted, under $1.5M",
  "Modern 2-bed rental in Vancouver under $4,500/mo, pet-friendly, parking included",
  "Luxury home with pool in LA or Miami, 4+ beds, budget up to $4M",
]

export function AIPropertyMatchmaker({ onResultsReady }: { onResultsReady?: (criteria: any) => void }) {
  const router   = useRouter()
  const [input,  setInput]   = useState('')
  const [loading,setLoading] = useState(false)
  const [result, setResult]  = useState<any>(null)
  const [error,  setError]   = useState('')

  const match = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      const data = await res.json()
      if (data.result) {
        setResult(data.result)
        onResultsReady?.(data.result.criteria)
      } else {
        setError('Could not process your request. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const searchWithCriteria = () => {
    if (!result?.criteria) return
    const p = new URLSearchParams()
    const c = result.criteria
    if (c.type)      p.set('type', c.type)
    if (c.locations?.[0]) p.set('city', c.locations[0])
    if (c.maxPrice)  p.set('maxPrice', String(c.maxPrice))
    if (c.minBeds)   p.set('minBeds', String(c.minBeds))
    if (c.keywords?.[0]) p.set('query', c.keywords[0])
    router.push(`/listings?${p.toString()}`)
  }

  return (
    <div className="w-full">
      {!result ? (
        <div className="space-y-4">
          {/* Input */}
          <div className="relative">
            <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500" />
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) match() }}
              placeholder="Describe what you're looking for in plain language… e.g. '3-bed condo in Toronto under $900K, walking distance to transit, modern kitchen'"
              rows={3}
              className="w-full pl-12 pr-4 pt-4 pb-3 border border-ivory-300 rounded-2xl text-sm font-dm text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          {/* Examples */}
          <div>
            <p className="text-2xs font-dm text-charcoal-400 uppercase tracking-[0.12em] mb-2">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.slice(0, 3).map(p => (
                <button key={p} onClick={() => setInput(p)}
                  className="text-xs font-dm px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full hover:bg-emerald-100 transition text-left">
                  {p.length > 60 ? p.slice(0, 57) + '…' : p}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-600 font-dm">{error}</p>}

          <button onClick={match} disabled={!input.trim() || loading} className="btn-lg btn-primary w-full justify-center disabled:opacity-40">
            {loading ? <><Loader2 size={16} className="animate-spin" />Finding matches…</> : <><Sparkles size={16} />Find My Properties</>}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* AI Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <p className="text-2xs font-dm uppercase tracking-[0.12em] text-emerald-600 mb-1">AI Match Summary</p>
                <p className="text-sm font-dm text-charcoal-700 leading-relaxed">{result.summary}</p>
              </div>
            </div>
          </div>

          {/* Extracted Criteria */}
          {result.criteria && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {result.criteria.locations?.length > 0 && (
                <div className="bg-white border border-ivory-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1"><MapPin size={12} className="text-emerald-600" /><span className="text-2xs font-dm text-charcoal-400">Locations</span></div>
                  <p className="text-xs font-dm font-semibold text-charcoal-800">{result.criteria.locations.join(', ')}</p>
                </div>
              )}
              {result.criteria.maxPrice && (
                <div className="bg-white border border-ivory-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1"><DollarSign size={12} className="text-emerald-600" /><span className="text-2xs font-dm text-charcoal-400">Max Price</span></div>
                  <p className="text-xs font-dm font-semibold text-charcoal-800">${result.criteria.maxPrice.toLocaleString()}</p>
                </div>
              )}
              {result.criteria.type && (
                <div className="bg-white border border-ivory-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1"><Home size={12} className="text-emerald-600" /><span className="text-2xs font-dm text-charcoal-400">Type</span></div>
                  <p className="text-xs font-dm font-semibold text-charcoal-800 capitalize">{result.criteria.type}</p>
                </div>
              )}
            </div>
          )}

          {/* AI Insights */}
          {result.insights?.length > 0 && (
            <div className="space-y-2">
              <p className="text-2xs font-dm uppercase tracking-[0.12em] text-charcoal-400">Expert Insights</p>
              {result.insights.map((insight: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm font-dm text-charcoal-600">
                  <span className="text-gold-500 mt-0.5 shrink-0">✦</span>{insight}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={searchWithCriteria} className="btn-lg btn-primary flex-1 justify-center">
              <Search size={16} />View Matching Listings
            </button>
            <button onClick={() => { setResult(null); setInput('') }} className="btn-lg btn-outline">
              Refine
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
