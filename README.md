# Erowho Holdings Limited — PropTech Platform v2.0

A full-stack, enterprise-grade real estate technology platform. Combines the elegance of Compass, the usability of Zillow, and modern AI-powered experiences — built for a premium brokerage operating across Canada and the United States.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   EROWHO PLATFORM v2.0                       │
├─────────────────────────────────────────────────────────────┤
│  PUBLIC WEBSITE          │  ADMIN PORTAL                     │
│  · Home page             │  · Dashboard (KPIs + charts)      │
│  · Listings + filters    │  · Listings CRUD                  │
│  · Property detail       │  · Lead management (CRM)          │
│  · Sell / Invest         │  · Agent management               │
│  · Tools hub (6 calcs)   │  · Appointment management         │
│  · Investor platform     │  · Blog / CMS                     │
│  · AI Assistant          │  · Testimonials                   │
│  · Blog + Articles       │  · Newsletter                     │
│  · Appointments          │  · Analytics + charts             │
│  · Owner Portal          │  · Settings (all integrations)    │
│  · About / Contact       │                                   │
├─────────────────────────────────────────────────────────────┤
│  AI FEATURES                                                  │
│  · Floating chatbot (claude-sonnet-4-6)                       │
│  · Property Matchmaker (natural language → listings)          │
│  · Investment Advisor (ROI, risk, market comparison)          │
│  · Mortgage Assistant (education + affordability)             │
│  · Listing Summarizer (auto-generate descriptions)            │
├─────────────────────────────────────────────────────────────┤
│  DATA LAYER                                                   │
│  · PostgreSQL + Prisma ORM                                    │
│  · 13-model schema (users, properties, leads, agents…)       │
│  · Full service layer (PropertyService, LeadService…)        │
│  · External integrations layer (ATTOM, RentCast, Google…)    │
├─────────────────────────────────────────────────────────────┤
│  INTEGRATIONS (ENV-gated)                                     │
│  · Anthropic Claude (AI features)                            │
│  · ATTOM Data API (AVM, comps, market stats)                 │
│  · RentCast API (rental market data)                         │
│  · Google Maps + Places (geocoding, nearby)                  │
│  · Google Calendar (appointment sync)                        │
│  · Resend (email notifications)                              │
│  · Slack (lead notifications)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or a cloud database URL)

### 1. Install
```bash
cd erowho
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Edit `.env.local`. Minimum required:
```
DATABASE_URL="postgresql://user:password@localhost:5432/erowho"
NEXTAUTH_SECRET="any-32-char-random-string"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-your-key"
```

### 3. Set up database
```bash
npm run db:generate   # generate Prisma client
npm run db:migrate    # run migrations
npm run db:seed       # seed demo data
```

### 4. Run
```bash
npm run dev
```

Open http://localhost:3000

**Admin portal**: http://localhost:3000/admin  
Demo credentials: `admin@erowho.com` / `demo1234`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx              Home
│   │   ├── listings/             Property search & filters
│   │   ├── properties/[slug]/    Property detail
│   │   ├── sell/                 Home valuation
│   │   ├── invest/               Investment hub
│   │   ├── investor/             Premium investor platform
│   │   ├── tools/                6-calculator hub
│   │   ├── ai-assistant/         Full-page AI chat
│   │   ├── appointments/         Public booking
│   │   ├── owner-portal/         Property owner dashboard
│   │   ├── blog/                 Blog listing + [slug]
│   │   ├── about/                Company + agents
│   │   └── contact/              Contact + offices
│   │
│   ├── admin/                    🔒 Password-protected
│   │   ├── dashboard/            KPI overview
│   │   ├── listings/             Listing management
│   │   ├── leads/                CRM / lead pipeline
│   │   ├── agents/               Agent management
│   │   ├── appointments/         Schedule management
│   │   ├── blog/                 CMS
│   │   ├── testimonials/         Review management
│   │   ├── newsletter/           Subscriber management
│   │   ├── analytics/            Charts & reporting
│   │   ├── owners/               Owner portal admin
│   │   ├── reports/              Market reports
│   │   └── settings/             All platform settings
│   │
│   └── api/
│       ├── auth/[...nextauth]/   Authentication
│       ├── ai/
│       │   ├── matchmaker/       AI property matching
│       │   ├── investment-advisor/ AI ROI analysis
│       │   ├── mortgage-assistant/ AI mortgage education
│       │   └── listing-summarizer/ AI copywriting
│       ├── listings/             Property search API
│       ├── leads/                Lead creation + mgmt
│       ├── appointments/         Booking API
│       ├── contact/              Contact form
│       ├── newsletter/           Subscription
│       └── valuation/            Home valuation request
│
├── components/
│   ├── layout/        Navbar, Footer
│   ├── admin/         AdminSidebar, AdminHeader, DashboardCharts
│   ├── ai/            AIFloatingChat, AIPropertyMatchmaker, AIInvestmentAdvisor
│   ├── home/          HeroSearch, StatsSection, TestimonialsSection, NewsletterSection
│   ├── listings/      PropertyCard (default + horizontal variants)
│   ├── property/      MortgageCalculator, ScheduleForm
│   ├── invest/        ROICalculator
│   └── tools/         AffordabilityCalc, ClosingCostCalc, DownPaymentCalc
│
├── lib/
│   ├── prisma.ts          Prisma client singleton
│   ├── auth.ts            Auth helpers + session guards
│   ├── utils.ts           cn(), formatPrice(), calcMortgage(), calcROI()
│   ├── services/          Full service layer
│   │   └── index.ts       PropertyService, LeadService, AgentService…
│   └── integrations/      External API wrappers
│       └── index.ts       AttomService, RentCastService, GoogleMapsService…
│
├── types/index.ts         All TypeScript interfaces
├── data/index.ts          Demo data (12 properties, agents, blog, testimonials)
└── prisma/
    ├── schema.prisma      13-model enterprise schema
    └── seed.ts            Complete database seed
```

