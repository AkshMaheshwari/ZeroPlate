'use client'

import React from 'react'
import { Star, Activity, Trash2, TrendingUp } from 'lucide-react'

export default function OverviewCards({
    avgRating,
    sentimentDist,
    estimatedWaste
}: {
    avgRating: number
    sentimentDist: { positive: number; neutral: number; negative: number }
    estimatedWaste: number
}) {
    const total = sentimentDist.positive + sentimentDist.neutral + sentimentDist.negative
    const positivePercent = total > 0 ? Math.round((sentimentDist.positive / total) * 100) : 0
    const neutralPercent = total > 0 ? Math.round((sentimentDist.neutral / total) * 100) : 0
    const negativePercent = total > 0 ? Math.round((sentimentDist.negative / total) * 100) : 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* 1. Average Rating Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-emerald-50 rounded-2xl p-3">
                        <Star className="w-8 h-8 text-emerald-600" fill="currentColor" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                            User Satisfaction
                        </span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Rating</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-5xl font-black text-gray-900">{avgRating.toFixed(1)}</h3>
                        <span className="text-gray-400 font-bold">/ 4.0</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500 transition-all duration-1000" 
                            style={{ width: `${(avgRating / 4) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 2. Sentiment Distribution Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-blue-50 rounded-2xl p-3">
                        <Activity className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider">
                        Live Sentiment
                    </span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between group">
                        <span className="text-sm font-bold text-gray-600">😄 Positive</span>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                <div className="h-full bg-green-500" style={{ width: `${positivePercent}%` }} />
                            </div>
                            <span className="text-lg font-black text-green-600 w-10 text-right">{positivePercent}%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between group">
                        <span className="text-sm font-bold text-gray-600">😐 Neutral</span>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                <div className="h-full bg-yellow-500" style={{ width: `${neutralPercent}%` }} />
                            </div>
                            <span className="text-lg font-black text-yellow-600 w-10 text-right">{neutralPercent}%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between group">
                        <span className="text-sm font-bold text-gray-600">😞 Negative</span>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                <div className="h-full bg-red-500" style={{ width: `${negativePercent}%` }} />
                            </div>
                            <span className="text-lg font-black text-red-600 w-10 text-right">{negativePercent}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Estimated Food Waste Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                {/* Background Decoration */}
                <Trash2 className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                        <TrendingUp className="w-8 h-8 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest">
                        Environmental Impact
                    </span>
                </div>
                
                <div className="relative z-10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Waste Generated</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-6xl font-black text-white">{estimatedWaste}</h3>
                        <span className="text-2xl font-bold text-emerald-400">kg</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2 font-medium">Recorded for today</p>
                    
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-400/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        AI TRACKING ACTIVE
                    </div>
                </div>
            </div>

        </div>
    )
}