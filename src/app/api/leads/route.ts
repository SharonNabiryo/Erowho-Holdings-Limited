import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name:        z.string().min(2, 'Name required'),
  email:       z.string().email('Valid email required'),
  phone:       z.string().optional(),
  inquiryType: z.string().min(1, 'Inquiry type required'),
  source:      z.string().default('WEBSITE'),
  message:     z.string().optional(),
  propertyId:  z.string().optional(),
  propertyName: z.string().optional(),
  budget:      z.string().optional(),
  timeline:    z.string().optional(),
  country:     z.enum(['CA','US']).optional(),
  utmSource:   z.string().optional(),
  utmMedium:   z.string().optional(),
  utmCampaign: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // In production:
    // const lead = await LeadService.create(data)
    // await EmailService.sendLeadNotification({ name, email, phone, inquiryType, message, propertyName })
    // await SlackService.notifyNewLead({ name, email, inquiryType, source })

    console.log('[lead created]', { name: data.name, email: data.email, type: data.inquiryType, source: data.source })

    return NextResponse.json({
      success: true,
      lead: {
        id:     `lead_${Date.now()}`,
        status: 'NEW',
        ...data,
      },
      message: 'Thank you! An Erowho advisor will be in touch within 2 business hours.',
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
