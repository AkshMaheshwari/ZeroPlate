'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { isAdmin, onAuthChange } from '@/lib/auth'
import OverviewCards from '@/components/OverviewCards'
import RatingsChart from '@/components/charts/RatingsChart'
import SentimentChart from '@/components/charts/SentimentChart'
import AIInsights from '@/components/AIInsights'
import FeedbackTable from '@/components/FeedbackTable'
import WastageTracker from '@/components/WastageTracker'
import WastageStats from '@/components/WastageStats'
import NGODonationWidget from '@/components/NGODonationWidget'

export default function DashboardPage() {
    const router = useRouter()
    const [feedbackData, setFeedbackData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [checking, setChecking] = useState(true)
    const [stats, setStats] = useState({
        avgRating: 0,
        sentimentDist: { positive: 0, neutral: 0, negative: 0 },
        estimatedWaste: 0
    })

    // Check if user is admin
    useEffect(() => {
        const checkAuth = async () => {
            const unsubscribe = onAuthChange(async (user) => {
                if (!user) {
                    router.push('/login')
                } else {
                    const admin = await isAdmin()
                    if (!admin) {
                        router.push('/feedback')
                    } else {
                        setChecking(false)
                    }
                }
            })
            return () => unsubscribe()
        }
        checkAuth()
    }, [router])

    useEffect(() => {
        if (!checking) {
            fetchDashboardData()
        }
    }, [checking])

    const fetchDashboardData = async () => {
        try {
            // Fetch recent feedback
            const feedbackQuery = query(
                collection(db, 'feedback'),
                orderBy('timestamp', 'desc'),
                limit(20)
            )
            const feedbackSnapshot = await getDocs(feedbackQuery)
            const feedback = feedbackSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setFeedbackData(feedback)

            // Calculate average rating
            let totalRating = 0
            let sentimentCount = { positive: 0, neutral: 0, negative: 0 }

            feedback.forEach((item: any) => {
                if (item.rating) totalRating += item.rating
                if (item.sentiment) {
                    const sentiment = item.sentiment.toLowerCase()
                    if (sentiment in sentimentCount) {
                        sentimentCount[sentiment as keyof typeof sentimentCount]++
                    }
                }
            })

            const avgRating = feedback.length > 0 ? totalRating / feedback.length : 0
            const total = sentimentCount.positive + sentimentCount.neutral + sentimentCount.negative
            const sentimentDist = {
                positive: total > 0 ? Math.round((sentimentCount.positive / total) * 100) : 0,
                neutral: total > 0 ? Math.round((sentimentCount.neutral / total) * 100) : 0,
                negative: total > 0 ? Math.round((sentimentCount.negative / total) * 100) : 0
            }

            // Fetch today's wastage
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const wastageQuery = query(
                collection(db, 'dailyWastage'),
                where('date', '>=', Timestamp.fromDate(today)),
                orderBy('date', 'desc')
            )
            const wastageSnapshot = await getDocs(wastageQuery)
            let totalWastage = 0
            wastageSnapshot.docs.forEach(doc => {
                totalWastage += doc.data().wastageKg || 0
            })

            setStats({
                avgRating,
                sentimentDist,
                estimatedWaste: totalWastage
            })
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            // Use default values if fetch fails
            setStats({
                avgRating: 0,
                sentimentDist: { positive: 0, neutral: 0, negative: 0 },
                estimatedWaste: 0
            })
        } finally {
            setLoading(false)
        }
    }

    // Show loading while checking authentication
    if (checking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-primary-100 rounded-2xl p-3">
                            <span className="text-4xl">📊</span>
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 ml-16">Monitor food waste metrics and student feedback in real-time</p>
                </div>

                {/* Overview Cards */}
                <OverviewCards
                    avgRating={stats.avgRating}
                    sentimentDist={stats.sentimentDist}
                    estimatedWaste={stats.estimatedWaste}
                />

                {/* Charts Section */}
                <div className="mt-12 grid lg:grid-cols-2 gap-8">
                    <RatingsChart />
                    <SentimentChart sentimentDist={stats.sentimentDist} />
                </div>

                {/* Wastage Management Section */}
                <div className="mt-12 grid lg:grid-cols-2 gap-8">
                    <WastageTracker />
                    <WastageStats />
                </div>

                {/* NGO Donation Section */}
                <div className="mt-12">
                    <NGODonationWidget />
                </div>

                {/* AI Insights */}
                <div className="mt-12">
                    <AIInsights />
                </div>

                {/* Recent Feedback Table */}
                <div className="mt-12">
                    <FeedbackTable feedbackData={feedbackData} loading={loading} />
                </div>
            </div>
        </div>
    )
}

