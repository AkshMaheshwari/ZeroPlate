'use client'

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
        setError(null); // Clear previous errors

        try {
            // Fetch feedback data
            const feedbackRef = collection(db, "feedback");
            const feedbackQuery = query(feedbackRef, orderBy("timestamp", "desc"), limit(10));
            const feedbackSnap = await getDocs(feedbackQuery);
            const feedbackData = feedbackSnap.docs.map(doc => doc.data());

            // Fetch wastage data (last 7 days)
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

            // Ensure your backend (node index.js) is running on port 3001
            const res = await axios.post("http://localhost:3001/analyze-waste", {
                feedbackData: feedbackData,
                wastageData: wastageData
            });

            setSuggestions(res.data.insights || []);
        } catch (err: any) {
            console.error("Connection Error:", err);
            // Fixed the red line by ensuring we only pass a string
            setError("AI Server is offline. Please start the backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1e1b4b] rounded-2xl p-6 text-white border border-indigo-500/30 shadow-2xl mt-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-yellow-400">✨</span> AI Waste Analysis
                </h3>
                <p className="text-xs text-indigo-300">Live insights from recent feedback</p>
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
                        <p className="text-[10px] mt-1 opacity-70 italic">Check your terminal: cd server && node index.js</p>
                    </div>
                ) : suggestions.length > 0 ? (
                    suggestions.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/5 p-4 rounded-xl border-l-4 border-indigo-500 hover:bg-white/10 transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-100">{item.suggestion}</p>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${item.priority === 'High' ? 'bg-red-900/40 text-red-400' : 'bg-blue-900/40 text-blue-400'
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