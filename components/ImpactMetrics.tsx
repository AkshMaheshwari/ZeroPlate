'use client'

import { useEffect, useState } from 'react'
import { Package, Users, Leaf, UtensilsCrossed, Building2, Zap, Globe, Star, Trophy } from 'lucide-react'
import { ImpactMetrics } from '@/lib/ngo'
import { estimateMealsFed, calculateCO2Saved } from '@/lib/location'

interface ImpactMetricsComponentProps {
    metrics?: ImpactMetrics
    loading?: boolean
}

export default function ImpactMetricsComponent({
    metrics,
    loading = false,
}: ImpactMetricsComponentProps) {
    const [animatedMetrics, setAnimatedMetrics] = useState<ImpactMetrics | null>(null)

    useEffect(() => {
        if (metrics) {
            // Simulate animation of numbers
            setAnimatedMetrics(metrics)
        }
    }, [metrics])

    // Default metrics for demo
    const displayMetrics = animatedMetrics || {
        totalFoodDonated: 1250,
        totalDonations: 18,
        estimatedMealsFed: 4165,
        ngoPartnershipsCount: 10,
        activeDonationsToday: 3,
        estimatedCO2Saved: 3125,
    }

    const stats = [
        {
            label: 'Food Donated',
            value: `${displayMetrics.totalFoodDonated}kg`,
            icon: Package,
            color: 'emerald',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700',
            iconColor: 'text-emerald-600',
        },
        {
            label: 'Total Donations',
            value: displayMetrics.totalDonations,
            icon: Users,
            color: 'slate',
            bgColor: 'bg-slate-50',
            textColor: 'text-slate-700',
            iconColor: 'text-slate-600',
        },
        {
            label: 'Meals Made',
            value: displayMetrics.estimatedMealsFed.toLocaleString(),
            icon: UtensilsCrossed,
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-600',
        },
        {
            label: 'NGO Partners',
            value: displayMetrics.ngoPartnershipsCount,
            icon: Building2,
            color: 'slate',
            bgColor: 'bg-slate-50',
            textColor: 'text-slate-700',
            iconColor: 'text-slate-600',
        },
        {
            label: 'Active Today',
            value: displayMetrics.activeDonationsToday,
            icon: Zap,
            color: 'emerald',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700',
            iconColor: 'text-emerald-600',
        },
        {
            label: 'CO2 Saved',
            value: `${displayMetrics.estimatedCO2Saved}kg`,
            icon: Leaf,
            color: 'slate',
            bgColor: 'bg-slate-50',
            textColor: 'text-slate-700',
            iconColor: 'text-slate-600',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Main Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</h3>
                            {typeof stat.icon === 'string' ? (
                                <span className="text-2xl">{stat.icon}</span>
                            ) : (
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <stat.icon className="w-5 h-5 text-slate-600" />
                                </div>
                            )}
                        </div>
                        {loading ? (
                            <div className="h-8 bg-slate-200 rounded-lg animate-pulse"></div>
                        ) : (
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-slate-600" /> Environmental Impact
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                        <p className="text-3xl font-black text-slate-900">
                            {displayMetrics.totalFoodDonated}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Kg Food Saved</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                        <p className="text-3xl font-black text-emerald-600">
                            {displayMetrics.estimatedCO2Saved}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Kg CO2 Saved</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                        <p className="text-3xl font-black text-slate-900">
                            {Math.round(displayMetrics.totalFoodDonated * 0.8)}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Water Saved (L)</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                        <p className="text-3xl font-black text-slate-900">
                            {displayMetrics.estimatedMealsFed}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Meals Provided</p>
                    </div>
                </div>
            </div>

            {/* Recognition Section */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Recognition</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <Trophy className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                        <div>
                            <p className="font-black text-emerald-900">Zero Waste Champion</p>
                            <p className="text-sm text-emerald-700 font-medium">
                                You&apos;ve reduced food waste by {Math.round((displayMetrics.totalFoodDonated / 1500) * 100)}%
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Leaf className="w-8 h-8 text-slate-600 flex-shrink-0" />
                        <div>
                            <p className="font-black text-slate-900">Sustainability Leader</p>
                            <p className="text-sm text-slate-600 font-medium">
                                Contributing to a sustainable future for {displayMetrics.estimatedMealsFed} people
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
