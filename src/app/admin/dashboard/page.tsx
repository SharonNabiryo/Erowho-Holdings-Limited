import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2, Users, Calendar, TrendingUp, ArrowRight,
  Star, Clock, Flame, Eye, Phone, CheckCircle, BarChart2,
  Mail, AlertCircle
} from 'lucide-react'

export const metadata: Metadata = { title: 'Dashboard' }

// Simulated stats — replace with AnalyticsService.getDashboardStats() when DB is connected
const STATS = [
  { label: 'Total Listings',        value: '124',  change: '+8',   positive: true,  icon: Building2,  color: 'bg-emerald-50  border-emerald-200', iconColor: 'text-emerald-700' },
  { label: 'New Leads (7 days)',     value: '34',   change: '+12',  positive: true,  icon: TrendingUp, color: 'bg-blue-50     border-blue-200',    iconColor: 'text-blue-700'    },
  { label: 'Upcoming Appts',        value: '9',    change: '+3',   positive: true,  icon: Calendar,   color: 'bg-gold-50     border-gold-200',    iconColor: 'text-gold-700'    },
  { label: 'Conversion Rate',       value: '18%',  change: '+2%',  positive: true,  icon: BarChart2,  color: 'bg-purple-50   border-purple-200',  iconColor: 'text-purple-700'  },
  { label: 'Active Agents',         value: '12',   change: '',     positive: true,  icon: Users,      color: 'bg-clay-50     border-clay-200',    iconColor: 'text-clay-700'    },
  { label: 'Subscribers',           value: '3,481',change: '+142', positive: true,  icon: Mail,       color: 'bg-ivory-100   border-ivory-300',   iconColor: 'text-charcoal-600'},
]

const RECENT_LEADS = [
  { name:'James Okonkwo',   email:'james@email.com', type:'Buying',      status:'NEW',       time:'4m ago',  priority: 1 },
  { name:'Maria Santos',    email:'maria@email.com', type:'Investment',  status:'CONTACTED', time:'1h ago',  priority: 2 },
  { name:'Robert Mensah',   email:'robert@co.com',   type:'Cross-Border',status:'QUALIFIED', time:'2h ago',  priority: 1 },
  { name:'Sophie Chen',     email:'sophie@mail.com', type:'Selling',     status:'NEW',       time:'3h ago',  priority: 3 },
  { name:'Priya Sharma',    email:'priya@email.com', type:'Renting',     status:'NURTURING', time:'5h ago',  priority: 2 },
  { name:'Marcus Webb',     email:'marcus@co.com',   type:'Commercial',  status:'NEW',       time:'6h ago',  priority: 2 },
]

const UPCOMING_APPTS = [
  { title:'Property Viewing — Bayshore Penthouse',     agent:'David Mensah',     time:'Today, 2:00 PM',  type:'VIEWING'      },
  { title:'Investment Consultation',                   agent:'Simone Beaumont',  time:'Today, 4:30 PM',  type:'CONSULTATION' },
  { title:'Viewing — King West Loft',                  agent:'Natasha Kovalenko',time:'Tomorrow, 10am',  type:'VIEWING'      },
  { title:'Mortgage Strategy Call',                    agent:'Charles Lin',      time:'Tomorrow, 2pm',   type:'CALL'         },
  { title:'Cross-Border Buying Consult',               agent:'Natasha Kovalenko',time:'Thu, 11:00 AM',   type:'CONSULTATION' },
]

const STATUS_COLORS: Record<string,string> = {
  NEW:         'bg-emerald-100 text-emerald-800',
  CONTACTED:   'bg-blue-100   text-blue-800',
  QUALIFIED:   'bg-purple-100 text-purple-800',
  APPOINTMENT_SET: 'bg-gold-100 text-gold-800',
  NURTURING:   'bg-orange-100 text-orange-800',
  CONVERTED:   'bg-teal-100   text-teal-800',
  LOST:        'bg-red-100    text-red-800',
}

