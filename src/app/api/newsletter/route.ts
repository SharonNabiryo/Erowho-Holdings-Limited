import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()
    if (!email || !String(email).includes('@'))
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })

    // Production: add to Mailchimp / ConvertKit / Klaviyo
    console.log('[newsletter] new subscriber:', { email, name })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
