'use client'
import { useState } from 'react'
import { Calendar, Clock, Video, MapPin, User, CheckCircle, XCircle, Phone, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_CFG: Record<string,{label:string;color:string;icon:any}> = {
  VIEWING:      { label:'Property Viewing', color:'bg-blue-100 text-blue-800',    icon:MapPin    },
  CONSULTATION: { label:'Consultation',     color:'bg-purple-100 text-purple-800', icon:User      },
  CALL:         { label:'Strategy Call',    color:'bg-emerald-100 text-emerald-800',icon:Phone    },
  VIRTUAL_TOUR: { label:'Virtual Tour',     color:'bg-teal-100 text-teal-800',    icon:Video     },
  VALUATION:    { label:'Valuation',        color:'bg-gold-100 text-gold-800',    icon:Calendar  },
}
const STATUS_CFG: Record<string,string> = {
  PENDING:   'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-slate-100 text-slate-700',
  CANCELLED: 'bg-red-100 text-red-700',
}
const MOCK = [
  { id:'a1', title:'Bayshore Penthouse Viewing',     type:'VIEWING',      status:'CONFIRMED', date:'Today',    time:'2:00 PM', dur:60,  agent:'David Mensah',     client:'James Okonkwo',    email:'james@email.com',  phone:'+1 416 555 0101', property:'Bayshore Penthouse',  meetLink:'https://meet.google.com/abc' },
  { id:'a2', title:'Investment Portfolio Consult',   type:'CONSULTATION', status:'CONFIRMED', date:'Today',    time:'4:30 PM', dur:45,  agent:'Simone Beaumont',  client:'Maria Santos',     email:'maria@email.com',  phone:'+1 604 555 0202', property:null,                  meetLink:'https://meet.google.com/def' },
  { id:'a3', title:'King West Loft Viewing',         type:'VIEWING',      status:'PENDING',   date:'Tomorrow', time:'10:00 AM',dur:60, agent:'Natasha Kovalenko',client:'Robert Mensah',    email:'rob@corp.com',     phone:'+1 212 555 0303', property:'King West Loft',      meetLink:null },
  { id:'a4', title:'Cross-Border Buying Consult',    type:'CALL',         status:'CONFIRMED', date:'Tomorrow', time:'2:00 PM', dur:30,  agent:'Natasha Kovalenko',client:'Sophie Chen',      email:'sophie@mail.com',  phone:'+1 514 555 0404', property:null,                  meetLink:'https://meet.google.com/ghi' },
  { id:'a5', title:'Point Grey Estate Virtual Tour', type:'VIRTUAL_TOUR', status:'PENDING',   date:'Thu Jun 26',time:'11:00 AM',dur:45, agent:'David Mensah',    client:'Priya Sharma',    email:'priya@email.com',  phone:'+1 310 555 0505', property:'Point Grey Estate',   meetLink:'https://meet.google.com/jkl' },
  { id:'a6', title:'Brickell Condo Viewing',         type:'VIEWING',      status:'CANCELLED', date:'Thu Jun 26',time:'3:00 PM', dur:60, agent:'Simone Beaumont', client:'Marcus Webb',     email:'marcus@co.com',    phone:'+1 312 555 0606', property:'Brickell Waterfront', meetLink:null },
  { id:'a7', title:'Home Valuation — Westmount',     type:'VALUATION',    status:'COMPLETED', date:'Mon Jun 23',time:'1:00 PM', dur:90, agent:'Charles Lin',     client:'Amara Diallo',    email:'amara@mail.com',   phone:'+1 416 555 0707', property:null,                  meetLink:null },
  { id:'a8', title:'Luxury Investment Strategy Call',type:'CALL',         status:'COMPLETED', date:'Fri Jun 20',time:'11:00 AM',dur:45, agent:'Natasha Kovalenko',client:'Kevin Osei',     email:'kevin@email.com',  phone:'+1 604 555 0808', property:null,                  meetLink:'https://meet.google.com/mno' },
]

export default function AdminAppointmentsPage() {
  const [q,      setQ]      = useState('')
  const [filter, setFilter] = useState('All')
  const [items,  setItems]  = useState(MOCK)

  const listed = items.filter(a => {
    const mq = !q || a.client.toLowerCase().includes(q.toLowerCase()) || a.title.toLowerCase().includes(q.toLowerCase())
    const mf = filter==='All' || a.status===filter
    return mq && mf
  })

  const updateStatus = (id:string, status:string) => setItems(prev => prev.map(a => a.id===id?{...a,status}:a))

  const counts = {
    today:     items.filter(a=>a.date==='Today').length,
    upcoming:  items.filter(a=>a.status==='CONFIRMED'||a.status==='PENDING').length,
    confirmed: items.filter(a=>a.status==='CONFIRMED').length,
    pending:   items.filter(a=>a.status==='PENDING').length,
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l:"Today's Appts",  v:counts.today    },
          { l:'Upcoming Total', v:counts.upcoming  },
          { l:'Confirmed',      v:counts.confirmed },
          { l:'Awaiting Confirm',v:counts.pending  },
        ].map(s=>(
          <div key={s.l} className="bg-white border border-slate-200 rounded-xl px-5 py-4">
            <p className="font-playfair text-3xl font-bold text-slate-900">{s.v}</p>
            <p className="text-2xs font-dm text-slate-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search appointments…" className="text-sm font-dm placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent"/>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {['All','PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={cn('px-3 py-1.5 text-xs font-dm font-medium rounded-lg whitespace-nowrap transition-all', filter===f?'bg-emerald-600 text-white':'text-slate-600 hover:bg-slate-100')}>
              {f==='All'?'All':f}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors"><Plus size={15}/>Schedule</button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {listed.map(appt => {
          const tc = TYPE_CFG[appt.type]??TYPE_CFG.CONSULTATION
          const sc = STATUS_CFG[appt.status]??'bg-slate-100 text-slate-700'
          return (
            <div key={appt.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-card-hover transition-all duration-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Time block */}
                <div className="flex items-center gap-3 md:w-40 shrink-0">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-dm font-bold text-emerald-700 uppercase">{appt.date.split(' ')[0]}</span>
                    <span className="text-sm font-dm font-bold text-slate-800">{appt.time}</span>
                  </div>
                  <div>
                    <p className="text-xs font-dm text-slate-500">{appt.date}</p>
                    <p className="text-xs font-dm text-slate-400 flex items-center gap-1"><Clock size={9}/>{appt.dur} min</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={cn('text-[10px] font-dm font-bold px-2 py-0.5 rounded-full', tc.color)}>{tc.label}</span>
                    <span className={cn('text-[10px] font-dm font-bold px-2 py-0.5 rounded-full', sc)}>{appt.status}</span>
                    {appt.meetLink && <span className="text-[10px] font-dm text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Video size={9}/>Video</span>}
                  </div>
                  <p className="font-dm font-semibold text-slate-800">{appt.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-xs font-dm text-slate-500 flex items-center gap-1"><User size={10}/>{appt.client}</span>
                    <span className="text-xs font-dm text-emerald-600">{appt.agent}</span>
                    {appt.property && <span className="text-xs font-dm text-slate-400 flex items-center gap-1"><MapPin size={10}/>{appt.property}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a href={`tel:${appt.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-dm rounded-lg transition-colors"><Phone size={12}/>Call</a>
                  {appt.meetLink && <a href={appt.meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-dm rounded-lg transition-colors"><Video size={12}/>Join</a>}
                  {appt.status==='PENDING' && (
                    <button onClick={()=>updateStatus(appt.id,'CONFIRMED')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-dm rounded-lg transition-colors"><CheckCircle size={12}/>Confirm</button>
                  )}
                  {(appt.status==='PENDING'||appt.status==='CONFIRMED') && (
                    <button onClick={()=>updateStatus(appt.id,'CANCELLED')} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-dm rounded-lg transition-colors"><XCircle size={12}/>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
