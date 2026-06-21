'use client'
import { useState } from 'react'
import { Search, Download, UserX, Users, TrendingUp, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_SUBS = [
  { id:'s1', email:'james.okonkwo@email.com', name:'James Okonkwo',   source:'Website',     tags:['Buyer','Luxury'],    active:true,  date:'Jun 18, 2025' },
  { id:'s2', email:'maria.santos@email.com',  name:'Maria Santos',    source:'AI Assistant',tags:['Investor'],          active:true,  date:'Jun 15, 2025' },
  { id:'s3', email:'rob.mensah@corp.com',     name:'Robert Mensah',   source:'Referral',    tags:['Buyer','CrossBorder'],active:true, date:'Jun 12, 2025' },
  { id:'s4', email:'sophie.chen@mail.com',    name:'Sophie Chen',     source:'Newsletter',  tags:['Seller'],            active:true,  date:'Jun 10, 2025' },
  { id:'s5', email:'priya.sharma@email.com',  name:'Priya Sharma',    source:'Social',      tags:['Renter'],            active:false, date:'Jun 8, 2025'  },
  { id:'s6', email:'marcus.webb@co.com',      name:'Marcus Webb',     source:'Google Ads',  tags:['Investor','Commercial'],active:true,date:'Jun 5, 2025' },
  { id:'s7', email:'amara.diallo@mail.com',   name:'Amara Diallo',    source:'Website',     tags:['Buyer'],             active:true,  date:'Jun 3, 2025'  },
  { id:'s8', email:'kevin.osei@email.com',    name:'Kevin Osei',      source:'Website',     tags:['Investor'],          active:true,  date:'Jun 1, 2025'  },
]

export default function AdminNewsletterPage() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const subs = MOCK_SUBS.filter(s => {
    const mq = !q || s.email.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase())
    const mf = filter==='All' || (filter==='Active'&&s.active) || (filter==='Unsubscribed'&&!s.active)
    return mq && mf
  })
  const stats = { total: MOCK_SUBS.length, active: MOCK_SUBS.filter(s=>s.active).length, thisWeek: 3, openRate: '38.4%' }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ l:'Total Subscribers', v:stats.total, i:Users }, { l:'Active', v:stats.active, i:Mail }, { l:'This Week', v:`+${stats.thisWeek}`, i:TrendingUp }, { l:'Avg Open Rate', v:stats.openRate, i:TrendingUp }].map(s=>(
          <div key={s.l} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <s.i size={16} className="text-emerald-600 shrink-0"/>
            <div><p className="font-playfair text-xl font-bold text-slate-900">{s.v}</p><p className="text-2xs font-dm text-slate-500">{s.l}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search subscribers…" className="text-sm font-dm placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent"/>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {['All','Active','Unsubscribed'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={cn('px-3 py-1.5 text-xs font-dm font-medium rounded-lg transition-all',filter===f?'bg-emerald-600 text-white':'text-slate-600 hover:bg-slate-100')}>{f}</button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-dm rounded-xl transition-colors">
          <Download size={14}/>Export CSV
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {['Subscriber','Source','Tags','Status','Joined',''].map(h=>(
                <th key={h} className="text-left px-5 py-3 text-2xs font-dm font-bold uppercase tracking-[0.1em] text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subs.map(s=>(
              <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-dm font-semibold text-slate-800">{s.name}</p>
                  <p className="text-xs font-dm text-slate-400">{s.email}</p>
                </td>
                <td className="px-5 py-3.5"><span className="text-xs font-dm text-slate-600">{s.source}</span></td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {s.tags.map(tag=><span key={tag} className="text-[10px] font-dm font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{tag}</span>)}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn('text-[10px] font-dm font-bold px-2.5 py-1 rounded-full',s.active?'bg-emerald-100 text-emerald-800':'bg-red-100 text-red-700')}>
                    {s.active?'Active':'Unsub'}
                  </span>
                </td>
                <td className="px-5 py-3.5"><span className="text-xs font-dm text-slate-400">{s.date}</span></td>
                <td className="px-5 py-3.5">
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-red-500"><UserX size={13}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs font-dm text-slate-500">{subs.length} subscribers shown</p>
        </div>
      </div>
    </div>
  )
}
