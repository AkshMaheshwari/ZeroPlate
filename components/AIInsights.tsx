'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define what an Insight looks like to satisfy TypeScript
interface Insight {
    id: number;
    suggestion: string;
    impact: string;
    priority: string;
}

export default function AllInsights() {
    const [suggestions, setSuggestions] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAIAnalysis();
    }, []);

    const getAIAnalysis = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Fetch feedback data (Including the new transcript field)
            const feedbackRef = collection(db, "feedback");
            const feedbackQuery = query(feedbackRef, orderBy("timestamp", "desc"), limit(15));
            const feedbackSnap = await getDocs(feedbackQuery);
            
            const feedbackData = feedbackSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    dish: data.dishName,
                    rating: data.rating,
                    // ✅ CRITICAL: Pass the transcript to the AI backend
                    transcript: data.transcript || "", 
                    mealType: data.mealType || ""
                };
            });

            // 2. Fetch wastage data (last 7 days)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const wastageRef = collection(db, "dailyWastage");
            const wastageQuery = query(
                wastageRef,
                orderBy("date", "desc"),
                limit(20)
            );
            const wastageSnap = await getDocs(wastageQuery);
            const wastageData = wastageSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    date: data.date?.toDate?.()?.toISOString() || null,
                    timestamp: data.timestamp?.toDate?.()?.toISOString() || null
                };
            });

            if (feedbackData.length === 0 && wastageData.length === 0) {
                setLoading(false);
                return;
            }

            // 3. Send to your Node.js backend (index.js)
            const res = await axios.post("https://zeroplate.onrender.com/analyze-waste", {
                feedbackData: feedbackData,
                wastageData: wastageData
            });

            setSuggestions(res.data.insights || []);
        } catch (err: any) {
            console.error("Connection Error:", err);
            setError("AI Server is offline. Please start the backend (node index.js).");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1e1b4b] rounded-2xl p-6 text-white border border-indigo-500/30 shadow-2xl mt-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-yellow-400">✨</span> AI Waste Analysis
                    </h3>
                    <p className="text-xs text-indigo-300">Analyzing voice feedback & wastage patterns</p>
                </div>
                <button 
                    onClick={getAIAnalysis}
                    className="text-xs bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1 rounded-lg border border-indigo-500/50 transition-all"
                >
                    🔄 Refresh
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center py-10 space-y-4">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-indigo-300 text-sm animate-pulse">Consulting Gemini AI...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-6 text-red-400 bg-red-900/20 rounded-xl border border-red-500/50">
                        <p className="text-sm font-medium">{error}</p>
                        <p className="text-[10px] mt-1 opacity-70 italic">Check terminal: cd server && node index.js</p>
                    </div>
                ) : suggestions.length > 0 ? (
                    suggestions.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/5 p-4 rounded-xl border-l-4 border-indigo-500 hover:bg-white/10 transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-100">{item.suggestion}</p>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                    item.priority === 'High' ? 'bg-red-900/40 text-red-400' : 'bg-blue-900/40 text-blue-400'
                                }`}>
                                    {item.priority}
                                </span>
                            </div>
                            <p className="text-[11px] text-indigo-400 mt-2 font-mono uppercase">
                                Impact: {item.impact}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-indigo-300/60 text-sm py-10">No feedback data found in database.</p>
                )}
            </div>
        </div>
    );
}