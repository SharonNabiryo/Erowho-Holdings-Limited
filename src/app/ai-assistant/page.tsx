'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'

const STARTERS = [
  { label: 'Affordability',  prompt: 'What can I afford with a $200,000 down payment in Toronto?' },
  { label: 'Cross-Border',   prompt: 'What do I need to know about buying US property as a Canadian?' },
  { label: 'ROI Analysis',   prompt: 'Compare investment returns in Miami vs Toronto for a $1M property.' },
  { label: 'First-Time Buyer', prompt: 'Walk me through buying my first home in Canada step by step.' },
  { label: 'Mortgage Terms', prompt: 'Explain the difference between GDS, TDS, and what banks look at.' },
  { label: 'Neighbourhood',  prompt: 'What are the best up-and-coming neighbourhoods in Vancouver right now?' },
  { label: 'Luxury Market',  prompt: 'What's happening in the Toronto luxury market above $3M right now?' },
  { label: 'FIRPTA',         prompt: 'Explain FIRPTA and how it affects Canadians selling US property.' },
]

const INIT: ChatMessage = {
  role: 'assistant',
  content: "Hello, and welcome to Erowho AI. I'm your dedicated real estate advisor, with deep expertise across Canadian and US markets, cross-border transactions, investment analysis, and mortgage guidance. Whether you're buying your first home, expanding an investment portfolio, or navigating a cross-border deal — I'm here to help. What would you like to know?",
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INIT])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res  = await fetch('/api/ai-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'I\'m having a connectivity issue. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setMessages([INIT]); setInput('') }

  return (
    <div className="min-h-screen bg-ivory-50 pt-[var(--nav-height)] flex flex-col">
      <div className="bg-section-dark border-b border-white/10">
        <div className="container-xl py-10">
          <div className="eyebrow-white mb-4">Powered by Claude AI</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">
            Your Personal Property{' '}
            <span className="text-gold">Intelligence</span>
          </h1>
          <p className="font-dm text-white/55 max-w-xl">
            Ask me anything about buying, selling, investing, or renting real estate across Canada and the United States. Mortgage advice, market trends, neighbourhood comparisons — all here.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8 gap-6">
        {/* Starter prompts */}
        {messages.length === 1 && (
          <div>
            <p className="text-2xs font-dm uppercase tracking-[0.15em] text-charcoal-400 mb-3">Try asking about…</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STARTERS.map(({ label, prompt }) => (
                <button
                  key={label}
                  onClick={() => send(prompt)}
                  className="text-left p-3 bg-white border border-ivory-200 rounded-xl hover:border-emerald-300 hover:shadow-luxury transition-all duration-200 group"
                >
                  <p className="text-xs font-dm font-semibold text-emerald-700 group-hover:text-emerald-800 mb-0.5">{label}</p>
                  <p className="text-2xs font-dm text-charcoal-400 leading-tight line-clamp-2">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-full bg-emerald-700 border-2 border-emerald-600 flex items-center justify-center shrink-0 mt-1 shadow-luxury">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] px-5 py-3.5 rounded-2xl text-sm font-dm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-sm shadow-luxury'
                    : 'bg-white text-charcoal-800 border border-ivory-200 shadow-card rounded-bl-sm',
                )}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-full bg-charcoal-100 flex items-center justify-center shrink-0 mt-1">
                  <User size={16} className="text-charcoal-600" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-700 border-2 border-emerald-600 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-ivory-200 rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-card">
                <div className="flex gap-1 items-center h-4">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="sticky bottom-0 bg-ivory-50 pb-4 pt-2">
          <div className="flex gap-3 bg-white border border-ivory-200 rounded-2xl p-2 shadow-card">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
              placeholder="Ask about properties, mortgages, investment returns, neighbourhoods…"
              disabled={loading}
              className="flex-1 px-3 py-2.5 font-dm text-sm text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none bg-transparent"
            />
            <button onClick={reset} title="New conversation"
              className="p-2.5 text-charcoal-400 hover:text-charcoal-700 rounded-xl hover:bg-ivory-100 transition">
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="btn-md btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <p className="text-center text-2xs font-dm text-charcoal-400 mt-2">
            <Sparkles size={10} className="inline mr-1 text-gold-500" />
            Powered by Anthropic Claude · Not financial advice
          </p>
        </div>
      </div>
    </div>
  )
}
