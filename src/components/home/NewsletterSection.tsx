'use client'
import { useState } from 'react'
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react'

export function NewsletterSection() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <section className="bg-charcoal-950 py-20">
      <div className="container-xl">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-gold-400/15 border border-gold-400/25 flex items-center justify-center mx-auto mb-6">
            <Mail size={22} className="text-gold-400" />
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-3">
            Stay Ahead of the{' '}
            <span className="text-gold">Market</span>
          </h2>
          <p className="font-dm text-white/50 text-sm leading-relaxed mb-8">
            Exclusive listings before they go public, quarterly market reports, and investment insights — delivered to 14,000+ subscribers across Canada and the USA.
          </p>

          {status === 'done' ? (
            <div className="flex items-center justify-center gap-3 py-4 px-6 bg-emerald-900/40 border border-emerald-700/50 rounded-2xl">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <span className="font-dm text-white text-sm">You're in. Welcome to Erowho Insider.</span>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 bg-white/8 border border-white/15 rounded-xl font-dm text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-gold-400/30 focus:border-gold-400/50 transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-md btn-gold whitespace-nowrap"
              >
                {status === 'loading' ? 'Subscribing…' : (
                  <><span>Subscribe</span><ArrowRight size={14} /></>
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-xs font-dm text-red-400">Something went wrong. Please try again.</p>
          )}
          <p className="mt-4 text-2xs font-dm text-white/25">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
