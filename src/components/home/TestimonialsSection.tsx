import { Star } from 'lucide-react'
import type { Testimonial } from '@/types'

interface Props { testimonials: Testimonial[] }

export function TestimonialsSection({ testimonials }: Props) {
  return (
    <section className="py-20 lg:py-24 bg-ivory-100">
      <div className="container-xl">
        <div className="text-center mb-14">
          <div className="eyebrow mx-auto mb-4">Client Stories</div>
          <h2 className="section-title mb-4">
            Trusted by{' '}
            <em className="not-italic text-gold">Thousands</em>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Our clients' success stories are the measure of everything we do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="card-hover p-7 flex flex-col gap-5 relative overflow-hidden"
            >
              {/* Decorative quote */}
              <span
                aria-hidden
                className="absolute -top-2 -left-1 font-playfair text-[7rem] leading-none text-emerald-50 select-none pointer-events-none"
              >
                "
              </span>

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#ca8a04" className="text-gold-600" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-dm text-sm text-charcoal-600 leading-relaxed italic flex-1 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <footer className="flex items-center gap-3 pt-4 border-t border-ivory-200">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold font-dm shrink-0">
                  {t.initials}
                </div>
                <div>
                  <cite className="not-italic font-dm font-semibold text-sm text-charcoal-900">
                    {t.name}
                  </cite>
                  <p className="text-xs font-dm text-charcoal-400">
                    {t.location} &middot; {t.propertyType}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
