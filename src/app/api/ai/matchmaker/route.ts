import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `You are an expert real estate property matchmaker for Erowho Holdings Limited, operating across Canada and the United States.

A user will describe what they're looking for in natural language. Your job is to:
1. Extract their key requirements (location preference, budget, property type, lifestyle needs, investment goals)
2. Return a structured JSON response with matched property criteria AND a conversational explanation
3. Be specific, warm, and expert

Always respond in this exact JSON format:
{
  "summary": "A 2-3 sentence warm summary of what you understood",
  "criteria": {
    "locations": ["city names"],
    "type": "buy|rent|luxury|investment|commercial",
    "minBeds": number or null,
    "maxPrice": number or null,
    "minPrice": number or null,
    "keywords": ["pool", "downtown", "waterfront", etc],
    "country": "CA|US|both"
  },
  "insights": ["3-4 expert insights tailored to their search"],
  "nextSteps": "One clear recommended next step"
}`

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 })

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: SYSTEM,
        messages: [
          { role: 'user', content: message },
        ],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text ?? '{}'

    let parsed
    try {
      const clean = text.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      parsed = { summary: text, criteria: {}, insights: [], nextSteps: '' }
    }

    return NextResponse.json({ result: parsed })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
