'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sparkles, RefreshCw, Zap, Target, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';

interface Insight {
    id: number;
    suggestion: string;
    impact: string;
    priority: string;
}

const FALLBACK_INSIGHTS: Insight[] = [
    {
        id: 1,
        suggestion: "Prioritize smaller batch cooking for low-demand meals to cut waste without affecting freshness.",
        impact: "15-20% waste reduction",
        priority: "High",
    },
    {
        id: 2,
        suggestion: "Standardize portion sizes for breakfast and lunch where over-serving is most frequent.",
        impact: "8-12% waste reduction",
        priority: "Medium",
    },
    {
        id: 3,
        suggestion: "Offer a feedback-driven 'light plate' option during low appetite periods (post-exam evenings).",
        impact: "5-8% waste reduction",
        priority: "Medium",
    },
];

export default function AllInsights() {
    const [suggestions, setSuggestions] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { getAIAnalysis(); }, []);

    const getAIAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const feedbackRef = collection(db, "feedback");
            const feedbackQuery = query(feedbackRef, orderBy("timestamp", "desc"), limit(15));
            const feedbackSnap = await getDocs(feedbackQuery);
            
            const feedbackData = feedbackSnap.docs.map(doc => ({
                dish: doc.data().dishName,
                rating: doc.data().rating,
                transcript: doc.data().transcript || "", 
                mealType: doc.data().mealType || ""
            }));

            const wastageRef = collection(db, "dailyWastage");
            const wastageQuery = query(wastageRef, orderBy("date", "desc"), limit(20));
            const wastageSnap = await getDocs(wastageQuery);
            const wastageData = wastageSnap.docs.map(doc => ({
                ...doc.data(),
                date: doc.data().date?.toDate?.()?.toISOString() || null
            }));

            const res = await axios.post("http://localhost:3001/analyze-waste", { feedbackData, wastageData });
            const insights: Insight[] = res.data?.insights;
            setSuggestions(insights && insights.length > 0 ? insights : FALLBACK_INSIGHTS);
        } catch (err: any) {
            setError("AI Analysis unavailable. Ensure backend is active.");
            setSuggestions(FALLBACK_INSIGHTS);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Executive Insights <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Smart recommendations to reduce kitchen overhead</p>
                </div>
                <button 
                    onClick={getAIAnalysis}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Intelligence
                </button>
            </div>

            {loading ? (
                <div className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center">
                    <Activity className="w-10 h-10 text-emerald-500 animate-pulse mx-auto mb-4" />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Processing Feedback Patterns...</p>
                </div>
            ) : suggestions.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* FEATURED INSIGHT (The Highlight) */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target className="w-40 h-40" />
                        </div>
                        
                        <div className="relative z-10">
                            <span className="bg-emerald-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                Primary Action
                            </span>
                            <h3 className="text-3xl font-bold mt-6 mb-4 leading-tight tracking-tight">
                                {suggestions[0].suggestion}
                            </h3>
                            <div className="flex items-center gap-6 mt-8">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Estimated Impact</span>
                                    <span className="text-emerald-400 font-bold text-lg">{suggestions[0].impact}</span>
                                </div>
                                <div className="h-10 w-px bg-slate-700"></div>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Priority Status</span>
                                    <span className="text-amber-400 font-bold text-lg">{suggestions[0].priority} Level</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECONDARY INSIGHTS */}
                    <div className="space-y-4">
                        {suggestions.slice(1, 3).map((item, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-slate-50 rounded-xl">
                                            <Zap className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                    <p className="text-slate-800 font-bold leading-snug">
                                        {item.suggestion}
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.impact} Improvement</span>
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                    <p className="text-slate-400 font-bold">Waiting for enough data to generate highlights.</p>
                </div>
            )}
        </div>
    );
}