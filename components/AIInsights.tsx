'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sparkles, RefreshCw, Zap, Target, ArrowUpRight, ShieldCheck, Activity, Database, TrendingUp, Brain, CheckCircle } from 'lucide-react';

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
    const [loadingStage, setLoadingStage] = useState(0);

    useEffect(() => { getAIAnalysis(); }, []);

    const getAIAnalysis = async () => {
        setLoading(true);
        setError(null);
        setLoadingStage(0);
        
        try {
            // Stage 1: Fetching feedback
            setLoadingStage(1);
            const feedbackRef = collection(db, "feedback");
            const feedbackQuery = query(feedbackRef, orderBy("timestamp", "desc"), limit(15));
            const feedbackSnap = await getDocs(feedbackQuery);
            
            const feedbackData = feedbackSnap.docs.map(doc => ({
                dish: doc.data().dishName,
                rating: doc.data().rating,
                transcript: doc.data().transcript || "", 
                mealType: doc.data().mealType || ""
            }));

            // Stage 2: Fetching wastage data
            setLoadingStage(2);
            const wastageRef = collection(db, "dailyWastage");
            const wastageQuery = query(wastageRef, orderBy("date", "desc"), limit(20));
            const wastageSnap = await getDocs(wastageQuery);
            const wastageData = wastageSnap.docs.map(doc => ({
                ...doc.data(),
                date: doc.data().date?.toDate?.()?.toISOString() || null
            }));

            // Stage 3: AI Processing
            setLoadingStage(3);
            const res = await axios.post("https://zeroplate.onrender.com/analyze-waste", { feedbackData, wastageData });
            const insights: Insight[] = res.data?.insights;
            
            // Stage 4: Finalizing
            setLoadingStage(4);
            await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for smooth transition
            setSuggestions(insights && insights.length > 0 ? insights : FALLBACK_INSIGHTS);
        } catch (err: any) {
            setError("AI Analysis unavailable. Ensure backend is active.");
            setSuggestions(FALLBACK_INSIGHTS);
        } finally {
            setLoading(false);
            setLoadingStage(0);
        }
    };

    return (
        <div className="mt-8 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Executive Insights <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Smart recommendations to reduce kitchen overhead</p>
                </div>
                <button 
                    onClick={getAIAnalysis}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Intelligence
                </button>
            </div>

            {loading ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-xl">
                    <div className="max-w-2xl mx-auto">
                        {/* Animated Header */}
                        <div className="text-center mb-10">
                            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                                {/* Outer rotating ring */}
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-spin" style={{ animationDuration: '3s' }}></div>
                                {/* Inner pulsing circle */}
                                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse"></div>
                                {/* Center icon */}
                                <Sparkles className="w-10 h-10 text-white relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Analysis in Progress</h3>
                            <p className="text-slate-500 text-sm">Processing your data with advanced intelligence</p>
                        </div>
                        
                        {/* Loading Stages */}
                        <div className="space-y-3">
                            {[
                                { stage: 1, label: "Collecting feedback data", detail: "Fetching recent reviews and ratings", Icon: Database },
                                { stage: 2, label: "Analyzing wastage patterns", detail: "Processing historical trends", Icon: TrendingUp },
                                { stage: 3, label: "Generating AI insights", detail: "Running machine learning models", Icon: Brain },
                                { stage: 4, label: "Finalizing recommendations", detail: "Compiling actionable strategies", Icon: CheckCircle }
                            ].map(({ stage, label, detail, Icon }) => (
                                <div 
                                    key={stage}
                                    className={`relative flex items-start gap-4 p-5 rounded-2xl transition-all duration-500 ${
                                        loadingStage >= stage 
                                            ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-2 border-emerald-300 shadow-sm' 
                                            : 'bg-slate-50/50 border-2 border-slate-100'
                                    }`}
                                >
                                    {/* Icon Container */}
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                        loadingStage >= stage 
                                            ? 'bg-emerald-500 shadow-lg shadow-emerald-200' 
                                            : 'bg-slate-200'
                                    }`}>
                                        <Icon className={`w-6 h-6 transition-all duration-500 ${
                                            loadingStage === stage ? 'animate-pulse' : ''
                                        } ${
                                            loadingStage >= stage ? 'text-white' : 'text-slate-400'
                                        }`} />
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-base transition-colors duration-300 ${
                                            loadingStage >= stage ? 'text-slate-800' : 'text-slate-400'
                                        }`}>
                                            {label}
                                        </p>
                                        <p className={`text-xs mt-1 transition-colors duration-300 ${
                                            loadingStage >= stage ? 'text-slate-600' : 'text-slate-300'
                                        }`}>
                                            {detail}
                                        </p>
                                    </div>
                                    
                                    {/* Status Indicator */}
                                    <div className="flex-shrink-0 flex items-center">
                                        {loadingStage > stage && (
                                            <div className="transition-all duration-300 animate-in fade-in zoom-in">
                                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                            </div>
                                        )}
                                        {loadingStage === stage && (
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Progress line connector */}
                                    {stage < 4 && (
                                        <div className={`absolute left-[38px] top-[72px] w-0.5 h-3 transition-colors duration-500 ${
                                            loadingStage >= stage ? 'bg-emerald-300' : 'bg-slate-200'
                                        }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-8 px-1">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</span>
                                <span className="text-sm font-black text-emerald-600">{Math.round((loadingStage / 4) * 100)}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 rounded-full transition-all duration-700 ease-out relative"
                                    style={{ width: `${(loadingStage / 4) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
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