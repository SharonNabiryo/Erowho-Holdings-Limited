/**
 * Erowho Holdings — External Integrations Layer
 * All third-party API calls go through these modules.
 * Set environment variables to activate each integration.
 */

// ── ATTOM Property Data ────────────────────────────────────────
export const AttomService = {
  baseUrl: process.env.ATTOM_BASE_URL ?? 'https://api.gateway.attomdata.com',
  apiKey:  process.env.ATTOM_API_KEY  ?? '',

  async getPropertyDetails(address: string, zipCode: string) {
    if (!this.apiKey) return { data: null, error: 'ATTOM_API_KEY not configured' }
    try {
      const res = await fetch(
        `${this.baseUrl}/propertyapi/v1.0.0/property/detail?address=${encodeURIComponent(address)}&zipcode=${zipCode}`,
        { headers: { Accept: 'application/json', apikey: this.apiKey } }
      )
      if (!res.ok) return { data: null, error: `ATTOM error: ${res.status}` }
      const data = await res.json()
      return { data: data.property?.[0] ?? null, error: null }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },

  async getAVM(address: string, zipCode: string) {
    if (!this.apiKey) return { data: null, error: 'ATTOM_API_KEY not configured' }
    try {
      const res = await fetch(
        `${this.baseUrl}/propertyapi/v1.0.0/valuation/homeequity?address=${encodeURIComponent(address)}&zipcode=${zipCode}`,
        { headers: { Accept: 'application/json', apikey: this.apiKey } }
      )
      if (!res.ok) return { data: null, error: `ATTOM AVM error: ${res.status}` }
      const data = await res.json()
      return { data: data.property?.[0]?.avm ?? null, error: null }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },

  async getComparables(address: string, zipCode: string, radius = 0.25, limit = 5) {
    if (!this.apiKey) return { data: [], error: 'ATTOM_API_KEY not configured' }
    try {
      const res = await fetch(
        `${this.baseUrl}/propertyapi/v1.0.0/sale/snapshot?address=${encodeURIComponent(address)}&zipcode=${zipCode}&radius=${radius}&pagesize=${limit}`,
        { headers: { Accept: 'application/json', apikey: this.apiKey } }
      )
      if (!res.ok) return { data: [], error: `ATTOM comps error: ${res.status}` }
      const data = await res.json()
      return { data: data.property ?? [], error: null }
    } catch (e: any) {
      return { data: [], error: e.message }
    }
  },

  async getMarketStats(zipCode: string) {
    if (!this.apiKey) return { data: null, error: 'ATTOM_API_KEY not configured' }
    try {
      const res = await fetch(
        `${this.baseUrl}/propertyapi/v1.0.0/area/full?postalcode=${zipCode}`,
        { headers: { Accept: 'application/json', apikey: this.apiKey } }
      )
      if (!res.ok) return { data: null, error: `ATTOM market error: ${res.status}` }
      const data = await res.json()
      return { data: data.area?.[0] ?? null, error: null }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },
}

// ── RentCast Rental Data ──────────────────────────────────────
export const RentCastService = {
  baseUrl: process.env.RENTCAST_BASE_URL ?? 'https://api.rentcast.io/v1',
  apiKey:  process.env.RENTCAST_API_KEY  ?? '',

  async getRentEstimate(address: string, bedrooms?: number, bathrooms?: number, sqft?: number) {
    if (!this.apiKey) return { data: null, error: 'RENTCAST_API_KEY not configured' }
    try {
      const params = new URLSearchParams({ address })
      if (bedrooms !== undefined) params.set('bedrooms', String(bedrooms))
      if (bathrooms !== undefined) params.set('bathrooms', String(bathrooms))
      if (sqft !== undefined) params.set('squareFootage', String(sqft))

      const res = await fetch(
        `${this.baseUrl}/avm/rent/long-term?${params}`,
        { headers: { Accept: 'application/json', 'X-Api-Key': this.apiKey } }
      )
      if (!res.ok) return { data: null, error: `RentCast error: ${res.status}` }
      const data = await res.json()
      return {
        data: {
          rentEstimate:  data.rent,
          rentRangeLow:  data.rentRangeLow,
          rentRangeHigh: data.rentRangeHigh,
          latitude:      data.latitude,
          longitude:     data.longitude,
        },
        error: null,
      }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },

  async getMarketStatistics(city: string, state: string, propertyType = 'Single Family') {
    if (!this.apiKey) return { data: null, error: 'RENTCAST_API_KEY not configured' }
    try {
      const res = await fetch(
        `${this.baseUrl}/markets?city=${encodeURIComponent(city)}&state=${state}&propertyType=${encodeURIComponent(propertyType)}`,
        { headers: { Accept: 'application/json', 'X-Api-Key': this.apiKey } }
      )
      if (!res.ok) return { data: null, error: `RentCast market error: ${res.status}` }
      const data = await res.json()
      return { data, error: null }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },

  async getRentComps(address: string, radius = 0.5, limit = 5) {
    if (!this.apiKey) return { data: [], error: 'RENTCAST_API_KEY not configured' }
    try {
      const res = await fetch(
        `${this.baseUrl}/avm/rent/long-term/comparables?address=${encodeURIComponent(address)}&radius=${radius}&limit=${limit}`,
        { headers: { Accept: 'application/json', 'X-Api-Key': this.apiKey } }
      )
      if (!res.ok) return { data: [], error: `RentCast comps error: ${res.status}` }
      const data = await res.json()
      return { data: data.comparables ?? [], error: null }
    } catch (e: any) {
      return { data: [], error: e.message }
    }
  },
}

// ── Google Maps / Places ──────────────────────────────────────
export const GoogleMapsService = {
  apiKey: process.env.GOOGLE_MAPS_SERVER_KEY ?? '',

  async geocodeAddress(address: string) {
    if (!this.apiKey) return { data: null, error: 'GOOGLE_MAPS_SERVER_KEY not configured' }
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      )
      const data = await res.json()
      if (data.status !== 'OK' || !data.results[0]) {
        return { data: null, error: `Geocode error: ${data.status}` }
      }
      const loc = data.results[0].geometry.location
      return { data: { lat: loc.lat, lng: loc.lng, formattedAddress: data.results[0].formatted_address }, error: null }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },

  async getWalkScore(lat: number, lng: number) {
    // Walk Score API — separate key required
    // https://www.walkscore.com/professional/api.php
    return { data: null, error: 'Walk Score API key not configured' }
  },

  async getNearbyPlaces(lat: number, lng: number, type: string, radius = 1000) {
    if (!this.apiKey) return { data: [], error: 'GOOGLE_MAPS_SERVER_KEY not configured' }
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${this.apiKey}`
      )
      const data = await res.json()
      return { data: data.results ?? [], error: null }
    } catch (e: any) {
      return { data: [], error: e.message }
    }
  },
}

// ── Google Calendar ───────────────────────────────────────────
export const GoogleCalendarService = {
  /**
   * Create a calendar event via Google Calendar API.
   * Requires a valid access_token from the OAuth flow.
   */
  async createEvent(accessToken: string, event: {
    summary: string
    description?: string
    location?: string
    startDateTime: string // ISO 8601
    endDateTime:   string
    attendees?:    { email: string }[]
    meetLink?:     boolean
  }) {
    try {
      const body: any = {
        summary:     event.summary,
        description: event.description,
        location:    event.location,
        start:       { dateTime: event.startDateTime, timeZone: 'America/Toronto' },
        end:         { dateTime: event.endDateTime,   timeZone: 'America/Toronto' },
        attendees:   event.attendees,
      }
      if (event.meetLink) {
        body.conferenceData = {
          createRequest: { requestId: `erowho-${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } },
        }
      }

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events${event.meetLink ? '?conferenceDataVersion=1' : ''}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
      if (!res.ok) {
        const err = await res.json()
        return { data: null, error: err.error?.message ?? 'Calendar event creation failed' }
      }
      const data = await res.json()
      return {
        data: {
          id:       data.id,
          htmlLink: data.htmlLink,
          meetLink: data.conferenceData?.entryPoints?.[0]?.uri ?? null,
        },
        error: null,
      }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },

  async deleteEvent(accessToken: string, eventId: string) {
    try {
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
      )
      return { data: true, error: null }
    } catch (e: any) {
      return { data: false, error: e.message }
    }
  },
}

