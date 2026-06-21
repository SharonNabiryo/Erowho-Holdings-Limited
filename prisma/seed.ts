import { PrismaClient, UserRole, PropertyType, PropertyStatus, Country, LeadStatus, LeadSource, InquiryType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Erowho database...')

  // ── Admin user ──────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@erowho.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@erowho.com',
      password: adminHash,
      role: UserRole.SUPER_ADMIN,
    },
  })

  // ── Agent users ─────────────────────────────────────────────
  const agentData = [
    {
      name: 'Natasha Kovalenko', email: 'natasha@erowho.com',
      title: 'Senior Partner — Luxury & Cross-Border',
      bio: 'Twelve years guiding high-net-worth clients through complex cross-border transactions. Dual licences in Ontario and New York State.',
      phone: '+1 (416) 555-0172',
      cities: ['Toronto', 'New York'],
      specialties: ['Luxury', 'Cross-Border', 'Investment'],
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      dealsCount: 320, rating: 4.9,
    },
    {
      name: 'David Mensah', email: 'david@erowho.com',
      title: 'Luxury Property Director',
      bio: 'Pacific Coast specialist with a portfolio spanning Vancouver waterfront estates and Beverly Hills trophy homes.',
      phone: '+1 (604) 555-0189',
      cities: ['Vancouver', 'Los Angeles'],
      specialties: ['Luxury', 'Pacific Coast', 'Waterfront'],
      photo: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=400&q=80',
      dealsCount: 214, rating: 4.8,
    },
    {
      name: 'Simone Beaumont', email: 'simone@erowho.com',
      title: 'Investment & Commercial Advisor',
      bio: 'Bilingual investment specialist helping clients build diversified income-producing portfolios. CCIM certified.',
      phone: '+1 (514) 555-0134',
      cities: ['Montreal', 'Miami'],
      specialties: ['Investment', 'Commercial', 'Bilingual'],
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      dealsCount: 188, rating: 4.9,
    },
    {
      name: 'Charles Lin', email: 'charles@erowho.com',
      title: 'Commercial Real Estate Director',
      bio: 'West Coast commercial real estate authority with landmark transactions across retail, office, and mixed-use developments.',
      phone: '+1 (310) 555-0201',
      cities: ['Los Angeles', 'Chicago'],
      specialties: ['Commercial', 'Mixed-Use', 'Development'],
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      dealsCount: 156, rating: 4.7,
    },
  ]

  const agentHash = await bcrypt.hash('agent123!', 12)
  const agents = []
  for (const a of agentData) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: { name: a.name, email: a.email, password: agentHash, role: UserRole.AGENT },
    })
    const agent = await prisma.agent.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id, title: a.title, bio: a.bio, phone: a.phone,
        cities: a.cities, specialties: a.specialties, photo: a.photo,
        dealsCount: a.dealsCount, rating: a.rating, reviewCount: Math.floor(a.dealsCount * 0.4),
        isFeatured: true, languages: ['English'],
      },
    })
    agents.push(agent)
  }

  // ── Properties ───────────────────────────────────────────────
  const properties = [
    {
      slug: 'bayshore-penthouse-vancouver', name: 'The Bayshore Penthouse',
      price: 4850000, priceLabel: '$4,850,000',
      address: '1600 Bayshore Dr', city: 'Vancouver', province: 'BC', country: Country.CA,
      type: PropertyType.LUXURY, status: PropertyStatus.LISTING_OF_MONTH,
      beds: 4, baths: 5, sqft: 4200, yearBuilt: 2021, garage: 2,
      description: 'A crown jewel above English Bay. Full-floor penthouse with 360° views, Calacatta marble, Boffi chef kitchen, and private infinity plunge pool. 24-hour concierge and private wine cellar.',
      features: ['Panoramic Ocean Views','Private Infinity Pool','Boffi Chef Kitchen','Calacatta Marble','Crestron Smart Home','24-Hour Concierge','Private Wine Cellar','Home Theatre'],
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80','https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1400&q=80'],
      neighborhood: 'Coal Harbour', walkScore: 94, transitScore: 88,
      tag: 'Listing of the Month', isFeatured: true, agentIndex: 1,
    },
    {
      slug: 'king-west-loft-toronto', name: 'King West Loft Residences',
      price: 1295000, priceLabel: '$1,295,000',
      address: '550 King St W', city: 'Toronto', province: 'ON', country: Country.CA,
      type: PropertyType.BUY, status: PropertyStatus.LISTING_OF_WEEK,
      beds: 2, baths: 2, sqft: 1650, yearBuilt: 2019, garage: 1,
      description: 'Dramatic loft living in Toronto\'s most creative neighbourhood. Soaring 14-foot ceilings, exposed concrete, and a waterfall-edge kitchen. Private terrace and smart lighting throughout.',
      features: ['14-Foot Ceilings','Exposed Concrete','Waterfall Kitchen Island','Private Terrace','Smart Lighting','Rooftop Access','Gym & Concierge'],
      images: ['https://images.unsplash.com/photo-1560185127-6a9b934e8e45?w=1400&q=80','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&q=80'],
      neighborhood: 'King West', walkScore: 98, transitScore: 100,
      tag: 'Listing of the Week', isFeatured: true, agentIndex: 0,
    },
    {
      slug: 'brickell-waterfront-miami', name: 'Brickell Waterfront Residence',
      price: 2750000, priceLabel: '$2,750,000',
      address: '1100 Brickell Bay Dr', city: 'Miami', province: 'FL', country: Country.US,
      type: PropertyType.LUXURY, status: PropertyStatus.ACTIVE,
      beds: 3, baths: 4, sqft: 3100, yearBuilt: 2022, garage: 2,
      description: 'Direct Biscayne Bay views from every room. Italian kitchen, floor-to-ceiling glass, wraparound loggia. Full-service building with private marina and rooftop pool club.',
      features: ['Direct Bay Views','Private Marina','Rooftop Pool','24/7 Concierge','Italian Kitchen','Smart Home'],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400&q=80'],
      neighborhood: 'Brickell', walkScore: 92, transitScore: 85,
      capRate: 4.8, roi: 8.2, monthlyRent: 11000,
      tag: 'New Listing', isFeatured: true, agentIndex: 2,
    },
    {
      slug: 'lincoln-park-investment-chicago', name: 'Lincoln Park Investment Portfolio',
      price: 4600000, priceLabel: '$4,600,000',
      address: '2300 N Clark St', city: 'Chicago', province: 'IL', country: Country.US,
      type: PropertyType.INVESTMENT, status: PropertyStatus.ACTIVE,
      beds: 12, baths: 10, sqft: 9800, yearBuilt: 2001, garage: 6,
      description: 'Six-unit income-producing building in the heart of Lincoln Park. All units leased at market rate with staggered expirations. Cap rate 5.6% with mark-to-market upside.',
      features: ['6 Units','All Leased','5.6% Cap Rate','Staggered Leases','Off-Street Parking','Coin Laundry'],
      images: ['https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1400&q=80'],
      neighborhood: 'Lincoln Park',
      capRate: 5.6, roi: 9.1, monthlyRent: 21500,
      tag: 'Investment', agentIndex: 3,
    },
    {
      slug: 'point-grey-estate-vancouver', name: 'Point Grey Waterfront Estate',
      price: 8900000, priceLabel: '$8,900,000',
      address: '4885 Point Grey Rd', city: 'Vancouver', province: 'BC', country: Country.CA,
      type: PropertyType.LUXURY, status: PropertyStatus.ACTIVE,
      beds: 5, baths: 7, sqft: 7200, yearBuilt: 2018, garage: 3,
      description: 'Pritzker-nominated architect design on Vancouver\'s most coveted waterfront address. Infinity pool, guest house, 4,000-bottle wine room, and private boat dock access.',
      features: ['Waterfront','Architect Design','Infinity Pool','Guest House','Wine Room','Home Theatre','Boat Dock'],
      images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=80','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&q=80'],
      neighborhood: 'Point Grey', walkScore: 65, transitScore: 60,
      tag: 'Ultra Luxury', isFeatured: true, agentIndex: 1,
    },
    {
      slug: 'soho-townhouse-new-york-rent', name: 'SoHo Cast Iron Townhouse',
      price: 12900, priceLabel: '$12,900/mo',
      address: '128 Mercer St', city: 'New York', province: 'NY', country: Country.US,
      type: PropertyType.RENT, status: PropertyStatus.ACTIVE,
      beds: 3, baths: 3, sqft: 2800, yearBuilt: 1892, garage: 0,
      description: 'Historic cast-iron facade meets contemporary interiors. Original wide-plank floors, exposed brick, La Cornue kitchen. Private garden and direct elevator.',
      features: ['Historic Facade','La Cornue Range','Exposed Brick','Private Garden','Direct Elevator','Doorman Building'],
      images: ['https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=1400&q=80'],
      neighborhood: 'SoHo', walkScore: 100, transitScore: 100,
      monthlyRent: 12900, tag: 'For Rent', agentIndex: 0,
    },
  ]

  for (const p of properties) {
    const { agentIndex, ...data } = p
    await prisma.property.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        agentId: agents[agentIndex]?.id,
        publishedAt: new Date(),
      },
    })
  }

  // ── Testimonials ─────────────────────────────────────────────
  const testimonials = [
    { name: 'James & Maya Okonkwo', location: 'Vancouver, BC', propertyType: 'Luxury Waterfront', rating: 5, initials: 'JO', text: 'Erowho found our dream home in West Vancouver in under three weeks. David\'s knowledge of the Coal Harbour market is genuinely unmatched — the entire process felt completely effortless.', isFeatured: true },
    { name: 'Robert Sefiani', location: 'New York → Toronto', propertyType: 'Cross-Border Portfolio', rating: 5, initials: 'RS', text: 'I expanded my portfolio into Canada for the first time and needed a firm that understood both jurisdictions. Erowho delivered on every front — including cross-border tax structuring.', isFeatured: true },
    { name: 'Amara Chukwu', location: 'Miami, FL', propertyType: 'Luxury Condo', rating: 5, initials: 'AC', text: 'From the AI advisor to the closing coordinator, Erowho operates at a completely different level. Closed my Brickell condo in 28 days. I\'ve already sent four referrals.', isFeatured: true },
    { name: 'Sophie Tremblay', location: 'Montreal, QC', propertyType: 'Heritage Home Sale', rating: 5, initials: 'ST', text: 'Selling our Mount Royal home felt daunting until Simone walked us through the strategy. Seven offers in four days — all above asking. The staging advice alone was worth a hundred thousand dollars.', isFeatured: false },
    { name: 'Marcus Webb', location: 'Chicago, IL', propertyType: 'Investment Portfolio', rating: 5, initials: 'MW', text: 'The ROI calculator and investment analysis gave me absolute confidence in my Lincoln Park acquisition. Charles turned a complex multi-unit deal into a seamless experience.', isFeatured: false },
    { name: 'Priya Sharma', location: 'London → Toronto', propertyType: 'Relocation Purchase', rating: 5, initials: 'PS', text: 'I relocated from London and knew nothing about Toronto. The AI assistant helped me understand neighbourhoods before I even arrived. Outstanding service from start to close.', isFeatured: false },
  ]
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {})
  }

  // ── Sample leads ─────────────────────────────────────────────
  const sampleProperty = await prisma.property.findFirst()
  await prisma.lead.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Jennifer Williams', email: 'jwilliams@email.com', phone: '+1 416 555 0911', inquiryType: InquiryType.BUYING, source: LeadSource.WEBSITE, status: LeadStatus.QUALIFIED, budget: '1500000', message: 'Looking for a 3-bed condo in King West or Liberty Village.', priority: 1, propertyId: sampleProperty?.id },
      { name: 'Marcus Chen', email: 'mchen@invest.com', phone: '+1 604 555 0734', inquiryType: InquiryType.INVESTING, source: LeadSource.WEBSITE, status: LeadStatus.CONTACTED, budget: '3000000', message: 'Looking to build a $5M Canadian residential portfolio.', priority: 1 },
      { name: 'Sofia Rodriguez', email: 'sofia.r@mail.com', phone: '+1 305 555 0482', inquiryType: InquiryType.BUYING, source: LeadSource.AI_ASSISTANT, status: LeadStatus.NEW, budget: '800000', message: 'First-time buyer, pre-approved for $800K.', priority: 2 },
      { name: 'Andrew Thompson', email: 'andrew.t@corp.com', phone: '+1 312 555 0219', inquiryType: InquiryType.VALUATION, source: LeadSource.OTHER, status: LeadStatus.NEW, message: 'Need valuation on my Lincoln Park 3-flat.', priority: 2 },
      { name: 'Yuki Tanaka', email: 'yukitanaka@yahoo.co.jp', inquiryType: InquiryType.CROSS_BORDER, source: LeadSource.REFERRAL, status: LeadStatus.QUALIFIED, budget: '5000000', message: 'Japanese investor looking at Vancouver luxury.', priority: 1 },
    ],
  })

  // ── Newsletter subscribers ───────────────────────────────────
  await prisma.subscriber.createMany({
    skipDuplicates: true,
    data: [
      { email: 'investor1@gmail.com', name: 'Alex Kim', tags: ['investor'] },
      { email: 'buyer1@hotmail.com', name: 'Lisa Park', tags: ['buyer'] },
      { email: 'jane.doe@company.com', name: 'Jane Doe', tags: ['seller'] },
    ],
  })

  console.log('✅ Seed complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
