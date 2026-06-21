'use client'
import { useCallback, useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  SlidersHorizontal, LayoutGrid, List, X, Search, MapPin, GitCompare,
} from 'lucide-react'
import { PropertyCard } from '@/components/listings/PropertyCard'
import { PROPERTIES } from '@/data'
import { cn } from '@/lib/utils'
import type { Property } from '@/types'

// ─── Filter config ────────────────────────────────────────────

const TYPES   = [{ v:'',           l:'All Types' },{ v:'buy',l:'For Sale' },{ v:'rent',l:'For Rent' },{ v:'luxury',l:'Luxury' },{ v:'investment',l:'Investment' },{ v:'commercial',l:'Commercial' }]
const CITIES  = ['','Toronto','Vancouver','Montreal','Calgary','New York','Miami','Los Angeles','Chicago','Houston']
const PRICES  = [{ v:'',l:'Any Price' },{ v:'0-500000',l:'Under $500K' },{ v:'500000-1000000',l:'$500K–$1M' },{ v:'1000000-3000000',l:'$1M–$3M' },{ v:'3000000-5000000',l:'$3M–$5M' },{ v:'5000000-99999999',l:'$5M+' }]
const BEDS    = [0,1,2,3,4,5]
const SORTS   = [{ v:'newest',l:'Newest First' },{ v:'price-asc',l:'Price ↑' },{ v:'price-desc',l:'Price ↓' },{ v:'beds',l:'Most Beds' }]

