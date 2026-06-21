'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Calendar, Clock, Video, Phone, MapPin, CheckCircle2,
  Loader2, ArrowRight, Building2, Users, ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AGENTS } from '@/data'

const APPOINTMENT_TYPES = [
  { id: 'PROPERTY_VIEWING',  label: 'Property Viewing',     icon: Building2, duration: 60,  desc: 'Tour a specific property in person or virtually' },
  { id: 'CONSULTATION',      label: 'Buyer Consultation',   icon: Users,     duration: 45,  desc: 'Discuss your property search and goals' },
  { id: 'INVESTMENT_CALL',   label: 'Investment Call',      icon: Phone,     duration: 30,  desc: 'Explore investment opportunities and ROI analysis' },
  { id: 'VALUATION',         label: 'Home Valuation',       icon: Building2, duration: 90,  desc: 'Get a comparative market analysis for your property' },
  { id: 'VIRTUAL_TOUR',      label: 'Virtual Tour',         icon: Video,     duration: 45,  desc: 'Video walkthrough of a property from anywhere' },
]

const MEETING_TYPES = [
  { id: 'in-person', label: 'In Person', icon: MapPin },
  { id: 'virtual',   label: 'Video Call', icon: Video  },
  { id: 'phone',     label: 'Phone',      icon: Phone  },
]

const schema = z.object({
  name:        z.string().min(2, 'Full name required'),
  email:       z.string().email('Valid email required'),
  phone:       z.string().optional(),
  notes:       z.string().optional(),
  meetingType: z.enum(['in-person','virtual','phone']),
})
type F = z.infer<typeof schema>

