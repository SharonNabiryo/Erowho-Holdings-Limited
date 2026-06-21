import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage } from '@/types'

const SYSTEM = `You are a knowledgeable real estate advisor for Erowho Holdings Limited, a premium brokerage operating across Canada (Toronto, Vancouver, Montreal, Calgary, Ottawa) and the United States (New York, Miami, Los Angeles, Chicago, Houston).

Your expertise includes:
- Canadian real estate: CMHC mortgage insurance, land transfer taxes, provincial regulations, foreign buyer taxes in BC/ON, First Home Savings Account (FHSA), First Home Buyer Plan (FHBP), HST on new builds
- US real estate: FIRPTA withholding rules, 1031 exchanges, state property taxes, HOA, escrow and title process
- Cross-border investing: LLC vs trust structuring, FATCA, currency hedging, tax treaty considerations
- Luxury markets: Toronto Bridle Path, West Vancouver, Park Slope, Miami Beach, Bel Air
- Investment analysis: cap rate, NOI, cash-on-cash return, IRR, GRM, DSCR
- Mortgage: qualification ratios (GDS/TDS in Canada; DTI in USA), rate types, amortisation schedules
- Property management: tenant screening, rent rolls, vacancy analysis
- Neighbourhood comparisons across all 10 markets

Be warm, expert, and concise. Use 2-4 short paragraphs max per response. When relevant, mention that Erowho advisors are available for deeper consultation. Never invent specific listing data you don't know.`

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    const filtered = messages.filter(m => m.role === 'user' || m.role === 'assistant')

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 600,
        system:     SYSTEM,
        messages:   filtered,
      }),
    })

    const data  = await res.json()
    const reply = data.content?.[0]?.text ?? 'I wasn\'t able to generate a response. Please try again.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[ai-chat]', err)
    return NextResponse.json(
      { reply: 'I\'m having a connectivity issue. Please try again in a moment.' },
      { status: 500 },
    )
  }
}