function ListingsContent() {
  const sp = useSearchParams()

  const [type,      setType]      = useState(sp.get('type')    ?? '')
  const [city,      setCity]      = useState(sp.get('city')    ?? '')
  const [country,   setCountry]   = useState(sp.get('country') ?? '')
  const [price,     setPrice]     = useState('')
  const [minBeds,   setMinBeds]   = useState(0)
  const [query,     setQuery]     = useState(sp.get('query')   ?? '')
  const [sortBy,    setSortBy]    = useState('newest')
  const [view,      setView]      = useState<'grid' | 'list'>('grid')
  const [showPanel, setShowPanel] = useState(false)
  const [results,   setResults]   = useState<Property[]>(PROPERTIES)
  const [compared,  setCompared]  = useState<string[]>([])

  const filter = useCallback(() => {
    let r = [...PROPERTIES]
    if (type)    r = r.filter(p => p.type    === type)
    if (country) r = r.filter(p => p.country === country)
    if (city)    r = r.filter(p => p.city.toLowerCase() === city.toLowerCase())
    if (price) {
      const [mn, mx] = price.split('-').map(Number)
      r = r.filter(p => p.price >= mn && p.price <= (mx || 1e9))
    }
    if (minBeds) r = r.filter(p => p.beds >= minBeds)
    if (query) {
      const q = query.toLowerCase()
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.features.some(f => f.toLowerCase().includes(q))
      )
    }
    switch (sortBy) {
      case 'price-asc':  r.sort((a, b) => a.price - b.price); break
      case 'price-desc': r.sort((a, b) => b.price - a.price); break
      case 'beds':       r.sort((a, b) => b.beds - a.beds);   break
      default:           r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    setResults(r)
  }, [type, city, country, price, minBeds, query, sortBy])

  useEffect(() => { filter() }, [filter])

  const clearAll = () => {
    setType(''); setCity(''); setCountry(''); setPrice(''); setMinBeds(0); setQuery(''); setSortBy('newest')
  }
  const hasFilters = !!(type || city || country || price || minBeds || query)

  const toggleCompare = (id: string) => {
    setCompared(prev =>
      prev.includes(id) ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev
    )
  }

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Page header */}
      <div className="page-hero">
        <div className="container-xl w-full">
          <nav className="text-2xs font-dm text-white/40 mb-3 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">Properties</span>
          </nav>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">
            {type ? TYPES.find(t => t.v === type)?.l ?? 'All Properties' : 'All Properties'}
          </h1>
          <p className="font-dm text-white/55 text-sm">{results.length} properties across Canada &amp; USA</p>

          {/* Inline search row */}
          <div className="mt-5 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 flex-1 max-w-sm">
              <Search size={14} className="text-white/45 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by keyword or neighbourhood…"
                className="bg-transparent text-white placeholder:text-white/35 text-sm font-dm focus:outline-none flex-1"
              />
            </div>
            <button
              onClick={() => setShowPanel(p => !p)}
              className={cn('btn-md btn-white gap-2', showPanel && 'bg-white/20')}
            >
              <SlidersHorizontal size={14} />
              Filters
              {hasFilters && <span className="w-5 h-5 rounded-full bg-gold-500 text-charcoal-950 text-[10px] font-bold flex items-center justify-center">!</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showPanel && (
        <div className="bg-white border-b border-ivory-200 shadow-sm">
          <div className="container-xl py-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="field-label">Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)} className="field-select">
                  <option value="">All</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="US">🇺🇸 USA</option>
                </select>
              </div>
              <div>
                <label className="field-label">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="field-select">
                  {TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">City</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="field-select">
                  {CITIES.map(c => <option key={c} value={c}>{c || 'All Cities'}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Price</label>
                <select value={price} onChange={e => setPrice(e.target.value)} className="field-select">
                  {PRICES.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Min Beds</label>
                <select value={minBeds} onChange={e => setMinBeds(+e.target.value)} className="field-select">
                  {BEDS.map(b => <option key={b} value={b}>{b === 0 ? 'Any' : `${b}+`}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                {hasFilters && (
                  <button onClick={clearAll} className="w-full btn-md btn-ghost border border-charcoal-200 text-red-500 hover:bg-red-50">
                    <X size={13} /> Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results bar */}
      <div className="bg-white border-b border-ivory-200 sticky top-[var(--nav-height)] z-30">
        <div className="container-xl py-3 flex items-center justify-between gap-4">
          <p className="text-sm font-dm text-charcoal-600">
            <span className="font-semibold text-charcoal-900">{results.length}</span> properties
            {hasFilters && (
              <button onClick={clearAll} className="ml-3 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                <X size={10} />Clear filters
              </button>
            )}
          </p>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="field-select w-auto text-xs py-2 pr-6">
              {SORTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
            <div className="flex items-center border border-ivory-200 rounded-lg p-0.5">
              {([['grid', LayoutGrid], ['list', List]] as const).map(([v, Icon]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn('p-1.5 rounded transition', view === v ? 'bg-emerald-700 text-white' : 'text-charcoal-400 hover:text-charcoal-700')}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-xl py-10">
        {results.length === 0 ? (
          <div className="py-24 text-center">
            <MapPin size={48} className="text-charcoal-200 mx-auto mb-4" />
            <h3 className="font-playfair text-2xl font-bold text-charcoal-800 mb-2">No properties found</h3>
            <p className="font-dm text-charcoal-400 mb-6">Try adjusting your filters.</p>
            <button onClick={clearAll} className="btn-md btn-primary">Clear All Filters</button>
          </div>
        ) : (
          <div className={cn(
            view === 'grid'
              ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4',
          )}>
            {results.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                variant={view === 'list' ? 'horizontal' : 'default'}
                onCompare={toggleCompare}
                comparing={compared.includes(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Compare bar */}
      {compared.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-charcoal-950 text-white px-5 py-3 rounded-2xl shadow-card-hover flex items-center gap-4 font-dm">
            <GitCompare size={16} className="text-gold-400" />
            <span className="text-sm">{compared.length} selected</span>
            <button className="btn-sm btn-gold">Compare</button>
            <button onClick={() => setCompared([])} className="text-white/40 hover:text-white transition">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory-50" />}>
      <ListingsContent />
    </Suspense>
  )
}
