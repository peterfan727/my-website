import './globals.css'
import { Inter, Ubuntu } from 'next/font/google'
import Header from "./components/header"
import Navbar from './components/navbar'

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
    title: 'Peter Fan',
    description: 'My humble software developer portfolio',
    url: 'https://www.peterfan.dev',
    siteName: 'Peter Fan',
    // images: [
    //   {
    //     url: 'https://nextjs.org/og.png',
    //     width: 800,
    //     height: 600,
    //   },
    //   {
    //     url: 'https://nextjs.org/og-alt.png',
    //     width: 1800,
    //     height: 1600,
    //     alt: 'My custom alt',
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
  // fine tune this later
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
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
      className={`${ubuntu.variable}`}>
      <body 
        className='
        antialiased font-ubuntu text-black bg-sky-200
        max-w-6xl flex flex-col items-center
        my-3 mx-3 md:mx-auto'>
        <Header/>
        <Navbar/>
        <main className='flex flex-col items-center text-center
          max-w-3xl px-3 py-3 md:py-6 md:px-6'>
          {children}
        </main>
      </body>
    </html>
  )
}