'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Users, ArrowRight, Star, Leaf, TrendingUp } from 'lucide-react'
import { MOCK_NGOS } from '@/lib/ngo'

export default function NGODonationWidget() {
    const [activeDonations] = useState(3)
    const [totalDonated] = useState(1250) // kg

    const topNGOs = MOCK_NGOS.slice(0, 3)

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        Partner Network
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Impact Overview</p>
                </div>
                <Link
                    href="/donate-food"
                    className="text-[10px] font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 text-slate-500 px-4 py-2 rounded-full border border-slate-100 transition-all"
                >
                    Directory
                </Link>
            </div>

            {/* Quick Stats Bento Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50/50 rounded-3xl p-5 border border-emerald-100/50 relative overflow-hidden group">
                    <TrendingUp className="absolute -right-2 -bottom-2 w-12 h-12 text-emerald-100 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">Active</p>
                    <p className="text-3xl font-black text-emerald-900">{activeDonations}</p>
                </div>
                <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 relative overflow-hidden group">
                    <Leaf className="absolute -right-2 -bottom-2 w-12 h-12 text-slate-200 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total (KG)</p>
                    <p className="text-3xl font-black text-slate-900">{totalDonated}</p>
                </div>
            </div>

            {/* Top NGOs List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Rated Partners</h4>
                    <span className="w-8 h-[1px] bg-slate-100 flex-grow ml-4"></span>
                </div>
                
                {topNGOs.map((ngo) => (
                    <div 
                        key={ngo.id} 
                        className="group flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs">
                                {ngo.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{ngo.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <span className="text-[10px] font-bold text-slate-400">{ngo.rating} Rating</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-emerald-600 uppercase">
                                {ngo.capacity - ngo.currentLoad}kg space
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium CTA Button */}
            <Link
                href="/donate-food"
                className="mt-8 w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl text-center transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200 hover:shadow-emerald-100 group"
            >
                <span className="text-sm tracking-wide">Start Donating Food</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    )
}