'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInUser, signInWithGoogle } from '@/lib/auth'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Email/Password Login Handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const userData = await signInUser(email, password)

            // Redirect based on role
            if (userData.role === 'admin') {
                router.push('/dashboard')
            } else {
                router.push('/feedback')
            }
        } catch (err: any) {
            setError(err.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    // Google Sign-In Handler
    const handleGoogleSignIn = async () => {
        setError('')
        setLoading(true)

        try {
            const userData = await signInWithGoogle()

            // Redirect based on role returned from Google Auth logic
            if (userData.role === 'admin') {
                router.push('/dashboard')
            } else {
                router.push('/feedback')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google')
        } finally {
            setLoading(false)
        }


    
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary-100 rounded-3xl p-6">
                            <span className="text-6xl">🍽️</span>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome to ZeroPlate</h2>
                    <p className="text-lg text-gray-600">Sign in to continue</p>
                </div>

                {/* Login Form */}
                <div className="card p-8 border-2 border-gray-100 bg-white rounded-2xl shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@university.edu"
                                className="input w-full p-3 border rounded-xl"
                                required
                                autoComplete="email"
                                autoFocus
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input w-full p-3 border rounded-xl"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl">
                                <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
                            </div>
                        )}

                        {/* Email/Password Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                '🔐 Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 border-2 border-gray-100 rounded-xl bg-white text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all disabled:opacity-50"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            className="w-6 h-6" 
                            alt="Google" 
                        />
                        Sign in with Google
                    </button>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}