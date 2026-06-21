'use client'
import { Bell, Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TITLES: Record<string,string> = {
  '/admin/dashboard':   'Dashboard',
  '/admin/analytics':   'Analytics',
  '/admin/listings':    'Listings',
  '/admin/agents':      'Agent Management',
  '/admin/appointments':'Appointments',
  '/admin/leads':       'Lead Management',
  '/admin/inquiries':   'Inquiries',
  '/admin/newsletter':  'Newsletter Subscribers',
  '/admin/blog':        'Blog & CMS',
  '/admin/testimonials':'Testimonials',
  '/admin/reports':     'Market Reports',
  '/admin/owners':      'Owner Portal',
  '/admin/settings':    'Settings',
}

const QUICK_ACTIONS: Record<string,{label:string;href:string}> = {
  '/admin/listings': { label:'+ New Listing',      href:'/admin/listings/new'    },
  '/admin/agents':   { label:'+ Add Agent',         href:'/admin/agents/new'      },
  '/admin/blog':     { label:'+ New Post',          href:'/admin/blog/new'        },
  '/admin/leads':    { label:'+ Add Lead',          href:'/admin/leads/new'       },
}

interface Props { user: { name?: string|null; role: string } }

export function AdminHeader({ user }: Props) {
  const pathname = usePathname()
  const title    = TITLES[pathname] ?? 'Erowho Admin'
  const qa       = QUICK_ACTIONS[pathname]

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="font-playfair text-xl font-bold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-56">
          <Search size={14} className="text-slate-400"/>
          <input placeholder="Quick search…" className="bg-transparent text-sm font-dm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1"/>
        </div>
        {/* Bell */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={18}/>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"/>
        </button>
        {/* Quick action */}
        {qa && (
          <Link href={qa.href} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors">
            <Plus size={14}/>{qa.label}
          </Link>
        )}
      </div>
    </header>
  )
}
