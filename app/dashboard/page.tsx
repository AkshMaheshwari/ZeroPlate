'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { isAdmin, onAuthChange, signOut } from '@/lib/auth'
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
                positive: sentimentCount.positive,
                neutral: sentimentCount.neutral,
                negative: sentimentCount.negative
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
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full space-y-10 sm:space-y-12">
                {/* Header */}
                <div className="space-y-4 sm:space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-primary-100 rounded-2xl p-2.5 sm:p-3">
                                <span className="text-3xl sm:text-4xl">📊</span>
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
                                <p className="text-sm sm:text-base text-gray-600 sm:ml-0">Monitor food waste metrics and student feedback in real-time</p>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    await signOut()
                                    router.push('/login')
                                } catch (err) {
                                    console.error('Logout failed:', err)
                                }
                            }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-gray-800 border border-gray-200 shadow-sm hover:shadow-md active:scale-[0.99] text-sm font-semibold"
                        >
                            <span className="text-lg">📱</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Overview Cards */}
                <OverviewCards
                    avgRating={stats.avgRating}
                    sentimentDist={stats.sentimentDist}
                    estimatedWaste={stats.estimatedWaste}
                />

                {/* Charts Section */}
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                    <RatingsChart />
                    <SentimentChart sentimentDist={stats.sentimentDist} />
                </div>

                {/* Wastage Management Section */}
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                    <WastageTracker />
                    <WastageStats />
                </div>

                {/* NGO Donation Section */}
                <div>
                    <NGODonationWidget />
                </div>

                {/* AI Insights */}
                <div>
                    <AIInsights />
                </div>

                {/* Recent Feedback Table */}
                <div>
                    <FeedbackTable feedbackData={feedbackData} loading={loading} />
                </div>
            </div>
        </div>
    )
}

