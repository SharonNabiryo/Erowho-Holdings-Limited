import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight, Shield, Globe, Sparkles, Award, TrendingUp, Star,
  Home, Key, Building, BarChart2, ChevronRight,
} from 'lucide-react'
import { HeroSearch }          from '@/components/home/HeroSearch'
import { StatsSection }        from '@/components/home/StatsSection'
import { NewsletterSection }   from '@/components/home/NewsletterSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { PropertyCard }        from '@/components/listings/PropertyCard'
import { PROPERTIES, TESTIMONIALS, BLOG_POSTS } from '@/data'

export const metadata: Metadata = {
  title: 'Erowho Holdings Limited | Luxury Real Estate — Canada & USA',
}

const QUICK = [
  { icon: Home,     label: 'Buy a Home',    sub: 'Browse 1,900+ listings',     href: '/listings?type=buy',        color: 'bg-emerald-50  border-emerald-100 hover:border-emerald-300 text-emerald-700' },
  { icon: Key,      label: 'Sell My Home',  sub: 'Get your free valuation',    href: '/sell',                     color: 'bg-gold-50     border-gold-100    hover:border-gold-300    text-gold-700'    },
  { icon: Building, label: 'Invest',        sub: 'ROI-driven opportunities',   href: '/invest',                   color: 'bg-clay-50     border-clay-100    hover:border-clay-300    text-clay-700'    },
  { icon: BarChart2,label: 'Rent',          sub: 'Premium rentals',            href: '/listings?type=rent',       color: 'bg-charcoal-50 border-charcoal-100 hover:border-charcoal-300 text-charcoal-700' },
]

const WHY = [
  { icon: Shield,     title: 'Licensed & Trusted',     body: 'Dual licences in every major Canadian province and US state. Fully bonded and E&O insured.' },
  { icon: Globe,      title: 'Cross-Border Experts',   body: 'The only firm with dedicated cross-border teams navigating FIRPTA, FHSA, and cross-currency transactions daily.' },
  { icon: Sparkles,   title: 'AI-Powered Search',      body: 'Our proprietary AI advisor matches buyers with properties based on lifestyle, budget, and investment objectives.' },
  { icon: Award,      title: 'Concierge Closing',      body: 'Full transaction coordination — legal review, mortgage introductions, inspection scheduling — all in one team.' },
  { icon: TrendingUp, title: 'Market Intelligence',    body: 'Quarterly market reports, real-time data dashboards, and investment analysis for every market we operate in.' },
  { icon: Star,       title: '98% Satisfaction',       body: 'Over 1,200 satisfied clients and counting. We earn business through results, not promises.' },
]

