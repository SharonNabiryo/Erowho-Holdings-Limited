import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const bookingSchema = z.object({
  type:       z.enum(['PROPERTY_VIEWING','CONSULTATION','INVESTMENT_CALL','VALUATION','VIRTUAL_TOUR']),
  name:       z.string().min(2),
  email:      z.string().email(),
  phone:      z.string().optional(),
  date:       z.string().min(1),
  time:       z.string().min(1),
  timezone:   z.string().default('America/Toronto'),
  propertyId: z.string().optional(),
  propertyName: z.string().optional(),
  agentId:    z.string().optional(),
  agentName:  z.string().optional(),
  notes:      z.string().optional(),
  meetingType: z.enum(['in-person','virtual','phone']).default('in-person'),
})

// Available time slots
const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM',
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date    = searchParams.get('date')
  const agentId = searchParams.get('agentId')

  // In production: query booked slots from DB for this agent+date and remove from available
  // For now, return all slots minus a few "booked" ones for realism
  const bookedSlots = date ? ['10:00 AM', '2:30 PM'] : []
  const available = TIME_SLOTS.filter(s => !bookedSlots.includes(s))

  return NextResponse.json({ slots: available, date, agentId })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = bookingSchema.parse(body)

    // In production:
    // 1. AppointmentService.create(data)
    // 2. LeadService.create({ name, email, phone, inquiryType: data.type, source: 'WEBSITE' })
    // 3. GoogleCalendarService.createEvent(accessToken, { summary, start, end, attendees, meetLink: data.meetingType === 'virtual' })
    // 4. EmailService.sendAppointmentConfirmation(data.email, { type, scheduledAt, agentName, propertyName, meetLink })
    // 5. SlackService.notify(`📅 New ${data.type}: ${data.name} — ${data.date} ${data.time}`)

    console.log('[appointment booked]', data)

    const confirmationCode = `EW-${Date.now().toString(36).toUpperCase().slice(-6)}`

    return NextResponse.json({
      success: true,
      confirmationCode,
      appointment: {
        ...data,
        id:     `appt_${Date.now()}`,
        status: 'PENDING',
      },
      message: `Your ${data.type.replace(/_/g, ' ').toLowerCase()} has been requested for ${data.date} at ${data.time}. Confirmation code: ${confirmationCode}. You will receive an email confirmation within 1 hour.`,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 })
  }
}
