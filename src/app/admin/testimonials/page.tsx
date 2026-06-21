'use client'
import { useState } from 'react'
import { Star, Check, X, Eye, Trash2, Plus, Search } from 'lucide-react'
import { TESTIMONIALS } from '@/data'
import { cn } from '@/lib/utils'

const MOCK = TESTIMONIALS.map((t,i) => ({ ...t, isApproved: i<4, isFeatured: i<2 }))

export default function AdminTestimonialsPage() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const [items, setItems] = useState(MOCK)

  const filtered = items.filter(t => {
    const mq = !q || t.name.toLowerCase().includes(q.toLowerCase())
    const mf = filter === 'All' || (filter === 'Pending' && !t.isApproved) || (filter === 'Approved' && t.isApproved) || (filter === 'Featured' && t.isFeatured)
    return mq && mf
  })

  const approve = (id: string) => setItems(prev => prev.map(t => t.id === id ? { ...t, isApproved: true } : t))
  const feature = (id: string) => setItems(prev => prev.map(t => t.id === id ? { ...t, isFeatured: !t.isFeatured } : t))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search testimonials…" className="text-sm font-dm placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent"/>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {['All','Approved','Pending','Featured'].map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={cn('px-3 py-1.5 text-xs font-dm font-medium rounded-lg transition-all', filter===f?'bg-emerald-600 text-white':'text-slate-600 hover:bg-slate-100')}>{f}</button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors"><Plus size={15}/>Add Review</button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex gap-0.5 mb-1">{[...Array(t.rating)].map((_,i)=><Star key={i} size={12} fill="#ca8a04" className="text-gold-600"/>)}</div>
                <p className="font-dm font-semibold text-sm text-slate-800">{t.name}</p>
                <p className="text-xs font-dm text-slate-400">{t.location} · {t.propertyType}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                {t.isApproved ? <span className="text-[10px] font-dm font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Approved</span>
                  : <span className="text-[10px] font-dm font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Pending</span>}
                {t.isFeatured && <span className="text-[10px] font-dm font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">Featured</span>}
              </div>
            </div>
            <p className="text-sm font-dm text-slate-600 leading-relaxed italic line-clamp-3">"{t.text}"</p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {!t.isApproved && (
                <button onClick={()=>approve(t.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-dm font-medium rounded-lg transition-colors">
                  <Check size={12}/>Approve
                </button>
              )}
              <button onClick={()=>feature(t.id)} className={cn('flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-dm font-medium rounded-lg transition-colors', t.isFeatured ? 'bg-gold-50 hover:bg-gold-100 text-gold-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-600')}>
                <Star size={12}/>{t.isFeatured?'Unfeature':'Feature'}
              </button>
              <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"><Trash2 size={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
