'use client'

import { useState } from 'react'
import { Check, Package, UtensilsCrossed, Phone, Mail } from 'lucide-react'
import { NGO } from '@/lib/ngo'

interface DonationCardProps {
    ngo: NGO
    onClose: () => void
    onSubmit: (data: DonationFormData) => Promise<void>
}

export interface DonationFormData {
    quantity: number
    foodType: string
    description: string
    pickupTime: string
}

const FOOD_TYPES = [
    'Cooked Rice',
    'Cooked Vegetables',
    'Bread/Roti',
    'Dal/Curry',
    'Packaged Snacks',
    'Fruits',
    'Raw Vegetables',
    'Mixed Meal',
    'Other',
]

export default function DonationCard({ ngo, onClose, onSubmit }: DonationCardProps) {
    const [formData, setFormData] = useState<DonationFormData>({
        quantity: 10,
        foodType: 'Cooked Rice',
        description: '',
        pickupTime: new Date().toISOString().slice(0, 16),
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await onSubmit(formData)
            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit donation')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <div className="text-center">
                    <div className="mb-4 flex justify-center"><Check className="w-16 h-16 text-green-600" /></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Donation Confirmed!</h3>
                    <p className="text-gray-600 mb-6">
                        {ngo.name} will contact you within {ngo.responseTime} minutes
                    </p>
                    <div className="bg-green-50 rounded-lg p-4 mb-6 text-sm text-green-700 space-y-2">
                        <p className="font-semibold">Donation Details:</p>
                        <p className="flex items-center gap-2"><Package className="w-4 h-4" />Quantity: {formData.quantity}kg</p>
                        <p className="flex items-center gap-2"><UtensilsCrossed className="w-4 h-4" />Type: {formData.foodType}</p>
                        <p className="flex items-center gap-2">⏰ Pickup: {new Date(formData.pickupTime).toLocaleString()}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold">{ngo.name}</h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-2xl font-light"
                    >
                        ×
                    </button>
                </div>
                <p className="text-sm text-white/90">{ngo.address}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />Quantity (kg)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max={ngo.capacity - ngo.currentLoad}
                        value={formData.quantity}
                        onChange={(e) =>
                            setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                        Available capacity: {ngo.capacity - ngo.currentLoad}kg
                    </p>
                </div>

                {/* Food Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4" />Food Type
                    </label>
                    <select
                        value={formData.foodType}
                        onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    >
                        {FOOD_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📝 Description (optional)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="e.g., Fresh cooked meals from today's lunch"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={3}
                    ></textarea>
                </div>

                {/* Pickup Time */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ⏰ Preferred Pickup Time
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />
                    <p className="text-xs text-gray-600 mt-1">Response time: {ngo.responseTime}m</p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 space-y-2">
                    <p className="font-semibold flex items-center gap-2"><Phone className="w-4 h-4" />Contact Information:</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" />{ngo.phone}</p>
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4" />{ngo.email}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Confirm Donation'}
                    </button>
                </div>
            </form>
        </div>
    )
}
