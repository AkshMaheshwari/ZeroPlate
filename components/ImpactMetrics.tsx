'use client'

import { useEffect, useState } from 'react'
import { Package, Users, Leaf } from 'lucide-react'
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
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
        },
        {
            label: 'Total Donations',
            value: displayMetrics.totalDonations,
            icon: Users,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
        },
        {
            label: 'Meals Made',
            value: displayMetrics.estimatedMealsFed.toLocaleString(),
            icon: '🍽️',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700',
        },
        {
            label: 'NGO Partners',
            value: displayMetrics.ngoPartnershipsCount,
            icon: '🏢',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
        },
        {
            label: 'Active Today',
            value: displayMetrics.activeDonationsToday,
            icon: '⚡',
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
        },
        {
            label: 'CO2 Saved',
            value: `${displayMetrics.estimatedCO2Saved}kg`,
            icon: Leaf,
            color: 'from-teal-500 to-teal-600',
            bgColor: 'bg-teal-50',
            textColor: 'text-teal-700',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Main Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.bgColor} rounded-lg p-6 border-2 border-transparent hover:border-primary-400 transition-all`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">{stat.label}</h3>
                            {typeof stat.icon === 'string' ? (
                                <span className="text-3xl">{stat.icon}</span>
                            ) : (
                                <stat.icon className="w-8 h-8" />
                            )}
                        </div>
                        {loading ? (
                            <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
                        ) : (
                            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-lg p-6 border border-primary-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🌍 Environmental Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-primary-600">
                            {displayMetrics.totalFoodDonated}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Kg Food Saved</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            {displayMetrics.estimatedCO2Saved}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Kg CO2 Saved</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-orange-600">
                            {Math.round(displayMetrics.totalFoodDonated * 0.8)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Water Saved (L)</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-600">
                            {displayMetrics.estimatedMealsFed}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Meals Provided</p>
                    </div>
                </div>
            </div>

            {/* Recognition Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">⭐ Recognition</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-2xl">🏆</span>
                        <div>
                            <p className="font-semibold text-yellow-900">Zero Waste Champion</p>
                            <p className="text-sm text-yellow-700">
                                You&apos;ve reduced food waste by {Math.round((displayMetrics.totalFoodDonated / 1500) * 100)}%
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Leaf className="w-8 h-8 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-green-900">Sustainability Leader</p>
                            <p className="text-sm text-green-700">
                                Contributing to a sustainable future for {displayMetrics.estimatedMealsFed} people
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