const PRIORITY_ICON: Record<number, React.ReactNode> = {
  1: <Flame size={12} className="text-red-500" />,
  2: <AlertCircle size={12} className="text-amber-500" />,
  3: <Eye size={12} className="text-slate-400" />,
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-slate-900">Good morning, Admin</h2>
          <p className="text-sm font-dm text-slate-500 mt-0.5">Here's what's happening across your platform today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/listings/new" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors">
            + New Listing
          </Link>
          <Link href="/admin/leads/new" className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-dm font-medium rounded-xl transition-colors">
            + Add Lead
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map(s => (
          <div key={s.label} className={`bg-white rounded-2xl border p-4 ${s.color.split(' ')[1]}`}>
            <div className={`w-9 h-9 rounded-xl ${s.color.split(' ')[0]} flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.iconColor} />
            </div>
            <p className="font-playfair text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-2xs font-dm text-slate-500 mt-0.5 leading-tight">{s.label}</p>
            {s.change && (
              <p className={`text-2xs font-dm font-semibold mt-1.5 ${s.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.change} this week
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-dm font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" /> Recent Leads
            </h3>
            <Link href="/admin/leads" className="text-xs font-dm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {RECENT_LEADS.map((lead, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {lead.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {PRIORITY_ICON[lead.priority]}
                    <p className="text-sm font-dm font-semibold text-slate-800 truncate">{lead.name}</p>
                  </div>
                  <p className="text-xs font-dm text-slate-400">{lead.email} · {lead.type}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] font-dm font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status] ?? 'bg-slate-100 text-slate-700'}`}>
                    {lead.status}
                  </span>
                  <span className="text-[10px] font-dm text-slate-400 flex items-center gap-0.5">
                    <Clock size={9}/>{lead.time}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Call">
                    <Phone size={13} className="text-slate-400"/>
                  </button>
                  <Link href="/admin/leads" className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                    <ArrowRight size={13} className="text-slate-400"/>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-dm font-semibold text-slate-900 flex items-center gap-2">
                <Calendar size={15} className="text-emerald-600"/> Upcoming
              </h3>
              <Link href="/admin/appointments" className="text-xs font-dm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                All <ArrowRight size={11}/>
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {UPCOMING_APPTS.map((a, i) => (
                <div key={i} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-dm font-medium text-slate-800 leading-snug">{a.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-dm text-slate-400">{a.time}</span>
                    <span className="text-xs font-dm text-emerald-600">{a.agent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-emerald-950 rounded-2xl p-5">
            <h3 className="font-dm font-semibold text-white mb-4 flex items-center gap-2">
              <Star size={15} className="text-gold-400"/> Platform Health
            </h3>
            <div className="space-y-3">
              {[
                { label:'Listings Published', value:'87', max: 124, color:'bg-emerald-500' },
                { label:'Leads Responded',    value:'91%', max: 100, color:'bg-gold-500'   },
                { label:'Appts Confirmed',    value:'78%', max: 100, color:'bg-blue-500'   },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-dm text-white/65">{m.label}</span>
                    <span className="text-xs font-dm font-bold text-white">{m.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.color}`} style={{ width: m.value }}/>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/analytics" className="mt-4 flex items-center gap-1.5 text-xs font-dm text-gold-300 hover:text-gold-200 transition-colors">
              Full analytics <ArrowRight size={11}/>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Add New Listing',    href:'/admin/listings/new',   icon:Building2, desc:'Create and publish a property' },
          { label:'View All Leads',     href:'/admin/leads',          icon:TrendingUp,desc:'Manage your lead pipeline'    },
          { label:'Schedule Viewing',   href:'/admin/appointments',   icon:Calendar,  desc:'Book property appointments'    },
          { label:'Publish Blog Post',  href:'/admin/blog/new',       icon:Star,      desc:'Write market insights'         },
        ].map(action => (
          <Link key={action.href} href={action.href}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-luxury transition-all duration-200 group">
            <div className="w-10 h-10 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <action.icon size={18} className="text-emerald-700"/>
            </div>
            <p className="font-dm font-semibold text-sm text-slate-800 mb-0.5">{action.label}</p>
            <p className="text-xs font-dm text-slate-400">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
