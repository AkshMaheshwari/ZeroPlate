import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'ZeroPlate - Reducing Food Waste',
    description: 'AI-powered food waste reduction and mess optimization system',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* Header is global - shows on Home, Feedback, and Dashboard */}
                <Header />
                <main className="min-h-screen bg-gray-50">
                    {children}
                </main>
            </body>
        </html>
    )
}