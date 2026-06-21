import type { Metadata } from 'next'
import { Playfair_Display, Inter, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar }        from '@/components/layout/Navbar'
import { Footer }        from '@/components/layout/Footer'
import { AIFloatingChat } from '@/components/ai/AIFloatingChat'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const dm = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://erowho.com'),
  title: {
    default: 'Erowho Holdings Limited | Luxury Real Estate — Canada & USA',
    template: '%s | Erowho Holdings',
  },
  description:
    'Erowho Holdings Limited — premier real estate advisory across Canada and the United States. Luxury homes, investment properties, cross-border guidance.',
  keywords: [
    'luxury real estate','canada real estate','usa real estate','investment property',
    'Toronto homes','Vancouver luxury','New York condos','Miami real estate',
    'cross-border real estate','Erowho Holdings',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Erowho Holdings Limited',
    title: 'Erowho Holdings Limited | Luxury Real Estate — Canada & USA',
    description: 'Premium real estate advisory across Canada and the United States.',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${dm.variable}`}
    >
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <AIFloatingChat />
      </body>
    </html>
  )
}
