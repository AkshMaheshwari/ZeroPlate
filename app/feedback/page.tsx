'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { onAuthChange } from '@/lib/auth'

const EMOJI_RATINGS = [
    { emoji: '😄', label: 'Loved it!', value: 4 },
    { emoji: '🙂', label: 'Good', value: 3 },
    { emoji: '😐', label: 'Okay', value: 2 },
    { emoji: '😞', label: 'Poor', value: 1 },
]

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']

export default function FeedbackPage() {
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const router = useRouter()

    const [mealType, setMealType] = useState('')
    const [dishName, setDishName] = useState('')
    const [rating, setRating] = useState<number | null>(null)
    const [voiceNote, setVoiceNote] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // AUTH GUARD: Redirect to login if not signed in
    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            if (!user) {
                router.push('/login')
            } else {
                setCurrentUser(user)
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mealType || !dishName || rating === null) {
            alert('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            if (!currentUser) return;

            await addDoc(collection(db, 'feedback'), {
                uid: currentUser.uid,
                email: currentUser.email,
                mealType,
                dishName,
                rating,
                hasVoiceNote: voiceNote,
                timestamp: serverTimestamp(),
                sentiment: rating >= 3 ? 'positive' : rating === 2 ? 'neutral' : 'negative'
            })

            setShowSuccess(true)
            setTimeout(() => {
                setMealType('')
                setDishName('')
                setRating(null)
                setVoiceNote(false)
                setShowSuccess(false)
            }, 2500)

        } catch (error) {
            console.error('Error submitting feedback:', error)
            alert('Failed to submit feedback.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    )

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Share Your Feedback</h1>
                    <p className="text-gray-600 italic text-sm">Logging feedback as: {currentUser?.email}</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Meal Type</label>
                            <select 
                                value={mealType} 
                                onChange={(e) => setMealType(e.target.value)}
                                className="w-full p-3 border rounded-xl"
                            >
                                <option value="">Select a meal</option>
                                {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Dish Name</label>
                            <input 
                                type="text" 
                                value={dishName} 
                                onChange={(e) => setDishName(e.target.value)}
                                className="w-full p-3 border rounded-xl"
                                placeholder="What did you eat?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-4">Rating</label>
                            <div className="grid grid-cols-4 gap-2">
                                {EMOJI_RATINGS.map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => setRating(item.value)}
                                        className={`p-4 rounded-xl border-2 transition-all ${rating === item.value ? 'border-primary-600 bg-primary-50' : 'border-gray-100'}`}
                                    >
                                        <div className="text-3xl">{item.emoji}</div>
                                        <div className="text-xs mt-1 font-bold">{item.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>

                    {showSuccess && (
                        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-center font-bold">
                            Success! Thank you for your feedback.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}