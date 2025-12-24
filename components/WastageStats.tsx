'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
        Breakfast: 0,
        Lunch: 0,
        Dinner: 0,
        Snacks: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchWastageStats();
    }, []);

    const fetchWastageStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const now = new Date();

            // Today - start of day
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);

            // Week - 7 days ago
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - 7);
            weekStart.setHours(0, 0, 0, 0);

            // Month - 30 days ago
            const monthStart = new Date(now);
            monthStart.setDate(now.getDate() - 30);
            monthStart.setHours(0, 0, 0, 0);

            console.log('Fetching wastage data from:', monthStart);

            // Fetch all recent data without date filter first to debug
            const q = query(
                collection(db, 'dailyWastage'),
                orderBy('date', 'desc')
            );

            const snapshot = await getDocs(q);
            console.log('Total documents found:', snapshot.docs.length);

            if (snapshot.empty) {
                console.log('No wastage data found in database');
                setLoading(false);
                return;
            }

            const allData = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log('Document data:', data);
                return data;
            });

            // Calculate totals
            let todaySum = 0;
            let weekSum = 0;
            let monthSum = 0;
            const dishMap: { [key: string]: WastageData } = {};
            const mealStats: MealTypeStats = { Breakfast: 0, Lunch: 0, Dinner: 0, Snacks: 0 };

            allData.forEach((entry: any) => {
                // Handle both Timestamp and regular Date objects
                let entryDate: Date;
                if (entry.date && typeof entry.date.toDate === 'function') {
                    entryDate = entry.date.toDate();
                } else if (entry.date instanceof Date) {
                    entryDate = entry.date;
                } else if (entry.timestamp && typeof entry.timestamp.toDate === 'function') {
                    entryDate = entry.timestamp.toDate();
                } else {
                    console.warn('Invalid date format for entry:', entry);
                    return;
                }

                const wastage = parseFloat(entry.wastageKg) || 0;
                
                console.log('Processing entry:', {
                    date: entryDate,
                    dish: entry.dishName,
                    wastage,
                    mealType: entry.mealType
                });

                // Time period totals
                if (entryDate >= monthStart) {
                    monthSum += wastage;
                }
                if (entryDate >= weekStart) {
                    weekSum += wastage;
                }
                if (entryDate >= todayStart) {
                    todaySum += wastage;
                }

                // Dish aggregation (for month)
                if (entryDate >= monthStart) {
                    const dishKey = entry.dishName || 'Unknown Dish';
                    if (!dishMap[dishKey]) {
                        dishMap[dishKey] = {
                            dishName: dishKey,
                            wastageKg: 0,
                            mealType: entry.mealType || 'Unknown'
                        };
                    }
                    dishMap[dishKey].wastageKg += wastage;
                }

                // Meal type breakdown (today only)
                if (entryDate >= todayStart) {
                    const meal = entry.mealType as keyof MealTypeStats;
                    if (meal && meal in mealStats) {
                        mealStats[meal] += wastage;
                    }
                }
            });

            console.log('Calculated totals:', {
                today: todaySum,
                week: weekSum,
                month: monthSum
            });

            setTodayTotal(todaySum);
            setWeekTotal(weekSum);
            setMonthTotal(monthSum);

            // Top 3 wasted dishes
            const topDishes = Object.values(dishMap)
                .sort((a, b) => b.wastageKg - a.wastageKg)
                .slice(0, 3);
            setTopWasted(topDishes);

            setMealTypeBreakdown(mealStats);
        } catch (err) {
            console.error('Error fetching wastage stats:', err);
            setError('Failed to load wastage statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
                <div className="text-center text-red-600">
                    <p className="font-bold mb-2">⚠️ Error Loading Stats</p>
                    <p className="text-sm">{error}</p>
                    <button 
                        onClick={fetchWastageStats}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 rounded-2xl p-3">
                        <span className="text-4xl">📈</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Wastage Statistics</h3>
                        <p className="text-sm text-gray-600">Track trends and patterns</p>
                    </div>
                </div>
            </div>

            {/* Period Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Today</p>
                    <p className="text-3xl font-bold text-blue-900">{todayTotal.toFixed(1)} kg</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Last 7 Days</p>
                    <p className="text-3xl font-bold text-purple-900">{weekTotal.toFixed(1)} kg</p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border-2 border-pink-200">
                    <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide mb-1">Last 30 Days</p>
                    <p className="text-3xl font-bold text-pink-900">{monthTotal.toFixed(1)} kg</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Wasted Dishes */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🔥</span> Most Wasted Dishes (30 days)
                    </h4>

                    {topWasted.length > 0 ? (
                        <div className="space-y-3">
                            {topWasted.map((dish, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 border-2 border-orange-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-red-600">#{index + 1}</span>
                                            <span className="font-bold text-gray-900">{dish.dishName}</span>
                                        </div>
                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                                            {dish.mealType}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-red-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-red-600 h-full rounded-full transition-all"
                                                style={{ width: `${Math.min((dish.wastageKg / topWasted[0].wastageKg) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-red-600">{dish.wastageKg.toFixed(1)} kg</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No data available yet</p>
                    )}
                </div>

                {/* Meal Type Breakdown */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🍽️</span> Today's Breakdown
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    ☀️ Breakfast
                                </span>
                                <span className="text-lg font-bold text-orange-600">
                                    {mealTypeBreakdown.Breakfast.toFixed(1)} kg
                                </span>
                            </div>
                            <div className="bg-orange-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-orange-500 h-full rounded-full transition-all"
                                    style={{ width: `${todayTotal > 0 ? (mealTypeBreakdown.Breakfast / todayTotal) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    🌞 Lunch
                                </span>
                                <span className="text-lg font-bold text-yellow-600">
                                    {mealTypeBreakdown.Lunch.toFixed(1)} kg
                                </span>
                            </div>
                            <div className="bg-yellow-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-yellow-500 h-full rounded-full transition-all"
                                    style={{ width: `${todayTotal > 0 ? (mealTypeBreakdown.Lunch / todayTotal) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    🌙 Dinner
                                </span>
                                <span className="text-lg font-bold text-indigo-600">
                                    {mealTypeBreakdown.Dinner.toFixed(1)} kg
                                </span>
                            </div>
                            <div className="bg-indigo-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-indigo-500 h-full rounded-full transition-all"
                                    style={{ width: `${todayTotal > 0 ? (mealTypeBreakdown.Dinner / todayTotal) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    🍿 Snacks
                                </span>
                                <span className="text-lg font-bold text-teal-600">
                                    {mealTypeBreakdown.Snacks.toFixed(1)} kg
                                </span>
                            </div>
                            <div className="bg-teal-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-teal-500 h-full rounded-full transition-all"
                                    style={{ width: `${todayTotal > 0 ? (mealTypeBreakdown.Snacks / todayTotal) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {todayTotal === 0 && (
                            <p className="text-gray-500 text-xs text-center italic mt-4">
                                No wastage recorded today 🎉
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Refresh button */}
            <div className="mt-6 text-center">
                <button
                    onClick={fetchWastageStats}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors"
                >
                    🔄 Refresh Stats
                </button>
            </div>
        </div>
    );
}