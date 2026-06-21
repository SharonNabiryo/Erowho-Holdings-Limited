'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label:'Buy',    href:'/listings?type=buy' },
  { label:'Rent',   href:'/listings?type=rent' },
  { label:'Sell',   href:'/sell' },
  {
    label:'Invest',
    href:'/investor',
    children:[
      { label:'Investor Platform',   href:'/investor',            icon:'💼' },
      { label:'Investment Listings', href:'/listings?type=investment', icon:'🏢' },
      { label:'ROI Calculator',      href:'/tools?tab=roi',       icon:'📊' },
      { label:'Cross-Border Guide',  href:'/investor#cross-border',icon:'🌎' },
    ],
  },
  {
    label:'Properties',
    href:'/listings',
    children:[
      { label:'All Listings',       href:'/listings',                  icon:'🏠' },
      { label:'Luxury Homes',       href:'/listings?type=luxury',      icon:'✨' },
      { label:'Commercial',         href:'/listings?type=commercial',  icon:'🏙️' },
      { label:'Listing of Week',    href:'/listings?status=listing-of-week', icon:'⭐' },
    ],
  },
  {
    label:'Tools',
    href:'/tools',
    children:[
      { label:'All Calculators',    href:'/tools',        icon:'🔢' },
      { label:'Mortgage Calc',      href:'/tools',        icon:'🏦' },
      { label:'Affordability',      href:'/tools',        icon:'💰' },
      { label:'Closing Costs',      href:'/tools',        icon:'📋' },
    ],
  },
  {
    label:'Company',
    href:'/about',
    children:[
      { label:'About Erowho',   href:'/about',         icon:'🏛️' },
      { label:'AI Assistant',   href:'/ai-assistant',  icon:'🤖' },
      { label:'Blog',           href:'/blog',          icon:'📰' },
      { label:'Book Appointment',href:'/appointments', icon:'📅' },
      { label:'Owner Portal',   href:'/owner-portal',  icon:'🔑' },
      { label:'Contact',        href:'/contact',       icon:'📞' },
    ],
  },
]

export function Navbar() {
  const pathname  = usePathname()
  const isHome    = pathname === '/'
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu]     = useState<string|null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    h(); window.addEventListener('scroll', h, { passive:true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const transparent = isHome && !scrolled

  const enter = (label: string) => { clearTimeout(timerRef.current); setOpenMenu(label) }
  const leave = () => { timerRef.current = setTimeout(() => setOpenMenu(null), 80) }

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', transparent ? 'bg-transparent' : 'bg-white border-b border-charcoal-100 shadow-sm')} style={{ height:'var(--nav-height)' }}>
      <div className="container-xl h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none shrink-0 group">
          <span className={cn('font-playfair text-2xl font-bold tracking-tight transition-colors', transparent ? 'text-white group-hover:text-gold-300' : 'text-charcoal-900 group-hover:text-emerald-700')}>EROWHO</span>
          <span className={cn('text-[9px] font-dm font-semibold uppercase tracking-[0.28em] mt-0.5', transparent ? 'text-gold-400' : 'text-emerald-700')}>Holdings Limited</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {NAV.map(item => (
            <div key={item.label} className="relative" onMouseEnter={() => item.children && enter(item.label)} onMouseLeave={leave}>
              <Link href={item.href}
                className={cn('flex items-center gap-1 px-3 py-2 text-sm font-dm font-medium rounded-lg transition-colors duration-150',
                  pathname.startsWith(item.href) && item.href !== '/'
                    ? (transparent ? 'text-gold-300 bg-white/10' : 'text-emerald-700 bg-emerald-50')
                    : (transparent ? 'text-white/75 hover:text-white hover:bg-white/10' : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-50'))}>
                {item.label}
                {item.children && <ChevronDown size={12} className={cn('transition-transform duration-200', openMenu===item.label && 'rotate-180')}/>}
              </Link>
              {item.children && openMenu===item.label && (
                <div className="absolute left-0 top-full pt-2 w-52 z-50" onMouseEnter={() => enter(item.label)} onMouseLeave={leave}>
                  <div className="bg-white rounded-2xl shadow-card-hover border border-ivory-200 overflow-hidden py-1">
                    {item.children.map(child => (
                      <Link key={child.href} href={child.href} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-dm text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors">
                        <span>{(child as any).icon}</span>{child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <a href="tel:+18005376496" className={cn('flex items-center gap-1.5 text-xs font-dm transition-colors', transparent ? 'text-white/55 hover:text-gold-300' : 'text-charcoal-400 hover:text-charcoal-700')}>
            <Phone size={12}/>1-800-EROWHO
          </a>
          <Link href="/ai-assistant" className={cn('flex items-center gap-1.5 text-xs font-dm transition-colors', transparent ? 'text-gold-300 hover:text-gold-200' : 'text-emerald-700 hover:text-emerald-800')}>
            <Sparkles size={12}/>AI Advisor
          </Link>
          <Link href="/appointments" className={cn('flex items-center gap-1.5 text-xs font-dm transition-colors px-3 py-1.5 rounded-lg border', transparent ? 'text-white/55 hover:text-white border-white/20 hover:border-white/40' : 'text-charcoal-600 hover:text-charcoal-900 border-charcoal-200 hover:border-charcoal-400')}>
            Book Appointment
          </Link>
          <Link href="/listings" className="btn-sm btn-gold">View Properties</Link>
        </div>

        {/* Mobile hamburger */}
        <button className={cn('xl:hidden p-2 rounded-lg transition', transparent ? 'text-white hover:bg-white/10' : 'text-charcoal-700 hover:bg-charcoal-50')} onClick={() => setMobileOpen(p=>!p)}>
          {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-emerald-950 border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <nav className="container-xl py-4 flex flex-col gap-1">
            {NAV.map(item => (
              <div key={item.label}>
                <Link href={item.href} className="block px-4 py-3 text-sm font-dm text-white/80 hover:text-white hover:bg-white/8 rounded-xl transition">
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 pl-4 border-l border-white/10 mb-2">
                    {item.children.map(child => (
                      <Link key={child.href} href={child.href} className="flex items-center gap-2 px-3 py-2 text-xs font-dm text-white/50 hover:text-gold-300 transition">
                        <span>{(child as any).icon}</span>{child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-white/10 mt-2 flex flex-col gap-2">
              <Link href="/appointments" className="btn-md btn-gold w-full text-center justify-center">Book Appointment</Link>
              <Link href="/listings" className="btn-md btn-white w-full text-center justify-center"><Sparkles size={14}/>View Properties</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