const featured = PROPERTIES.filter(p => ['listing-of-month','listing-of-week','active'].includes(p.status)).slice(0, 6)

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Luxury property exterior"
            fill priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/75 to-emerald-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
        </div>

        {/* Floating badge — desktop */}
        <div className="absolute top-32 right-16 xl:right-28 hidden xl:block animate-float z-10">
          <div className="bg-white/96 backdrop-blur rounded-2xl p-4 shadow-card-hover w-56 border border-ivory-100">
            <p className="text-2xs font-dm text-charcoal-400 mb-1.5">🏆 Listing of the Month</p>
            <p className="font-playfair text-lg font-bold text-charcoal-950 leading-snug">The Bayshore Penthouse</p>
            <p className="font-dm text-gold-700 font-bold mt-0.5">$4,850,000</p>
            <p className="text-xs font-dm text-charcoal-400 mt-0.5">Vancouver, BC — 4 bed / 5 bath</p>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#ca8a04" className="text-gold-600" />)}
              <span className="text-2xs font-dm text-charcoal-400 ml-1.5">4.9 · 24 reviews</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-36 right-16 xl:right-32 hidden xl:block z-10" style={{ animationDelay: '2.5s' }}>
          <div className="card-glass rounded-2xl p-4 w-48 text-white">
            <p className="text-2xs font-dm text-gold-300 mb-1">🇨🇦 + 🇺🇸 Active Markets</p>
            <p className="font-playfair text-2xl font-bold">18 Cities</p>
            <p className="text-xs font-dm text-white/55 mt-0.5">Coast to coast, border to border</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container-xl pt-24 pb-40">
          <div className="max-w-2xl xl:max-w-3xl">
            <div className="eyebrow-white mb-6">
              <span>🇨🇦 Canada</span>
              <span className="w-px h-3 bg-white/30" />
              <span>🇺🇸 United States</span>
            </div>

            <h1 className="font-playfair text-5xl md:text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.08] tracking-tight mb-6">
              Where{' '}
              <em className="not-italic text-gold">Exceptional</em>
              <br />
              Meets Home
            </h1>

            <p className="font-dm text-lg md:text-xl text-white/65 font-light leading-relaxed mb-10 max-w-xl">
              Erowho Holdings curates the most distinguished residential, luxury, and investment properties across premier markets in Canada and the United States.
            </p>

            <HeroSearch />

            {/* Tag links */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['Luxury Homes','Investment Properties','Toronto Listings','Miami Condos','Vancouver Estates'].map(tag => (
                <Link
                  key={tag}
                  href={`/listings?query=${encodeURIComponent(tag)}`}
                  className="text-xs font-dm px-3 py-1.5 bg-white/10 hover:bg-white/18 text-white/70 hover:text-white border border-white/20 rounded-full transition-all duration-150"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-2xs font-dm uppercase tracking-[0.2em] text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ─── QUICK ACTIONS ───────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-ivory-200">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK.map(({ icon: Icon, label, sub, href, color }) => (
              <Link
                key={label}
                href={href}
                className={`group flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 hover:shadow-luxury hover:-translate-y-0.5 ${color}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:shadow transition-all">
                  <Icon size={22} />
                </div>
                <p className="font-dm font-semibold text-charcoal-900 mb-0.5">{label}</p>
                <p className="text-xs font-dm text-charcoal-400">{sub}</p>
                <ChevronRight size={14} className="mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED LISTINGS ───────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-ivory-50">
        <div className="container-xl">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow mb-4">Featured Properties</div>
              <h2 className="section-title mb-3">
                Curated for{' '}
                <em className="not-italic text-gold">Discerning</em> Buyers
              </h2>
              <p className="section-subtitle max-w-lg">
                Handpicked luxury and investment properties across our most sought-after markets.
              </p>
            </div>
            <Link href="/listings" className="btn-md btn-outline hidden md:inline-flex shrink-0">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {/* Listing of Week + Month highlight strip */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {PROPERTIES.filter(p => p.status === 'listing-of-week' || p.status === 'listing-of-month').map(p => (
              <div key={p.id} className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer">
                <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className={`badge mb-3 ${p.status === 'listing-of-week' ? 'badge-gold' : 'badge-gold'}`}>
                    {p.status === 'listing-of-week' ? '⭐ Listing of the Week' : '🏆 Listing of the Month'}
                  </span>
                  <p className="font-playfair text-xl font-bold text-white mb-1">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white/65 font-dm text-sm">{p.city}, {p.province}</p>
                    <p className="font-playfair text-gold text-xl font-bold">{p.priceLabel}</p>
                  </div>
                  <Link href={`/properties/${p.slug}`} className="mt-4 btn-sm btn-gold inline-flex">
                    View Property <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>

          <div className="text-center mt-10">
            <Link href="/listings" className="btn-lg btn-primary">
              Browse All Properties <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────── */}
      <StatsSection />

      {/* ─── WHY EROWHO ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container-xl">
          <div className="text-center mb-14">
            <div className="eyebrow mx-auto mb-4">Why Erowho</div>
            <h2 className="section-title mb-4">
              A Standard{' '}
              <em className="not-italic text-gold">Above</em> the Rest
            </h2>
            <p className="section-subtitle mx-auto max-w-xl">
              We combine market expertise with white-glove service across every transaction — from first viewing to final closing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map(({ icon: Icon, title, body }) => (
              <div key={title} className="group p-6 rounded-2xl border border-ivory-200 hover:border-emerald-200 hover:shadow-luxury transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-4 transition-colors">
                  <Icon size={20} className="text-emerald-700" />
                </div>
                <h3 className="font-playfair text-lg font-bold text-charcoal-950 mb-2">{title}</h3>
                <p className="font-dm text-sm text-charcoal-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI CTA ──────────────────────────────────────────────── */}
      <section className="bg-section-dark py-20 lg:py-24">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="eyebrow-white mb-6">AI-Powered Advisor</div>
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Your 24/7 Property{' '}
                <span className="text-gold">Intelligence</span>
              </h2>
              <p className="font-dm text-white/60 text-lg leading-relaxed mb-8">
                Ask anything — from "What can I afford?" to "Compare Toronto vs Miami investment returns." Get expert-grade answers backed by real market data, instantly.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Find properties by lifestyle and budget',
                  'Understand mortgage options across both countries',
                  'Compare investment returns city by city',
                  'Get neighbourhood insights before you visit',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm font-dm text-white/65">
                    <Sparkles size={14} className="text-gold-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/ai-assistant" className="btn-lg btn-gold">
                Chat with AI Advisor <ArrowRight size={15} />
              </Link>
            </div>

            {/* Mock chat */}
            <div className="card-glass rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
                  <Sparkles size={13} className="text-gold-300" />
                </div>
                <div>
                  <p className="text-sm font-dm font-semibold text-white">Erowho AI Advisor</p>
                  <p className="text-2xs font-dm text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-emerald-700 text-white text-sm font-dm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[78%]">
                    What's the best area to invest in Toronto right now?
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={10} className="text-white" />
                  </div>
                  <div className="bg-white/10 border border-white/15 text-white/85 text-sm font-dm rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                    East Danforth and the Junction Triangle are showing the strongest YoY appreciation in 2024 — 8–12% — with improving transit scores and robust rental demand from young professionals...
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-emerald-700 text-white text-sm font-dm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[78%]">
                    What ROI would I expect on a $900K property?
                  </div>
                </div>
                <div className="flex gap-1.5 mt-1 ml-8">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────── */}
      <TestimonialsSection testimonials={TESTIMONIALS} />

      {/* ─── BLOG PREVIEW ────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-ivory-50">
        <div className="container-xl">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow mb-4">Expert Insights</div>
              <h2 className="section-title">
                Market Intelligence &amp;{' '}
                <em className="not-italic text-gold">Guides</em>
              </h2>
            </div>
            <Link href="/blog" className="btn-md btn-outline hidden md:inline-flex shrink-0">
              All Articles <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-emerald">{post.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-2xs font-dm text-charcoal-400 mb-3">
                    <span>{post.readTime} read</span>
                    <span className="w-0.5 h-3 bg-charcoal-200" />
                    <span>{post.publishedAt}</span>
                  </div>
                  <h3 className="font-playfair font-bold text-charcoal-900 text-lg leading-snug mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm font-dm text-charcoal-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-ivory-200">
                    <Image
                      src={post.authorPhoto} alt={post.author}
                      width={24} height={24}
                      className="rounded-full object-cover"
                    />
                    <span className="text-xs font-dm font-semibold text-charcoal-700">{post.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ──────────────────────────────────────────── */}
      <NewsletterSection />
    </>
  )
}
