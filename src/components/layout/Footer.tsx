import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'

const COLS = {
  'Buy & Invest': [
    { label:'All Listings',       href:'/listings'           },
    { label:'Luxury Homes',       href:'/listings?type=luxury' },
    { label:'Investment',         href:'/investor'           },
    { label:'Commercial',         href:'/listings?type=commercial' },
    { label:'Rentals',            href:'/listings?type=rent' },
    { label:'New Developments',   href:'/listings'           },
  ],
  'Services': [
    { label:'Sell Your Home',     href:'/sell'               },
    { label:'Free Valuation',     href:'/sell#valuation'     },
    { label:'Financial Tools',    href:'/tools'              },
    { label:'Book Appointment',   href:'/appointments'       },
    { label:'Owner Portal',       href:'/owner-portal'       },
    { label:'AI Assistant',       href:'/ai-assistant'       },
  ],
  'Company': [
    { label:'About Erowho',       href:'/about'              },
    { label:'Our Agents',         href:'/about#agents'       },
    { label:'Blog',               href:'/blog'               },
    { label:'Market Reports',     href:'/investor#reports'   },
    { label:'Contact',            href:'/contact'            },
    { label:'Admin Portal',       href:'/admin/dashboard'    },
  ],
}

const SOCIALS = [
  { Icon: Instagram, href:'#', label:'Instagram' },
  { Icon: Linkedin,  href:'#', label:'LinkedIn'  },
  { Icon: Twitter,   href:'#', label:'Twitter/X' },
  { Icon: Youtube,   href:'#', label:'YouTube'   },
]

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-white">
      <div className="container-xl py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex flex-col leading-none mb-6 group">
              <span className="font-playfair text-3xl font-bold text-white group-hover:text-gold-300 transition-colors">EROWHO</span>
              <span className="text-[9px] font-dm font-semibold uppercase tracking-[0.28em] text-gold-400 mt-1">Holdings Limited</span>
            </Link>
            <p className="font-dm text-sm text-white/50 leading-relaxed max-w-sm mb-8">
              A premier real estate technology company operating across Canada and the United States — combining AI-powered tools with expert advisory for residential, luxury, and investment real estate.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { Icon:MapPin, text:'100 King St W, Suite 5600, Toronto, ON M5X 1C9' },
                { Icon:MapPin, text:'1441 Broadway, Suite 3200, New York, NY 10018' },
                { Icon:Phone,  text:'1-800-EROWHO (Canada & USA)', href:'tel:+18005376496' },
                { Icon:Mail,   text:'hello@erowho.com', href:'mailto:hello@erowho.com' },
              ].map(({ Icon, text, href }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={13} className="text-gold-400 mt-0.5 shrink-0"/>
                  {href ? <a href={href} className="text-xs font-dm text-white/50 hover:text-white transition-colors">{text}</a>
                        : <span className="text-xs font-dm text-white/50">{text}</span>}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 hover:bg-gold-400/20 border border-white/10 hover:border-gold-400/40 flex items-center justify-center text-white/50 hover:text-gold-300 transition-all duration-200">
                  <Icon size={14}/>
                </a>
              ))}
            </div>
          </div>
          {Object.entries(COLS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-2xs font-dm font-bold uppercase tracking-[0.15em] text-gold-400 mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={href}><Link href={href} className="text-sm font-dm text-white/45 hover:text-white transition-colors duration-150">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="container-xl py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-dm text-white/30 text-center sm:text-left">
            © {new Date().getFullYear()} Erowho Holdings Limited. All rights reserved. Licensed in Canada &amp; United States.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {['Terms','Privacy','Cookies','Accessibility','Admin'].map(t => (
              <Link key={t} href={t==='Admin'?'/admin/dashboard':'#'} className="text-xs font-dm text-white/30 hover:text-white/60 transition-colors">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
