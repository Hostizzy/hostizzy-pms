import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hostizzy PMS - Property Management System',
  description: 'A comprehensive property management system for vacation rentals and hotels',
  keywords: ['PMS', 'Property Management', 'Hostizzy', 'Vacation Rentals', 'Hotel Management'],
  authors: [{ name: 'Hostizzy Team' }],
  creator: 'Hostizzy',
  publisher: 'Hostizzy',
  robots: 'noindex, nofollow', // Private application
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  )
}
