'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, Users, Calendar, BarChart3,
  FileText, Star, Settings, ChevronRight, Shield, Megaphone,
  MessagesSquare, TrendingUp, BookOpen, X, Home, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_SECTIONS = [
  { label: 'Overview', items: [
    { href: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard'    },
    { href: '/admin/analytics',  icon: BarChart3,       label: 'Analytics'    },
  ]},
  { label: 'Real Estate', items: [
    { href: '/admin/listings',     icon: Building2, label: 'Listings'         },
    { href: '/admin/agents',       icon: Users,     label: 'Agents'           },
    { href: '/admin/appointments', icon: Calendar,  label: 'Appointments', b: 3 },
  ]},
  { label: 'CRM', items: [
    { href: '/admin/leads',      icon: TrendingUp,    label: 'Leads',    b: 12 },
    { href: '/admin/inquiries',  icon: MessagesSquare,label: 'Inquiries'       },
    { href: '/admin/newsletter', icon: Megaphone,     label: 'Newsletter'      },
  ]},
  { label: 'Content', items: [
    { href: '/admin/blog',         icon: BookOpen, label: 'Blog / CMS'         },
    { href: '/admin/testimonials', icon: Star,     label: 'Testimonials'        },
    { href: '/admin/reports',      icon: FileText, label: 'Reports'             },
  ]},
  { label: 'Platform', items: [
    { href: '/admin/owners',   icon: Shield,   label: 'Owner Portal' },
    { href: '/admin/settings', icon: Settings, label: 'Settings'     },
  ]},
]

interface Props { user: { name?: string|null; role: string } }

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname()
  const [col, setCol] = useState(false)
  return (
    <aside className={cn('h-screen bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-all duration-300 shrink-0', col ? 'w-16' : 'w-64')}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800 shrink-0">
        {!col && <div className="flex flex-col leading-none"><span className="font-playfair text-lg font-bold text-white">EROWHO</span><span className="text-[9px] font-dm text-emerald-400 uppercase tracking-[0.2em]">Admin Portal</span></div>}
        <button onClick={() => setCol(c=>!c)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto">
          {col ? <ChevronRight size={16}/> : <X size={16}/>}
        </button>
      </div>
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {NAV_SECTIONS.map(sec => (
          <div key={sec.label} className="mb-5">
            {!col && <p className="text-[9px] font-dm font-bold uppercase tracking-[0.18em] text-slate-500 px-4 mb-2">{sec.label}</p>}
            {sec.items.map((item:any) => {
              const active = pathname === item.href || pathname.startsWith(item.href+'/')
              return (
                <Link key={item.href} href={item.href} title={col ? item.label : undefined}
                  className={cn('flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition-all duration-150 relative',
                    active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800')}>
                  <item.icon size={17} className="shrink-0"/>
                  {!col && <><span className="text-sm font-medium flex-1">{item.label}</span>{item.b && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{item.b}</span>}</>}
                  {col && item.b && <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-slate-900"/>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      {!col && <div className="px-4 py-2 border-t border-slate-800"><Link href="/" target="_blank" className="flex items-center gap-2 text-xs font-dm text-slate-400 hover:text-white transition-colors py-2"><Home size={14}/>View Public Site</Link></div>}
      <div className={cn('border-t border-slate-800 p-4 flex items-center gap-3 shrink-0', col && 'justify-center')}>
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{user.name?.[0]?.toUpperCase() ?? 'A'}</div>
        {!col && <div className="flex-1 min-w-0"><p className="text-xs font-dm font-semibold text-white truncate">{user.name ?? 'Admin'}</p><p className="text-[10px] font-dm text-emerald-400">{user.role?.replace('_',' ')}</p></div>}
        {!col && <Link href="/api/auth/signout" className="text-slate-500 hover:text-white transition-colors"><LogOut size={14}/></Link>}
      </div>
    </aside>
  )
}
