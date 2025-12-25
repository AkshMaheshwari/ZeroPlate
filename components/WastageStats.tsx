'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart3, RefreshCw, Flame, PieChart, Info, Trophy, Target } from 'lucide-react';

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
            if (snapshot.empty) { setLoading(false); return; }

            let todaySum = 0; let weekSum = 0; let monthSum = 0;
            const dishMap: { [key: string]: WastageData } = {};
            const mealStats: MealTypeStats = { Breakfast: 0, Lunch: 0, Dinner: 0, Snacks: 0 };

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const entryTimestamp = data.timestamp?.toDate?.() || data.date?.toDate?.() || new Date(data.date || data.timestamp);
                const entryTime = entryTimestamp.getTime();
                const wastage = Number(data.wastageKg) || 0;

                if (entryTime >= monthStart) monthSum += wastage;
                if (entryTime >= weekStart) weekSum += wastage;
                if (entryTime >= todayStart) todaySum += wastage;

                if (entryTime >= monthStart) {
                    const name = data.dishName || 'Unknown Item';
                    if (!dishMap[name]) {
                        dishMap[name] = { dishName: name, wastageKg: 0, mealType: data.mealType || 'N/A' };
                    }
                    dishMap[name].wastageKg += wastage;
                }

                if (entryTime >= todayStart) {
                    const meal = data.mealType as keyof MealTypeStats;
                    if (meal in mealStats) mealStats[meal] += wastage;
                }
            });

            setTodayTotal(todaySum);
            setWeekTotal(weekSum);
            setMonthTotal(monthSum);
            setMealTypeBreakdown(mealStats);
            setTopWasted(Object.values(dishMap).sort((a, b) => b.wastageKg - a.wastageKg).slice(0, 3));
        } catch (err: any) {
            setError('Failed to load latest statistics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWastageStats();
        const interval = setInterval(fetchWastageStats, 300000);
        return () => clearInterval(interval);
    }, [fetchWastageStats]);

    if (loading && todayTotal === 0) return <LoadingSkeleton />;

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 rounded-2xl p-3 shadow-lg shadow-emerald-100">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Waste Analytics</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Efficiency Report</p>
                    </div>
                </div>
                <button 
                    onClick={fetchWastageStats} 
                    className="p-3 hover:bg-slate-50 rounded-xl transition-all group"
                >
                    <RefreshCw className={`w-5 h-5 text-slate-400 group-hover:text-emerald-500 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-xs font-black flex items-center gap-2">
                    <Info className="w-4 h-4" /> {error}
                </div>
            )}

            {/* Top Stat Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <StatCard label="Today" value={todayTotal} trend="Live" color="emerald" />
                <StatCard label="Last 7 Days" value={weekTotal} trend="Weekly" color="slate" />
                <StatCard label="Last 30 Days" value={monthTotal} trend="Monthly" color="emerald-dark" />
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Most Wasted Items */}
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-500" /> Critical Loss Items
                        </h4>
                        <Trophy className="w-4 h-4 text-slate-300" />
                    </div>
                    
                    {topWasted.length > 0 ? (
                        <div className="space-y-4">
                            {topWasted.map((dish, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/50 group hover:border-emerald-500/30 transition-all">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
                                                0{i+1}
                                            </span>
                                            <span className="font-black text-slate-800 tracking-tight">{dish.dishName}</span>
                                        </div>
                                        <span className="text-xs font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                                            {dish.wastageKg.toFixed(1)}kg
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${(dish.wastageKg / topWasted[0].wastageKg) * 100}%` }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState text="No significant loss recorded" />}
                </div>

                {/* Daily Meal Breakdown */}
                <div className="bg-emerald-900 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
                    <Target className="absolute -right-10 -bottom-10 w-40 h-40 opacity-5" />
                    <h4 className="font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-2 relative z-10">
                        <PieChart className="w-4 h-4 text-emerald-400" /> Today's Distribution
                    </h4>
                    
                    <div className="space-y-6 relative z-10">
                        <MealProgress label="Breakfast" val={mealTypeBreakdown.Breakfast} total={todayTotal} />
                        <MealProgress label="Lunch" val={mealTypeBreakdown.Lunch} total={todayTotal} />
                        <MealProgress label="Dinner" val={mealTypeBreakdown.Dinner} total={todayTotal} />
                        <MealProgress label="Snacks" val={mealTypeBreakdown.Snacks} total={todayTotal} />
                    </div>
                    {todayTotal === 0 && <EmptyState text="Clear plate day!" isDark />}
                </div>
            </div>
        </div>
    );
}

// --- Internal Helper Components ---

function StatCard({ label, value, color, trend }: any) {
    const colors: any = {
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-900",
        slate: "bg-slate-50 border-slate-100 text-slate-900",
        "emerald-dark": "bg-slate-900 border-slate-800 text-white"
    };

    return (
        <div className={`${colors[color]} rounded-3xl p-6 border transition-transform hover:scale-[1.02]`}>
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/20 uppercase">{trend}</span>
            </div>
            <p className="text-4xl font-black tracking-tighter">
                {value.toFixed(1)} <span className="text-sm font-bold opacity-50">kg</span>
            </p>
        </div>
    );
}

function MealProgress({ label, val, total }: any) {
    const pct = total > 0 ? (val / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="opacity-70">{label}</span>
                <span className="text-emerald-400 font-black">{val.toFixed(1)} kg</span>
            </div>
            <div className="bg-white/10 rounded-full h-1.5">
                <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${pct}%` }} 
                />
            </div>
        </div>
    );
}

function EmptyState({ text, isDark }: { text: string, isDark?: boolean }) {
    return (
        <div className={`flex flex-col items-center justify-center py-10 ${isDark ? 'text-white/40' : 'text-slate-300'}`}>
            <Info className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">{text}</p>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-xl w-48 mb-10"></div>
            <div className="grid grid-cols-3 gap-6 mb-10">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-3xl"></div>)}
            </div>
            <div className="grid grid-cols-2 gap-10">
                <div className="h-64 bg-slate-50 rounded-[2rem]"></div>
                <div className="h-64 bg-emerald-900/10 rounded-[2rem]"></div>
            </div>
        </div>
    );
}