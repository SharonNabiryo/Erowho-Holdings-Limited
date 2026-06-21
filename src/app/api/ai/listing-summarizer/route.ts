import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `You are a luxury real estate copywriter for Erowho Holdings Limited. You write compelling, precise, aspirational property descriptions for discerning buyers.

Given property details, generate:
1. A headline (≤10 words, evocative and specific — no clichés)
2. A highlights paragraph (3 sentences — lead with the strongest differentiator, be specific)
3. Three neighbourhood advantage bullets (factual, specific, varied)
4. Investment note if property has rental/investment potential (or null)
5. A closing line for buyers

RULES: No "stunning", "amazing", "dream home", "gem" — be specific and premium. Use precise language. Reference actual features mentioned.

Respond ONLY in this JSON (no markdown):
{
  "headline": "...",
  "highlights": "...",
  "neighbourhoodAdvantages": ["...", "...", "..."],
  "investmentNote": "..." or null,
  "closingLine": "..."
}`

export async function POST(req: NextRequest) {
  try {
    const { property } = await req.json()
    if (!property) return NextResponse.json({ error: 'Property data required' }, { status: 400 })

    const prompt = `Generate premium marketing copy for:

Name: ${property.name}
Address: ${property.address}, ${property.city}, ${property.province} ${property.country}
Type: ${property.type} | Price: ${property.priceLabel}
Beds: ${property.beds} | Baths: ${property.baths} | Sqft: ${property.sqft?.toLocaleString()} | Built: ${property.yearBuilt}
Neighbourhood: ${property.neighborhood}
Walk Score: ${property.walkScore ?? 'N/A'} | Transit Score: ${property.transitScore ?? 'N/A'}
Features: ${property.features?.join(', ')}
${property.capRate ? `Cap Rate: ${property.capRate}% | Monthly Rent: $${property.monthlyRent?.toLocaleString()}` : ''}
Agent: ${property.agent?.name}

Description: ${property.description}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
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
      result = { headline: property.name, highlights: text, neighbourhoodAdvantages: [], investmentNote: null, closingLine: '' }
    }

    return NextResponse.json({ result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
