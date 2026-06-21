'use client'
import { useState } from 'react'
import { Save, Shield, Globe, Bell, Database, Key, Sliders, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { id:'general',    label:'General',       icon: Globe    },
  { id:'integrations',label:'Integrations', icon: Database },
  { id:'notifications',label:'Notifications',icon: Bell    },
  { id:'security',   label:'Security',      icon: Shield   },
  { id:'ai',         label:'AI Config',     icon: Sliders  },
  { id:'branding',   label:'Branding',      icon: Palette  },
]

export default function AdminSettingsPage() {
  const [tab, setTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2500) }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 flex-wrap">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className={cn('flex items-center gap-2 px-4 py-2 text-sm font-dm font-medium rounded-xl transition-all',
            tab===t.id?'bg-emerald-600 text-white':'text-slate-600 hover:bg-slate-100')}>
            <t.icon size={14}/>{t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-8">
        {tab === 'general' && (
          <>
            <Section title="Company Information">
              <Grid>
                <Field label="Company Name" defaultValue="Erowho Holdings Limited"/>
                <Field label="Tagline" defaultValue="Where Exceptional Meets Home"/>
                <Field label="Phone" defaultValue="1-800-EROWHO"/>
                <Field label="Email" defaultValue="hello@erowho.com"/>
                <Field label="Toronto Office" defaultValue="100 King St W, Suite 5600, Toronto ON" className="col-span-2"/>
                <Field label="New York Office" defaultValue="1441 Broadway, Suite 3200, New York NY" className="col-span-2"/>
              </Grid>
            </Section>
            <Section title="SEO & Meta">
              <Grid>
                <Field label="Site Title" defaultValue="Erowho Holdings | Luxury Real Estate Canada & USA" className="col-span-2"/>
                <Field label="Meta Description" defaultValue="Premier real estate advisory across Canada and the United States." className="col-span-2" type="textarea"/>
                <Field label="Google Analytics ID" defaultValue="G-XXXXXXXXXX"/>
                <Field label="Google Tag Manager ID" defaultValue="GTM-XXXXXXX"/>
              </Grid>
            </Section>
          </>
        )}

        {tab === 'integrations' && (
          <>
            <Section title="AI (Anthropic Claude)">
              <Grid>
                <Field label="API Key" type="password" placeholder="sk-ant-…" className="col-span-2"/>
                <Field label="Model" defaultValue="claude-sonnet-4-6" className="col-span-1"/>
                <Field label="Max Tokens" defaultValue="800" className="col-span-1"/>
              </Grid>
            </Section>
            <Section title="ATTOM Property Data">
              <Grid>
                <Field label="API Key" type="password" placeholder="ATTOM_API_KEY…" className="col-span-2"/>
                <Field label="Base URL" defaultValue="https://api.gateway.attomdata.com" className="col-span-2"/>
              </Grid>
              <p className="text-xs font-dm text-slate-400 mt-2">Used for AVM valuations, comparables, and market statistics.</p>
            </Section>
            <Section title="RentCast">
              <Grid>
                <Field label="API Key" type="password" placeholder="RENTCAST_API_KEY…" className="col-span-2"/>
              </Grid>
              <p className="text-xs font-dm text-slate-400 mt-2">Used for rental market data and rent estimation.</p>
            </Section>
            <Section title="Google Maps">
              <Grid>
                <Field label="Public API Key" placeholder="NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" className="col-span-2"/>
                <Field label="Server Key" type="password" placeholder="GOOGLE_MAPS_SERVER_KEY" className="col-span-2"/>
              </Grid>
            </Section>
            <Section title="Email (Resend)">
              <Grid>
                <Field label="API Key" type="password" placeholder="re_…" className="col-span-2"/>
                <Field label="From Address" defaultValue="noreply@erowho.com"/>
                <Field label="Notifications To" defaultValue="leads@erowho.com"/>
              </Grid>
            </Section>
          </>
        )}

        {tab === 'notifications' && (
          <Section title="Notification Preferences">
            <div className="space-y-4">
              {[
                { label:'Email on new lead',              desc:'Receive an email for every new lead submission' },
                { label:'Slack on hot lead (priority 1)', desc:'Ping Slack channel when a high-priority lead arrives' },
                { label:'Email on appointment booking',   desc:'Confirmation to agent and client' },
                { label:'Weekly analytics digest',        desc:'Summary report every Monday morning' },
                { label:'Newsletter milestone alerts',    desc:'Alert when subscriber count hits milestones' },
              ].map(n=>(
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div><p className="text-sm font-dm font-medium text-slate-800">{n.label}</p><p className="text-xs font-dm text-slate-400 mt-0.5">{n.desc}</p></div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer"/>
                    <div className="w-10 h-5 bg-slate-200 peer-checked:bg-emerald-600 rounded-full transition-colors after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"/>
                  </label>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === 'security' && (
          <Section title="Access & Security">
            <Grid>
              <Field label="Current Password" type="password" className="col-span-2"/>
              <Field label="New Password" type="password"/>
              <Field label="Confirm Password" type="password"/>
            </Grid>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm font-dm font-semibold text-amber-800 mb-1">Two-Factor Authentication</p>
              <p className="text-xs font-dm text-amber-700">2FA is not yet enabled. Enable it for your account and all admin users.</p>
              <button className="mt-2 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-dm font-medium rounded-lg transition-colors">Enable 2FA</button>
            </div>
          </Section>
        )}

        {tab === 'ai' && (
          <Section title="AI Feature Configuration">
            <div className="space-y-4">
              {[
                { label:'AI Property Matchmaker',  desc:'Natural language property search on listings page', enabled:true  },
                { label:'AI Investment Advisor',    desc:'ROI analysis and investment recommendations',       enabled:true  },
                { label:'AI Mortgage Assistant',    desc:'Mortgage education chatbot on property pages',     enabled:true  },
                { label:'AI Listing Summarizer',    desc:'Auto-generate listing highlights for new listings',enabled:true  },
                { label:'AI Floating Chat',         desc:'Global floating assistant on all public pages',    enabled:true  },
                { label:'AI Lead Scoring',          desc:'Auto-score leads by intent and engagement',        enabled:false },
              ].map(f=>(
                <div key={f.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div><p className="text-sm font-dm font-medium text-slate-800">{f.label}</p><p className="text-xs font-dm text-slate-400 mt-0.5">{f.desc}</p></div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={f.enabled} className="sr-only peer"/>
                    <div className="w-10 h-5 bg-slate-200 peer-checked:bg-emerald-600 rounded-full transition-colors after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"/>
                  </label>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === 'branding' && (
          <Section title="Brand Settings">
            <Grid>
              <Field label="Primary Color" defaultValue="#047857" type="color"/>
              <Field label="Accent Color" defaultValue="#ca8a04" type="color"/>
              <Field label="Logo URL" defaultValue="/logo.svg" className="col-span-2"/>
              <Field label="OG Image URL" defaultValue="https://erowho.com/og.jpg" className="col-span-2"/>
            </Grid>
          </Section>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button onClick={save} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors flex items-center gap-2">
            <Save size={14}/>{saved ? 'Saved ✓' : 'Save Changes'}
          </button>
          <p className="text-xs font-dm text-slate-400">Changes take effect immediately.</p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <div>
      <h3 className="font-playfair text-lg font-bold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Grid({ children }: { children:React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>
}

function Field({ label, defaultValue, placeholder, type='text', className='' }: any) {
  return (
    <div className={className}>
      <label className="block text-2xs font-dm font-bold uppercase tracking-[0.1em] text-slate-500 mb-1.5">{label}</label>
      {type==='textarea'
        ? <textarea defaultValue={defaultValue} placeholder={placeholder} rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-dm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none transition-all"/>
        : <input type={type} defaultValue={defaultValue} placeholder={placeholder} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-dm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"/>
      }
    </div>
  )
}
