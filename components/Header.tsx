'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
    HandHeartIcon,
    UtensilsCrossed,
    GraduationCap,
    Briefcase,
    Menu,
    X,
    LogOut,
} from 'lucide-react'
import { onAuthChange, signOut, getCurrentUserData, UserData } from '@/lib/auth'

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthChange(async (user) => {
            if (user) {
                const data = await getCurrentUserData()
                setUserData(data)
            } else {
                setUserData(null)
            }
        })

        return () => unsubscribe()
    }, [])

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/login')
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    const navLinks = userData
        ? userData.role === 'admin'
            ? [
                { href: '/', label: 'Home' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/donate-food', label: 'Donate Food', icon: HandHeartIcon },
            ]
            : [
                { href: '/', label: 'Home' },
                { href: '/feedback', label: 'Give Feedback' },
            ]
        : [
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
                        <UtensilsCrossed className="w-6 h-6 text-primary-600" />
                        <span className="text-xl font-bold text-primary-600">ZeroPlate</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${pathname === link.href
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                    }`}
                            >
                                {link.icon && <link.icon className="w-4 h-4" />}
                                {link.label}
                            </Link>
                        ))}

                        {/* User Menu */}
                        {userData ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {userData.email[0].toUpperCase()}
                                    </div>
                                    {userData.role === 'admin' ? (
                                        <Briefcase className="w-5 h-5 text-gray-700" />
                                    ) : (
                                        <GraduationCap className="w-5 h-5 text-gray-700" />
                                    )}
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 max-w-xs bg-white rounded-lg shadow-lg border border-gray-200 py-2 overflow-hidden">
                                        <div className="px-4 py-2 border-b border-gray-200 space-y-1">
                                            <p className="text-sm font-semibold text-gray-900 break-all leading-tight">{userData.email}</p>
                                            <p className="text-xs text-gray-600 capitalize">{userData.role}</p>
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        aria-label="Toggle navigation"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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

                        {userData ? (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="px-3 py-2">
                                    <p className="text-sm font-semibold text-gray-900">{userData.email}</p>
                                    <p className="text-xs text-gray-600 capitalize">{userData.role}</p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="block mt-4 px-3 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 text-center"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    )
}
