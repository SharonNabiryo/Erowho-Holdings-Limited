import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/data'

export const metadata: Metadata = { title: 'Blog | Real Estate Insights & Market Intelligence' }

const CATEGORIES = ['All', 'Buying', 'Selling', 'Investing', 'Market Trends']

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const rest     = BLOG_POSTS.slice(1)

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Header */}
      <div className="page-hero">
        <div className="container-xl w-full">
          <div className="eyebrow-white mb-4">Expert Insights</div>
          <h1 className="font-playfair text-5xl font-bold text-white mb-3">
            Market Intelligence &amp;{' '}
            <em className="not-italic text-gold">Guides</em>
          </h1>
          <p className="font-dm text-white/55 max-w-xl">
            In-depth articles from Erowho's advisory team covering the Canadian and US real estate markets.
          </p>
        </div>
      </div>

      <div className="container-xl py-16">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 text-sm font-dm font-medium rounded-full border transition-all duration-150 ${
                cat === 'All'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-charcoal-700 border-ivory-300 hover:border-emerald-400 hover:text-emerald-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        <Link href={`/blog/${featured.slug}`} className="card-hover group grid md:grid-cols-2 mb-12 overflow-hidden">
          <div className="relative h-72 md:h-auto">
            <Image src={featured.coverImage} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex gap-2 mb-4">
              <span className="badge badge-gold">Featured</span>
              <span className="badge badge-emerald">{featured.category}</span>
            </div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-charcoal-950 mb-3 group-hover:text-emerald-700 transition-colors leading-snug">
              {featured.title}
            </h2>
            <p className="font-dm text-sm text-charcoal-500 leading-relaxed mb-5">{featured.excerpt}</p>
            <div className="flex items-center gap-3 mb-5">
              <Image src={featured.authorPhoto} alt={featured.author} width={32} height={32} className="rounded-full object-cover" />
              <div>
                <p className="font-dm font-semibold text-sm text-charcoal-800">{featured.author}</p>
                <p className="text-2xs font-dm text-charcoal-400">{featured.readTime} read · {featured.publishedAt}</p>
              </div>
            </div>
            <span className="btn-md btn-primary self-start">
              Read Article <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover group">
              <div className="relative h-52 overflow-hidden">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="badge badge-emerald">{post.category}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-2xs font-dm text-charcoal-400 mb-3">
                  <span>{post.readTime} read</span>
                  <span className="w-px h-3 bg-charcoal-200" />
                  <span>{post.publishedAt}</span>
                </div>
                <h3 className="font-playfair font-bold text-charcoal-900 text-lg leading-snug mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm font-dm text-charcoal-500 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-ivory-200">
                  <Image src={post.authorPhoto} alt={post.author} width={24} height={24} className="rounded-full object-cover" />
                  <span className="text-xs font-dm font-semibold text-charcoal-700">{post.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
