'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { isAdmin, onAuthChange } from '@/lib/auth'
import OverviewCards from '@/components/OverviewCards'
import RatingsChart from '@/components/charts/RatingsChart'
import SentimentChart from '@/components/charts/SentimentChart'
import AIInsights from '@/components/AIInsights'
import FeedbackTable from '@/components/FeedbackTable'

// Mock data for demo purposes
const MOCK_STATS = {
    avgRating: 3.2,
    sentimentDist: { positive: 45, neutral: 35, negative: 20 },
    estimatedWaste: 23.5
}

export default function DashboardPage() {
    const router = useRouter()
    const [feedbackData, setFeedbackData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [checking, setChecking] = useState(true)

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
            fetchFeedback()
        }
    }, [checking])

    const fetchFeedback = async () => {
        try {
            const q = query(
                collection(db, 'feedback'),
                orderBy('timestamp', 'desc'),
                limit(10)
            )
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setFeedbackData(data)
        } catch (error) {
            console.error('Error fetching feedback:', error)
            // Continue with empty data if Firebase is not configured
            setFeedbackData([])
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
                    avgRating={MOCK_STATS.avgRating}
                    sentimentDist={MOCK_STATS.sentimentDist}
                    estimatedWaste={MOCK_STATS.estimatedWaste}
                />

                {/* Charts Section */}
                <div className="mt-12 grid lg:grid-cols-2 gap-8">
                    <RatingsChart />
                    <SentimentChart sentimentDist={MOCK_STATS.sentimentDist} />
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

