'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, Loader2, ArrowRight, TrendingUp, Home, Users, Star, BarChart3, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  address:   z.string().min(5,'Address required'),
  city:      z.string().min(2,'City required'),
  country:   z.enum(['CA','US']),
  type:      z.string().min(1),
  condition: z.enum(['excellent','good','fair','renovation']),
  beds:      z.coerce.number().min(0),
  baths:     z.coerce.number().min(0),
  sqft:      z.coerce.number().min(100),
  yearBuilt: z.coerce.number().min(1800).max(2025),
  name:      z.string().min(2,'Name required'),
  email:     z.string().email('Valid email required'),
  phone:     z.string().optional(),
})
type F = z.infer<typeof schema>

const STEPS = [
  { icon: TrendingUp, label:'Free Valuation',    desc:'AI-assisted estimate + expert CMA within 24 hours, completely free and no-obligation.' },
  { icon: BarChart3,  label:'Strategic Pricing', desc:'We analyse 90 days of comparable sales and buyer demand to price for maximum return.' },
  { icon: Home,       label:'Premium Marketing', desc:'Professional photography, 3D tour, 30+ platform syndication, and targeted digital ads.' },
  { icon: Users,      label:'Offer & Negotiation',desc:'We present and negotiate every offer, leveraging our expertise to maximise your price.' },
  { icon: Check,      label:'Closing Day',       desc:'Full coordination with lawyers, lenders, and inspectors for a stress-free close.' },
]

