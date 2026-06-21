import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  address:   z.string().min(5),
  city:      z.string().min(2),
  country:   z.enum(['CA','US']),
  type:      z.string(),
  beds:      z.coerce.number().min(0),
  baths:     z.coerce.number().min(0),
  sqft:      z.coerce.number().min(100),
  yearBuilt: z.coerce.number().min(1800).max(2025),
  condition: z.enum(['excellent','good','fair','renovation']),
  name:      z.string().min(2),
  email:     z.string().email(),
  phone:     z.string().optional(),
})

// Base price-per-sqft estimates by city (rough proxies for demo)
const BASE_PSF: Record<string, number> = {
  vancouver:    1200, toronto: 950,  montreal: 550,
  calgary:      450,  ottawa:  520,  halifax:  420,
  'new york':   1600, miami:   900,  'los angeles': 900,
  chicago:      450,  houston: 380,  dallas:   380,
}

const CONDITION_MULT: Record<string, number> = {
  excellent: 1.10, good: 1.00, fair: 0.88, renovation: 0.72,
}

const AGE_DISCOUNT = (year: number) => {
  const age = 2025 - year
  if (age < 5)  return 1.08
  if (age < 15) return 1.00
  if (age < 30) return 0.95
  if (age < 50) return 0.90
  return 0.85
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // In production:
    // 1. AttomService.getAVM(data.address, zipCode) for precise AVM
    // 2. LeadService.create({ name, email, phone, inquiryType: 'VALUATION', source: 'WEBSITE', message: JSON.stringify(data) })
    // 3. EmailService.sendLeadNotification(...)

    const cityKey  = data.city.toLowerCase()
    const basePSF  = BASE_PSF[cityKey] ?? (data.country === 'CA' ? 650 : 600)
    const condMult = CONDITION_MULT[data.condition] ?? 1.0
    const ageMult  = AGE_DISCOUNT(data.yearBuilt)
    const typeMult = data.type === 'condo' ? 0.85 : data.type === 'commercial' ? 1.4 : 1.0

    const midEstimate = Math.round(data.sqft * basePSF * condMult * ageMult * typeMult)
    const low   = Math.round(midEstimate * 0.90)
    const high  = Math.round(midEstimate * 1.12)

    console.log('[valuation request]', { name: data.name, email: data.email, city: data.city })

    return NextResponse.json({
      success: true,
      estimate: {
        low,
        mid:  midEstimate,
        high,
        currency: data.country === 'CA' ? 'CAD' : 'USD',
        basedOn:  `${data.sqft.toLocaleString()} sqft × $${basePSF.toLocaleString()}/sqft base rate, adjusted for condition (${data.condition}), age (${data.yearBuilt}), and property type`,
        disclaimer: 'Preliminary AI estimate. Not a formal appraisal. Final valuation subject to property inspection, current market conditions, and comparable sales analysis. Full CMA provided within 24 hours.',
      },
      message: `Thank you ${data.name}! We've received your valuation request for ${data.address}. An Erowho advisor will provide a full Comparative Market Analysis within 24 hours.`,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
