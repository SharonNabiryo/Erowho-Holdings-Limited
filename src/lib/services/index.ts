/**
 * Erowho Holdings — Service Layer v2
 */
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export type ServiceResult<T> = {
  data: T | null
  error: string | null
  total?: number
}

// ── PROPERTY SERVICE ──────────────────────────────────────────
export const PropertyService = {
  async getAll(opts: {
    type?: string; country?: string; city?: string
    minPrice?: number; maxPrice?: number; minBeds?: number
    sortBy?: string; query?: string; limit?: number; page?: number
    status?: string; agentId?: string; isFeatured?: boolean
  } = {}): Promise<ServiceResult<any[]>> {
    try {
      const {
        type, country, city, minPrice, maxPrice, minBeds,
        sortBy = 'newest', query, limit = 20, page = 1, status, agentId, isFeatured
      } = opts
      const where: any = { NOT: { status: 'ARCHIVED' } }
      if (type)    where.type    = type.toUpperCase()
      if (country) where.country = country.toUpperCase()
      if (city)    where.city    = { contains: city, mode: 'insensitive' }
      if (status)  where.status  = status.toUpperCase()
      if (agentId) where.agentId = agentId
      if (isFeatured !== undefined) where.isFeatured = isFeatured
      if (minPrice !== undefined) where.price = { ...where.price, gte: minPrice }
      if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice }
      if (minBeds  !== undefined) where.beds  = { gte: minBeds }
      if (query) {
        where.OR = [
          { name:{ contains: query, mode:'insensitive' } },
          { description:{ contains: query, mode:'insensitive' } },
          { city:{ contains: query, mode:'insensitive' } },
          { neighborhood:{ contains: query, mode:'insensitive' } },
        ]
      }
      const orderBy: Prisma.PropertyOrderByWithRelationInput = sortBy==='price-asc'? {price:'asc'} : sortBy==='price-desc'? {price:'desc'} : sortBy==='beds'? {beds:'desc'} : {createdAt:'desc'}
      const [results, total] = await Promise.all([
        prisma.property.findMany({ where, orderBy, take: limit, skip: (page-1)*limit, include:{ agent:{ include:{ user:true } } } }),
        prisma.property.count({ where }),
      ])
      return { data: results, error: null, total }
    } catch(e:any){ return { data:[], error: e.message, total:0 } }
  },
  async getBySlug(slug: string): Promise<ServiceResult<any>> {
    try {
      const p = await prisma.property.findUnique({ where:{ slug }, include:{ agent:{ include:{ user:true } } } })
      if(p) await prisma.property.update({ where:{ slug }, data:{ viewCount:{ increment:1 } } })
      return { data:p, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async getById(id: string): Promise<ServiceResult<any>> {
    try {
      const p = await prisma.property.findUnique({ where:{ id }, include:{ agent:{ include:{ user:true } }, leads:true } })
      return { data:p, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async create(data: any): Promise<ServiceResult<any>> {
    try {
      const p = await prisma.property.create({ data, include:{ agent:{ include:{ user:true } } } })
      return { data:p, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async update(id: string, data: any): Promise<ServiceResult<any>> {
    try {
      const p = await prisma.property.update({ where:{ id }, data, include:{ agent:{ include:{ user:true } } } })
      return { data:p, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async delete(id: string): Promise<ServiceResult<boolean>> {
    try {
      await prisma.property.update({ where:{ id }, data:{ status:'ARCHIVED' } })
      return { data:true, error:null }
    } catch(e:any){ return { data:false, error: e.message } }
  },
  async getFeatured(limit=6): Promise<ServiceResult<any[]>> {
    return this.getAll({ isFeatured:true, limit, status:'ACTIVE' })
  },
}

// ── LEAD SERVICE ──────────────────────────────────────────────
export const LeadService = {
  async create(data: any): Promise<ServiceResult<any>> {
    try {
      const lead = await prisma.lead.create({
        data: { ...data, status:'NEW', priority:3 },
        include:{ property:true },
      })
      return { data:lead, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async getAll(opts: { status?:string; agentId?:string; limit?:number; page?:number; query?:string; priority?:number } = {}): Promise<ServiceResult<any[]>> {
    try {
      const { status, agentId, limit=20, page=1, query, priority } = opts
      const where: any = {}
      if(status)   where.status   = status
      if(agentId)  where.agentId  = agentId
      if(priority) where.priority = priority
      if(query) where.OR = [
        { name:{ contains:query, mode:'insensitive' } },
        { email:{ contains:query, mode:'insensitive' } },
      ]
      const [leads, total] = await Promise.all([
        prisma.lead.findMany({ where, orderBy:[{ priority:'asc' },{ createdAt:'desc' }], take:limit, skip:(page-1)*limit, include:{ property:true, agent:{ include:{ user:true } }, notes:{ orderBy:{ createdAt:'desc' }, take:1 } } }),
        prisma.lead.count({ where }),
      ])
      return { data:leads, error:null, total }
    } catch(e:any){ return { data:[], error: e.message, total:0 } }
  },
  async update(id: string, data: any): Promise<ServiceResult<any>> {
    try {
      const lead = await prisma.lead.update({ where:{ id }, data })
      return { data:lead, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async addNote(leadId: string, userId: string, content: string): Promise<ServiceResult<any>> {
    try {
      const note = await prisma.leadNote.create({ data:{ leadId, userId, content } })
      await prisma.lead.update({ where:{ id:leadId }, data:{ lastContactedAt:new Date() } })
      return { data:note, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
}

// ── AGENT SERVICE ─────────────────────────────────────────────
export const AgentService = {
  async getAll(opts: { city?:string; isActive?:boolean } = {}): Promise<ServiceResult<any[]>> {
    try {
      const where: any = {}
      if(opts.isActive !== undefined) where.isActive = opts.isActive
      if(opts.city) where.cities = { has: opts.city }
      const agents = await prisma.agent.findMany({ where, include:{ user:true, _count:{ select:{ listings:true, leads:true } } }, orderBy:{ rating:'desc' } })
      return { data:agents, error:null }
    } catch(e:any){ return { data:[], error: e.message } }
  },
  async getById(id: string): Promise<ServiceResult<any>> {
    try {
      const a = await prisma.agent.findUnique({ where:{ id }, include:{ user:true, listings:{ where:{ status:{ not:'ARCHIVED' } }, take:6 }, _count:{ select:{ listings:true, leads:true } } } })
      return { data:a, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async update(id: string, data: any): Promise<ServiceResult<any>> {
    try {
      const a = await prisma.agent.update({ where:{ id }, data })
      return { data:a, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
}

// ── APPOINTMENT SERVICE ───────────────────────────────────────
export const AppointmentService = {
  async create(data: any): Promise<ServiceResult<any>> {
    try {
      const appt = await prisma.appointment.create({ data, include:{ lead:true, agent:{ include:{ user:true } }, property:true } })
      return { data:appt, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async getAll(opts: { agentId?:string; status?:string; from?:Date; to?:Date; limit?:number } = {}): Promise<ServiceResult<any[]>> {
    try {
      const where: any = {}
      if(opts.agentId) where.agentId = opts.agentId
      if(opts.status)  where.status  = opts.status
      if(opts.from||opts.to){ where.scheduledAt = {}; if(opts.from) where.scheduledAt.gte=opts.from; if(opts.to) where.scheduledAt.lte=opts.to }
      const appts = await prisma.appointment.findMany({ where, orderBy:{ scheduledAt:'asc' }, take:opts.limit??50, include:{ lead:true, agent:{ include:{ user:true } }, property:true } })
      return { data:appts, error:null, total:appts.length }
    } catch(e:any){ return { data:[], error: e.message } }
  },
  async update(id: string, data: any): Promise<ServiceResult<any>> {
    try {
      const a = await prisma.appointment.update({ where:{ id }, data })
      return { data:a, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
}

// ── BLOG SERVICE ──────────────────────────────────────────────
export const BlogService = {
  async getAll(opts: { status?:string; category?:string; limit?:number; page?:number } = {}): Promise<ServiceResult<any[]>> {
    try {
      const { status='PUBLISHED', category, limit=12, page=1 } = opts
      const where: any = { status }
      if(category && category!=='All') where.category = category
      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({ where, orderBy:{ publishedAt:'desc' }, take:limit, skip:(page-1)*limit }),
        prisma.blogPost.count({ where }),
      ])
      return { data:posts, error:null, total }
    } catch(e:any){ return { data:[], error: e.message } }
  },
  async getBySlug(slug: string): Promise<ServiceResult<any>> {
    try {
      const post = await prisma.blogPost.findUnique({ where:{ slug } })
      if(post) await prisma.blogPost.update({ where:{ slug }, data:{ viewCount:{ increment:1 } } })
      return { data:post, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async create(data: any): Promise<ServiceResult<any>> {
    try {
      const post = await prisma.blogPost.create({ data })
      return { data:post, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async update(id: string, data: any): Promise<ServiceResult<any>> {
    try {
      const post = await prisma.blogPost.update({ where:{ id }, data })
      return { data:post, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
}

// ── TESTIMONIAL SERVICE ───────────────────────────────────────
export const TestimonialService = {
  async getApproved(limit=6): Promise<ServiceResult<any[]>> {
    try {
      const items = await prisma.testimonial.findMany({ where:{ isApproved:true }, orderBy:[{ isFeatured:'desc' },{ createdAt:'desc' }], take:limit })
      return { data:items, error:null }
    } catch(e:any){ return { data:[], error: e.message } }
  },
  async getAll(limit=50): Promise<ServiceResult<any[]>> {
    try {
      const items = await prisma.testimonial.findMany({ orderBy:{ createdAt:'desc' }, take:limit, include:{ agent:{ include:{ user:true } } } })
      return { data:items, error:null, total:items.length }
    } catch(e:any){ return { data:[], error: e.message } }
  },
  async create(data: any): Promise<ServiceResult<any>> {
    try {
      const t = await prisma.testimonial.create({ data })
      return { data:t, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async update(id: string, data: any): Promise<ServiceResult<any>> {
    try {
      const t = await prisma.testimonial.update({ where:{ id }, data })
      return { data:t, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
}

// ── NEWSLETTER SERVICE ────────────────────────────────────────
export const NewsletterService = {
  async subscribe(email: string, name?: string, source?: string): Promise<ServiceResult<any>> {
    try {
      const sub = await prisma.subscriber.upsert({
        where:{ email },
        create:{ email, name, source, isActive:true },
        update:{ isActive:true },
      })
      return { data:sub, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
  async getAll(opts: { limit?:number; page?:number } = {}): Promise<ServiceResult<any[]>> {
    try {
      const { limit=50, page=1 } = opts
      const [subs, total] = await Promise.all([
        prisma.subscriber.findMany({ orderBy:{ subscribedAt:'desc' }, take:limit, skip:(page-1)*limit }),
        prisma.subscriber.count(),
      ])
      return { data:subs, error:null, total }
    } catch(e:any){ return { data:[], error: e.message } }
  },
}

// ── ANALYTICS SERVICE ─────────────────────────────────────────
export const AnalyticsService = {
  async getDashboardStats(): Promise<ServiceResult<any>> {
    try {
      const now  = new Date()
      const week = new Date(now.getTime() - 7*24*60*60*1000)
      const [
        totalListings, activeListings, totalLeads, newLeads,
        totalAgents, upcomingAppointments, totalSubscribers,
        convertedLeads, leadGroups, typeGroups, recentLeads,
      ] = await Promise.all([
        prisma.property.count(),
        prisma.property.count({ where:{ status:'ACTIVE' } }),
        prisma.lead.count(),
        prisma.lead.count({ where:{ createdAt:{ gte:week }, status:'NEW' } }),
        prisma.agent.count({ where:{ isActive:true } }),
        prisma.appointment.count({ where:{ scheduledAt:{ gte:now }, status:{ not:'CANCELLED' } } }),
        prisma.subscriber.count({ where:{ isActive:true } }),
        prisma.lead.count({ where:{ status:'CONVERTED' } }),
        prisma.lead.groupBy({ by:['status'], _count:true }),
        prisma.property.groupBy({ by:['type'], _count:true }),
        prisma.lead.findMany({ orderBy:{ createdAt:'desc' }, take:10, include:{ property:true } }),
      ])
      const leadsByStatus: Record<string,number> = {}
      leadGroups.forEach((g:any)=>{ leadsByStatus[g.status] = g._count })
      const listingsByType: Record<string,number> = {}
      typeGroups.forEach((g:any)=>{ listingsByType[g.type] = g._count })
      const conversionRate = totalLeads>0 ? Math.round((convertedLeads/totalLeads)*100) : 0
      return { data:{ totalListings, activeListings, totalLeads, newLeads, totalAgents, upcomingAppointments, totalSubscribers, conversionRate, leadsByStatus, listingsByType, recentActivity:recentLeads }, error:null }
    } catch(e:any){ return { data:null, error: e.message } }
  },
}
