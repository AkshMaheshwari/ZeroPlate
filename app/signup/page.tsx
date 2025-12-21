'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpUser, UserRole } from '@/lib/auth'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState<UserRole>('student')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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
                <div className="card p-8 border-2 border-gray-100">
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
                                className="input"
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
                                className="input"
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
                                className="input"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                '✨ Create Account'
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
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