---

## 🤖 AI Features

### 1. AI Property Matchmaker (`/api/ai/matchmaker`)
Users describe what they want in plain English. Claude extracts requirements and filters the property database.

### 2. AI Investment Advisor (`/api/ai/investment-advisor`)
Input: purchase price, down %, monthly rent, expenses, appreciation, city.  
Output: JSON with rating (Strong Buy → Avoid), cap rate, cash-on-cash, ROI, risk factors, 3-year projection.

### 3. AI Mortgage Assistant (`/api/ai/mortgage-assistant`)
Educational chatbot covering Canadian GDS/TDS/CMHC and US DTI/PMI rules, affordability guidance, and financing explanations.

### 4. AI Listing Summarizer (`/api/ai/listing-summarizer`)
Given property details, generates: headline, highlights paragraph, 3 neighbourhood bullets, investment note, and closing line.

### 5. Floating Chat (`/api/ai-chat`)
Global assistant on all public pages, powered by claude-sonnet-4-6 with a comprehensive system prompt covering both markets.

---

## 🗄️ Database Models

| Model | Purpose |
|-------|---------|
| `User` | Auth + role management (SUPER_ADMIN, ADMIN, AGENT, OWNER, CLIENT) |
| `Account`, `Session` | NextAuth OAuth state |
| `Agent` | Agent profiles linked to users |
| `Property` | Full listing record with external ID field for MLS/IDX |
| `SavedProperty` | User wishlist |
| `PropertyAnalytic` | Daily view/inquiry/save tracking per listing |
| `Lead` | CRM — every form submission creates a lead |
| `LeadNote` | Internal notes per lead |
| `Appointment` | Bookings with Google Calendar event ID |
| `BlogPost` | CMS with draft/published workflow |
| `Testimonial` | Approval + featured workflow |
| `Subscriber` | Newsletter list |
| `MarketReport` | Downloadable PDF reports |
| `AuditLog` | Full change history |
| `SiteConfig` | Key/value settings store |

---

## 🔌 External Integrations

| Service | Env Variable | Purpose |
|---------|-------------|---------|
| Anthropic | `ANTHROPIC_API_KEY` | All AI features |
| ATTOM Data | `ATTOM_API_KEY` | AVM, comparables, market stats |
| RentCast | `RENTCAST_API_KEY` | Rental market data, rent estimates |
| Google Maps | `GOOGLE_MAPS_SERVER_KEY` | Geocoding, nearby places |
| Google Calendar | `GOOGLE_CALENDAR_CLIENT_ID` | Appointment sync |
| Resend | `RESEND_API_KEY` | Email notifications |
| Slack | `SLACK_WEBHOOK_URL` | Lead alerts |
| AWS S3 / R2 | `S3_ACCESS_KEY` | Image storage |

All integrations are **ENV-gated** — the platform runs without any of them using demo data.

---

## 🛠️ NPM Scripts

| Script | Action |
|--------|--------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run DB migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

---

## 🔐 Authentication

- NextAuth v4 with CredentialsProvider + GoogleProvider
- Role-based access: `SUPER_ADMIN > ADMIN > AGENT > OWNER > CLIENT`
- Admin routes guard: all `/admin/*` pages require ADMIN+ role
- Demo login (no DB): `admin@erowho.com` / `demo1234`

---

## 📈 Production Checklist

- [ ] Set `NODE_ENV=production` and strong `NEXTAUTH_SECRET`
- [ ] Connect PostgreSQL and run `npm run db:migrate && npm run db:seed`
- [ ] Add `ANTHROPIC_API_KEY` for AI features
- [ ] Configure Resend for email notifications
- [ ] Add Google OAuth for social login
- [ ] Set up Cloudflare R2 or AWS S3 for image uploads
- [ ] Add ATTOM and RentCast keys for live property data
- [ ] Configure Google Calendar for appointment sync
- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Enable Vercel Analytics or self-host PostHog

---

© 2025 Erowho Holdings Limited. All rights reserved.
