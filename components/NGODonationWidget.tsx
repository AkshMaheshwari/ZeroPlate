'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { MOCK_NGOS } from '@/lib/ngo'

export default function NGODonationWidget() {
    const [activeDonations] = useState(3)
    const [totalDonated] = useState(1250) // kg

    const topNGOs = MOCK_NGOS.slice(0, 3)

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5" />NGO Donations</h3>
                <Link
                    href="/donate-food"
                    className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                    View All
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Active Donations</p>
                    <p className="text-2xl font-bold text-green-600">{activeDonations}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Total Donated</p>
                    <p className="text-2xl font-bold text-blue-600">{totalDonated}kg</p>
                </div>
            </div>

            {/* Top NGOs */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Top Partners</h4>
                {topNGOs.map((ngo) => (
                    <div key={ngo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                            <p className="text-xs text-gray-600">Rating: {ngo.rating}★</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-primary-600">
                                {ngo.capacity - ngo.currentLoad}kg free
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Link
                href="/donate-food"
                className="mt-6 w-full bg-gradient-to-r from-primary-600 to-green-600 hover:from-primary-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg text-center transition-all block"
            >
                Start Donating Food →
            </Link>
        </div>
    )
}
