// ── Core Types ────────────────────────────────────────────────

export type Country = 'CA' | 'US'

export type PropertyType =
  | 'buy'
  | 'rent'
  | 'luxury'
  | 'investment'
  | 'commercial'

export type PropertyStatus =
  | 'active'
  | 'pending'
  | 'sold'
  | 'listing-of-week'
  | 'listing-of-month'

// ── Agent ─────────────────────────────────────────────────────

export interface Agent {
  id:         string
  name:       string
  title:      string
  phone:      string
  email:      string
  photo:      string
  cities:     string[]
  dealsCount: number
  rating:     number
  bio:        string
}

// ── Property ──────────────────────────────────────────────────

export interface Property {
  id:            string
  slug:          string
  name:          string
  price:         number
  priceLabel:    string
  address:       string
  city:          string
  province:      string
  country:       Country
  type:          PropertyType
  status:        PropertyStatus
  beds:          number
  baths:         number
  sqft:          number
  lotSize?:      string
  yearBuilt:     number
  garage?:       number
  description:   string
  features:      string[]
  images:        string[]
  agent:         Agent
  neighborhood:  string
  walkScore?:    number
  transitScore?: number
  capRate?:      number
  roi?:          number
  monthlyRent?:  number
  tag?:          string
  createdAt:     string
}

// ── Blog ──────────────────────────────────────────────────────

export interface BlogPost {
  id:          string
  slug:        string
  title:       string
  excerpt:     string
  category:    string
  author:      string
  authorPhoto: string
  coverImage:  string
  readTime:    string
  publishedAt: string
  tags:        string[]
  body:        string
}

// ── Testimonial ───────────────────────────────────────────────

export interface Testimonial {
  id:           string
  name:         string
  location:     string
  rating:       number
  text:         string
  initials:     string
  propertyType: string
}

// ── Forms ─────────────────────────────────────────────────────

export interface SearchFilters {
  query?:    string
  type?:     PropertyType | ''
  country?:  Country | ''
  city?:     string
  minPrice?: number
  maxPrice?: number
  minBeds?:  number
  sortBy?:   'newest' | 'price-asc' | 'price-desc' | 'beds'
}

export interface ChatMessage {
  role:    'user' | 'assistant'
  content: string
}
