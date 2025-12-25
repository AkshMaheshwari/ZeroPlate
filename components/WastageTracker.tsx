'use client'

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCurrentUserData } from '@/lib/auth';
import * as gtag from '@/lib/gtag'; // Ensure this helper exists in your lib folder

interface WastageEntry {
    id: string;
    date: Date;
    mealType: string;
    dishName: string;
    wastageKg: number;
    timestamp: Date;
    recordedBy?: string;
}

export default function WastageTracker() {
    const [mealType, setMealType] = useState('Lunch');
    const [dishName, setDishName] = useState('');
    const [wastageKg, setWastageKg] = useState('');
    const [todayEntries, setTodayEntries] = useState<WastageEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchTodayWastage();
    }, []);

    const fetchTodayWastage = async () => {
        setLoading(true);
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const q = query(
                collection(db, 'dailyWastage'),
                where('date', '>=', Timestamp.fromDate(today)),
                orderBy('timestamp', 'desc')
            );

            const snapshot = await getDocs(q);
            const entries: WastageEntry[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    date: data.date.toDate(),
                    mealType: data.mealType,
                    dishName: data.dishName,
                    wastageKg: data.wastageKg,
                    timestamp: data.timestamp.toDate(),
                    recordedBy: data.recordedBy
                };
            });

            setTodayEntries(entries);
        } catch (err) {
            console.error('Error fetching wastage:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dishName.trim() || !wastageKg || parseFloat(wastageKg) <= 0) {
            setError('Please enter valid dish name and wastage amount');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const user = await getCurrentUserData();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const wastageData = {
                date: Timestamp.fromDate(today),
                mealType,
                dishName: dishName.trim(),
                wastageKg: parseFloat(wastageKg),
                timestamp: Timestamp.now(),
                recordedBy: user?.email || 'admin'
            };

            const docRef = await addDoc(collection(db, 'dailyWastage'), wastageData);

            // --- GOOGLE ANALYTICS EVENT ---
            gtag.event({
                action: 'submit_wastage',
                category: 'Wastage Tracker',
                label: dishName.trim(),
                value: parseFloat(wastageKg)
            });

            setSuccess('✅ Wastage entry added successfully!');
            setDishName('');
            setWastageKg('');

            await fetchTodayWastage();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            console.error('Error adding wastage:', err);
            setError(`Failed to add entry: ${err.message || 'Unknown error'}`);
            setTimeout(() => setError(null), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        try {
            await deleteDoc(doc(db, 'dailyWastage', id));

            // --- GOOGLE ANALYTICS EVENT ---
            gtag.event({
                action: 'delete_wastage',
                category: 'Wastage Tracker',
                label: id
            });

            setSuccess('Entry deleted successfully!');
            fetchTodayWastage();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error deleting entry:', err);
            setError('Failed to delete entry');
            setTimeout(() => setError(null), 3000);
        }
    };

    const totalWastage = todayEntries.reduce((sum, entry) => sum + entry.wastageKg, 0);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-red-100 rounded-2xl p-3">
                        <span className="text-4xl">🗑️</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Daily Wastage Tracker</h3>
                        <p className="text-sm text-gray-600">Record food waste for analysis</p>
                    </div>
                </div>
            </div>

            {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">{success}</p>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label htmlFor="mealType" className="block text-sm font-semibold text-gray-700 mb-2">
                            Meal Type
                        </label>
                        <select
                            id="mealType"
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer text-gray-900 font-medium"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="Breakfast">🌅 Breakfast</option>
                            <option value="Lunch">☀️ Lunch</option>
                            <option value="Dinner">🌙 Dinner</option>
                            <option value="Snacks">🍿 Snacks</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dishName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Dish Name
                        </label>
                        <input
                            id="dishName"
                            type="text"
                            value={dishName}
                            onChange={(e) => setDishName(e.target.value)}
                            placeholder="e.g., Paneer Butter Masala"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 placeholder-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="wastageKg" className="block text-sm font-semibold text-gray-700 mb-2">
                            Wastage (kg)
                        </label>
                        <input
                            id="wastageKg"
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={wastageKg}
                            onChange={(e) => setWastageKg(e.target.value)}
                            placeholder="0.0"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 placeholder-gray-400"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50"
                >
                    {submitting ? 'Adding Entry...' : '+ Add Wastage Entry'}
                </button>
            </form>

            <div className="mb-6 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide opacity-90 mb-1">
                            Total Wastage Today
                        </p>
                        <p className="text-4xl font-bold">{totalWastage.toFixed(1)} kg</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-2xl p-4">
                        <span className="text-5xl">📊</span>
                    </div>
                </div>
                <p className="text-sm mt-2 opacity-90">{todayEntries.length} entries recorded</p>
            </div>

            <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📋</span> Today's Entries
                </h4>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : todayEntries.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <span className="text-5xl mb-2 block">📝</span>
                        <p className="text-gray-500">No wastage entries for today</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-primary-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                                {entry.mealType}
                                            </span>
                                            <h5 className="font-bold text-gray-900">{entry.dishName}</h5>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="font-semibold text-red-600 text-lg">
                                                {entry.wastageKg} kg
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                • {entry.timestamp.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                        type="button"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}