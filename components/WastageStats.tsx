'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// --- Interfaces ---
interface WastageData {
    dishName: string;
    wastageKg: number;
    mealType: string;
}

interface MealTypeStats {
    Breakfast: number;
    Lunch: number;
    Dinner: number;
    Snacks: number;
}

export default function WastageStats() {
    const [todayTotal, setTodayTotal] = useState(0);
    const [weekTotal, setWeekTotal] = useState(0);
    const [monthTotal, setMonthTotal] = useState(0);
    const [topWasted, setTopWasted] = useState<WastageData[]>([]);
    const [mealTypeBreakdown, setMealTypeBreakdown] = useState<MealTypeStats>({
        Breakfast: 0, Lunch: 0, Dinner: 0, Snacks: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching Logic ---
    const fetchWastageStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const now = new Date();
            const todayStart = new Date(now).setHours(0, 0, 0, 0);
            const weekStart = new Date(now).setDate(now.getDate() - 7);
            const monthStart = new Date(now).setDate(now.getDate() - 30);

            const q = query(
                collection(db, 'dailyWastage'),
                orderBy('timestamp', 'desc'),
                limit(500)
            );

            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                setLoading(false);
                return;
            }

            let todaySum = 0;
            let weekSum = 0;
            let monthSum = 0;
            const dishMap: { [key: string]: WastageData } = {};
            const mealStats: MealTypeStats = { Breakfast: 0, Lunch: 0, Dinner: 0, Snacks: 0 };

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                
                // Flexible date parsing for Firestore Timestamps or regular Dates
                const entryTimestamp = data.timestamp?.toDate?.() || data.date?.toDate?.() || new Date(data.date || data.timestamp);
                const entryTime = entryTimestamp.getTime();
                const wastage = Number(data.wastageKg) || 0;

                // 1. Calculate Time Period Totals
                if (entryTime >= monthStart) monthSum += wastage;
                if (entryTime >= weekStart) weekSum += wastage;
                if (entryTime >= todayStart) todaySum += wastage;

                // 2. Aggregate Top Dishes (Last 30 Days)
                if (entryTime >= monthStart) {
                    const name = data.dishName || 'Unknown Item';
                    if (!dishMap[name]) {
                        dishMap[name] = { dishName: name, wastageKg: 0, mealType: data.mealType || 'N/A' };
                    }
                    dishMap[name].wastageKg += wastage;
                }

                // 3. Meal Breakdown (Today Only)
                if (entryTime >= todayStart) {
                    const meal = data.mealType as keyof MealTypeStats;
                    if (meal in mealStats) mealStats[meal] += wastage;
                }
            });

            setTodayTotal(todaySum);
            setWeekTotal(weekSum);
            setMonthTotal(monthSum);
            setMealTypeBreakdown(mealStats);
            setTopWasted(
                Object.values(dishMap)
                    .sort((a, b) => b.wastageKg - a.wastageKg)
                    .slice(0, 3)
            );

        } catch (err: any) {
            console.error('Stats Sync Error:', err);
            setError('Failed to load latest statistics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWastageStats();
        const interval = setInterval(fetchWastageStats, 300000); // Auto-refresh every 5 mins
        return () => clearInterval(interval);
    }, [fetchWastageStats]);

    // --- Render Loading State ---
    if (loading && todayTotal === 0) return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="h-24 bg-gray-100 rounded-xl"></div>
                <div className="h-24 bg-gray-100 rounded-xl"></div>
                <div className="h-24 bg-gray-100 rounded-xl"></div>
            </div>
            <div className="h-64 bg-gray-50 rounded-xl"></div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-2xl p-3"><span className="text-4xl">📈</span></div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Waste Analytics</h3>
                        <p className="text-sm text-gray-600">Track and optimize food usage</p>
                    </div>
                </div>
                <button 
                    onClick={fetchWastageStats} 
                    className={`p-2 hover:bg-gray-100 rounded-full transition-all ${loading ? 'animate-spin' : ''}`}
                >
                    <span className="text-xl">🔄</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm font-medium">
                    ⚠️ {error}
                </div>
            )}

            {/* Top Stat Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <StatCard label="Today" value={todayTotal} color="blue" />
                <StatCard label="Last 7 Days" value={weekTotal} color="purple" />
                <StatCard label="Last 30 Days" value={monthTotal} color="pink" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Most Wasted Items */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🔥</span> Top 3 Wasted Items</h4>
                    {topWasted.length > 0 ? (
                        <div className="space-y-3">
                            {topWasted.map((dish, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-800">#{i+1} {dish.dishName}</span>
                                        <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-lg">
                                            {dish.wastageKg.toFixed(1)}kg
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-red-500 h-full transition-all duration-1000" 
                                            style={{ width: `${(dish.wastageKg / topWasted[0].wastageKg) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState text="No data for this month" />}
                </div>

                {/* Daily Meal Breakdown */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🍽️</span> Today&apos;s Progress</h4>
                    <div className="space-y-5">
                        <MealProgress label="Breakfast" val={mealTypeBreakdown.Breakfast} total={todayTotal} color="orange" icon="☀️" />
                        <MealProgress label="Lunch" val={mealTypeBreakdown.Lunch} total={todayTotal} color="yellow" icon="🌞" />
                        <MealProgress label="Dinner" val={mealTypeBreakdown.Dinner} total={todayTotal} color="indigo" icon="🌙" />
                        <MealProgress label="Snacks" val={mealTypeBreakdown.Snacks} total={todayTotal} color="teal" icon="🍿" />
                    </div>
                    {todayTotal === 0 && <EmptyState text="No waste recorded today!" />}
                </div>
            </div>
        </div>
    );
}

// --- Internal Helper Components ---

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
    const theme: any = {
        blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-900",
        purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-900",
        pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-900"
    };
    return (
        <div className={`bg-gradient-to-br ${theme[color]} rounded-xl p-5 border-2`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{label}</p>
            <p className="text-3xl font-black">{value.toFixed(1)} <span className="text-sm font-normal">kg</span></p>
        </div>
    );
}

function MealProgress({ label, val, total, color, icon }: any) {
    const pct = total > 0 ? (val / total) * 100 : 0;
    const barColor: any = { 
        orange: "bg-orange-500", yellow: "bg-yellow-500", 
        indigo: "bg-indigo-500", teal: "bg-teal-500" 
    };
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600">{icon} {label}</span>
                <span className="font-bold text-gray-900">{val.toFixed(1)} kg</span>
            </div>
            <div className="bg-white/60 rounded-full h-2.5 border border-gray-100">
                <div 
                    className={`${barColor[color]} h-full rounded-full transition-all duration-700 ease-out`} 
                    style={{ width: `${pct}%` }} 
                />
            </div>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 opacity-40">
            <span className="text-3xl mb-2">🍃</span>
            <p className="text-xs italic">{text}</p>
        </div>
    );
}