'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MapPin, Phone, Mail, MessageCircle, Check, Loader2,
  Calendar, Clock, ArrowRight, Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  name:    z.string().min(2, 'Full name required'),
  email:   z.string().email('Valid email required'),
  phone:   z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(20, 'Please include a bit more detail (20 chars min)'),
})
type F = z.infer<typeof schema>

const SUBJECTS = [
  'Buying a Property',
  'Selling a Property',
  'Investment / ROI Analysis',
  'Cross-Border Purchase',
  'Rental Property',
  'Commercial Real Estate',
  'Property Management',
  'Mortgage & Financing',
  'General Enquiry',
]

const OFFICES = [
  {
    city:    'Toronto',
    flag:    '🇨🇦',
    role:    'Head Office',
    address: '100 King St W, Suite 5600\nToronto, ON M5X 1C9',
    phone:   '+1 (416) 555-0100',
    email:   'toronto@erowho.com',
    hours:   'Mon–Fri 8am–7pm ET · Sat 9am–4pm',
  },
  {
    city:    'Vancouver',
    flag:    '🇨🇦',
    role:    'Pacific Office',
    address: '1090 W Georgia St, Suite 2200\nVancouver, BC V6E 3V7',
    phone:   '+1 (604) 555-0200',
    email:   'vancouver@erowho.com',
    hours:   'Mon–Fri 8am–7pm PT · Sat 9am–4pm',
  },
  {
    city:    'New York',
    flag:    '🇺🇸',
    role:    'US Head Office',
    address: '1441 Broadway, Suite 3200\nNew York, NY 10018',
    phone:   '+1 (212) 555-0300',
    email:   'newyork@erowho.com',
    hours:   'Mon–Fri 8am–7pm ET · Sat 9am–4pm',
  },
  {
    city:    'Miami',
    flag:    '🇺🇸',
    role:    'Southeast Office',
    address: '1200 Brickell Ave, Suite 1800\nMiami, FL 33131',
    phone:   '+1 (305) 555-0400',
    email:   'miami@erowho.com',
    hours:   'Mon–Fri 8am–7pm ET · Sat 9am–4pm',
  },
]

export default function ContactPage() {
  const [done, setDone] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { subject: '' },
  })

  const onSubmit = async (data: F) => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Header */}
      <div className="page-hero">
        <div className="container-xl w-full">
          <div className="eyebrow-white mb-6">Get in Touch</div>
          <h1 className="font-playfair text-5xl font-bold text-white mb-3">
            Let&apos;s Start a{' '}
            <em className="not-italic text-gold">Conversation</em>
          </h1>
          <p className="font-dm text-white/55 max-w-xl">
            Whether you're ready to buy, sell, or simply want market intelligence — our advisors respond within 2 business hours.
          </p>
        </div>
      </div>

      {/* Contact form + info */}
      <section className="py-20">
        <div className="container-xl">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
            {/* Form */}
            <div className="card p-8 lg:p-10">
              {done ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check size={30} className="text-emerald-700" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-charcoal-950 mb-3">Message Received</h3>
                  <p className="font-dm text-sm text-charcoal-500 max-w-sm mx-auto">
                    Thank you for reaching out. An Erowho advisor will respond to you within 2 business hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-playfair text-2xl font-bold text-charcoal-950 mb-2">Send Us a Message</h2>
                  <p className="font-dm text-sm text-charcoal-400 mb-7">Response within 2 business hours, guaranteed.</p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="field-label">Full Name *</label>
                        <input {...register('name')} placeholder="Your name" className={cn('field-input', errors.name && 'border-red-300')} />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="field-label">Email Address *</label>
                        <input {...register('email')} type="email" placeholder="you@example.com" className={cn('field-input', errors.email && 'border-red-300')} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Phone Number</label>
                      <input {...register('phone')} type="tel" placeholder="Optional — for quicker response" className="field-input" />
                    </div>
                    <div>
                      <label className="field-label">Subject *</label>
                      <select {...register('subject')} className={cn('field-select', errors.subject && 'border-red-300')}>
                        <option value="">Select a subject…</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <label className="field-label">Message *</label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        placeholder="Tell us about your situation, timeline, and what you're looking for…"
                        className={cn('field-textarea', errors.message && 'border-red-300')}
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-xl btn-primary w-full justify-center">
                      {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Sending…</> : <>Send Message <ArrowRight size={15} /></>}
                    </button>
                    <p className="text-center text-2xs font-dm text-charcoal-400">Your information is never shared or sold.</p>
                  </form>
                </>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/18005376496"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 card p-5 hover:shadow-luxury transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-dm font-semibold text-charcoal-900">WhatsApp Chat</p>
                  <p className="text-xs font-dm text-charcoal-400">Quick responses — often within minutes</p>
                </div>
                <ArrowRight size={16} className="text-charcoal-300 ml-auto group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </a>

              {/* Book consultation */}
              <div className="card p-5 bg-section-dark border-0">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={20} className="text-gold-400" />
                  <p className="font-playfair font-bold text-white text-lg">Book a Consultation</p>
                </div>
                <p className="text-sm font-dm text-white/55 mb-4 leading-relaxed">
                  Schedule a 30-minute strategy session with one of our senior advisors. No obligation. Available by video, phone, or in person.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={13} className="text-gold-400" />
                  <span className="text-xs font-dm text-white/50">30-min sessions · Mon–Fri, 9am–6pm</span>
                </div>
                <button className="btn-md btn-gold w-full justify-center">
                  Schedule a Session <ArrowRight size={14} />
                </button>
              </div>

              {/* Direct contact */}
              <div className="card p-5">
                <p className="field-label mb-4">Direct Line</p>
                <div className="space-y-3">
                  <a href="tel:+18005376496" className="flex items-center gap-3 text-sm font-dm text-charcoal-700 hover:text-emerald-700 transition-colors">
                    <Phone size={14} className="text-emerald-600" />
                    1-800-EROWHO (Canada &amp; USA)
                  </a>
                  <a href="mailto:hello@erowho.com" className="flex items-center gap-3 text-sm font-dm text-charcoal-700 hover:text-emerald-700 transition-colors">
                    <Mail size={14} className="text-emerald-600" />
                    hello@erowho.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office locations */}
      <section className="py-20 bg-white" id="offices">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="eyebrow mx-auto mb-4">Our Offices</div>
            <h2 className="section-title mb-4">
              Find Us{' '}
              <em className="not-italic text-gold">Near You</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OFFICES.map(office => (
              <div key={office.city} className="card p-5 hover:shadow-luxury transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{office.flag}</span>
                  <div>
                    <p className="font-playfair font-bold text-charcoal-950">{office.city}</p>
                    <p className="text-2xs font-dm text-emerald-700 font-semibold uppercase tracking-[0.1em]">{office.role}</p>
                  </div>
                </div>
                <div className="space-y-3 pt-3 border-t border-ivory-200">
                  <div className="flex items-start gap-2">
                    <MapPin size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-xs font-dm text-charcoal-600 whitespace-pre-line">{office.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-emerald-600 shrink-0" />
                    <a href={`tel:${office.phone}`} className="text-xs font-dm text-charcoal-600 hover:text-emerald-700 transition-colors">{office.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-emerald-600 shrink-0" />
                    <a href={`mailto:${office.email}`} className="text-xs font-dm text-charcoal-600 hover:text-emerald-700 transition-colors">{office.email}</a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-xs font-dm text-charcoal-400 leading-relaxed">{office.hours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
