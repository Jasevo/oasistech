import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OasisTech | Secure Task Engine',
  description: 'Enterprise task management powered by OasisTech',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'OasisTech | Secure Task Engine',
    description: 'Enterprise task management powered by OasisTech',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
