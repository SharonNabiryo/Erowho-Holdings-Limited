'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const MONTHLY_LEADS = [
  { month: 'Jun', leads: 28 }, { month: 'Jul', leads: 35 },
  { month: 'Aug', leads: 42 }, { month: 'Sep', leads: 38 },
  { month: 'Oct', leads: 55 }, { month: 'Nov', leads: 47 },
]

const PIE_COLORS = ['#047857', '#ca8a04', '#cc7d6a', '#3b82f6', '#8b5cf6', '#6b7280']

interface Props {
  leadsBySource: { source: string; count: number }[]
}

export function DashboardCharts({ leadsBySource }: Props) {
  const pieData = leadsBySource.length > 0
    ? leadsBySource.slice(0, 6).map(l => ({
        name: l.source.replace(/_/g, ' '),
        value: l.count,
      }))
    : [
        { name: 'PROPERTY INQUIRY', value: 18 },
        { name: 'WEBSITE CONTACT', value: 12 },
        { name: 'AI CHAT', value: 9 },
        { name: 'REFERRAL', value: 5 },
        { name: 'NEWSLETTER', value: 3 },
      ]

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Monthly leads bar chart */}
      <div className="bg-white rounded-2xl border border-charcoal-100 p-6">
        <h2 className="font-playfair font-bold text-charcoal-950 mb-5">Leads by Month</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MONTHLY_LEADS} barSize={28}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e4', fontSize: 12, fontFamily: 'DM Sans' }}
              cursor={{ fill: '#f0fdf4' }}
            />
            <Bar dataKey="leads" fill="#047857" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lead source pie chart */}
      <div className="bg-white rounded-2xl border border-charcoal-100 p-6">
        <h2 className="font-playfair font-bold text-charcoal-950 mb-5">Leads by Source</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 10, fontFamily: 'DM Sans' }}
            />
            <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 11, fontFamily: 'DM Sans' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
