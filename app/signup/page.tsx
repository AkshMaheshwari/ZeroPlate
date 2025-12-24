'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpUser, UserRole, signInWithGoogle } from '@/lib/auth'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState<UserRole>('student')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Email/Password Signup Handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const userData = await signUpUser(email, password, role)

            // Redirect based on role
            if (userData.role === 'admin') {
                router.push('/dashboard')
            } else {
                router.push('/feedback')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create account')
        } finally {
            setLoading(false)
        }
    }

    // Google Signup Handler
    const handleGoogleSignup = async () => {
        setError('')
        setLoading(true)
        try {
            const userData = await signInWithGoogle()
            
            // Note: Google signups are 'student' by default in our auth.ts logic
            if (userData.role === 'admin') {
                router.push('/dashboard')
            } else {
                router.push('/feedback')
            }
        } catch (err: any) {
            setError(err.message || 'Google signup failed')
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
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Join ZeroPlate</h2>
                    <p className="text-lg text-gray-600">Create your account</p>
                </div>

                {/* Signup Form */}
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
                                placeholder="your.email@university.edu"
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
                                placeholder="Min. 6 characters"
                                className="input w-full p-3 border rounded-xl"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                className="input w-full p-3 border rounded-xl"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                I am a:
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`p-4 rounded-xl border-2 transition-all ${role === 'student'
                                        ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-200'
                                        : 'border-gray-200 hover:border-primary-400'
                                        }`}
                                >
                                    <div className="text-4xl mb-2">🎓</div>
                                    <div className="text-sm font-semibold text-gray-900">Student</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`p-4 rounded-xl border-2 transition-all ${role === 'admin'
                                        ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-200'
                                        : 'border-gray-200 hover:border-primary-400'
                                        }`}
                                >
                                    <div className="text-4xl mb-2">👨‍💼</div>
                                    <div className="text-sm font-semibold text-gray-900">Admin</div>
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl">
                                <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
                            </div>
                        )}

                        {/* Manual Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : '✨ Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm uppercase">
                            <span className="bg-white px-2 text-gray-500">Or join with</span>
                        </div>
                    </div>

                    {/* Google Signup Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 border-2 border-gray-100 rounded-xl bg-white text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all disabled:opacity-50"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            className="w-6 h-6" 
                            alt="Google" 
                        />
                        Sign up with Google
                    </button>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}