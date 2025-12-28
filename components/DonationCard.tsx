'use client'

import { useState } from 'react'
import { Check, Package, UtensilsCrossed, Phone, Mail, PenSquare, Clock4, X } from 'lucide-react'
import { NGO } from '@/lib/ngo'
import toast from 'react-hot-toast'

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
            toast.success('Donation request submitted successfully! 🎉', {
                duration: 3000,
            })
            setTimeout(() => onClose(), 2000)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit donation'
            setError(errorMessage)
            toast.error(errorMessage, {
                duration: 4000,
            })
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-2xl border border-white">
                <div className="mb-6 flex justify-center">
                    <div className="bg-emerald-100 rounded-full p-4 animate-bounce">
                        <Check className="w-12 h-12 text-emerald-600" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Confirmed!</h3>
                <p className="text-slate-500 mb-6">Redirecting to your dashboard...</p>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            {/* Modal Container: Fixed max-width removes the "extra space" issue */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[500px] overflow-hidden border border-white/50 animate-in zoom-in-95 duration-200">
                
                {/* Reference Header Style */}
                <div className="bg-[#10b981] p-8 text-white relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold leading-tight">Food For Change</h3>
                            <p className="text-emerald-50 text-sm mt-1 opacity-90">{ngo.address || '456 Marine Drive, Mumbai'}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Weight and Type Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Weight (KG)</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Type</label>
                            <select
                                value={formData.foodType}
                                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800 cursor-pointer"
                            >
                                {FOOD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Notes Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Additional Notes</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="e.g. Fresh meals packed in containers"
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 min-h-[100px] resize-none"
                        />
                    </div>

                    {/* Schedule Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Pickup Schedule</label>
                        <input
                            type="datetime-local"
                            value={formData.pickupTime}
                            onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 font-medium"
                            required
                        />
                    </div>

                    {/* Reference Support Line Pill */}
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-emerald-800 font-bold text-sm">
                            <Phone className="w-4 h-4" />
                            <span>+91-98765-43211</span>
                        </div>
                        <span className="text-[9px] font-black bg-[#10b981] text-white px-2 py-1 rounded-md tracking-tighter uppercase">Support Line</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-4 border border-slate-200 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-all text-[11px] uppercase tracking-[0.2em]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-4 bg-[#10b981] hover:bg-emerald-600 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 text-[11px] uppercase tracking-[0.15em]"
                        >
                            {loading ? 'Submitting...' : 'Confirm Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}