'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, signInAnonymouslyHelper } from '@/lib/firebase'

const EMOJI_RATINGS = [
    { emoji: '😄', label: 'Loved it!', value: 4 },
    { emoji: '🙂', label: 'Good', value: 3 },
    { emoji: '😐', label: 'Okay', value: 2 },
    { emoji: '😞', label: 'Poor', value: 1 },
]

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']

export default function FeedbackPage() {
    const [mealType, setMealType] = useState('')
    const [dishName, setDishName] = useState('')
    const [rating, setRating] = useState<number | null>(null)
    const [voiceNote, setVoiceNote] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!mealType || !dishName || rating === null) {
            alert('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            // Ensure user is signed in anonymously
            await signInAnonymouslyHelper()

            // Submit feedback to Firestore
            await addDoc(collection(db, 'feedback'), {
                mealType,
                dishName,
                rating,
                hasVoiceNote: voiceNote,
                timestamp: serverTimestamp(),
                sentiment: rating >= 3 ? 'positive' : rating === 2 ? 'neutral' : 'negative'
            })

            // Show success message
            setShowSuccess(true)

            // Reset form
            setTimeout(() => {
                setMealType('')
                setDishName('')
                setRating(null)
                setVoiceNote(false)
                setShowSuccess(false)
            }, 2500)

        } catch (error) {
            console.error('Error submitting feedback:', error)
            alert('Failed to submit feedback. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block p-4 bg-primary-100 rounded-2xl mb-4">
                        <span className="text-5xl">📝</span>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-3">Share Your Feedback</h1>
                    <p className="text-xl text-gray-600">Help us reduce food waste with your honest opinion</p>
                </div>

                {/* Feedback Form Card */}
                <div className="card p-10 border-2 border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Meal Type Dropdown */}
                        <div>
                            <label htmlFor="mealType" className="block text-lg font-semibold text-gray-900 mb-3">
                                Meal Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="mealType"
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value)}
                                className="input text-lg"
                                required
                            >
                                <option value="">Select a meal</option>
                                {MEAL_TYPES.map((meal) => (
                                    <option key={meal} value={meal}>{meal}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dish Name Input */}
                        <div>
                            <label htmlFor="dishName" className="block text-lg font-semibold text-gray-900 mb-3">
                                Dish Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="dishName"
                                type="text"
                                value={dishName}
                                onChange={(e) => setDishName(e.target.value)}
                                placeholder="e.g., Paneer Butter Masala"
                                className="input text-lg"
                                required
                            />
                        </div>

                        {/* Emoji Rating */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-900 mb-4">
                                How was it? <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {EMOJI_RATINGS.map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => setRating(item.value)}
                                        className={`p-6 rounded-2xl border-3 transition-all transform hover:scale-105 active:scale-95 ${rating === item.value
                                                ? 'border-primary-600 bg-primary-50 shadow-xl ring-4 ring-primary-200'
                                                : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="text-6xl mb-3">{item.emoji}</div>
                                        <div className="text-base font-semibold text-gray-900">{item.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Voice Feedback (Placeholder UI) */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-900 mb-3">
                                Voice Feedback <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setVoiceNote(!voiceNote)}
                                className={`w-full sm:w-auto px-8 py-4 rounded-xl border-2 transition-all flex items-center justify-center space-x-3 font-semibold ${voiceNote
                                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg'
                                        : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                </svg>
                                <span className="text-base">{voiceNote ? '🎤 Voice note added' : 'Add voice note'}</span>
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !mealType || !dishName || rating === null}
                                className="btn-primary w-full text-lg py-5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    '✨ Submit Feedback'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="mt-8 p-6 bg-green-50 border-2 border-green-500 rounded-2xl">
                            <div className="flex items-center justify-center space-x-3 text-green-700 font-bold text-lg">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Feedback submitted successfully!</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Cards */}
                <div className="mt-8 grid sm:grid-cols-2 gap-5">
                    <div className="card p-6 border border-gray-100">
                        <div className="flex items-start space-x-4">
                            <span className="text-3xl">⚡</span>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick & Easy</h3>
                                <p className="text-gray-600">Takes less than 30 seconds</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-6 border border-gray-100">
                        <div className="flex items-start space-x-4">
                            <span className="text-3xl">🌍</span>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Make an Impact</h3>
                                <p className="text-gray-600">Help reduce food waste</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
