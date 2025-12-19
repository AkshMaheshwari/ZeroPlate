'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/feedback', label: 'Give Feedback' },
        { href: '/dashboard', label: 'Dashboard' },
    ]

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🍽️</span>
                        <span className="text-xl font-bold text-primary-600">ZeroPlate</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    )
}
