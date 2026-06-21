'use client'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2, BarChart3, FileText, DollarSign, Users,
  TrendingUp, Calendar, Download, Eye, ArrowRight, Lock,
  CheckCircle, MessageSquare, Bell
} from 'lucide-react'
import { PROPERTIES } from '@/data'

// Mock owner-specific data
const OWNER_PROPERTIES = PROPERTIES.filter(p => p.capRate || p.monthlyRent).slice(0, 3)

const STATEMENTS = [
  { period: 'November 2024', income: 18400, expenses: 5200, net: 13200, status: 'Available' },
  { period: 'October 2024',  income: 18400, expenses: 4800, net: 13600, status: 'Available' },
  { period: 'September 2024',income: 17500, expenses: 5600, net: 11900, status: 'Available' },
]

const DOCUMENTS = [
  { name: 'Lease Agreement — Unit 1 (2024)',      type: 'PDF', size: '2.4 MB', date: '2024-01-15' },
  { name: 'Property Inspection Report Q3 2024',  type: 'PDF', size: '4.1 MB', date: '2024-09-30' },
  { name: 'Insurance Certificate 2024',          type: 'PDF', size: '1.2 MB', date: '2024-01-01' },
  { name: 'Annual Tax Statement 2023',           type: 'PDF', size: '0.8 MB', date: '2024-03-01' },
  { name: 'Maintenance Log Q3 2024',             type: 'PDF', size: '1.6 MB', date: '2024-10-01' },
]

const INQUIRIES = [
  { id: 1, property: 'Lincoln Park Portfolio', message: 'Interested in the 3-bed unit for February 2025', from: 'Marcus Webb', time: '2h ago',  status: 'New' },
  { id: 2, property: 'Brickell Waterfront',    message: 'Can we schedule a viewing this weekend?',        from: 'Anna Kim',    time: '5h ago',  status: 'Replied' },
  { id: 3, property: 'Lincoln Park Portfolio', message: 'Question about pet policy for Unit 3',           from: 'Sam Torres',  time: '1d ago',  status: 'Replied' },
]

