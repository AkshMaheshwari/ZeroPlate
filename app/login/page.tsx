'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UtensilsCrossed, Lock, AlertTriangle, Sparkles } from 'lucide-react'
import { signInUser, signInWithGoogle } from '@/lib/auth'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const userData = await signInUser(email, password)
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

    const handleGoogleSignIn = async () => {
        setError('')
        setLoading(true)

        try {
            const userData = await signInWithGoogle()
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
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-6">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Secure Access</span>
                    </div>
                    
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                        Zero<span className="text-emerald-500">Plate</span>
                    </h2>
                    <p className="text-slate-400 font-medium">Welcome back, enter your details</p>
                </div>

                {/* Glassmorphic Card */}
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@university.edu"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-xs text-rose-400 font-bold uppercase tracking-tight">
                                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" /> Sign In
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="bg-[#0b1224] px-4 text-slate-500 italic">Auth Provider</span>
                        </div>
                    </div>

                    {/* Google Sign-In */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-white/10 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            className="w-5 h-5" 
                            alt="Google" 
                        />
                        Continue with Google
                    </button>

                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
                            New to ZeroPlate?{' '}
                            <Link href="/signup" className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Team Footer */}
                <div className="mt-8 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">
                        Secure Infrastructure @ A² Labs
                    </p>
                </div>
            </div>
        </div>
    )
}