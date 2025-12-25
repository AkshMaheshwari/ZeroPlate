'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NGO } from '@/lib/ngo'
import { getAvailableCapacity } from '@/lib/location'

interface MapProps {
    ngos: (NGO & { distance?: number })[]
    userLocation?: { lat: number; lon: number }
    onSelectNGO: (ngo: NGO) => void
    selectedNGO?: NGO | null
}

export default function InteractiveMap({
    ngos,
    userLocation,
    onSelectNGO,
    selectedNGO,
}: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<L.Map | null>(null)
    // Use CircleMarker because we render circle-based markers instead of icon-based markers
    const markersRef = useRef<{ [key: string]: L.CircleMarker }>({})

    useEffect(() => {
        if (!mapContainer.current) return

        // Initialize map
        if (!map.current) {
            map.current = L.map(mapContainer.current).setView(
                [userLocation?.lat || 28.6139, userLocation?.lon || 77.209],
                12
            )

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map.current)

            // Add user location marker
            if (userLocation) {
                L.circleMarker([userLocation.lat, userLocation.lon], {
                    radius: 8,
                    fillColor: '#3b82f6',
                    color: '#1e40af',
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.8,
                })
                    .bindPopup('📍 Your Location')
                    .addTo(map.current)
            }
        }

        // Clear existing markers
        Object.values(markersRef.current).forEach((marker) => {
            map.current?.removeLayer(marker)
        })
        markersRef.current = {}

        // Add NGO markers
        ngos.forEach((ngo) => {
            const available = getAvailableCapacity(ngo)
            const capacityPercent = (available / ngo.capacity) * 100

            let color = '#22c55e' // green
            if (capacityPercent < 50) color = '#eab308' // yellow
            if (capacityPercent < 25) color = '#ef4444' // red

            const marker = L.circleMarker([ngo.latitude, ngo.longitude], {
                radius: 12,
                fillColor: color,
                color: color,
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
            })

            const popupContent = `
                <div style="min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${ngo.name}</h3>
                    <p style="margin: 4px 0; font-size: 12px; color: #666;">${ngo.address}</p>
                    <div style="margin: 8px 0; padding: 8px; background: #f0f0f0; border-radius: 4px;">
                        <p style="margin: 0; font-size: 12px;">
                            <strong>Capacity:</strong> ${available}/${ngo.capacity}kg
                        </p>
                        <p style="margin: 0; font-size: 12px;">
                            <strong>Response:</strong> ${ngo.responseTime}m
                        </p>
                        <p style="margin: 0; font-size: 12px;">
                            <strong>Rating:</strong> ${ngo.rating}★
                        </p>
                    </div>
                    <button onclick="window.ngoSelectCallback('${ngo.id}')" style="width: 100%; padding: 8px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Select & Donate
                    </button>
                </div>
            `

            marker.bindPopup(popupContent)

            marker.on('click', () => {
                onSelectNGO(ngo)
            })

            if (selectedNGO?.id === ngo.id) {
                marker.openPopup()
            }

            marker.addTo(map.current!)
            markersRef.current[ngo.id] = marker
        })

        // Store callback for popup button
        ;(window as any).ngoSelectCallback = (ngoId: string) => {
            const ngo = ngos.find((n) => n.id === ngoId)
            if (ngo) onSelectNGO(ngo)
        }

        // Fit bounds if NGOs exist
        if (ngos.length > 0 && map.current) {
            const group = new L.FeatureGroup(Object.values(markersRef.current))
            map.current.fitBounds(group.getBounds().pad(0.1))
        }
    }, [ngos, userLocation, selectedNGO, onSelectNGO])

    return (
        <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    )
}
