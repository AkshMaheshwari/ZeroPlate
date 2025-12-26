'use client';

import React from 'react';
import { MessageSquare, Mic, Star, Clock, Info } from 'lucide-react';

// EXACT COLOR CODING FOR SENTIMENTS
const SENTIMENT_COLORS: { [key: string]: string } = {
    POSITIVE: 'bg-[#ECFDF5] text-[#059669] border-[#10B981]',
    NEUTRAL: 'bg-[#F8FAFC] text-[#475569] border-[#94A3B8]',
    NEGATIVE: 'bg-[#FFF1F2] text-[#E11D48] border-[#F43F5E]'
}

export default function FeedbackTable({
    feedbackData,
    loading
}: {
    feedbackData: any[]
    loading: boolean
}) {
    if (loading) {
        return (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Feed...</p>
            </div>
        )
    }

    // Ensure we handle case sensitivity by normalizing sentiment keys
    const getSentimentStyles = (sentiment: string) => {
        const key = sentiment?.toUpperCase() || 'NEUTRAL';
        return SENTIMENT_COLORS[key] || SENTIMENT_COLORS.NEUTRAL;
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            {/* Table Header Section */}
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <MessageSquare className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Recent Feedback</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Student Submissions</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-[#ECFDF5] px-3 py-1.5 rounded-full border border-[#D1FAE5]">
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-[#059669] uppercase tracking-tighter">Live Feed</span>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/30">
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Timestamp</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Meal & Dish</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Experience</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Sentiment</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Audio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {feedbackData.map((feedback, index) => (
                            <tr key={feedback.id || index} className="hover:bg-[#FBFDFF] transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-xs font-bold whitespace-nowrap">
                                            {formatTime(feedback.timestamp)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-[#10B981] uppercase tracking-wider mb-0.5">
                                            {feedback.mealType}
                                        </span>
                                        <span className="text-sm font-bold text-slate-900 capitalize">
                                            {feedback.dishName}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex gap-0.5">
                                        {[...Array(4)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`w-3.5 h-3.5 ${i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} 
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 text-[9px] font-black rounded-lg border uppercase tracking-widest inline-block ${getSentimentStyles(feedback.sentiment)}`}>
                                        {feedback.sentiment || 'NEUTRAL'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    {feedback.hasVoiceNote ? (
                                        <div className="inline-flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-xl shadow-md hover:scale-110 transition-transform cursor-pointer group-hover:shadow-slate-200">
                                            <Mic className="w-3.5 h-3.5" />
                                        </div>
                                    ) : (
                                        <span className="text-slate-200 text-xs">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                <div className="divide-y divide-slate-50">
                    {feedbackData.map((feedback, index) => (
                        <div key={feedback.id || index} className="p-4 hover:bg-[#FBFDFF] transition-colors">
                            {/* Header with timestamp and sentiment */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2 text-slate-400 flex-1">
                                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="text-xs font-bold whitespace-nowrap">
                                        {formatTime(feedback.timestamp)}
                                    </span>
                                </div>
                                <span className={`px-2 py-1 text-[8px] font-black rounded-lg border uppercase tracking-widest whitespace-nowrap flex-shrink-0 ${getSentimentStyles(feedback.sentiment)}`}>
                                    {feedback.sentiment || 'NEUTRAL'}
                                </span>
                            </div>

                            {/* Meal info */}
                            <div className="mb-3">
                                <span className="text-[9px] font-black text-[#10B981] uppercase tracking-wider block mb-0.5">
                                    {feedback.mealType}
                                </span>
                                <span className="text-sm font-bold text-slate-900 capitalize block">
                                    {feedback.dishName}
                                </span>
                            </div>

                            {/* Rating and Audio */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-0.5">
                                    {[...Array(4)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`w-3.5 h-3.5 ${i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} 
                                        />
                                    ))}
                                </div>
                                {feedback.hasVoiceNote ? (
                                    <div className="inline-flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-xl shadow-md hover:scale-110 transition-transform cursor-pointer">
                                        <Mic className="w-3.5 h-3.5" />
                                    </div>
                                ) : (
                                    <span className="text-slate-200 text-xs">—</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {feedbackData.length === 0 && (
                <div className="py-20 text-center bg-white">
                    <div className="bg-slate-50 w-12 h-12 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Info className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No feedback available yet</p>
                </div>
            )}
        </div>
    )
}

function formatTime(timestamp: any): string {
    if (!timestamp) return 'Just now'
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    } catch { return '—' }
}