'use client'
import { useState } from 'react'
import { Search, Filter, Flame, AlertCircle, Eye, Phone, Mail, Plus, ArrowUpDown, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS = ['NEW','CONTACTED','QUALIFIED','APPOINTMENT_SET','ACTIVE','NURTURING','CONVERTED','LOST']
const TYPES  = ['Buying','Selling','Investment','Renting','Cross-Border','Commercial','Mortgage','Valuation','General']
const SOURCES = ['Website','Referral','Social','Google Ads','AI Assistant','Newsletter','Direct']

const STATUS_CFG: Record<string,string> = {
  NEW:             'bg-emerald-100 text-emerald-800',
  CONTACTED:       'bg-blue-100 text-blue-800',
  QUALIFIED:       'bg-purple-100 text-purple-800',
  APPOINTMENT_SET: 'bg-gold-100 text-gold-800',
  ACTIVE:          'bg-teal-100 text-teal-800',
  NURTURING:       'bg-orange-100 text-orange-800',
  CONVERTED:       'bg-cyan-100 text-cyan-800',
  LOST:            'bg-red-100 text-red-700',
}

const MOCK_LEADS = [
  { id:'l1', name:'James Okonkwo',    email:'james@email.com',  phone:'+1 416 555 0101', type:'Buying',       source:'Website',      status:'NEW',             priority:1, budget:'$1M–$2M', time:'4m ago',   agent:'Natasha K.' },
  { id:'l2', name:'Maria Santos',     email:'maria@email.com',  phone:'+1 604 555 0202', type:'Investment',   source:'Referral',     status:'CONTACTED',       priority:2, budget:'$500K+',  time:'1h ago',   agent:'Simone B.'  },
  { id:'l3', name:'Robert Mensah',    email:'rob@corp.com',     phone:'+1 212 555 0303', type:'Cross-Border', source:'AI Assistant', status:'QUALIFIED',        priority:1, budget:'$3M+',    time:'2h ago',   agent:'Natasha K.' },
  { id:'l4', name:'Sophie Chen',      email:'sophie@mail.com',  phone:'+1 514 555 0404', type:'Selling',      source:'Google Ads',   status:'NEW',             priority:3, budget:'N/A',     time:'3h ago',   agent:'David M.'   },
  { id:'l5', name:'Priya Sharma',     email:'priya@email.com',  phone:'+1 310 555 0505', type:'Renting',      source:'Social',       status:'NURTURING',       priority:2, budget:'$4K/mo',  time:'5h ago',   agent:'Charles L.' },
  { id:'l6', name:'Marcus Webb',      email:'marcus@co.com',    phone:'+1 312 555 0606', type:'Commercial',   source:'Direct',       status:'APPOINTMENT_SET', priority:1, budget:'$5M+',    time:'6h ago',   agent:'Charles L.' },
  { id:'l7', name:'Amara Diallo',     email:'amara@mail.com',   phone:'+1 416 555 0707', type:'Buying',       source:'Newsletter',   status:'ACTIVE',          priority:2, budget:'$800K',   time:'1d ago',   agent:'Natasha K.' },
  { id:'l8', name:'Kevin Osei',       email:'kevin@email.com',  phone:'+1 604 555 0808', type:'Investment',   source:'Website',      status:'CONVERTED',       priority:1, budget:'$2M+',    time:'3d ago',   agent:'David M.'   },
  { id:'l9', name:'Linda Tremblay',   email:'linda@mail.com',   phone:'+1 514 555 0909', type:'Selling',      source:'Referral',     status:'CONTACTED',       priority:3, budget:'N/A',     time:'4d ago',   agent:'Simone B.'  },
  { id:'l10',name:'Paul Richardson',  email:'paul@corp.com',    phone:'+1 212 555 1010', type:'Mortgage',     source:'Google Ads',   status:'NEW',             priority:2, budget:'$1.5M',   time:'5d ago',   agent:'Natasha K.' },
]

const PRIORITY_ICON: Record<number,{icon:any;cls:string;label:string}> = {
  1: { icon:Flame,        cls:'text-red-500',   label:'Hot'  },
  2: { icon:AlertCircle,  cls:'text-amber-500', label:'Warm' },
  3: { icon:Eye,          cls:'text-slate-400', label:'Cool' },
}

export default function AdminLeadsPage() {
  const [q,    setQ]    = useState('')
  const [tab,  setTab]  = useState('All')
  const [sel,  setSel]  = useState<string[]>([])
  const [active, setActive] = useState<string|null>(null)

  const items = MOCK_LEADS.filter(l => {
    const mq = !q || l.name.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase()) || l.type.toLowerCase().includes(q.toLowerCase())
    const mt = tab==='All' || l.status===tab
    return mq && mt
  })

  const stats = {
    total:    MOCK_LEADS.length,
    hot:      MOCK_LEADS.filter(l=>l.priority===1).length,
    new_:     MOCK_LEADS.filter(l=>l.status==='NEW').length,
    converted:MOCK_LEADS.filter(l=>l.status==='CONVERTED').length,
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l:'Total Leads', v:stats.total,     cls:'text-slate-900' },
          { l:'🔥 Hot',       v:stats.hot,      cls:'text-red-600'   },
          { l:'New Today',   v:stats.new_,      cls:'text-emerald-700'},
          { l:'Converted',   v:stats.converted, cls:'text-blue-700'  },
        ].map(s=>(
          <div key={s.l} className="bg-white border border-slate-200 rounded-xl px-5 py-4">
            <p className={cn('font-playfair text-3xl font-bold',s.cls)}>{s.v}</p>
            <p className="text-2xs font-dm text-slate-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search leads…" className="text-sm font-dm placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent"/>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
          {['All','NEW','CONTACTED','QUALIFIED','APPOINTMENT_SET','ACTIVE','CONVERTED'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={cn('px-3 py-1.5 text-xs font-dm font-medium rounded-lg whitespace-nowrap transition-all',
              tab===t?'bg-emerald-600 text-white':'text-slate-600 hover:bg-slate-100')}>
              {t==='All'?'All':t.replace('_',' ')}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors ml-auto">
          <Plus size={15}/>Add Lead
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="w-10 px-4 py-3"><input type="checkbox" className="accent-emerald-600"/></th>
                {['Lead','Type','Status','Source','Budget','Agent','Added',''].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-2xs font-dm font-bold uppercase tracking-[0.12em] text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(lead=>{
                const pi = PRIORITY_ICON[lead.priority]
                const sc = STATUS_CFG[lead.status]??'bg-slate-100 text-slate-600'
                return (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" className="accent-emerald-600"/></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <pi.icon size={13} className={pi.cls}/>
                        <div>
                          <p className="text-sm font-dm font-semibold text-slate-800">{lead.name}</p>
                          <p className="text-xs font-dm text-slate-400">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs font-dm text-slate-700">{lead.type}</span></td>
                    <td className="px-4 py-3"><span className={cn('text-[10px] font-dm font-bold px-2.5 py-1 rounded-full',sc)}>{lead.status.replace('_',' ')}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-dm text-slate-500">{lead.source}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-dm font-semibold text-slate-700">{lead.budget}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-dm text-slate-600">{lead.agent}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-dm text-slate-400">{lead.time}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <a href={`tel:${lead.phone}`} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-emerald-600"><Phone size={13}/></a>
                        <a href={`mailto:${lead.email}`} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600"><Mail size={13}/></a>
                        <button onClick={()=>setActive(active===lead.id?null:lead.id)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700">
                          <Tag size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs font-dm text-slate-500">{items.length} leads</p>
          <select className="text-xs font-dm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
            <option>20 per page</option><option>50 per page</option><option>100 per page</option>
          </select>
        </div>
      </div>
    </div>
  )
}
