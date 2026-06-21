import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BedDouble, Bath, Maximize2, Calendar, MapPin,
  Share2, Heart, Phone, Mail, Star, ArrowRight,
} from 'lucide-react'
import { PROPERTIES } from '@/data'
import { PropertyCard }       from '@/components/listings/PropertyCard'
import { MortgageCalculator } from '@/components/property/MortgageCalculator'
import { ScheduleForm }       from '@/components/property/ScheduleForm'
import { formatPrice }        from '@/lib/utils'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return PROPERTIES.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = PROPERTIES.find(x => x.slug === params.slug)
  if (!p) return { title: 'Not Found' }
  return {
    title: `${p.name} in ${p.city} | Erowho Holdings`,
    description: p.description.slice(0, 155),
  }
}

export default function PropertyPage({ params }: Props) {
  const p = PROPERTIES.find(x => x.slug === params.slug)
  if (!p) notFound()

  const isRent = p.type === 'rent'
  const isCom  = p.type === 'commercial'
  const similar = PROPERTIES.filter(x => x.id !== p.id && (x.city === p.city || x.type === p.type)).slice(0, 3)

  return (
    <div className="min-h-screen bg-ivory-50 pt-[var(--nav-height)]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-ivory-200">
        <div className="container-xl py-3">
          <nav className="flex items-center gap-2 text-2xs font-dm text-charcoal-400">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/listings" className="hover:text-emerald-700 transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-charcoal-700 truncate">{p.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-xl py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {p.tag && <span className="badge badge-gold">{p.tag}</span>}
              <span className={`badge ${isRent ? 'badge-rent' : isCom ? 'badge-clay' : 'badge-emerald'}`}>
                {isRent ? 'For Rent' : isCom ? 'Commercial' : 'For Sale'}
              </span>
              <span className="text-base">{p.country === 'CA' ? '🇨🇦' : '🇺🇸'}</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal-950 mb-2 leading-tight">
              {p.name}
            </h1>
            <div className="flex items-center gap-1.5 text-sm font-dm text-charcoal-500">
              <MapPin size={13} className="text-emerald-600 shrink-0" />
              {p.address}
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
            <p className="font-playfair text-4xl font-bold text-charcoal-950">
              {formatPrice(p.price, isRent)}
            </p>
            <div className="flex gap-2">
              <button className="btn-sm btn-ghost border border-ivory-300 text-xs">
                <Heart size={12} /> Save
              </button>
              <button className="btn-sm btn-ghost border border-ivory-300 text-xs">
                <Share2 size={12} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[460px] rounded-2xl overflow-hidden mb-8">
          <div className="col-span-2 row-span-2 relative">
            <Image src={p.images[0]} alt={p.name} fill className="object-cover" priority />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative">
              {p.images[i + 1]
                ? <Image src={p.images[i + 1]} alt={`${p.name} ${i + 2}`} fill className="object-cover" />
                : <div className="w-full h-full bg-ivory-200" />
              }
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ─ Main column ─ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key stats */}
            <div className="card p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  ...(p.beds > 0 ? [{ icon: BedDouble, val: p.beds, label: 'Bedrooms' }] : []),
                  { icon: Bath,      val: p.baths,          label: 'Bathrooms' },
                  { icon: Maximize2, val: p.sqft.toLocaleString(), label: 'Sq Ft' },
                  { icon: Calendar,  val: p.yearBuilt,      label: 'Year Built' },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="text-center">
                    <Icon size={22} className="text-emerald-600 mx-auto mb-2" />
                    <p className="font-playfair text-2xl font-bold text-charcoal-950">{val}</p>
                    <p className="text-2xs font-dm uppercase tracking-[0.12em] text-charcoal-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-playfair text-xl font-bold text-charcoal-950 mb-4">About This Property</h2>
              <p className="font-dm text-sm text-charcoal-600 leading-relaxed">{p.description}</p>
            </div>

            {/* Features */}
            <div className="card p-6">
              <h2 className="font-playfair text-xl font-bold text-charcoal-950 mb-5">Features &amp; Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm font-dm text-charcoal-700">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block" />
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Neighbourhood */}
            <div className="card p-6">
              <h2 className="font-playfair text-xl font-bold text-charcoal-950 mb-4">Neighbourhood Insights</h2>
              {(p.walkScore || p.transitScore) && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {p.walkScore && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                      <p className="font-playfair text-3xl font-bold text-emerald-700">{p.walkScore}</p>
                      <p className="text-2xs font-dm uppercase tracking-[0.12em] text-emerald-600 mt-1">Walk Score</p>
                      <p className="text-xs font-dm text-emerald-500 mt-0.5">
                        {p.walkScore >= 90 ? "Walker's Paradise" : p.walkScore >= 70 ? 'Very Walkable' : 'Walkable'}
                      </p>
                    </div>
                  )}
                  {p.transitScore && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                      <p className="font-playfair text-3xl font-bold text-blue-700">{p.transitScore}</p>
                      <p className="text-2xs font-dm uppercase tracking-[0.12em] text-blue-600 mt-1">Transit Score</p>
                      <p className="text-xs font-dm text-blue-500 mt-0.5">
                        {p.transitScore >= 90 ? "Rider's Paradise" : 'Excellent Transit'}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm font-dm text-charcoal-600">
                Located in <strong className="text-charcoal-900">{p.neighborhood}</strong>, {p.city} —
                a highly sought-after area known for vibrant community life, excellent schools, and convenient access to city amenities.
              </p>
            </div>

            {/* Mortgage */}
            {!isRent && (
              <div className="card p-6">
                <h2 className="font-playfair text-xl font-bold text-charcoal-950 mb-6">Mortgage Calculator</h2>
                <MortgageCalculator defaultPrice={p.price} />
              </div>
            )}

            {/* Investment */}
            {(p.capRate || p.roi || p.monthlyRent) && (
              <div className="card p-6">
                <h2 className="font-playfair text-xl font-bold text-charcoal-950 mb-4">Investment Analysis</h2>
                <div className="grid grid-cols-3 gap-4">
                  {p.capRate     && <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100"><p className="font-playfair text-2xl font-bold text-emerald-700">{p.capRate}%</p><p className="text-2xs font-dm uppercase tracking-[0.12em] text-emerald-600 mt-1">Cap Rate</p></div>}
                  {p.roi         && <div className="text-center p-4 bg-gold-50 rounded-2xl border border-gold-100"><p className="font-playfair text-2xl font-bold text-gold-700">{p.roi}%</p><p className="text-2xs font-dm uppercase tracking-[0.12em] text-gold-600 mt-1">Est. ROI</p></div>}
                  {p.monthlyRent && <div className="text-center p-4 bg-clay-50 rounded-2xl border border-clay-100"><p className="font-playfair text-2xl font-bold text-clay-700">${p.monthlyRent.toLocaleString()}</p><p className="text-2xs font-dm uppercase tracking-[0.12em] text-clay-600 mt-1">Monthly Rent</p></div>}
                </div>
              </div>
            )}
          </div>

          {/* ─ Sidebar ─ */}
          <div className="space-y-5">
            <ScheduleForm
              propertyName={p.name}
              agentName={p.agent.name}
              agentPhone={p.agent.phone}
            />

            {/* Agent card */}
            <div className="card p-5">
              <p className="field-label mb-4">Listed by</p>
              <div className="flex items-start gap-3 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                  <Image src={p.agent.photo} alt={p.agent.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-dm font-semibold text-charcoal-900">{p.agent.name}</p>
                  <p className="text-xs font-dm text-emerald-700 font-medium">{p.agent.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} fill="#ca8a04" className="text-gold-600" />
                    <span className="text-xs font-dm text-charcoal-500">{p.agent.rating} · {p.agent.dealsCount}+ deals</span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-dm text-charcoal-500 leading-relaxed mb-4">{p.agent.bio}</p>
              <div className="space-y-2">
                <a href={`tel:${p.agent.phone}`} className="flex items-center gap-2 text-sm font-dm text-charcoal-700 hover:text-emerald-700 transition-colors">
                  <Phone size={13} className="text-emerald-600" />{p.agent.phone}
                </a>
                <a href={`mailto:${p.agent.email}`} className="flex items-center gap-2 text-sm font-dm text-charcoal-700 hover:text-emerald-700 transition-colors">
                  <Mail size={13} className="text-emerald-600" />{p.agent.email}
                </a>
              </div>
            </div>

            {/* Details */}
            <div className="card p-5">
              <h3 className="font-playfair text-base font-bold text-charcoal-950 mb-4">Property Details</h3>
              <table className="w-full text-sm font-dm">
                <tbody>
                  {[
                    ['Type', p.type.charAt(0).toUpperCase() + p.type.slice(1)],
                    ['Year Built', String(p.yearBuilt)],
                    ...(p.garage ? [['Garage', `${p.garage} car${p.garage > 1 ? 's' : ''}`]] : []),
                    ...(p.lotSize ? [['Lot Size', p.lotSize]] : []),
                    ['Neighbourhood', p.neighborhood],
                    ['Market', p.country === 'CA' ? '🇨🇦 Canada' : '🇺🇸 USA'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-ivory-100 last:border-0">
                      <td className="py-2 text-charcoal-400 uppercase tracking-[0.08em] text-2xs">{k}</td>
                      <td className="py-2 text-charcoal-800 font-medium text-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-playfair text-2xl font-bold text-charcoal-950">Similar Properties</h2>
              <Link href="/listings" className="btn-sm btn-ghost text-xs">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(sp => <PropertyCard key={sp.id} property={sp} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
