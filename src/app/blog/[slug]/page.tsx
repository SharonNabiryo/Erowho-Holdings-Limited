import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from 'lucide-react'
import { BLOG_POSTS } from '@/data'
import { NewsletterSection } from '@/components/home/NewsletterSection'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

// Simulated article body paragraphs
const BODY_PARAGRAPHS = [
  "The real estate market across Canada and the United States continues to evolve rapidly, shaped by shifting interest rates, demographic changes, and evolving buyer preferences. Understanding these dynamics is essential for anyone looking to buy, sell, or invest in property in 2024 and beyond.",
  "One of the most significant trends we are observing is the migration of buyers toward secondary cities — markets that offer more favourable affordability ratios without sacrificing quality of life. In Canada, cities like Hamilton, Kitchener-Waterloo, and Halifax have attracted significant interest from Toronto buyers. In the US, markets such as Jacksonville, Austin, and Nashville continue to draw residents from higher-cost coastal cities.",
  "From a financing perspective, higher interest rates have recalibrated buyer expectations. The era of sub-2% mortgage rates is behind us, and today's buyers must factor in carrying costs more carefully than at any point in the past decade. However, this recalibration has also presented opportunities — particularly for cash-heavy investors and those with strong existing equity positions.",
  "Cross-border investing between Canada and the US remains a compelling strategy for the right buyer. The two countries share a tax treaty that can significantly reduce withholding obligations, and the structural differences between the two markets — Canada's supply-constrained urban cores versus the US's greater inventory flexibility — provide meaningful diversification benefits.",
  "For those considering their first investment property, the fundamentals remain unchanged: buy in a market with strong employment growth, prioritise properties with positive cash flow from day one, and maintain sufficient reserves for vacancies and repairs. The leveraged returns available in real estate are difficult to replicate in other asset classes, but only when the underlying property metrics support the investment thesis.",
  "Erowho's advisory team is available to walk through any of these concepts in depth — whether you're a first-time buyer navigating the FHSA and CMHC insurance requirements, or an experienced investor looking to structure a cross-border acquisition efficiently. Reach out to speak with one of our specialists.",
]

export default function BlogPostPage({ params }: Props) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t)))).slice(0, 3)

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Hero image */}
      <div className="relative h-[50vh] min-h-[360px] w-full pt-[var(--nav-height)]">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-xl pb-10">
            <span className="badge badge-emerald mb-4">{post.category}</span>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-dm text-white/60">
              <div className="flex items-center gap-1.5">
                <Image src={post.authorPhoto} alt={post.author} width={24} height={24} className="rounded-full object-cover" />
                <span className="font-semibold text-white/80">{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={12} />{post.publishedAt}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} />{post.readTime} read
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-xl py-14">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
          {/* Article */}
          <article>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-dm text-emerald-700 hover:text-emerald-800 mb-8 transition-colors">
              <ArrowLeft size={14} /> Back to Blog
            </Link>

            <p className="font-dm text-lg text-charcoal-600 leading-relaxed mb-8 border-l-4 border-gold-400 pl-5 italic">
              {post.excerpt}
            </p>

            <div className="prose-custom space-y-5">
              {BODY_PARAGRAPHS.map((para, i) => (
                <p key={i} className="font-dm text-base text-charcoal-700 leading-[1.85]">{para}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-ivory-200">
              <Tag size={14} className="text-charcoal-400 mt-0.5" />
              {post.tags.map(tag => (
                <span key={tag} className="badge badge-emerald">{tag}</span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Author */}
            <div className="card p-5">
              <p className="field-label mb-4">Written by</p>
              <div className="flex items-center gap-3 mb-3">
                <Image src={post.authorPhoto} alt={post.author} width={48} height={48} className="rounded-full object-cover" />
                <div>
                  <p className="font-dm font-semibold text-charcoal-900">{post.author}</p>
                  <p className="text-xs font-dm text-emerald-700">Erowho Senior Advisor</p>
                </div>
              </div>
              <p className="text-xs font-dm text-charcoal-500 leading-relaxed">
                An Erowho partner specialising in luxury and cross-border transactions across Canada and the United States.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-section-dark rounded-2xl p-6 text-center">
              <p className="font-playfair text-lg font-bold text-white mb-2">Ready to Take Action?</p>
              <p className="text-xs font-dm text-white/55 mb-4">Speak with an Erowho advisor today. No obligation.</p>
              <Link href="/contact" className="btn-md btn-gold w-full justify-center">
                Book a Consultation <ArrowRight size={14} />
              </Link>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="card p-5">
                <p className="field-label mb-4">Related Articles</p>
                <div className="space-y-4">
                  {related.map(r => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className="flex gap-3 group">
                      <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0">
                        <Image src={r.coverImage} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-dm text-xs font-semibold text-charcoal-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                          {r.title}
                        </p>
                        <p className="text-2xs font-dm text-charcoal-400 mt-1">{r.readTime} read</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <NewsletterSection />
    </div>
  )
}
