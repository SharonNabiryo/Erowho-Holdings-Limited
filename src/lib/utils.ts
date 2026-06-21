import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, isRent = false): string {
  if (isRent) return `$${price.toLocaleString('en-CA')}/mo`
  if (price >= 1_000_000)
    return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 2)}M`
  return `$${price.toLocaleString('en-CA')}`
}

export function calcMortgage(
  price: number,
  downPct: number,
  annualRate: number,
  years: number,
): number {
  const principal = price * (1 - downPct / 100)
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function calcROI(
  price: number,
  downPct: number,
  monthlyRent: number,
  monthlyExpenses: number,
  appreciationPct: number,
): {
  cashOnCash: number
  capRate:    number
  annualROI:  number
  cashFlow:   number
  noi:        number
} {
  const down       = price * (downPct / 100)
  const noi        = (monthlyRent - monthlyExpenses) * 12
  const capRate    = (noi / price) * 100
  const cashOnCash = (noi / down) * 100
  const appreciation = price * (appreciationPct / 100)
  const annualROI  = ((noi + appreciation) / down) * 100
  const cashFlow   = monthlyRent - monthlyExpenses

  return { cashOnCash, capRate, annualROI, cashFlow, noi }
}

export function truncate(str: string, len: number): string {
  return str.length <= len ? str : str.slice(0, len).trimEnd() + '…'
}
