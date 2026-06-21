'use client'
import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Building2, DollarSign, Eye, Calendar, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const LEAD_TREND = [
  { month:'Jan', leads:28, converted:4, appointments:9  },
  { month:'Feb', leads:35, converted:6, appointments:12 },
  { month:'Mar', leads:42, converted:8, appointments:15 },
  { month:'Apr', leads:38, converted:5, appointments:11 },
  { month:'May', leads:55, converted:10,appointments:19 },
  { month:'Jun', leads:61, converted:13,appointments:22 },
  { month:'Jul', leads:49, converted:9, appointments:17 },
  { month:'Aug', leads:67, converted:14,appointments:24 },
  { month:'Sep', leads:73, converted:16,appointments:27 },
  { month:'Oct', leads:82, converted:18,appointments:31 },
  { month:'Nov', leads:88, converted:20,appointments:33 },
  { month:'Dec', leads:94, converted:22,appointments:36 },
]

const LISTING_VIEWS = [
  { week:'W1', views:1240, saves:89, inquiries:34 },
  { week:'W2', views:1580, saves:112,inquiries:41 },
  { week:'W3', views:1390, saves:98, inquiries:38 },
  { week:'W4', views:1820, saves:134,inquiries:52 },
  { week:'W5', views:2100, saves:158,inquiries:64 },
  { week:'W6', views:1950, saves:142,inquiries:58 },
]

const LEAD_SOURCES = [
  { name:'Website',      value:38, color:'#047857' },
  { name:'Referral',     value:24, color:'#ca8a04' },
  { name:'Google Ads',   value:16, color:'#0891b2' },
  { name:'AI Assistant', value:12, color:'#7c3aed' },
  { name:'Social Media', value:6,  color:'#db2777' },
  { name:'Other',        value:4,  color:'#6b7280' },
]

const CITY_PERFORMANCE = [
  { city:'Toronto',    listings:38, leads:142, revenue:4820000 },
  { city:'Vancouver',  listings:24, leads:98,  revenue:6100000 },
  { city:'New York',   listings:31, leads:128, revenue:8400000 },
  { city:'Miami',      listings:19, leads:82,  revenue:3200000 },
  { city:'Montreal',   listings:12, leads:44,  revenue:1900000 },
  { city:'Los Angeles',listings:16, leads:67,  revenue:5600000 },
]

const PERIODS = ['7d','30d','90d','1y','All']

const KPI = [
  { label:'Total Revenue (YTD)', value:'$42.8M', change:'+18.3%', up:true,  icon:DollarSign },
  { label:'Total Leads',         value:'794',    change:'+24.1%', up:true,  icon:TrendingUp },
  { label:'Conversion Rate',     value:'18.4%',  change:'+2.1%',  up:true,  icon:Users      },
  { label:'Avg Deal Size',       value:'$1.24M', change:'+6.7%',  up:true,  icon:Building2  },
  { label:'Listing Views (mo)',  value:'24,810', change:'+31.2%', up:true,  icon:Eye        },
  { label:'Appointments Set',    value:'156',    change:'+12.8%', up:true,  icon:Calendar   },
  { label:'Newsletter Subs',     value:'3,481',  change:'+8.4%',  up:true,  icon:Mail       },
  { label:'Avg Days to Close',   value:'34',     change:'-4 days',up:true,  icon:TrendingDown},
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d')

  return (
    <div className="space-y-7">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-dm text-slate-500">Platform analytics · Updated in real-time</p>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn('px-3 py-1.5 text-xs font-dm font-medium rounded-lg transition-all',
                period === p ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI.map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-2xs font-dm text-slate-500 uppercase tracking-wide">{k.label}</p>
              <k.icon size={15} className="text-slate-400"/>
            </div>
            <p className="font-playfair text-2xl font-bold text-slate-900">{k.value}</p>
            <p className={cn('text-xs font-dm font-semibold mt-1.5 flex items-center gap-1',
              k.up ? 'text-emerald-600' : 'text-red-500')}>
              {k.up ? '▲' : '▼'} {k.change} vs prev period
            </p>
          </div>
        ))}
      </div>

      {/* Main charts row */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-5">
        {/* Lead Trend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-dm font-semibold text-slate-900 mb-6">Lead Pipeline — 12 Months</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={LEAD_TREND}>
              <defs>
                <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{ fontSize:11, fontFamily:'DM Sans' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fontFamily:'DM Sans' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius:12, border:'1px solid #e2e8f0', fontFamily:'DM Sans', fontSize:12 }}/>
              <Legend wrapperStyle={{ fontFamily:'DM Sans', fontSize:12 }}/>
              <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#047857" strokeWidth={2} fill="url(#gLeads)"/>
              <Area type="monotone" dataKey="converted" name="Converted" stroke="#ca8a04" strokeWidth={2} fill="url(#gConv)"/>
              <Line type="monotone" dataKey="appointments" name="Appointments" stroke="#7c3aed" strokeWidth={2} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources pie */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-dm font-semibold text-slate-900 mb-6">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={LEAD_SOURCES} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {LEAD_SOURCES.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius:10, fontFamily:'DM Sans', fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {LEAD_SOURCES.map(s => (
              <div key={s.name} className="flex items-center gap-2 text-xs font-dm text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }}/>
                <span className="truncate">{s.name}</span>
                <span className="ml-auto font-semibold text-slate-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listing performance */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-dm font-semibold text-slate-900 mb-6">Listing Engagement — 6 Weeks</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={LISTING_VIEWS} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="week" tick={{ fontSize:11, fontFamily:'DM Sans' }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:11, fontFamily:'DM Sans' }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ borderRadius:12, border:'1px solid #e2e8f0', fontFamily:'DM Sans', fontSize:12 }}/>
            <Legend wrapperStyle={{ fontFamily:'DM Sans', fontSize:12 }}/>
            <Bar dataKey="views"    name="Views"     fill="#047857" radius={[4,4,0,0]}/>
            <Bar dataKey="saves"    name="Saves"     fill="#ca8a04" radius={[4,4,0,0]}/>
            <Bar dataKey="inquiries"name="Inquiries" fill="#0891b2" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* City performance table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-dm font-semibold text-slate-900">Performance by City</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {['City','Active Listings','Total Leads','Est. Revenue','Avg Lead Value'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-2xs font-dm font-bold uppercase tracking-[0.1em] text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CITY_PERFORMANCE.map(city => (
                <tr key={city.city} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-dm font-semibold text-slate-800">{city.city}</td>
                  <td className="px-6 py-4 text-sm font-dm text-slate-600">{city.listings}</td>
                  <td className="px-6 py-4 text-sm font-dm text-slate-600">{city.leads}</td>
                  <td className="px-6 py-4 text-sm font-dm font-semibold text-emerald-700">${(city.revenue/1_000_000).toFixed(1)}M</td>
                  <td className="px-6 py-4 text-sm font-dm text-slate-600">${Math.round(city.revenue/city.leads).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
