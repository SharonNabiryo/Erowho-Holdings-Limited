'use client'
import { useState } from 'react'
import { MortgageCalculator } from '@/components/property/MortgageCalculator'
import { ROICalculator }      from '@/components/invest/ROICalculator'
import { AffordabilityCalc }  from '@/components/tools/AffordabilityCalc'
import { ClosingCostCalc }    from '@/components/tools/ClosingCostCalc'
import { DownPaymentCalc }    from '@/components/tools/DownPaymentCalc'
import { Calculator, TrendingUp, Home, DollarSign, BarChart3, Percent, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const TABS = [
  { id:'mortgage',      label:'Mortgage',      icon: Calculator, desc:'Monthly payment estimator'   },
  { id:'affordability', label:'Affordability',  icon: Home,       desc:'What can I afford?'          },
  { id:'downpayment',   label:'Down Payment',   icon: DollarSign, desc:'Plan your down payment'      },
  { id:'closing',       label:'Closing Costs',  icon: Percent,    desc:'Canada & USA closing costs'  },
  { id:'roi',           label:'ROI',            icon: TrendingUp, desc:'Investment return analysis'  },
  { id:'cashflow',      label:'Cash Flow',      icon: BarChart3,  desc:'Monthly rental cash flow'    },
]

export default function ToolsPage() {
  const [active, setActive] = useState('mortgage')
  const tab = TABS.find(t=>t.id===active)!

  return (
    <div className="min-h-screen bg-ivory-50 pt-[var(--nav-height)]">
      {/* Header */}
      <div className="bg-section-dark py-14">
        <div className="container-xl">
          <div className="eyebrow-white mb-4">Real Estate Tools</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">
            Professional-Grade{' '}
            <span className="text-gold">Calculators</span>
          </h1>
          <p className="font-dm text-white/55 max-w-xl">
            The same tools our advisors use — mortgage planning, investment analysis, closing cost estimation, and affordability calculators for Canada and the USA.
          </p>
        </div>
      </div>

      <div className="container-xl py-12">
        {/* Tab selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setActive(t.id)}
              className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-dm font-medium border transition-all duration-200',
                active===t.id
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-luxury'
                  : 'bg-white text-charcoal-700 border-ivory-300 hover:border-emerald-300 hover:shadow-card')}>
              <t.icon size={14}/>
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Calculator */}
          <div className="card p-8">
            <h2 className="font-playfair text-2xl font-bold text-charcoal-950 mb-1">{tab.label} Calculator</h2>
            <p className="text-sm font-dm text-charcoal-400 mb-7">{tab.desc}</p>
            {active==='mortgage'      && <MortgageCalculator/>}
            {active==='affordability' && <AffordabilityCalc/>}
            {active==='downpayment'   && <DownPaymentCalc/>}
            {active==='closing'       && <ClosingCostCalc/>}
            {active==='roi'           && <ROICalculator/>}
            {active==='cashflow'      && <CashFlowCalc/>}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* AI Advisor CTA */}
            <div className="bg-section-dark rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-gold-400"/>
                <p className="font-dm font-semibold text-sm">Need personalised advice?</p>
              </div>
              <p className="text-sm font-dm text-white/55 leading-relaxed mb-4">
                Our AI advisor and human experts can walk through these numbers in the context of your specific situation, budget, and goals.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/ai-assistant" className="btn-md btn-gold w-full justify-center text-sm">
                  <Sparkles size={14}/>Chat with AI Advisor
                </Link>
                <Link href="/contact" className="btn-md btn-white w-full justify-center text-sm">
                  Book a Consultation
                </Link>
              </div>
            </div>

            {/* Quick facts */}
            <div className="card p-5">
              <p className="font-dm font-bold text-xs uppercase tracking-[0.12em] text-charcoal-400 mb-4">Did you know?</p>
              <div className="space-y-3">
                {[
                  { flag:'🇨🇦', fact:'Canada requires CMHC insurance on down payments below 20%, adding 2.8–4% to your mortgage.' },
                  { flag:'🇺🇸', fact:'US buyers can access 30-year fixed mortgages — unavailable in Canada where the max amortization is 25 years (insured).' },
                  { flag:'🇨🇦', fact:'Toronto and BC have land transfer taxes on top of the provincial LTT — budget 1.5–2.5% of purchase price.' },
                  { flag:'🇺🇸', fact:'US closing costs typically run 2–5% of the purchase price, covering title, escrow, lender fees, and prepaid items.' },
                ].map((f,i)=>(
                  <div key={i} className="flex gap-2.5 text-sm font-dm text-charcoal-600 leading-relaxed">
                    <span className="mt-0.5 shrink-0">{f.flag}</span>
                    <span>{f.fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline Cash Flow Calculator (simple)
function CashFlowCalc() {
  const [rent,      setRent]      = useState(3500)
  const [mortgage,  setMortgage]  = useState(1800)
  const [tax,       setTax]       = useState(300)
  const [insurance, setInsurance] = useState(150)
  const [mgmt,      setMgmt]      = useState(280)
  const [vacancy,   setVacancy]   = useState(175)
  const [repairs,   setRepairs]   = useState(150)

  const expenses    = mortgage + tax + insurance + mgmt + vacancy + repairs
  const cashFlow    = rent - expenses
  const annualROI   = (cashFlow * 12 / (rent * 12)) * 100
  const positive    = cashFlow >= 0

  const fmt = (n:number) => `$${Math.abs(n).toLocaleString()}`

  const FIELDS = [
    { label:'Monthly Rent',       value:rent,      set:setRent      },
    { label:'Mortgage Payment',   value:mortgage,  set:setMortgage  },
    { label:'Property Tax',       value:tax,       set:setTax       },
    { label:'Insurance',          value:insurance, set:setInsurance },
    { label:'Property Mgmt (8%)', value:mgmt,      set:setMgmt      },
    { label:'Vacancy Reserve (5%)',value:vacancy,  set:setVacancy   },
    { label:'Maintenance',        value:repairs,   set:setRepairs   },
  ]

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        {FIELDS.map(f=>(
          <div key={f.label}>
            <label className="field-label">{f.label}</label>
            <input type="number" value={f.value} onChange={e=>f.set(+e.target.value)} step={50} min={0} className="field-input"/>
          </div>
        ))}
      </div>

      <div className={cn('rounded-2xl p-6 text-center', positive ? 'bg-section-dark text-white' : 'bg-red-950 text-white')}>
        <p className="text-2xs font-dm uppercase tracking-[0.15em] text-white/50 mb-1">Monthly Cash Flow</p>
        <p className="font-playfair text-5xl font-bold text-gold">{positive?'+':'-'}{fmt(cashFlow)}</p>
        <p className="text-xs font-dm text-white/40 mt-1">after all expenses</p>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-white/10">
          <div className="text-center"><p className="font-playfair text-xl font-bold text-white">{fmt(rent)}</p><p className="text-2xs text-white/40 font-dm uppercase tracking-wide">Gross Rent</p></div>
          <div className="text-center"><p className="font-playfair text-xl font-bold text-white">{fmt(expenses)}</p><p className="text-2xs text-white/40 font-dm uppercase tracking-wide">Expenses</p></div>
          <div className="text-center"><p className={cn('font-playfair text-xl font-bold',positive?'text-gold':'text-red-300')}>{fmt(cashFlow*12)}/yr</p><p className="text-2xs text-white/40 font-dm uppercase tracking-wide">Annual</p></div>
        </div>
      </div>
    </div>
  )
}
