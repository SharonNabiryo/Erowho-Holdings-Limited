import Link from 'next/link'
import { FileText, Download, Plus, BarChart3 } from 'lucide-react'

const REPORTS = [
  { title:'Q4 2024 Toronto Market Report',   period:'Q4 2024', city:'Toronto', downloads:142, published:true,  date:'Dec 1, 2024'  },
  { title:'Vancouver Luxury Market Overview',period:'Nov 2024', city:'Vancouver',downloads:98, published:true,  date:'Nov 15, 2024' },
  { title:'Cross-Border Investment Guide',   period:'2024',    city:'Canada+USA',downloads:231,published:true,  date:'Oct 1, 2024'  },
  { title:'Miami Investment Outlook 2025',   period:'Q1 2025', city:'Miami',   downloads:0,   published:false, date:'Draft'         },
  { title:'NYC Rental Market Analysis',      period:'Q4 2024', city:'New York',downloads:0,   published:false, date:'Draft'         },
]

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-dm font-semibold text-slate-700">Market Reports</h3>
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors">
          <Plus size={15}/>New Report
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {REPORTS.map((r,i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0"><FileText size={18} className="text-emerald-700"/></div>
              <div className="flex-1 min-w-0">
                <p className="font-dm font-semibold text-slate-800 leading-snug">{r.title}</p>
                <p className="text-xs font-dm text-slate-400 mt-0.5">{r.city} · {r.period}</p>
              </div>
              <span className={`text-[10px] font-dm font-bold px-2.5 py-1 rounded-full shrink-0 ${r.published?'bg-emerald-100 text-emerald-800':'bg-amber-100 text-amber-800'}`}>{r.published?'Published':'Draft'}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-dm text-slate-400">
              <span>{r.date}</span>
              {r.downloads > 0 && <span className="flex items-center gap-1"><Download size={11}/>{r.downloads} downloads</span>}
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 text-xs font-dm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors">Edit</button>
              {r.published && <button className="flex-1 py-2 text-xs font-dm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1"><Download size={11}/>Download</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
