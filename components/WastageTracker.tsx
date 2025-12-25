'use client'

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCurrentUserData } from '@/lib/auth';
import * as gtag from '@/lib/gtag';
import { Trash2, Plus, Utensils, Scale, Clock, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

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

            await addDoc(collection(db, 'dailyWastage'), wastageData);

            gtag.event({
                action: 'submit_wastage',
                category: 'Wastage Tracker',
                label: dishName.trim(),
                value: parseFloat(wastageKg)
            });

            setSuccess('Entry recorded successfully');
            setDishName('');
            setWastageKg('');
            await fetchTodayWastage();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(`Failed to add entry: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        try {
            await deleteDoc(doc(db, 'dailyWastage', id));
            gtag.event({ action: 'delete_wastage', category: 'Wastage Tracker', label: id });
            setSuccess('Entry removed');
            fetchTodayWastage();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete entry');
        }
    };

    const totalWastage = todayEntries.reduce((sum, entry) => sum + entry.wastageKg, 0);

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            {/* Header Section */}
            <div className="p-8 border-b border-slate-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 rounded-2xl p-4 shadow-lg shadow-slate-200">
                            <Scale className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Wastage Tracker</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daily Operations</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl px-8 py-4 border border-slate-100 flex items-center gap-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Weight Today</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">{totalWastage.toFixed(1)}</span>
                                <span className="text-sm font-bold text-emerald-600">kg</span>
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-200" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Entries</p>
                            <p className="text-3xl font-black text-slate-900">{todayEntries.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 grid lg:grid-cols-12 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-5">
                    <form onSubmit={handleSubmit} className="space-y-6 sticky top-8">
                        <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-emerald-500" /> New Log Entry
                            </h4>
                            
                            <div className="space-y-5">
                                <div className="relative">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-2 mb-1 block">Meal Period</label>
                                    <div className="relative">
                                        <select
                                            value={mealType}
                                            onChange={(e) => setMealType(e.target.value)}
                                            className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none text-slate-900 font-bold"
                                        >
                                            <option value="Breakfast">Breakfast</option>
                                            <option value="Lunch">Lunch</option>
                                            <option value="Dinner">Dinner</option>
                                            <option value="Snacks">Snacks</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-2 mb-1 block">Dish Description</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={dishName}
                                            onChange={(e) => setDishName(e.target.value)}
                                            placeholder="e.g., Dosa"
                                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                        />
                                        <Utensils className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-2 mb-1 block">Quantity (KG)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={wastageKg}
                                        onChange={(e) => setWastageKg(e.target.value)}
                                        placeholder="0.0"
                                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900 font-black text-2xl"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full mt-8 bg-slate-900 text-emerald-400 font-black py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all transform active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 tracking-widest uppercase text-xs"
                            >
                                {submitting ? 'Processing...' : 'Record Wastage'}
                            </button>
                        </div>

                        {/* Status Messages */}
                        {success && (
                            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-bold">{success}</span>
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center gap-3 bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-bold">{error}</span>
                            </div>
                        )}
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-7">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Activity Log
                        </h4>
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full">TODAY</span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-400 font-bold animate-pulse">Syncing data...</p>
                        </div>
                    ) : todayEntries.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                            <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Scale className="w-8 h-8 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold">No entries recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {todayEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="group bg-white border border-slate-100 p-5 rounded-3xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                            <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600">KG</span>
                                            <span className="text-lg font-black text-slate-900">{entry.wastageKg}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                                                    entry.mealType === 'Lunch' ? 'bg-amber-100 text-amber-600' :
                                                    entry.mealType === 'Breakfast' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-purple-100 text-purple-600'
                                                }`}>
                                                    {entry.mealType}
                                                </span>
                                                <h5 className="font-black text-slate-800 tracking-tight">{entry.dishName}</h5>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {entry.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                <span className="mx-1">•</span>
                                                Recorded by {entry.recordedBy?.split('@')[0]}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}