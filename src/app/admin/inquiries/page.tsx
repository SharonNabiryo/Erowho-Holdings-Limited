'use client'
import { useState } from 'react'
import { Search, Mail, Phone, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK = [
  { id:'i1', name:'Chen Wei',       email:'chen@corp.com',   phone:'+1 604 555 0181', subject:'Commercial Space Vancouver', type:'Commercial',  msg:'Looking for 5,000+ sqft office space in Vancouver CBD for Q1 2025 occupancy.',         status:'NEW',      time:'2h ago'  },
  { id:'i2', name:'Elena Vasquez',  email:'elena@email.com', phone:'+1 416 555 0292', subject:'Cross-Border Purchase',      type:'Cross-Border', msg:'Canadian citizen buying in Florida. Need guidance on LLC structure and FIRPTA.',       status:'RESPONDED',time:'5h ago'  },
  { id:'i3', name:'John Ababio',    email:'john@mail.com',   phone:'+1 514 555 0383', subject:'Montreal Investment',        type:'Investment',   msg:'Looking for income properties in Plateau or Villeray under $1.2M with good cap rate.',status:'NEW',      time:'1d ago'  },
  { id:'i4', name:'Lucy Forster',   email:'lucy@co.com',     phone:'+1 212 555 0494', subject:'NYC Luxury Rental',          type:'Renting',      msg:'Relocating from London, need furnished 2-bed in Tribeca or West Village under $15K/mo.',status:'ARCHIVED',time:'3d ago'  },
  { id:'i5', name:'David Park',     email:'david@tech.com',  phone:'+1 310 555 0595', subject:'LA Investment Property',     type:'Investment',   msg:'Tech professional seeking 4-unit building in LA, budget $3-5M, strong appreciation.',  status:'RESPONDED',time:'4d ago'  },
]

const STATUS_CFG: Record<string,string> = {
  NEW:'bg-emerald-100 text-emerald-800', RESPONDED:'bg-blue-100 text-blue-800', ARCHIVED:'bg-slate-100 text-slate-500'
}

export default function InquiriesPage() {
  const [q, setQ] = useState('')
  const items = MOCK.filter(i => !q || i.name.toLowerCase().includes(q.toLowerCase()) || i.subject.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search inquiries…" className="text-sm font-dm placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent"/>
        </div>
        <p className="text-sm font-dm text-slate-500 ml-auto">{items.length} inquiries</p>
      </div>
      <div className="space-y-3">
        {items.map(inq => (
          <div key={inq.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-[10px] font-dm font-bold px-2 py-0.5 rounded-full', STATUS_CFG[inq.status]??'bg-slate-100')}>{inq.status}</span>
                  <span className="badge badge-emerald text-[10px]">{inq.type}</span>
                  <span className="text-xs font-dm text-slate-400">{inq.time}</span>
                </div>
                <h3 className="font-dm font-semibold text-slate-900">{inq.subject}</h3>
                <p className="text-xs font-dm text-slate-400">{inq.name} · {inq.email}</p>
              </div>
            </div>
            <p className="text-sm font-dm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 mb-3">"{inq.msg}"</p>
            <div className="flex items-center gap-2">
              <a href={`mailto:${inq.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-dm font-medium rounded-lg transition-colors"><Mail size={12}/>Reply</a>
              <a href={`tel:${inq.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-dm font-medium rounded-lg transition-colors"><Phone size={12}/>Call</a>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-dm font-medium rounded-lg transition-colors"><ArrowRight size={12}/>Convert to Lead</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
