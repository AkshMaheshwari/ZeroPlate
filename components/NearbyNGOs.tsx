'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle } from 'lucide-react'
import { NGO } from '@/lib/ngo'
import { formatDistance, getAvailableCapacity } from '@/lib/location'

interface NearbyNGOsProps {
    ngos: (NGO & { distance?: number })[]
    onSelectNGO: (ngo: NGO) => void
}

export default function NearbyNGOs({ ngos, onSelectNGO }: NearbyNGOsProps) {
    return (
        <div className="space-y-3">
            {ngos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No NGOs found in your area</p>
                    <p className="text-sm mt-2">Try increasing the search radius</p>
                </div>
            ) : (
                ngos.map((ngo) => {
                    const availableCapacity = getAvailableCapacity(ngo)
                    const capacityPercent = (availableCapacity / ngo.capacity) * 100

                    return (
                        <div
                            key={ngo.id}
                            onClick={() => onSelectNGO(ngo)}
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                                    <p className="text-sm text-gray-600">{ngo.address}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-primary-600">
                                        {ngo.distance ? formatDistance(ngo.distance) : 'N/A'}
                                    </div>
                                    {ngo.rating && (
                                        <div className="text-sm text-yellow-500">★ {ngo.rating}</div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3">{ngo.description}</p>

                            {/* Capacity Bar */}
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-gray-700">
                                        Capacity Available
                                    </span>
                                    <span className="text-xs font-bold text-primary-600">
                                        {availableCapacity}kg / {ngo.capacity}kg
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${
                                            capacityPercent > 50
                                                ? 'bg-green-500'
                                                : capacityPercent > 25
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                        }`}
                                        style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                                <div className="bg-blue-50 rounded p-2">
                                    <p className="text-gray-600">Response</p>
                                    <p className="font-semibold text-blue-600">{ngo.responseTime}m</p>
                                </div>
                                <div className="bg-purple-50 rounded p-2">
                                    <p className="text-gray-600">Categories</p>
                                    <p className="font-semibold text-purple-600">
                                        {ngo.foodCategories.length}
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded p-2">
                                    <p className="text-gray-600">Status</p>
                                    <p className="font-semibold text-green-600">
                                        {ngo.isActive ? 'Active' : 'Offline'}
                                    </p>
                                </div>
                            </div>

                            {/* Food Categories */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {ngo.foodCategories.map((cat) => (
                                    <span
                                        key={cat}
                                        className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            {/* Contact Options */}
                            <div className="flex gap-2 text-sm">
                                <a
                                    href={`tel:${ngo.phone}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 bg-blue-100 text-blue-700 rounded px-3 py-2 text-center hover:bg-blue-200 transition-colors font-medium flex items-center justify-center gap-1"
                                >
                                    <Phone className="w-4 h-4" />Call
                                </a>
                                <a
                                    href={`mailto:${ngo.email}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 bg-green-100 text-green-700 rounded px-3 py-2 text-center hover:bg-green-200 transition-colors font-medium flex items-center justify-center gap-1"
                                >
                                    📧 Email
                                </a>
                                <a
                                    href={`https://wa.me/${ngo.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 bg-teal-100 text-teal-700 rounded px-3 py-2 text-center hover:bg-teal-200 transition-colors font-medium flex items-center justify-center gap-1"
                                >
                                    <MessageCircle className="w-4 h-4" />WhatsApp
                                </a>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}
