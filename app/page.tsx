'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { onAuthChange } from '@/lib/auth'
import { User } from 'firebase/auth'
import { 
    UtensilsCrossed, 
    Rocket, 
    Target, 
    BarChart3, 
    Sparkles, 
    AlertTriangle, 
    MapPin,
    BrainCircuit,
    History
} from 'lucide-react'

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthChange((currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden flex flex-col justify-center">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 w-full">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-6">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Gemini AI Integrated</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-tight">
                        Zero<span className="text-emerald-500">Plate</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-10 font-medium max-w-2xl mx-auto">
                        Reducing food waste, one meal at a time.
                    </p>

                    {/* CTA Buttons - Logic Intact */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {loading ? (
                            <div className="h-14 w-48 bg-white/5 animate-pulse rounded-2xl"></div>
                        ) : !user ? (
                            <Link
                                href="/login"
                                className="w-full sm:w-auto bg-white text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                            >
                                <Rocket className="w-4 h-4" /> Get Started / Login
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/feedback"
                                    className="w-full sm:w-auto bg-emerald-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Target className="w-4 h-4" /> Give Feedback
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <BarChart3 className="w-4 h-4" /> Admin Dashboard
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Feature Grid - Functional Items Only */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16">
                    
                    {/* Feature 1: AI Analysis */}
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-emerald-500/50 transition-all">
                        <div className="bg-emerald-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                            <BrainCircuit className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="font-black text-white text-xs uppercase tracking-[0.15em] mb-2">AI Insights</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-medium tracking-wide">Predictive analytics powered by Gemini to optimize daily meal production.</p>
                    </div>

                    {/* Feature 2: NGO Locator */}
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all">
                        <div className="bg-blue-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                            <MapPin className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="font-black text-white text-xs uppercase tracking-[0.15em] mb-2">NGO Locator</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-medium tracking-wide">Integrated maps to locate and connect with nearby NGOs for surplus food.</p>
                    </div>

                    {/* Feature 3: Real-time Admin */}
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-purple-500/50 transition-all">
                        <div className="bg-purple-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                            <BarChart3 className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="font-black text-white text-xs uppercase tracking-[0.15em] mb-2">Live Dashboard</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-medium tracking-wide">Real-time monitoring of student feedback and waste metrics for admins.</p>
                    </div>

                    {/* Feature 4: Impact Logs */}
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-orange-500/50 transition-all">
                        <div className="bg-orange-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                            <History className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="font-black text-white text-xs uppercase tracking-[0.15em] mb-2">Waste Logs</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-medium tracking-wide">Comprehensive historical data tracking consumption patterns and savings.</p>
                    </div>

                </div>

                {/* Team Footer */}
                <div className="text-center border-t border-white/5 pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
                        Built by <span className="text-emerald-500">Aksh & Aditi</span> @ A² Labs
                    </p>
                </div>
            </main>
        </div>
    )
}