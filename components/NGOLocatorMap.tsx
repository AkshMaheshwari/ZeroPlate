'use client'

import { useEffect, useRef, useState } from 'react'
import { NGO } from '@/lib/ngo'
import { formatDistance, getAvailableCapacity } from '@/lib/location'

interface NGOLocatorMapProps {
    ngos: (NGO & { distance?: number })[]
    userLocation?: { lat: number; lon: number }
    onSelectNGO: (ngo: NGO) => void
    selectedNGO?: NGO | null
}

export default function NGOLocatorMap({
    ngos,
    userLocation,
    onSelectNGO,
    selectedNGO,
}: NGOLocatorMapProps) {
    const [mapHtml, setMapHtml] = useState<string>('')

    // Generate a simple HTML map with SVG overlay (no external map library needed)
    useEffect(() => {
        generateSimpleMap()
    }, [ngos, userLocation, selectedNGO])

    const generateSimpleMap = () => {
        // For hackathon, we'll use a simple card-based map view instead of complex libraries
        const html = `
            <div class="relative w-full h-full bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
                <div class="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" stroke-width="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <p class="text-center text-gray-600">
                        <span class="text-4xl mb-2 block">🗺️</span>
                        Interactive map showing ${ngos.length} nearby NGOs
                    </p>
                </div>
            </div>
        `
        setMapHtml(html)
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Map Container */}
            <div className="h-96 bg-gray-100 relative">
                <div dangerouslySetInnerHTML={{ __html: mapHtml }} className="w-full h-full" />

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
                    <h4 className="font-semibold text-gray-900 mb-3">📍 Capacity Status</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0"></div>
                            <span className="text-gray-700">High Capacity (50%+)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                            <span className="text-gray-700">Medium (25-50%)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0"></div>
                            <span className="text-gray-700">Low (&lt;25%)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span className="text-gray-700">Your location</span>
                        </div>
                    </div>
                </div>

                {/* Selected NGO Info */}
                {selectedNGO && (
                    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                        <div className="mb-2">
                            <h4 className="font-semibold text-gray-900">{selectedNGO.name}</h4>
                            <p className="text-xs text-gray-600">{selectedNGO.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p className="text-gray-600">Distance</p>
                                <p className="font-semibold text-primary-600">
                                    {selectedNGO.distance
                                        ? formatDistance(selectedNGO.distance)
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Available</p>
                                <p className="font-semibold text-primary-600">
                                    {getAvailableCapacity(selectedNGO)}kg
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Box for Simple Map */}
                <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-lg shadow-lg p-3 max-w-xs text-sm">
                    <p className="font-semibold mb-1">📊 Map Summary</p>
                    <p>{ngos.length} NGOs nearby • Sorted by distance</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-50 border-t border-gray-200 p-4">
                <p className="text-sm text-gray-600 text-center">
                    💡 Tip: Scroll down to see detailed list of NGOs. Use filters to narrow down by capacity,
                    distance, or food categories.
                </p>
            </div>
        </div>
    )
}
