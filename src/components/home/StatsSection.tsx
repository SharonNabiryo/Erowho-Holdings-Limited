'use client'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { STATS } from '@/data'

function Counter({
  value, suffix, prefix, decimals = 0, delay = 0,
}: { value: number; suffix: string; prefix: string; decimals?: number; delay?: number }) {
  const [count, setCount]       = useState(0)
  const { ref, inView }         = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => {
      const duration = 1600
      const fps      = 60
      const steps    = (duration / 1000) * fps
      const inc      = value / steps
      let cur        = 0
      const timer = setInterval(() => {
        cur += inc
        if (cur >= value) { setCount(value); clearInterval(timer) }
        else setCount(cur)
      }, duration / steps)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(id)
  }, [inView, value, delay])

  const display = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString()

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="font-playfair text-4xl lg:text-5xl font-bold text-gold leading-none">
        {prefix}{display}{suffix}
      </span>
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="bg-emerald-mesh py-20 lg:py-24">
      <div className="container-xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-6">
          {STATS.map((s, i) => (
            <div key={s.label} className="text-center">
              <Counter
                value={s.value}
                suffix={s.suffix}
                prefix={s.prefix}
                decimals={s.decimals}
                delay={i * 120}
              />
              <p className="text-2xs font-dm font-semibold uppercase tracking-[0.18em] text-white/50 mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
