import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `You are a mortgage education specialist at Erowho Holdings Limited, covering both Canadian and US mortgage systems.

You help users understand mortgage concepts, calculate affordability, and navigate financing. You are educational and precise. Always recommend consulting a licensed mortgage professional for personalised advice.

Your expertise:
CANADA: GDS ratio (max 32%), TDS ratio (max 44%), CMHC mortgage insurance (5-19.99% down), stress test (qualifying rate), FHSA ($40K lifetime), RRSP Home Buyers' Plan ($35K), Land Transfer Tax, amortisation periods (25yr insured, 30yr conventional), Bank of Canada rate influence, provincial first-time buyer rebates

USA: DTI ratio (front-end 28%, back-end 36-43%), FHA loans (3.5% down), conventional loans, VA loans, jumbo mortgages, 30-year fixed, ARM products, PMI (private mortgage insurance below 20% down), escrow, title insurance, closing costs (2-5%)

Be conversational, use concrete examples with numbers, keep responses under 250 words. Never invent specific rates — use ranges.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages?.length) return NextResponse.json({ error: 'Messages required' }, { status: 400 })

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: SYSTEM,
        messages,
      }),
    })

    const data  = await res.json()
    const reply = data.content?.[0]?.text ?? 'I could not process your question. Please try again.'

    return NextResponse.json({ reply })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