// Generate next 14 available dates (skip weekends)
function getAvailableDates() {
  const dates: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1) // start tomorrow
  while (dates.length < 14) {
    if (d.getDay() !== 0 && d.getDay() !== 6) dates.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export default function AppointmentsPage() {
  const [step,         setStep]         = useState(1)
  const [apptType,     setApptType]     = useState('')
  const [selectedAgent,setSelectedAgent]= useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [slots,        setSlots]        = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [confirmed,    setConfirmed]    = useState<any>(null)

  const dates  = getAvailableDates()
  const agents = AGENTS.filter(a => a.isActive !== false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { meetingType: 'in-person' },
  })

  const meetingType = watch('meetingType')

  useEffect(() => {
    if (!selectedDate || !selectedAgent) return
    setSlotsLoading(true)
    const dateStr = selectedDate.toISOString().split('T')[0]
    fetch(`/api/appointments?date=${dateStr}&agentId=${selectedAgent}`)
      .then(r => r.json())
      .then(d => { setSlots(d.slots ?? []); setSlotsLoading(false) })
      .catch(() => { setSlots(['10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM']); setSlotsLoading(false) })
  }, [selectedDate, selectedAgent])

  const onSubmit = async (formData: F) => {
    if (!selectedDate || !selectedTime || !apptType) return
    const body = {
      ...formData,
      type:        apptType,
      date:        selectedDate.toLocaleDateString('en-CA'),
      time:        selectedTime,
      agentId:     selectedAgent,
      agentName:   agents.find(a => a.id === selectedAgent)?.name,
    }
    const res  = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) setConfirmed(data)
  }

  const canProceed = (s: number) => {
    if (s === 1) return !!apptType
    if (s === 2) return !!selectedAgent
    if (s === 3) return !!selectedDate && !!selectedTime
    return false
  }

  const STEPS = ['Appointment Type','Choose Advisor','Date & Time','Your Details']

  if (confirmed) {
    return (
      <div className="min-h-screen bg-ivory-50 pt-[var(--nav-height)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-card text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-700" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-charcoal-950 mb-3">Appointment Requested!</h1>
          <div className="bg-ivory-100 rounded-2xl p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm font-dm">
              <span className="text-charcoal-500">Confirmation</span>
              <span className="font-bold text-emerald-700">{confirmed.confirmationCode}</span>
            </div>
            <div className="flex justify-between text-sm font-dm">
              <span className="text-charcoal-500">Type</span>
              <span className="text-charcoal-800">{APPOINTMENT_TYPES.find(t => t.id === apptType)?.label}</span>
            </div>
            <div className="flex justify-between text-sm font-dm">
              <span className="text-charcoal-500">Date</span>
              <span className="text-charcoal-800">{selectedDate?.toLocaleDateString('en-CA', { weekday:'long', month:'long', day:'numeric' })}</span>
            </div>
            <div className="flex justify-between text-sm font-dm">
              <span className="text-charcoal-500">Time</span>
              <span className="text-charcoal-800">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm font-dm">
              <span className="text-charcoal-500">Advisor</span>
              <span className="text-charcoal-800">{agents.find(a => a.id === selectedAgent)?.name}</span>
            </div>
          </div>
          <p className="text-sm font-dm text-charcoal-500 mb-6">{confirmed.message}</p>
          <a href="/" className="btn-lg btn-primary w-full justify-center">Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory-50 pt-[var(--nav-height)]">
      {/* Header */}
      <div className="bg-section-dark py-14">
        <div className="container-xl">
          <div className="eyebrow-white mb-4">Book an Appointment</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">
            Schedule with an{' '}
            <span className="text-gold">Erowho Advisor</span>
          </h1>
          <p className="font-dm text-white/55 max-w-xl">
            Choose your appointment type, select an advisor, and pick a time that works for you.
          </p>
        </div>
      </div>

      <div className="container-xl py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done   = step > n
            const active = step === n
            return (
              <div key={label} className="flex items-center gap-2 shrink-0">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-dm font-bold transition-all',
                  done   ? 'bg-emerald-700 text-white'
                  : active ? 'bg-emerald-700 text-white ring-4 ring-emerald-200'
                  : 'bg-ivory-200 text-charcoal-400'
                )}>
                  {done ? <CheckCircle2 size={16} /> : n}
                </div>
                <span className={cn('text-sm font-dm font-medium', active ? 'text-emerald-700' : 'text-charcoal-400')}>{label}</span>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-ivory-300 mx-1" />}
              </div>
            )
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Step 1: Appointment Type */}
          {step === 1 && (
            <div>
              <h2 className="font-playfair text-2xl font-bold text-charcoal-950 mb-6">What type of appointment?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {APPOINTMENT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setApptType(type.id)}
                    className={cn(
                      'text-left p-5 rounded-2xl border-2 transition-all duration-200 group',
                      apptType === type.id
                        ? 'border-emerald-700 bg-emerald-50 shadow-luxury'
                        : 'border-ivory-200 bg-white hover:border-emerald-300'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', apptType === type.id ? 'bg-emerald-700' : 'bg-emerald-50 group-hover:bg-emerald-100')}>
                      <type.icon size={18} className={apptType === type.id ? 'text-white' : 'text-emerald-700'} />
                    </div>
                    <p className="font-dm font-semibold text-charcoal-900 mb-1">{type.label}</p>
                    <p className="text-xs font-dm text-charcoal-500">{type.desc}</p>
                    <p className="text-xs font-dm text-emerald-600 mt-2 font-semibold">⏱ {type.duration} min</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Agent */}
          {step === 2 && (
            <div>
              <h2 className="font-playfair text-2xl font-bold text-charcoal-950 mb-6">Choose your advisor</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={cn(
                      'text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4',
                      selectedAgent === agent.id
                        ? 'border-emerald-700 bg-emerald-50 shadow-luxury'
                        : 'border-ivory-200 bg-white hover:border-emerald-300'
                    )}
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                      <Image src={agent.photo} alt={agent.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-dm font-semibold text-charcoal-900">{agent.name}</p>
                      <p className="text-xs font-dm text-emerald-700 font-medium mt-0.5">{agent.title}</p>
                      <p className="text-xs font-dm text-charcoal-400 mt-1">{agent.cities.join(' · ')}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-xs font-dm text-gold-700">★ {agent.rating}</span>
                        <span className="text-xs font-dm text-charcoal-400">· {agent.dealsCount}+ deals</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="font-playfair text-xl font-bold text-charcoal-950 mb-4">Select a date</h2>
                <div className="grid grid-cols-2 gap-2">
                  {dates.map(date => {
                    const label = date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
                    const sel   = selectedDate?.toDateString() === date.toDateString()
                    return (
                      <button key={label} onClick={() => { setSelectedDate(date); setSelectedTime('') }}
                        className={cn('py-2.5 px-3 rounded-xl text-sm font-dm font-medium border transition-all',
                          sel ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-ivory-200 bg-white text-charcoal-700 hover:border-emerald-300')}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <h2 className="font-playfair text-xl font-bold text-charcoal-950 mb-4">Select a time</h2>
                {!selectedDate ? (
                  <p className="text-sm font-dm text-charcoal-400">Select a date first</p>
                ) : slotsLoading ? (
                  <div className="flex items-center gap-2 text-sm font-dm text-charcoal-400"><Loader2 size={16} className="animate-spin" />Loading availability…</div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map(slot => (
                      <button key={slot} onClick={() => setSelectedTime(slot)}
                        className={cn('py-2 px-2 rounded-xl text-xs font-dm font-semibold border transition-all',
                          selectedTime === slot ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-ivory-200 bg-white text-charcoal-700 hover:border-emerald-300')}>
                        {slot}
                      </button>
                    ))}
                  </div>
                )}

                {/* Meeting type */}
                {selectedDate && selectedTime && (
                  <div className="mt-5">
                    <h3 className="font-dm text-sm font-semibold text-charcoal-700 mb-3">Meeting format</h3>
                    <div className="flex gap-2">
                      {MEETING_TYPES.map(mt => (
                        <button key={mt.id} onClick={() => {}}
                          className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-ivory-200 bg-white hover:border-emerald-300 transition-all">
                          <mt.icon size={16} className="text-emerald-600" />
                          <span className="text-xs font-dm">{mt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Details form */}
          {step === 4 && (
            <div>
              <h2 className="font-playfair text-2xl font-bold text-charcoal-950 mb-6">Your details</h2>
              {/* Summary */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div><p className="text-2xs font-dm text-charcoal-400">Type</p><p className="text-xs font-dm font-semibold text-charcoal-900">{APPOINTMENT_TYPES.find(t=>t.id===apptType)?.label}</p></div>
                <div><p className="text-2xs font-dm text-charcoal-400">Advisor</p><p className="text-xs font-dm font-semibold text-charcoal-900">{agents.find(a=>a.id===selectedAgent)?.name}</p></div>
                <div><p className="text-2xs font-dm text-charcoal-400">Date</p><p className="text-xs font-dm font-semibold text-charcoal-900">{selectedDate?.toLocaleDateString('en-CA',{month:'short',day:'numeric'})}</p></div>
                <div><p className="text-2xs font-dm text-charcoal-400">Time</p><p className="text-xs font-dm font-semibold text-charcoal-900">{selectedTime}</p></div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Full Name *</label>
                    <input {...register('name')} className={cn('field-input', errors.name && 'border-red-300')} placeholder="Your full name" />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="field-label">Email *</label>
                    <input {...register('email')} type="email" className={cn('field-input', errors.email && 'border-red-300')} placeholder="you@example.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="field-label">Phone</label>
                    <input {...register('phone')} type="tel" className="field-input" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="field-label">Meeting Format</label>
                    <select {...register('meetingType')} className="field-select">
                      <option value="in-person">In Person</option>
                      <option value="virtual">Video Call</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="field-label">Additional Notes</label>
                  <textarea {...register('notes')} rows={3} className="field-textarea" placeholder="Property you're interested in, questions you have, anything helpful for your advisor…" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-xl btn-primary w-full justify-center">
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Booking…</> : <>Confirm Appointment <CheckCircle2 size={16} /></>}
                </button>
                <p className="text-center text-2xs font-dm text-charcoal-400">
                  You'll receive a confirmation email. For urgent requests call 1-800-EROWHO.
                </p>
              </form>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-ivory-200">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 text-sm font-dm text-charcoal-500 hover:text-charcoal-700 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            {step < 4 && (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed(step)}
                className="btn-lg btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
