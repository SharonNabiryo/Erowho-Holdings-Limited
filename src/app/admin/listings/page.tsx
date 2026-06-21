'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Archive, Eye, CheckCircle, Clock, AlertCircle, Building2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROPERTIES } from '@/data'

const STATUS_CFG: Record<string,{label:string;cls:string}> = {
  ACTIVE:           { label:'Active',           cls:'bg-emerald-100 text-emerald-800' },
  LISTING_OF_WEEK:  { label:'Week Pick',        cls:'bg-gold-100 text-gold-800'       },
  LISTING_OF_MONTH: { label:'Month Pick',       cls:'bg-purple-100 text-purple-800'   },
  DRAFT:            { label:'Draft',            cls:'bg-slate-100 text-slate-600'     },
  PENDING:          { label:'Pending',          cls:'bg-amber-100 text-amber-800'     },
  SOLD:             { label:'Sold',             cls:'bg-blue-100 text-blue-800'       },
  ARCHIVED:         { label:'Archived',         cls:'bg-red-100 text-red-700'         },
}

const MOCK = PROPERTIES.map(p => ({
  id: p.id, slug: p.slug, name: p.name, price: p.priceLabel,
  city: p.city, country: p.country, type: p.type.toUpperCase(),
  status: p.status === 'listing-of-month' ? 'LISTING_OF_MONTH' : p.status === 'listing-of-week' ? 'LISTING_OF_WEEK' : 'ACTIVE',
  beds: p.beds, sqft: p.sqft, views: Math.floor(Math.random()*800+100),
  leads: Math.floor(Math.random()*15+1), agent: p.agent.name, image: p.images[0], createdAt: p.createdAt,
}))

const TABS = ['All','Active','Draft','Pending','Sold']

export default function AdminListingsPage() {
  const [q,   setQ]   = useState('')
  const [tab, setTab] = useState('All')
  const [sel, setSel] = useState<string[]>([])

  const items = MOCK.filter(l => {
    const mq = !q || l.name.toLowerCase().includes(q.toLowerCase()) || l.city.toLowerCase().includes(q.toLowerCase())
    const mt = tab==='All' || l.status===tab.toUpperCase()
    return mq && mt
  })

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search listings…" className="text-sm font-dm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent"/>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={cn('px-3 py-1.5 text-xs font-dm font-medium rounded-lg transition-all', tab===t ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
              {t}
            </button>
          ))}
        </div>
        <Link href="/admin/listings/new" className="ml-auto flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors">
          <Plus size={15}/>New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { l:'Total',    v:MOCK.length,                               i:Building2  },
          { l:'Active',   v:MOCK.filter(l=>l.status!=='ARCHIVED').length, i:CheckCircle},
          { l:'Drafts',   v:0,                                         i:Clock      },
          { l:'Pending',  v:0,                                         i:AlertCircle},
          { l:'Total Views', v:MOCK.reduce((a,l)=>a+l.views,0).toLocaleString(), i:Eye },
        ].map(s=>(
          <div key={s.l} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <s.i size={16} className="text-emerald-600 shrink-0"/>
            <div><p className="font-playfair text-lg font-bold text-slate-900">{s.v}</p><p className="text-2xs font-dm text-slate-500">{s.l}</p></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="w-10 px-4 py-3"><input type="checkbox" className="accent-emerald-600"/></th>
                {['Property','Status','Type','Agent','Views','Leads',''].map(h=>(
                  <th key={h} className={cn('text-2xs font-dm font-bold uppercase tracking-[0.12em] text-slate-500 px-4 py-3', h==='' ? '' : 'text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(l=>{
                const sc = STATUS_CFG[l.status]??STATUS_CFG.ACTIVE
                return (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" className="accent-emerald-600"/></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                          <img src={l.image} alt="" className="w-full h-full object-cover"/>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-dm font-semibold text-slate-800 truncate max-w-52">{l.name}</p>
                          <p className="text-xs font-dm text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10}/>{l.city} {l.country==='CA'?'🇨🇦':'🇺🇸'}</p>
                          <p className="text-xs font-dm font-bold text-emerald-700 mt-0.5">{l.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={cn('text-[10px] font-dm font-bold px-2.5 py-1 rounded-full',sc.cls)}>{sc.label}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-dm text-slate-600 capitalize">{l.type.toLowerCase()}</span></td>
                    <td className="px-4 py-3"><p className="text-xs font-dm text-slate-700">{l.agent}</p></td>
                    <td className="px-4 py-3 text-right"><span className="text-sm font-dm font-semibold text-slate-700">{l.views.toLocaleString()}</span></td>
                    <td className="px-4 py-3 text-right"><span className={cn('text-sm font-dm font-semibold',l.leads>5?'text-emerald-600':'text-slate-600')}>{l.leads}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/properties/${l.slug}`} target="_blank" className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700"><Eye size={14}/></Link>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-emerald-600"><Edit2 size={14}/></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-red-500"><Archive size={14}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs font-dm text-slate-500">Showing {items.length} of {MOCK.length} listings</p>
          <div className="flex items-center gap-1">
            {['1','2','3'].map((p,i)=>(
              <button key={i} className={cn('w-8 h-8 text-xs font-dm rounded-lg transition-colors', p==='1'?'bg-emerald-600 text-white':'text-slate-600 hover:bg-slate-100')}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
