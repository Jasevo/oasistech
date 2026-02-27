import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OasisTech | Secure Task Engine',
  description: 'Enterprise task management powered by OasisTech',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: { icon: '/logo.png' },
  openGraph: {
    title: 'OasisTech | Secure Task Engine',
    description: 'Enterprise task management powered by OasisTech',
    type: 'website',
    images: [
      {
        url: '/dohaoasis.jpg',
        width: 1200,
        height: 630,
        alt: 'Doha Oasis — Your all-in-one destination at the Heart of Doha',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OasisTech | Secure Task Engine',
    description: 'Enterprise task management powered by OasisTech',
    images: ['/dohaoasis.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var c=console.error;console.error=function(){var a=arguments[0];if(typeof a==='string'&&(a.includes('Hydration')||a.includes('hydrat')||a.includes('#418')||a.includes('#423')||a.includes('#425')))return;c.apply(console,arguments)};var e=window.onerror;window.onerror=function(m){if(typeof m==='string'&&(m.includes('#418')||m.includes('#423')||m.includes('#425')))return true;if(e)return e.apply(this,arguments)}})()`,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
