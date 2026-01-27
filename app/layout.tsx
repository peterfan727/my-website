import './globals.css'
import { Ubuntu, Inter } from 'next/font/google'
import Header from "./components/header"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import NavbarClient from './components/NavbarClient'

const ubuntu = Ubuntu({
  weight: '500',
  style: 'normal',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu'
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: {
    template: '%s | Peter Fan',
    default: 'Peter Fan',
  },
  description: "My humble software developer portfolio",
  generator: 'Next.js',
  applicationName: 'Peter Fan | Developer Portfolio',
  referrer: 'origin-when-cross-origin',
  keywords: ['Peter Fan', 'Chih-Chung Fan', 'Portfolio'],
  authors: [
    { name: 'Chih-Chung Fan', url: 'https://www.peterfan.dev' },
    { name: 'Peter Fan', url: 'https://www.peterfan.dev' },
  ],
  // colorScheme: 'dark',
  creator: 'Chih-Chung Fan',
  // publisher: '',
  formatDetection: {
    email: true,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.peterfan.dev'),
  openGraph: {
    title: 'Peter Fan | Developer Portfolio',
    description: 'Welcome to my humble software developer portfolio',
    url: 'https://www.peterfan.dev',
    siteName: 'Peter Fan',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${ubuntu.variable} ${inter.variable}`}>
      <body
        className='
        antialiased font-ubuntu text-slate-800
        max-w-6xl min-w-[20em] flex flex-col items-center overflow-y-scroll
        my-0 mx-3 md:mx-auto min-h-screen'>
        <Header />
        <NavbarClient />
        <main className='flex flex-col items-center text-center
          w-full max-w-3xl px-4 py-4 md:py-8 md:px-6 flex-1'>
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}