export default function OwnerPortalPage() {
  return (
    <div className="min-h-screen bg-ivory-50 pt-[var(--nav-height)]">
      {/* Header */}
      <div className="bg-section-dark py-14">
        <div className="container-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="eyebrow-white mb-4">Owner Portal</div>
              <h1 className="font-playfair text-4xl font-bold text-white mb-3">
                Welcome, Property Owner
              </h1>
              <p className="font-dm text-white/55">
                Track your portfolio performance, access documents, and manage inquiries.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button className="relative p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border border-emerald-900" />
              </button>
              <Link href="/contact" className="btn-md btn-gold">Contact Your Advisor</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl py-10 space-y-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: 'Properties',        v: '3',         icon: Building2,  cls: 'text-emerald-700' },
            { l: 'Total Monthly Rent',v: '$18,400',   icon: DollarSign, cls: 'text-gold-700'    },
            { l: 'YTD Net Income',    v: '$145,200',  icon: TrendingUp, cls: 'text-blue-700'    },
            { l: 'Occupancy Rate',    v: '97%',       icon: BarChart3,  cls: 'text-purple-700'  },
          ].map(s => (
            <div key={s.l} className="card p-5">
              <s.icon size={20} className={`${s.cls} mb-3`} />
              <p className="font-playfair text-2xl font-bold text-charcoal-950">{s.v}</p>
              <p className="text-xs font-dm text-charcoal-500 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Properties & Performance */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-200">
            <h2 className="font-playfair text-xl font-bold text-charcoal-950">Your Properties</h2>
            <Link href="/listings" className="text-xs font-dm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View on site <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-ivory-200">
            {OWNER_PROPERTIES.map(p => (
              <div key={p.id} className="flex items-center gap-5 p-5 hover:bg-ivory-50 transition-colors">
                <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-dm font-semibold text-charcoal-900 truncate">{p.name}</p>
                  <p className="text-xs font-dm text-charcoal-400 mt-0.5">{p.address}</p>
                </div>
                <div className="hidden md:grid grid-cols-3 gap-6 text-center">
                  {[
                    { l: 'Monthly Rent',  v: `$${(p.monthlyRent ?? 0).toLocaleString()}` },
                    { l: 'Cap Rate',      v: `${p.capRate ?? 'N/A'}%` },
                    { l: 'Occupancy',     v: '100%' },
                  ].map(s => (
                    <div key={s.l}>
                      <p className="font-dm font-bold text-charcoal-900 text-sm">{s.v}</p>
                      <p className="text-2xs font-dm text-charcoal-400">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/properties/${p.slug}`} className="p-2 hover:bg-ivory-200 rounded-lg transition-colors text-charcoal-400 hover:text-emerald-600">
                    <Eye size={15} />
                  </Link>
                  <button className="p-2 hover:bg-ivory-200 rounded-lg transition-colors text-charcoal-400 hover:text-blue-600">
                    <BarChart3 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Statements */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-200">
              <h2 className="font-playfair text-lg font-bold text-charcoal-950 flex items-center gap-2">
                <DollarSign size={17} className="text-emerald-600" />Monthly Statements
              </h2>
            </div>
            <div className="divide-y divide-ivory-200">
              {STATEMENTS.map(s => (
                <div key={s.period} className="flex items-center justify-between px-6 py-4 hover:bg-ivory-50 transition-colors">
                  <div>
                    <p className="font-dm font-semibold text-sm text-charcoal-800">{s.period}</p>
                    <div className="flex gap-4 mt-0.5">
                      <span className="text-xs font-dm text-charcoal-400">Inc: ${s.income.toLocaleString()}</span>
                      <span className="text-xs font-dm text-charcoal-400">Exp: ${s.expenses.toLocaleString()}</span>
                      <span className="text-xs font-dm font-semibold text-emerald-700">Net: ${s.net.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-dm text-emerald-700 hover:text-emerald-800 transition-colors">
                    <Download size={13} />Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-200">
              <h2 className="font-playfair text-lg font-bold text-charcoal-950 flex items-center gap-2">
                <FileText size={17} className="text-emerald-600" />Documents
              </h2>
            </div>
            <div className="divide-y divide-ivory-200">
              {DOCUMENTS.map(doc => (
                <div key={doc.name} className="flex items-center gap-4 px-6 py-3.5 hover:bg-ivory-50 transition-colors">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-dm text-charcoal-800 truncate">{doc.name}</p>
                    <p className="text-2xs font-dm text-charcoal-400">{doc.size} · {doc.date}</p>
                  </div>
                  <button className="text-charcoal-300 hover:text-emerald-600 transition-colors">
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inquiries */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-200">
            <h2 className="font-playfair text-lg font-bold text-charcoal-950 flex items-center gap-2">
              <MessageSquare size={17} className="text-emerald-600" />Recent Inquiries
            </h2>
          </div>
          <div className="divide-y divide-ivory-200">
            {INQUIRIES.map(inq => (
              <div key={inq.id} className="flex items-start gap-4 px-6 py-4 hover:bg-ivory-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {inq.from[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-dm font-semibold text-charcoal-800">{inq.from}</p>
                    <span className={`text-[10px] font-dm font-bold px-2 py-0.5 rounded-full ${inq.status==='New' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs font-dm text-charcoal-500 mb-0.5">{inq.message}</p>
                  <p className="text-2xs font-dm text-charcoal-400">{inq.property} · {inq.time}</p>
                </div>
                <button className="text-xs font-dm text-emerald-700 hover:text-emerald-800 font-semibold whitespace-nowrap">
                  Reply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Advisor CTA */}
        <div className="bg-section-dark rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-playfair text-2xl font-bold text-white mb-2">Speak with Your Dedicated Advisor</h3>
            <p className="font-dm text-white/55 text-sm">Questions about your portfolio, upcoming lease renewals, or property management? Your advisor is available Monday–Friday 8am–7pm.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/appointments" className="btn-md btn-gold">Book a Call</Link>
            <Link href="/contact"      className="btn-md btn-white">Send Message</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
