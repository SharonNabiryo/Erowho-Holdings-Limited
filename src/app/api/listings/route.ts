import { NextRequest, NextResponse } from 'next/server'
import { PROPERTIES } from '@/data'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams

  const type     = sp.get('type')     ?? ''
  const country  = sp.get('country')  ?? ''
  const city     = sp.get('city')     ?? ''
  const minPrice = sp.get('minPrice') ? Number(sp.get('minPrice')) : undefined
  const maxPrice = sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined
  const minBeds  = sp.get('minBeds')  ? Number(sp.get('minBeds'))  : undefined
  const sortBy   = sp.get('sortBy')   ?? 'newest'
  const query    = sp.get('query')    ?? ''

  let results = [...PROPERTIES]

  if (type)     results = results.filter(p => p.type    === type)
  if (country)  results = results.filter(p => p.country === country)
  if (city)     results = results.filter(p => p.city.toLowerCase() === city.toLowerCase())
  if (minPrice !== undefined) results = results.filter(p => p.price >= minPrice)
  if (maxPrice !== undefined) results = results.filter(p => p.price <= maxPrice)
  if (minBeds  !== undefined) results = results.filter(p => p.beds >= minBeds)

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q) ||
      p.features.some(f => f.toLowerCase().includes(q))
    )
  }

  switch (sortBy) {
    case 'price-asc':  results.sort((a, b) => a.price - b.price); break
    case 'price-desc': results.sort((a, b) => b.price - a.price); break
    case 'beds':       results.sort((a, b) => b.beds - a.beds);   break
    default:
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return NextResponse.json({ results, total: results.length })
}
