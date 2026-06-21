'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, DollarSign, Home, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPES = [
  { label: 'Buy',        value: 'buy' },
  { label: 'Rent',       value: 'rent' },
  { label: 'Luxury',     value: 'luxury' },
  { label: 'Invest',     value: 'investment' },
  { label: 'Commercial', value: 'commercial' },
]

const CITY_OPTS = [
  { label: '🇨🇦 All of Canada', value: '', country: 'CA' },
  { label: 'Toronto, ON',    value: 'Toronto' },
  { label: 'Vancouver, BC',  value: 'Vancouver' },
  { label: 'Montreal, QC',   value: 'Montreal' },
  { label: 'Calgary, AB',    value: 'Calgary' },
  { label: 'Ottawa, ON',     value: 'Ottawa' },
  { label: '🇺🇸 All of USA',  value: '', country: 'US' },
  { label: 'New York, NY',   value: 'New York' },
  { label: 'Miami, FL',      value: 'Miami' },
  { label: 'Los Angeles, CA',value: 'Los Angeles' },
  { label: 'Chicago, IL',    value: 'Chicago' },
  { label: 'Houston, TX',    value: 'Houston' },
]

const PRICE_RANGES = [
  { label: 'Any Price',        value: '' },
  { label: 'Under $500K',      value: '0-500000' },
  { label: '$500K – $1M',      value: '500000-1000000' },
  { label: '$1M – $3M',        value: '1000000-3000000' },
  { label: '$3M – $5M',        value: '3000000-5000000' },
  { label: '$5M+',             value: '5000000-99999999' },
]

interface HeroSearchProps {
  variant?: 'hero' | 'compact'
  className?: string
}

export function HeroSearch({ variant = 'hero', className }: HeroSearchProps) {
  const router = useRouter()
  const [activeType, setActiveType] = useState('buy')
  const [city,  setCity]  = useState('')
  const [price, setPrice] = useState('')
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    const p = new URLSearchParams()
    if (activeType) p.set('type', activeType)
    if (city)  p.set('city', city)
    if (price) {
      const [min, max] = price.split('-')
      if (min) p.set('minPrice', min)
      if (max && max !== '99999999') p.set('maxPrice', max)
    }
    if (query) p.set('query', query)
    router.push(`/listings?${p.toString()}`)
  }

  if (variant === 'compact') {
    return (
      <div className={cn('bg-white rounded-2xl shadow-card border border-ivory-200 p-3', className)}>
        <div className="flex flex-wrap gap-2">
          <select value={activeType} onChange={e => setActiveType(e.target.value)} className="field-select flex-1 min-w-28 py-2.5">
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={city} onChange={e => setCity(e.target.value)} className="field-select flex-1 min-w-36 py-2.5">
            {CITY_OPTS.map(c => <option key={`${c.value}-${c.country ?? ''}`} value={c.value}>{c.label}</option>)}
          </select>
          <select value={price} onChange={e => setPrice(e.target.value)} className="field-select flex-1 min-w-36 py-2.5">
            {PRICE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <button onClick={handleSearch} className="btn-md btn-primary">
            <Search size={15} /> Search
          </button>
        </div>
      </div>
    )
  }

  // ── Hero variant ─────────────────────────────────────────────
  return (
    <div className={cn('w-full max-w-3xl', className)}>
      {/* Tabs */}
      <div className="flex gap-1 mb-0">
        {TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => setActiveType(t.value)}
            className={cn(
              'px-4 py-2 text-sm font-dm font-semibold rounded-t-xl transition-all duration-150',
              activeType === t.value
                ? 'bg-white text-emerald-800'
                : 'bg-white/15 text-white hover:bg-white/25',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-hero p-2">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Location */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-ivory-200 rounded-xl hover:border-emerald-300 focus-within:border-emerald-400 transition-colors">
            <MapPin size={16} className="text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="field-label text-[9px] mb-0.5">Location</p>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full text-sm font-dm text-charcoal-800 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="">Anywhere in Canada or USA</option>
                <optgroup label="🇨🇦 Canada">
                  {CITY_OPTS.filter(c => !c.country && ['Toronto','Vancouver','Montreal','Calgary','Ottawa'].includes(c.value)).map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </optgroup>
                <optgroup label="🇺🇸 United States">
                  {CITY_OPTS.filter(c => !c.country && ['New York','Miami','Los Angeles','Chicago','Houston'].includes(c.value)).map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="md:w-48 flex items-center gap-3 px-4 py-3 border border-ivory-200 rounded-xl hover:border-emerald-300 focus-within:border-emerald-400 transition-colors">
            <DollarSign size={16} className="text-emerald-600 shrink-0" />
            <div className="flex-1">
              <p className="field-label text-[9px] mb-0.5">Price Range</p>
              <select
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full text-sm font-dm text-charcoal-800 focus:outline-none bg-transparent cursor-pointer"
              >
                {PRICE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>

          {/* Keyword */}
          <div className="md:w-44 flex items-center gap-3 px-4 py-3 border border-ivory-200 rounded-xl hover:border-emerald-300 focus-within:border-emerald-400 transition-colors">
            <Home size={16} className="text-emerald-600 shrink-0" />
            <div className="flex-1">
              <p className="field-label text-[9px] mb-0.5">Keyword</p>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="pool, penthouse…"
                className="w-full text-sm font-dm text-charcoal-800 focus:outline-none bg-transparent placeholder:text-charcoal-300"
              />
            </div>
          </div>

          {/* CTA */}
          <button onClick={handleSearch} className="btn-xl btn-primary rounded-xl">
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  )
}
