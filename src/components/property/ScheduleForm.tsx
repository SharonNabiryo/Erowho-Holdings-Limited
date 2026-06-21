'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, CheckCircle2, Loader2, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  name:    z.string().min(2, 'Full name required'),
  email:   z.string().email('Valid email required'),
  phone:   z.string().optional(),
  date:    z.string().min(1, 'Please select a date'),
  message: z.string().optional(),
})
type Fields = z.infer<typeof schema>

interface Props {
  propertyName: string
  agentName:    string
  agentPhone:   string
}

export function ScheduleForm({ propertyName, agentName, agentPhone }: Props) {
  const [done, setDone] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Fields>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: Fields) => {
    await new Promise(r => setTimeout(r, 900))
    setDone(true)
  }

  if (done) {
    return (
      <div className="card p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} className="text-emerald-700" />
        </div>
        <h3 className="font-playfair text-xl font-bold text-charcoal-950 mb-2">Viewing Requested!</h3>
        <p className="font-dm text-sm text-charcoal-500 mb-5">
          {agentName} will confirm within 2 hours.
        </p>
        <a href={`tel:${agentPhone}`} className="btn-md btn-primary w-full justify-center">
          <Phone size={14} /> Call Directly
        </a>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <Calendar size={18} className="text-emerald-700 shrink-0" />
        <h3 className="font-playfair text-lg font-bold text-charcoal-950">Schedule a Viewing</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <input
            {...register('name')}
            placeholder="Full name *"
            className={cn('field-input', errors.name && 'border-red-300 focus:border-red-400')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500 font-dm">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email address *"
            className={cn('field-input', errors.email && 'border-red-300')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-dm">{errors.email.message}</p>}
        </div>

        <input {...register('phone')} type="tel" placeholder="Phone (optional)" className="field-input" />

        <div>
          <input
            {...register('date')}
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className={cn('field-input', errors.date && 'border-red-300')}
          />
          {errors.date && <p className="mt-1 text-xs text-red-500 font-dm">{errors.date.message}</p>}
        </div>

        <textarea
          {...register('message')}
          rows={3}
          placeholder={`Message about ${propertyName}…`}
          className="field-textarea"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-lg btn-primary w-full justify-center"
        >
          {isSubmitting
            ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
            : 'Request Viewing'
          }
        </button>

        <p className="text-center text-2xs font-dm text-charcoal-400">
          {agentName} will confirm within 2 hours.
        </p>
      </form>
    </div>
  )
}
