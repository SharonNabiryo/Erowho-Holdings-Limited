'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'

const QUICK = [
  'What can I afford with $200K down?',
  'Best investment neighbourhoods in Toronto?',
  'How does cross-border buying work?',
  'Explain cap rate in simple terms',
]

export function AIFloatingChat() {
  const [open,      setOpen]      = useState(false)
  const [minimised, setMinimised] = useState(false)
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [messages,  setMessages]  = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Erowho's AI property advisor. I can help you find properties, understand the market, calculate what you can afford, and navigate cross-border buying in Canada and the USA. How can I help you today?",
    },
  ])

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !minimised) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [messages, open, minimised])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res  = await fetch('/api/ai-chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.reply ?? 'Sorry, I couldn\'t process that. Please try again.' }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'I\'m having a connectivity issue. Please try again in a moment.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-700 hover:bg-emerald-800
            rounded-full flex items-center justify-center text-white shadow-luxury
            transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Open AI advisor"
        >
          <MessageCircle size={22} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
            <Sparkles size={9} className="text-charcoal-950" />
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 w-[26rem] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-card-hover border border-ivory-200 flex flex-col transition-all duration-300 overflow-hidden',
            minimised ? 'h-[68px]' : 'h-[560px]',
          )}
        >
          {/* Header */}
          <div className="bg-section-dark flex items-center justify-between gap-3 px-4 py-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
                <Bot size={15} className="text-gold-300" />
              </div>
              <div>
                <p className="text-sm font-dm font-semibold text-white leading-none">Erowho AI Advisor</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                  <span className="text-2xs font-dm text-white/50">Online · Powered by Claude</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimised(m => !m)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
                <X size={14} />
              </button>
            </div>
          </div>

          {!minimised && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-ivory-50/60 no-scrollbar">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-1">
                        <Bot size={13} className="text-emerald-700" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm font-dm leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-emerald-700 text-white rounded-br-sm'
                          : 'bg-white text-charcoal-800 border border-ivory-200 shadow-sm rounded-bl-sm',
                      )}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-charcoal-100 flex items-center justify-center shrink-0 mt-1">
                        <User size={13} className="text-charcoal-600" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Bot size={13} className="text-emerald-700" />
                    </div>
                    <div className="bg-white border border-ivory-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts – shown only on first open */}
              {messages.length === 1 && (
                <div className="px-4 py-3 border-t border-ivory-200 bg-white">
                  <p className="text-2xs font-dm uppercase tracking-[0.12em] text-charcoal-400 mb-2">Quick questions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK.map(q => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="text-xs font-dm px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full hover:bg-emerald-100 transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-ivory-200 bg-white">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
                    placeholder="Ask about any property or market…"
                    disabled={loading}
                    className="flex-1 text-sm px-3.5 py-2.5 bg-ivory-50 border border-ivory-200 rounded-xl font-dm text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition"
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
