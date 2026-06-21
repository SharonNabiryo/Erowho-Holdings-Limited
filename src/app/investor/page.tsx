import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight, TrendingUp, Globe, Shield, BarChart3,
  DollarSign, Download, CheckCircle, Zap, FileText
} from 'lucide-react'
import { PropertyCard }    from '@/components/listings/PropertyCard'
import { AIInvestmentAdvisor } from '@/components/ai/AIInvestmentAdvisor'
import { PROPERTIES }     from '@/data'

export const metadata: Metadata = { title: 'Investor Platform | Erowho Holdings' }

const investmentProps = PROPERTIES.filter(p => p.type === 'investment' || p.capRate || p.type === 'commercial')

const MARKET_INTELLIGENCE = [
  {
    city: 'Toronto', country: '🇨🇦',
    capRate: '3.5–5.0%', appreciation: '+6.8%', avgRent: '$3,200/mo',
    trend: 'up', outlook: 'Strong',
    highlights: ['Undersupply of purpose-built rentals', 'Transit-oriented demand rising', 'Strong immigration pipeline'],
  },
  {
    city: 'Vancouver', country: '🇨🇦',
    capRate: '3.0–4.5%', appreciation: '+7.2%', avgRent: '$3,800/mo',
    trend: 'up', outlook: 'Strong',
    highlights: ['World-class lifestyle premium', 'Geographic supply constraints', 'Asia-Pacific capital flows'],
  },
  {
    city: 'Miami', country: '🇺🇸',
    capRate: '4.5–6.5%', appreciation: '+5.1%', avgRent: '$3,500/mo',
    trend: 'up', outlook: 'Very Strong',
    highlights: ['Zero state income tax', 'Strong short-term rental market', 'Corporate relocation boom'],
  },
  {
    city: 'Chicago', country: '🇺🇸',
    capRate: '5.5–7.5%', appreciation: '+3.8%', avgRent: '$2,100/mo',
    trend: 'stable', outlook: 'Solid Value',
    highlights: ['Highest cap rates of top 10 US cities', 'Strong midwest industrial demand', 'Deep tenant pool'],
  },
]

const CROSS_BORDER_GUIDE = [
  { flag: '🇨🇦', country: 'Canadians Buying in USA', items: [
    'FIRPTA: 15% withholding on sale — plan in advance',
    'LLC or LP structure recommended for liability isolation',
    'Canada-US Tax Treaty reduces rental income withholding to net rental rate',
    '1031 Exchange: defer capital gains indefinitely',
    'No personal income tax in FL, TX, NV — major advantage',
    'Depreciation over 27.5 years creates powerful tax deductions',
  ]},
  { flag: '🇺🇸', country: 'Americans Buying in Canada', items: [
    'Foreign buyer taxes: 25% in Ontario, 20% in BC — structure with care',
    'Canadian mortgage: 35% down typically required for non-residents',
    'Rental income reported to both CRA and IRS',
    'FAPI rules apply for passive rental income in corporations',
    'Principal Residence Exemption not available to non-residents',
    'Withholding tax on rent: file NR6 to reduce to net income',
  ]},
]

const DOWNLOADABLE_REPORTS = [
  { title: 'Canada vs USA Investment Comparison 2024', pages: 24, icon: '🇨🇦🇺🇸' },
  { title: 'Toronto Condo Investment Guide Q4 2024',   pages: 18, icon: '🏙️' },
  { title: 'Miami Luxury Market Report 2024',          pages: 20, icon: '🌴' },
  { title: 'Cross-Border Tax Structuring Primer',     pages: 32, icon: '📋' },
  { title: 'Cap Rate Benchmarking: 10 Markets',       pages: 16, icon: '📊' },
]

