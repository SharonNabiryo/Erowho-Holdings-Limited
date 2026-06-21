'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const router  = useRouter()
  const [email, setEmail]   = useState('admin@erowho.com')
  const [pw,    setPw]      = useState('demo1234')
  const [show,  setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password: pw, redirect: false })
    if (result?.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials. Demo: admin@erowho.com / demo1234')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <span className="font-playfair text-4xl font-bold text-white tracking-tight">EROWHO</span>
            <span className="text-[10px] font-dm font-bold uppercase tracking-[0.3em] text-gold-400 mt-1">Holdings Limited</span>
          </div>
          <p className="font-dm text-sm text-white/50 mt-4">Admin Portal — Secure Access</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-emerald-700" />
            </div>
            <div>
              <h1 className="font-playfair text-xl font-bold text-slate-900">Admin Login</h1>
              <p className="text-xs font-dm text-slate-400">Authorised personnel only</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-dm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-dm font-bold uppercase tracking-[0.12em] text-slate-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-dm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-dm font-bold uppercase tracking-[0.12em] text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} required
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm font-dm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-dm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
              {loading ? <><Loader2 size={16} className="animate-spin" />Signing in…</> : 'Sign In to Admin Portal'}
            </button>
          </form>

          <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-dm text-amber-700 text-center">
              <strong>Demo credentials:</strong> admin@erowho.com / demo1234
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-dm text-white/30 mt-6">
          © {new Date().getFullYear()} Erowho Holdings Limited. All rights reserved.
        </p>
      </div>
    </div>
  )
}
