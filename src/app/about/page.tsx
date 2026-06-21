import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Shield, Gem, Globe, Heart, Star, Phone, Mail } from 'lucide-react'
import { AGENTS, TESTIMONIALS } from '@/data'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'

export const metadata: Metadata = { title: 'About Erowho Holdings Limited' }

const VALUES = [
  { icon: Shield, title: 'Integrity',   body: 'We give honest advice, even when it means telling a client not to buy. Our reputation is built on transparency and trust, not commissions.' },
  { icon: Gem,    title: 'Excellence',  body: 'Every interaction — from first inquiry to final closing — is held to the highest standard. We don\'t settle for good enough.' },
  { icon: Globe,  title: 'Expertise',   body: 'Our team holds dual licences across Canada and the US, with continuous professional development in cross-border law, tax, and market intelligence.' },
  { icon: Heart,  title: 'Client-First',body: 'We measure success by client outcomes, not deal volume. Your financial wellbeing and satisfaction are our only metrics.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=60" alt="" fill className="object-cover" />
        </div>
        <div className="container-xl relative z-10 w-full">
          <div className="eyebrow-white mb-6">About Erowho</div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4 max-w-2xl leading-tight">
            Built on Trust.{' '}
            <em className="not-italic text-gold">Defined by Excellence.</em>
          </h1>
          <p className="font-dm text-lg text-white/60 max-w-xl">
            Erowho Holdings Limited was founded on a simple conviction: real estate clients deserve expert, honest, personalised guidance — not sales pressure.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="eyebrow mb-4">Our Story</div>
              <h2 className="section-title mb-6">
                15 Years of{' '}
                <em className="not-italic text-gold">North American</em>{' '}
                Expertise
              </h2>
              <div className="space-y-4 text-charcoal-600 font-dm text-base leading-relaxed">
                <p>
                  Erowho Holdings Limited was founded in Toronto in 2009, emerging from the conviction that the real estate industry's transactional culture was failing its clients. Our founder, a licensed agent with experience spanning Bay Street law and Pacific Rim investment banking, saw an opportunity to bring institutional-grade analysis to individual property decisions.
                </p>
                <p>
                  We opened our New York office in 2012, establishing one of the first formal Canada–US cross-border real estate practices serving both individual buyers and institutional investors. Today, we operate from offices in Toronto, Vancouver, Montreal, New York, and Miami, with a network of licensed agents covering 18 markets across both countries.
                </p>
                <p>
                  Over $3.4 billion in property transactions later, the original mission is unchanged: give every client the same quality of counsel you would give a trusted family member — honest, rigorous, and free of conflicts of interest.
                </p>
              </div>
            </div>
            <div className="relative h-[520px]">
              <div className="absolute inset-0 grid grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" alt="Toronto office" fill className="object-cover" />
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" alt="Miami" fill className="object-cover" />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80" alt="Vancouver" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-ivory-50">
        <div className="container-xl">
          <div className="text-center mb-14">
            <div className="eyebrow mx-auto mb-4">Our Values</div>
            <h2 className="section-title mb-4">
              The Principles That{' '}
              <em className="not-italic text-gold">Guide Us</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-6 hover:shadow-luxury transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-emerald-700" />
                </div>
                <h3 className="font-playfair text-lg font-bold text-charcoal-950 mb-2">{title}</h3>
                <p className="font-dm text-sm text-charcoal-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canada + USA presence */}
      <section className="py-20 bg-section-dark">
        <div className="container-xl">
          <div className="text-center mb-14">
            <div className="eyebrow-white mb-4">Our Presence</div>
            <h2 className="font-playfair text-4xl font-bold text-white mb-4">
              Coast to Coast,{' '}
              <span className="text-gold">Border to Border</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                flag: '🇨🇦',
                country: 'Canada',
                offices: ['Toronto, ON (Head Office)', 'Vancouver, BC', 'Montreal, QC'],
                cities: 'Toronto · Vancouver · Montreal · Calgary · Ottawa · Halifax',
                licence: 'Licensed with RECO (Ontario), RECBC (British Columbia), OACIQ (Québec), and RECA (Alberta)',
              },
              {
                flag: '🇺🇸',
                country: 'United States',
                offices: ['New York, NY', 'Miami, FL'],
                cities: 'New York · Miami · Los Angeles · Chicago · Houston · Dallas',
                licence: 'Licensed by NYDOS, FREC, DRE California, IDFPR Illinois, TREC Texas',
              },
            ].map(({ flag, country, offices, cities, licence }) => (
              <div key={country} className="card-glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl">{flag}</span>
                  <h3 className="font-playfair text-2xl font-bold text-white">{country}</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="field-label text-white/40 mb-2">Offices</p>
                    <ul className="space-y-1">
                      {offices.map(o => <li key={o} className="text-sm font-dm text-white/75">{o}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="field-label text-white/40 mb-1">Active Markets</p>
                    <p className="text-sm font-dm text-white/60">{cities}</p>
                  </div>
                  <div>
                    <p className="field-label text-white/40 mb-1">Licensing</p>
                    <p className="text-xs font-dm text-white/50 leading-relaxed">{licence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="py-20 bg-white">
        <div className="container-xl">
          <div className="text-center mb-14">
            <div className="eyebrow mx-auto mb-4">Our Team</div>
            <h2 className="section-title mb-4">
              Meet Your{' '}
              <em className="not-italic text-gold">Advisors</em>
            </h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Each Erowho advisor brings deep market expertise and holds licences across multiple jurisdictions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENTS.map(agent => (
              <div key={agent.id} className="card p-6 text-center group hover:shadow-luxury transition-all duration-300 hover:-translate-y-0.5">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-emerald-50 group-hover:ring-emerald-200 transition-all">
                  <Image src={agent.photo} alt={agent.name} fill className="object-cover" />
                </div>
                <h3 className="font-playfair font-bold text-charcoal-950 mb-0.5">{agent.name}</h3>
                <p className="text-xs font-dm text-emerald-700 font-medium mb-2">{agent.title}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star size={12} fill="#ca8a04" className="text-gold-600" />
                  <span className="text-xs font-dm text-charcoal-500">{agent.rating} · {agent.dealsCount}+ deals</span>
                </div>
                <p className="text-xs font-dm text-charcoal-500 leading-relaxed mb-4 line-clamp-3">{agent.bio}</p>
                <div className="flex flex-col gap-2 pt-4 border-t border-ivory-200">
                  <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-1.5 text-xs font-dm text-charcoal-600 hover:text-emerald-700 transition-colors">
                    <Phone size={11} />{agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center justify-center gap-1.5 text-xs font-dm text-charcoal-600 hover:text-emerald-700 transition-colors">
                    <Mail size={11} />{agent.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="btn-lg btn-primary">
              Work with Our Team <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection testimonials={TESTIMONIALS.slice(0, 3)} />
    </div>
  )
}