export default function InvestorPage() {
  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
            alt="Investor platform" fill className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/96 via-emerald-950/80 to-emerald-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent" />
        </div>
        <div className="relative z-10 container-xl pb-16 pt-40">
          <div className="eyebrow-white mb-6">Investor Platform</div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-5 max-w-2xl leading-tight">
            Institutional-Grade{' '}
            <span className="text-gold">Investment Intelligence</span>
          </h1>
          <p className="font-dm text-lg text-white/60 max-w-xl mb-8">
            Access deep market analytics, AI-powered investment analysis, cross-border structuring guidance, and curated income-producing opportunities across Canada and the USA.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#opportunities" className="btn-lg btn-gold">
              View Opportunities <ArrowRight size={15} />
            </Link>
            <Link href="/tools" className="btn-lg btn-white">
              Financial Tools
            </Link>
            <Link href="/appointments?type=INVESTMENT_CALL" className="btn-lg btn-white">
              Book Investment Call
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <div className="bg-white border-b border-ivory-200 py-6">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: '$3.4B+',  l: 'Assets Under Advisory' },
              { v: '18',      l: 'Markets Covered' },
              { v: '4.2–7.5%',l: 'Average Cap Rate Range' },
              { v: '98%',     l: 'Client Satisfaction Rate' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="font-playfair text-2xl font-bold text-emerald-700">{s.v}</p>
                <p className="text-xs font-dm text-charcoal-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Investment Advisor */}
      <section className="py-20 bg-ivory-50">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="eyebrow mb-4">AI Investment Advisor</div>
              <h2 className="section-title mb-5">
                Deep Analysis, <em className="not-italic text-gold">Instantly</em>
              </h2>
              <p className="section-subtitle mb-6">
                Enter any property's details and our AI Investment Advisor will generate a comprehensive analysis — cap rate benchmarking, cash flow projections, risk assessment, and a clear investment recommendation.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Institutional-quality investment analysis in seconds',
                  'Benchmarked against real market cap rates',
                  'Cross-border tax and structuring insights',
                  'Risk and opportunity assessment',
                ].map(i => (
                  <li key={i} className="flex items-center gap-3 text-sm font-dm text-charcoal-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle size={11} className="text-emerald-700" />
                    </div>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <AIInvestmentAdvisor />
          </div>
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="eyebrow mx-auto mb-4">Market Intelligence</div>
            <h2 className="section-title mb-4">Live Market <em className="not-italic text-gold">Benchmarks</em></h2>
            <p className="section-subtitle max-w-xl mx-auto">Current cap rates, appreciation data, and rental benchmarks for our top investment markets.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MARKET_INTELLIGENCE.map(m => (
              <div key={m.city} className="card p-6 hover:shadow-luxury transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-base mr-1">{m.country}</span>
                    <span className="font-playfair text-lg font-bold text-charcoal-950">{m.city}</span>
                  </div>
                  <span className={cn(
                    'text-[10px] font-dm font-bold px-2.5 py-1 rounded-full',
                    m.outlook === 'Very Strong' ? 'bg-emerald-100 text-emerald-800' :
                    m.outlook === 'Strong'      ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  )}>
                    {m.outlook}
                  </span>
                </div>
                <div className="space-y-2.5 mb-4">
                  {[
                    { l: 'Cap Rate',      v: m.capRate },
                    { l: 'YoY Apprec.',   v: m.appreciation },
                    { l: 'Avg Rent',      v: m.avgRent },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between items-center">
                      <span className="text-xs font-dm text-charcoal-500">{r.l}</span>
                      <span className="text-xs font-dm font-bold text-charcoal-900">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-ivory-200 space-y-1.5">
                  {m.highlights.map(h => (
                    <p key={h} className="text-[11px] font-dm text-charcoal-500 flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5 shrink-0">·</span>{h}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Listings */}
      <section id="opportunities" className="py-20 bg-ivory-50">
        <div className="container-xl">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow mb-4">Featured Opportunities</div>
              <h2 className="section-title">
                Curated Income-Producing{' '}
                <em className="not-italic text-gold">Properties</em>
              </h2>
            </div>
            <Link href="/listings?type=investment" className="btn-md btn-outline hidden md:inline-flex shrink-0">
              All Investment Properties <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentProps.slice(0, 6).map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* Cross-border guide */}
      <section className="py-20 bg-section-dark">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="eyebrow-white mb-4">Cross-Border Guide</div>
            <h2 className="font-playfair text-4xl font-bold text-white mb-4">
              Invest Across the{' '}
              <span className="text-gold">Border with Confidence</span>
            </h2>
            <p className="font-dm text-white/55 max-w-xl mx-auto">
              Critical tax, legal, and structuring considerations for Canadian and US cross-border investors.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {CROSS_BORDER_GUIDE.map(guide => (
              <div key={guide.country} className="card-glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{guide.flag}</span>
                  <h3 className="font-playfair text-xl font-bold text-white">{guide.country}</h3>
                </div>
                <ul className="space-y-3.5">
                  {guide.items.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm font-dm text-white/70">
                      <Shield size={13} className="text-gold-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/appointments?type=INVESTMENT_CALL" className="btn-lg btn-gold">
              Schedule a Cross-Border Consultation <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Downloadable Reports */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="text-center mb-10">
            <div className="eyebrow mx-auto mb-4">Market Reports</div>
            <h2 className="section-title mb-4">
              Downloadable <em className="not-italic text-gold">Intelligence</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOWNLOADABLE_REPORTS.map(r => (
              <div key={r.title} className="flex items-center gap-4 p-5 bg-white border border-ivory-200 rounded-2xl hover:border-emerald-300 hover:shadow-luxury transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 bg-ivory-100 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-emerald-50 transition-colors">
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-dm font-semibold text-sm text-charcoal-900 line-clamp-2 leading-snug">{r.title}</p>
                  <p className="text-xs font-dm text-charcoal-400 mt-1">{r.pages} pages · PDF</p>
                </div>
                <Download size={16} className="text-charcoal-300 group-hover:text-emerald-600 transition-colors shrink-0" />
              </div>
            ))}
            <div className="flex items-center justify-center p-5 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl cursor-pointer hover:bg-emerald-100 transition-colors">
              <div className="text-center">
                <FileText size={24} className="text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-dm font-semibold text-emerald-700">Request Custom Report</p>
                <p className="text-xs font-dm text-emerald-600 mt-0.5">Tailored to your portfolio</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