// ── Email (Resend) ────────────────────────────────────────────
export const EmailService = {
  apiKey: process.env.RESEND_API_KEY ?? '',
  from:   process.env.EMAIL_FROM     ?? 'noreply@erowho.com',

  async sendLeadNotification(lead: {
    name: string; email: string; phone?: string
    inquiryType: string; message?: string; propertyName?: string
  }) {
    if (!this.apiKey) return { data: null, error: 'RESEND_API_KEY not configured — skipping email' }
    try {
      const agentEmail = process.env.AGENT_NOTIFICATION_EMAIL ?? 'leads@erowho.com'
      const html = `
        <h2>New Lead: ${lead.name}</h2>
        <p><strong>Email:</strong> ${lead.email}</p>
        ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
        <p><strong>Type:</strong> ${lead.inquiryType}</p>
        ${lead.propertyName ? `<p><strong>Property:</strong> ${lead.propertyName}</p>` : ''}
        ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ''}
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads">View in Dashboard →</a></p>
      `
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    this.from,
          to:      agentEmail,
          subject: `🏠 New Lead: ${lead.name} — ${lead.inquiryType}`,
          html,
        }),
      })
      const data = await res.json()
      return { data, error: res.ok ? null : data.message }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },

  async sendAppointmentConfirmation(to: string, appt: {
    type: string; scheduledAt: string; agentName: string; propertyName?: string; meetLink?: string
  }) {
    if (!this.apiKey) return { data: null, error: 'RESEND_API_KEY not configured' }
    try {
      const html = `
        <h2>Your Appointment is Confirmed</h2>
        <p><strong>Type:</strong> ${appt.type}</p>
        <p><strong>Date & Time:</strong> ${appt.scheduledAt}</p>
        <p><strong>With:</strong> ${appt.agentName}</p>
        ${appt.propertyName ? `<p><strong>Property:</strong> ${appt.propertyName}</p>` : ''}
        ${appt.meetLink ? `<p><a href="${appt.meetLink}">Join Video Call →</a></p>` : ''}
        <p>If you need to reschedule, reply to this email or call 1-800-EROWHO.</p>
      `
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    this.from,
          to,
          subject: `Appointment Confirmed — ${appt.type} with Erowho`,
          html,
        }),
      })
      const data = await res.json()
      return { data, error: res.ok ? null : data.message }
    } catch (e: any) {
      return { data: null, error: e.message }
    }
  },
}

// ── Slack Notifications ───────────────────────────────────────
export const SlackService = {
  webhookUrl: process.env.SLACK_WEBHOOK_URL ?? '',

  async notify(message: string, channel = '#leads') {
    if (!this.webhookUrl) return
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, channel }),
      })
    } catch { /* fire and forget */ }
  },

  async notifyNewLead(lead: { name: string; email: string; inquiryType: string; source: string }) {
    await this.notify(
      `🏠 *New Lead*: ${lead.name} (${lead.email})\n*Type:* ${lead.inquiryType} | *Source:* ${lead.source}`,
      '#leads'
    )
  },
}
