import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Globe, DollarSign } from 'lucide-react'
import { ROICalculator }  from '@/components/invest/ROICalculator'
import { MortgageCalculator } from '@/components/property/MortgageCalculator'
import { PropertyCard }   from '@/components/listings/PropertyCard'
import { PROPERTIES }     from '@/data'

export const metadata: Metadata = { title: 'Invest in Real Estate | Canada & USA' }

const CANADA_TIPS = [
  { label: 'FHSA',       desc: 'First Home Savings Account — contribute up to $40K tax-free toward your first home.' },
  { label: 'CMHC',       desc: 'Mortgage insurance required for down payments under 20%, enabling entry with as little as 5%.' },
  { label: 'Land Transfer Tax', desc: 'Ontario & BC charge LTT on purchase. Toronto adds a second municipal LTT for city properties.' },
  { label: 'FHBP',       desc: 'Withdraw up to $35K from your RRSP tax-free for a first home purchase.' },
  { label: 'Foreign Buyer Tax', desc: 'Non-residents face a 25% foreign buyer tax in Ontario and 20% in BC — plan your structure carefully.' },
  { label: 'Cap Gains',  desc: 'Investment property sales trigger capital gains tax. Corporations and trusts offer structuring options.' },
]

const US_TIPS = [
  { label: 'FIRPTA',     desc: 'Foreign buyers must withhold 15% of the sale price upon resale. Proper advance planning can reduce this.' },
  { label: '1031 Exchange', desc: 'Defer capital gains taxes indefinitely by rolling proceeds into a like-kind property within 180 days.' },
  { label: 'LLC Ownership', desc: 'Most Canadian investors hold US property in an LLC or LP for liability isolation and estate planning.' },
  { label: 'Depreciation', desc: 'Residential rental property depreciates over 27.5 years, generating significant non-cash deductions.' },
  { label: 'State Taxes', desc: 'Florida, Texas, and Nevada have no state income tax — major advantage for rental income from those states.' },
  { label: 'Treaty Benefits', desc: 'The Canada–US Tax Treaty reduces withholding on rental income from 30% to the net rental income rate.' },
]

const investmentProps = PROPERTIES.filter(p => p.type === 'investment' || p.capRate)

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=60"
            alt="" fill className="object-cover"
          />
        </div>
        <div className="container-xl relative z-10 w-full">
          <div className="eyebrow-white mb-6">Investment Real Estate</div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4 max-w-2xl leading-tight">
            Build Wealth Through{' '}
            <em className="not-italic text-gold">Property</em>
          </h1>
          <p className="font-dm text-lg text-white/60 max-w-xl mb-8">
            Access income-producing properties across Canada and the USA with the analysis, advisory, and cross-border expertise to invest with confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/listings?type=investment" className="btn-lg btn-gold">
              View Investment Properties <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="btn-lg btn-white">
              Speak to an Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20" id="roi">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="eyebrow mb-4">ROI Calculator</div>
              <h2 className="section-title mb-4">
                Model Your{' '}
                <em className="not-italic text-gold">Returns</em>
              </h2>
              <p className="section-subtitle mb-6">
                Adjust purchase price, down payment, rental income, and expenses to see your projected cap rate, cash-on-cash return, and annualised ROI before you commit.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: TrendingUp, label: 'Avg. Cap Rate (Toronto)', value: '3.8–5.2%' },
                  { icon: TrendingUp, label: 'Avg. Cap Rate (Miami)',   value: '4.5–6.8%' },
                  { icon: DollarSign, label: 'Avg. Appreciation (CA)', value: '6.4% / yr' },
                  { icon: DollarSign, label: 'Avg. Appreciation (US)', value: '5.1% / yr' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white border border-ivory-200 rounded-2xl p-4 shadow-card">
                    <Icon size={16} className="text-emerald-600 mb-2" />
                    <p className="text-2xs font-dm text-charcoal-400 uppercase tracking-[0.1em] mb-0.5">{label}</p>
                    <p className="font-playfair text-xl font-bold text-charcoal-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-8">
              <ROICalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Mortgage calculator */}
      <section className="py-20 bg-white" id="mortgage">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="card p-8">
              <MortgageCalculator defaultPrice={800000} />
            </div>
            <div>
              <div className="eyebrow mb-4">Financing</div>
              <h2 className="section-title mb-4">
                Understand Your{' '}
                <em className="not-italic text-gold">Financing</em>
              </h2>
              <p className="section-subtitle mb-6">
                Model your monthly mortgage payments with our interactive calculator. Use it alongside the ROI tool to understand your total cash outlay and projected returns.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Canada: Amortisation up to 25 years', body: 'CMHC-insured mortgages are capped at 25 years. Conventional (20%+ down) can go to 30 years.' },
                  { title: 'USA: 30-year fixed widely available', body: 'US investors can access 30-year terms. Foreign nationals typically need 30–40% down with rates ~0.5–1% higher.' },
                  { title: 'Interest rate comparison', body: 'Canadian variable rates are tied to the Bank of Canada policy rate; US ARMs to the Fed Funds rate. Both offer fixed alternatives.' },
                ].map(({ title, body }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </div>
                    <div>
                      <p className="font-dm font-semibold text-sm text-charcoal-900 mb-0.5">{title}</p>
                      <p className="font-dm text-xs text-charcoal-500 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Canada vs USA guidance */}
      <section className="py-20 bg-section-dark">
        <div className="container-xl">
          <div className="text-center mb-14">
            <div className="eyebrow-white mb-4">Cross-Border Intelligence</div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              Canada vs USA:{' '}
              <span className="text-gold">What You Must Know</span>
            </h2>
            <p className="font-dm text-white/55 max-w-xl mx-auto">
              Tax rules, ownership structures, and incentive programs differ significantly between markets. Here's what every investor needs to understand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Canada */}
            <div className="card-glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🇨🇦</span>
                <h3 className="font-playfair text-2xl font-bold text-white">Investing in Canada</h3>
              </div>
              <div className="space-y-4">
                {CANADA_TIPS.map(({ label, desc }) => (
                  <div key={label} className="flex gap-3">
                    <Shield size={14} className="text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-dm font-semibold text-sm text-white mb-0.5">{label}</p>
                      <p className="font-dm text-xs text-white/55 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* USA */}
            <div className="card-glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🇺🇸</span>
                <h3 className="font-playfair text-2xl font-bold text-white">Investing in the USA</h3>
              </div>
              <div className="space-y-4">
                {US_TIPS.map(({ label, desc }) => (
                  <div key={label} className="flex gap-3">
                    <Globe size={14} className="text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-dm font-semibold text-sm text-white mb-0.5">{label}</p>
                      <p className="font-dm text-xs text-white/55 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact" className="btn-lg btn-gold">
              Schedule a Cross-Border Consultation <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Investment listings */}
      <section className="py-20 bg-ivory-50">
        <div className="container-xl">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow mb-4">Featured Investments</div>
              <h2 className="section-title">
                Income-Producing{' '}
                <em className="not-italic text-gold">Properties</em>
              </h2>
            </div>
            <Link href="/listings?type=investment" className="btn-md btn-outline hidden md:inline-flex shrink-0">
              All Investments <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentProps.slice(0, 3).map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
