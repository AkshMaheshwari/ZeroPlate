'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Briefcase, AlertTriangle, Sparkles, UserPlus } from 'lucide-react'
import { signUpUser, UserRole, signInWithGoogle } from '@/lib/auth'

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

    const handleGoogleSignup = async () => {
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
            setError(err.message || 'Google signup failed')
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
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-6">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Join the movement</span>
                    </div>
                    
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                        Zero<span className="text-emerald-500">Plate</span>
                    </h2>
                    <p className="text-slate-400 font-medium">Create your credentials to start</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                                    role === 'student' 
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                    : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                                }`}
                            >
                                <GraduationCap className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                                    role === 'admin' 
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                    : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                                }`}
                            >
                                <Briefcase className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                            </button>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">University Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
                                placeholder="name@edu.com"
                                required
                            />
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Confirm</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-[11px] text-rose-400 font-bold uppercase tracking-tight">
                                <AlertTriangle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Initialising...' : <span className="flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" /> Create Account</span>}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
                            <span className="bg-[#0b1224] px-4 italic">Quick Connect</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-white/10 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
                        Join with Google
                    </button>

                    <p className="mt-8 text-center text-xs text-slate-500 font-bold uppercase tracking-tight">
                        Already registered? <Link href="/login" className="text-emerald-500 hover:text-emerald-400 ml-1">Sign In</Link>
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">
                        Identity Management @ A² Labs
                    </p>
                </div>
            </div>
        </div>
    )
}