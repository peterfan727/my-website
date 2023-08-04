import './globals.css'
import { Inter, Ubuntu } from 'next/font/google'
import Header from "./components/header"
import { Analytics } from '@vercel/analytics/react';
import dynamic from 'next/dynamic';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const ubuntu = Ubuntu({
  weight: '500',
  style: 'normal',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu'
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
  authors: [{ name: 'Chih-Chung Fan', url: 'https://www.peterfan.dev'},
  { name: 'Peter Fan', url: 'https://www.peterfan.dev' }],
  // colorScheme: 'dark',
  creator: 'Chih-Chung Fan',
  // publisher: 'Sebastian Markbåge',
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

const DynamicNavbar = dynamic(() => import('./components/navbar'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${ubuntu.variable}`}>
      <body 
        className='
        antialiased font-ubuntu text-black bg-sky-200
        max-w-6xl min-w-[20em] flex flex-col items-center overflow-y-scroll
        my-3 mx-3 md:mx-auto'>
        <Header/>
        <DynamicNavbar/>
        <main className='flex flex-col items-center text-center
          w-full max-w-3xl px-3 py-3 md:py-6 md:px-6'>
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  )
}