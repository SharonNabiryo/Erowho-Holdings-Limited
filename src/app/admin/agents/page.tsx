'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Plus, Search, Star, Phone, Mail, Edit2, ToggleLeft, ToggleRight, MapPin, TrendingUp, Building2 } from 'lucide-react'
import { AGENTS } from '@/data'
import { cn } from '@/lib/utils'

const MOCK_AGENTS = AGENTS.map((a,i) => ({
  ...a,
  isActive: true, isFeatured: i < 2,
  listings: [12,8,6,4][i], leads: [48,34,28,19][i], closedDeals: [320,214,188,156][i],
  ytdRevenue: ['$12.4M','$8.2M','$6.8M','$4.1M'][i],
  cities: a.cities, languages: ['English','French'][i%2===0?0:1],
}))

export default function AdminAgentsPage() {
  const [q, setQ] = useState('')
  const agents = MOCK_AGENTS.filter(a => !q || a.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search agents…" className="text-sm font-dm placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent"/>
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors">
          <Plus size={15}/>Add Agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l:'Total Agents', v:MOCK_AGENTS.length, i:TrendingUp },
          { l:'Active',       v:MOCK_AGENTS.filter(a=>a.isActive).length, i:ToggleRight },
          { l:'Total Listings', v:MOCK_AGENTS.reduce((s,a)=>s+a.listings,0), i:Building2 },
          { l:'Total Leads',    v:MOCK_AGENTS.reduce((s,a)=>s+a.leads,0),    i:Mail },
        ].map(s => (
          <div key={s.l} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <s.i size={16} className="text-emerald-600 shrink-0"/>
            <div><p className="font-playfair text-xl font-bold text-slate-900">{s.v}</p><p className="text-2xs font-dm text-slate-500">{s.l}</p></div>
          </div>
        ))}
      </div>

      {/* Agent cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300">
            <div className="flex items-start gap-4 p-5 border-b border-slate-100">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                <Image src={agent.photo} alt={agent.name} fill className="object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-playfair font-bold text-slate-900">{agent.name}</p>
                    <p className="text-xs font-dm text-emerald-700 font-medium mt-0.5">{agent.title}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {agent.isFeatured && <span className="text-[10px] font-dm font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-800 border border-gold-200">Featured</span>}
                    <span className={cn('text-[10px] font-dm font-bold px-2 py-0.5 rounded-full', agent.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600')}>
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-0.5">
                    <Star size={12} fill="#ca8a04" className="text-gold-600"/>
                    <span className="text-xs font-dm text-slate-600 ml-0.5">{agent.rating} ({agent.dealsCount} deals)</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-dm text-slate-400">
                    <MapPin size={10}/>{agent.cities.join(' · ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 divide-x divide-slate-100">
              {[
                { l:'Listings', v:agent.listings },
                { l:'Leads',    v:agent.leads },
                { l:'Closed',   v:agent.closedDeals },
                { l:'YTD Rev',  v:agent.ytdRevenue },
              ].map(m => (
                <div key={m.l} className="py-3 px-4 text-center">
                  <p className="font-playfair text-lg font-bold text-slate-800">{m.v}</p>
                  <p className="text-2xs font-dm text-slate-400 mt-0.5">{m.l}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-5 py-3 bg-slate-50/60">
              <div className="flex items-center gap-3">
                <a href={`tel:${agent.phone}`} className="flex items-center gap-1.5 text-xs font-dm text-slate-600 hover:text-emerald-700 transition-colors">
                  <Phone size={12}/>{agent.phone}
                </a>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-emerald-600"><Edit2 size={13}/></button>
                <button className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-700">
                  {agent.isActive ? <ToggleRight size={15} className="text-emerald-600"/> : <ToggleLeft size={15}/>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
