import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SYSTEM = `You are a senior real estate investment advisor at Erowho Holdings Limited, with deep expertise in Canadian and US real estate markets, cap rates, NOI analysis, and cross-border structuring.

Given investment parameters, provide a comprehensive analysis. Always respond in this exact JSON format:
{
  "headline": "One-line investment verdict (max 12 words)",
  "rating": "Strong Buy|Buy|Hold|Caution|Avoid",
  "metrics": {
    "capRate": number,
    "cashOnCash": number,
    "annualROI": number,
    "monthlyNOI": number,
    "breakevenYears": number
  },
  "analysis": "3-4 paragraph detailed analysis covering cash flow, market position, appreciation potential, and structural considerations",
  "risks": ["specific risk 1", "specific risk 2", "specific risk 3"],
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "crossBorderNote": "Relevant tax/legal note for cross-border investors or null",
  "recommendation": "One specific, actionable recommendation"
}

Be precise with numbers. Use real market benchmarks. Be honest about risks.`

export async function POST(req: NextRequest) {
  try {
    const { property, inputs } = await req.json()

    const prompt = `Analyze this real estate investment opportunity:

Property: ${property?.name ?? 'Investment Property'} in ${property?.city ?? inputs?.city ?? 'Unknown Location'}
Country: ${property?.country ?? inputs?.country ?? 'CA'}
Purchase Price: $${(inputs?.price ?? property?.price ?? 0).toLocaleString()}
Down Payment: ${inputs?.downPct ?? 25}% ($${Math.round((inputs?.price ?? 0) * (inputs?.downPct ?? 25) / 100).toLocaleString()})
Monthly Rental Income: $${(inputs?.monthlyRent ?? property?.monthlyRent ?? 0).toLocaleString()}
Monthly Operating Expenses: $${(inputs?.expenses ?? 0).toLocaleString()}
Property Type: ${property?.type ?? inputs?.type ?? 'Residential'}
Sq Ft: ${property?.sqft?.toLocaleString() ?? 'Unknown'}
Year Built: ${property?.yearBuilt ?? 'Unknown'}
Annual Appreciation Assumption: ${inputs?.appreciation ?? 4}%
${property?.neighborhood ? `Neighbourhood: ${property.neighborhood}` : ''}
${inputs?.notes ? `Investor Notes: ${inputs.notes}` : ''}

Provide a comprehensive investment analysis with all metrics calculated precisely.`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text ?? '{}'

    let result
    try {
      result = JSON.parse(text.replace(/```json|```/g, '').trim())
    } catch {
      result = { headline: 'Analysis Complete', analysis: text, rating: 'Hold' }
    }

    return NextResponse.json({ result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