export default function SellPage() {
  const [result, setResult] = useState<any>(null)

  const { register, handleSubmit, watch, formState:{ errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues:{ country:'CA', type:'house', condition:'good', beds:3, baths:2, sqft:1600, yearBuilt:2005 },
  })

  const onSubmit = async (data: F) => {
    const res  = await fetch('/api/valuation', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) })
    const json = await res.json()
    setResult(json)
  }

  const fmt = (n: number) => `$${n.toLocaleString()}`

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=60" alt="" fill className="object-cover"/>
        </div>
        <div className="container-xl relative z-10 w-full">
          <div className="eyebrow-white mb-6">Sell with Erowho</div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4 max-w-2xl leading-tight">
            Sell Smarter. <em className="not-italic text-gold">Earn More.</em>
          </h1>
          <p className="font-dm text-lg text-white/60 max-w-xl">
            Our sellers achieve an average of 4.2% above asking price — backed by expert pricing, premium marketing, and relentless negotiation.
          </p>
          <div className="flex flex-wrap gap-6 mt-8">
            {['$2.1B in homes sold','34 avg. days to close','98% client satisfaction','4.2% above asking avg.'].map(s=>(
              <div key={s} className="flex items-center gap-2 text-sm font-dm text-white/60">
                <div className="w-1 h-1 rounded-full bg-gold-400 shrink-0"/>{s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20" id="valuation">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="eyebrow mb-4">Free Valuation</div>
              <h2 className="section-title mb-4">What&apos;s Your Home <em className="not-italic text-gold">Worth?</em></h2>
              <p className="section-subtitle mb-8">Get an AI-assisted preliminary estimate instantly, followed by a full Comparative Market Analysis within 24 hours.</p>
              <ul className="space-y-3 mb-8">
                {['No obligation, completely free','AI + human expert analysis','Preliminary estimate in seconds','Full CMA within 24 hours'].map(i=>(
                  <li key={i} className="flex items-center gap-3 text-sm font-dm text-charcoal-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><Check size={11} className="text-emerald-700"/></span>{i}
                  </li>
                ))}
              </ul>
              <div className="relative rounded-2xl overflow-hidden h-60">
                <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="" fill className="object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 to-transparent"/>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-dm text-sm text-white/70 font-medium">Our sellers receive on average</p>
                  <p className="font-playfair text-3xl font-bold text-gold">4.2% above asking price</p>
                </div>
              </div>
            </div>

            <div className="card p-8">
              {result ? (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check size={24} className="text-emerald-700"/>
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-charcoal-950">Valuation Received</h3>
                      <p className="text-xs font-dm text-charcoal-400">Preliminary AI Estimate</p>
                    </div>
                  </div>

                  {result.estimate && (
                    <div className="bg-section-dark rounded-2xl p-6 text-white mb-5">
                      <p className="text-2xs font-dm uppercase tracking-[0.12em] text-white/50 mb-3 text-center">Estimated Value Range ({result.estimate.currency})</p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="font-playfair text-xl font-bold text-white/70">{fmt(result.estimate.low)}</p>
                          <p className="text-2xs font-dm text-white/40 mt-0.5">Conservative</p>
                        </div>
                        <div>
                          <p className="font-playfair text-2xl font-bold text-gold">{fmt(result.estimate.mid)}</p>
                          <p className="text-2xs font-dm text-gold/60 mt-0.5">Mid-Range</p>
                        </div>
                        <div>
                          <p className="font-playfair text-xl font-bold text-white/70">{fmt(result.estimate.high)}</p>
                          <p className="text-2xs font-dm text-white/40 mt-0.5">Optimistic</p>
                        </div>
                      </div>
                      <p className="text-2xs font-dm text-white/35 text-center mt-4 leading-relaxed">{result.estimate.disclaimer}</p>
                    </div>
                  )}
                  <p className="text-sm font-dm text-charcoal-600 mb-5">{result.message}</p>
                  <div className="flex gap-3">
                    <Link href="/contact" className="btn-lg btn-primary flex-1 justify-center">Book Full CMA <ArrowRight size={15}/></Link>
                    <button onClick={() => setResult(null)} className="btn-lg btn-outline">Try Again</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-playfair text-xl font-bold text-charcoal-950 mb-6">Get Your Free Valuation</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="field-label">Property Address *</label>
                        <input {...register('address')} placeholder="123 Main Street" className="field-input"/>
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                      </div>
                      <div>
                        <label className="field-label">City *</label>
                        <input {...register('city')} placeholder="Toronto" className="field-input"/>
                        {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="field-label">Country</label>
                        <select {...register('country')} className="field-select">
                          <option value="CA">🇨🇦 Canada</option>
                          <option value="US">🇺🇸 United States</option>
                        </select>
                      </div>
                      <div>
                        <label className="field-label">Type</label>
                        <select {...register('type')} className="field-select">
                          {['house','condo','townhouse','commercial'].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="field-label">Condition</label>
                        <select {...register('condition')} className="field-select">
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="renovation">Needs Renovation</option>
                        </select>
                      </div>
                      <div><label className="field-label">Beds</label><input {...register('beds')} type="number" min="0" max="20" className="field-input"/></div>
                      <div><label className="field-label">Baths</label><input {...register('baths')} type="number" min="0" max="20" step="0.5" className="field-input"/></div>
                      <div><label className="field-label">Sq Ft</label><input {...register('sqft')} type="number" min="100" className="field-input"/></div>
                      <div><label className="field-label">Year Built</label><input {...register('yearBuilt')} type="number" min="1800" max="2025" className="field-input"/></div>
                      <div>
                        <label className="field-label">Your Name *</label>
                        <input {...register('name')} placeholder="Full name" className="field-input"/>
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="field-label">Email *</label>
                        <input {...register('email')} type="email" className="field-input"/>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                      </div>
                      <div className="col-span-2"><label className="field-label">Phone</label><input {...register('phone')} type="tel" className="field-input"/></div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-xl btn-primary w-full justify-center">
                      {isSubmitting ? <><Loader2 size={16} className="animate-spin"/>Getting Estimate…</> : 'Get My Free Valuation'}
                    </button>
                    <p className="text-center text-2xs font-dm text-charcoal-400">No obligation. We respect your privacy.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="text-center mb-14">
            <div className="eyebrow mx-auto mb-4">Our Process</div>
            <h2 className="section-title mb-4">From Listing to <em className="not-italic text-gold">Closing</em></h2>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {STEPS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="relative text-center">
                {i < STEPS.length-1 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-emerald-100 z-0"/>}
                <div className="relative z-10 w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-luxury">
                  <Icon size={22} className="text-white"/>
                </div>
                <p className="text-2xs font-dm font-bold uppercase tracking-[0.12em] text-emerald-600 mb-1">0{i+1}</p>
                <h3 className="font-playfair font-bold text-charcoal-950 mb-2">{label}</h3>
                <p className="text-xs font-dm text-charcoal-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
