'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { HandHeartIcon, UtensilsCrossed, GraduationCap, Briefcase, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { onAuthChange, signOut, getCurrentUserData, UserData } from '@/lib/auth'

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
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

    useEffect(() => {
        setMobileMenuOpen(false)
        setUserMenuOpen(false)
    }, [pathname])

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/login')
        } catch (error) { console.error(error) }
    }

    const navLinks = userData?.role === 'admin' 
        ? [{ href: '/', label: 'Home' }, { href: '/dashboard', label: 'Admin Panel' }, { href: '/donate-food', label: 'Donate', icon: HandHeartIcon }]
        : [{ href: '/', label: 'Home' }, { href: '/feedback', label: 'Share Feedback' }];

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                            <UtensilsCrossed className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900">Zero<span className="text-emerald-600">Plate</span></span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${pathname === link.href ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-gray-200 mx-4" />

                        {userData ? (
                            <div className="relative">
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                                        {userData.email[0].toUpperCase()}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{userData.role}</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{userData.email}</p>
                                        </div>
                                        <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">
                                Sign In
                            </Link>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label="Toggle navigation menu"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5 text-gray-800" /> : <Menu className="w-5 h-5 text-gray-800" />}
                    </button>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block w-full px-4 py-3 rounded-xl text-sm font-semibold ${pathname === link.href ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="pt-2 border-t border-gray-100 space-y-2">
                            {userData ? (
                                <>
                                    <div className="flex items-center gap-3 px-4">
                                        <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                                            {userData.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{userData.role}</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{userData.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 font-semibold"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block w-full text-center px-4 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}