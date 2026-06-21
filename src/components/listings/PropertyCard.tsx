'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, BedDouble, Bath, Maximize2, MapPin, Star, TrendingUp } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { Property } from '@/types'

interface Props {
  property: Property
  className?: string
  variant?: 'default' | 'horizontal' | 'featured'
  onCompare?: (id: string) => void
  comparing?: boolean
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  'listing-of-month': { label: '🏆 Listing of the Month', cls: 'badge-gold' },
  'listing-of-week':  { label: '⭐ Listing of the Week',  cls: 'badge-gold' },
  featured:           { label: 'Featured',                cls: 'badge-emerald' },
  active:             { label: 'Active',                  cls: 'badge-emerald' },
  pending:            { label: 'Pending',                 cls: 'badge-pending' },
}

const TYPE_BADGE: Record<string, string> = {
  rent:       'badge-rent',
  buy:        'badge-emerald',
  luxury:     'badge-gold',
  investment: 'badge-clay',
  commercial: 'badge-clay',
}

export function PropertyCard({ property: p, className, variant = 'default', onCompare, comparing }: Props) {
  const [saved, setSaved] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const fallback = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=60'
  const isRent   = p.type === 'rent'
  const isCom    = p.type === 'commercial'
  const status   = STATUS_BADGE[p.status] ?? STATUS_BADGE.active
  const typeCls  = TYPE_BADGE[p.type] ?? 'badge-emerald'

  if (variant === 'horizontal') {
    return (
      <article className={cn('card-hover flex overflow-hidden', className)}>
        {/* Image */}
        <div className="relative w-56 md:w-64 shrink-0">
          <Image
            src={imgErr ? fallback : p.images[0]}
            alt={p.name}
            fill
            className="object-cover"
            onError={() => setImgErr(true)}
          />
          <button
            onClick={() => setSaved((s) => !s)}
            className={cn(
              'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md',
              saved ? 'bg-emerald-700 text-white' : 'bg-white/90 text-charcoal-500 hover:bg-white',
            )}
          >
            <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="font-playfair text-xl font-bold text-charcoal-950 leading-snug">
                {formatPrice(p.price, isRent)}
              </div>
              {p.tag && <span className={cn('badge shrink-0', typeCls)}>{p.tag}</span>}
            </div>
            <Link
              href={`/properties/${p.slug}`}
              className="font-dm font-semibold text-charcoal-800 hover:text-emerald-700 transition-colors line-clamp-1 mb-1"
            >
              {p.name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-dm text-charcoal-400 mb-3">
              <MapPin size={11} className="text-emerald-500 shrink-0" />
              {p.city}, {p.province} {p.country === 'CA' ? '🇨🇦' : '🇺🇸'}
            </div>
          </div>
          <div className="flex items-center gap-4 pt-3 border-t border-ivory-200">
            {!isCom && p.beds > 0 && (
              <span className="flex items-center gap-1 text-xs font-dm text-charcoal-600">
                <BedDouble size={13} className="text-emerald-600" />{p.beds} Bed{p.beds !== 1 ? 's' : ''}
              </span>
            )}
            {!isCom && (
              <span className="flex items-center gap-1 text-xs font-dm text-charcoal-600">
                <Bath size={13} className="text-emerald-600" />{p.baths} Bath{p.baths !== 1 ? 's' : ''}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs font-dm text-charcoal-600">
              <Maximize2 size={13} className="text-emerald-600" />{p.sqft.toLocaleString()} sqft
            </span>
            {p.capRate && (
              <span className="flex items-center gap-1 text-xs font-dm text-emerald-700 font-semibold ml-auto">
                <TrendingUp size={12} />Cap {p.capRate}%
              </span>
            )}
          </div>
        </div>
      </article>
    )
  }

  // ── Default Card ─────────────────────────────────────────────

  return (
    <article
      className={cn(
        'card-hover group relative',
        comparing && 'ring-2 ring-emerald-500',
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-[220px] overflow-hidden">
        <Image
          src={imgErr ? fallback : p.images[0]}
          alt={p.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={() => setImgErr(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent opacity-60" />

        {/* Status badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {(p.status === 'listing-of-week' || p.status === 'listing-of-month') && (
            <span className={cn('badge', status.cls)}>{status.label}</span>
          )}
          <span className={cn('badge', typeCls)}>
            {p.type === 'rent' ? 'For Rent' : p.type === 'commercial' ? 'Commercial' : p.type === 'investment' ? 'Investment' : p.type === 'luxury' ? 'Luxury' : 'For Sale'}
          </span>
        </div>

        {/* Save */}
        <button
          onClick={() => setSaved((s) => !s)}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md',
            saved ? 'bg-emerald-700 text-white' : 'bg-white/90 text-charcoal-400 hover:bg-white hover:text-emerald-700',
          )}
          aria-label={saved ? 'Remove from saved' : 'Save property'}
        >
          <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
        </button>

        {/* Country */}
        <div className="absolute bottom-3 right-3 text-base">{p.country === 'CA' ? '🇨🇦' : '🇺🇸'}</div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="font-playfair text-[1.35rem] font-bold text-charcoal-950 leading-snug">
            {formatPrice(p.price, isRent)}
          </div>
          {p.capRate && (
            <div className="text-xs font-dm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">
              Cap {p.capRate}%
            </div>
          )}
        </div>

        <Link
          href={`/properties/${p.slug}`}
          className="block font-dm font-semibold text-charcoal-900 hover:text-emerald-700 transition-colors leading-snug mb-1.5 line-clamp-1"
        >
          {p.name}
        </Link>

        <div className="flex items-center gap-1.5 text-xs font-dm text-charcoal-400 mb-4">
          <MapPin size={11} className="text-emerald-500 shrink-0" />
          <span className="truncate">{p.address}</span>
        </div>

        {/* Features row */}
        <div className="flex items-center gap-3 pt-3.5 border-t border-ivory-200">
          {!isCom && p.beds > 0 && (
            <span className="flex items-center gap-1 text-xs font-dm text-charcoal-600">
              <BedDouble size={13} className="text-emerald-600" />{p.beds}
            </span>
          )}
          {!isCom && (
            <span className="flex items-center gap-1 text-xs font-dm text-charcoal-600">
              <Bath size={13} className="text-emerald-600" />{p.baths}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-dm text-charcoal-600">
            <Maximize2 size={13} className="text-emerald-600" />{p.sqft.toLocaleString()}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <Star size={11} fill="#ca8a04" className="text-gold-600" />
            <span className="text-xs font-dm text-charcoal-400">{p.agent.rating}</span>
          </div>
        </div>

        {/* Compare */}
        {onCompare && (
          <button
            onClick={() => onCompare(p.id)}
            className={cn(
              'mt-3 w-full text-xs font-dm py-1.5 rounded-lg border transition-all',
              comparing
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'border-ivory-300 text-charcoal-500 hover:border-emerald-400 hover:text-emerald-700',
            )}
          >
            {comparing ? '✓ Added to Compare' : '+ Compare'}
          </button>
        )}
      </div>
    </article>
  )
}
