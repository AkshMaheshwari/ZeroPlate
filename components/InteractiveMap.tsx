'use client'

import { useEffect, useRef } from 'react'
import { NGO } from '@/lib/ngo'
import { getAvailableCapacity } from '@/lib/location'
import 'leaflet/dist/leaflet.css'

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
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mapContainer.current) return

    let L: any

    ;(async () => {
      L = (await import('leaflet')).default

      if (!mapRef.current) {
        mapRef.current = L.map(mapContainer.current).setView(
          [userLocation?.lat ?? 28.6139, userLocation?.lon ?? 77.209],
          12
        )

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapRef.current)
      }

      // Clear markers
      Object.values(markersRef.current).forEach((m: any) =>
        mapRef.current.removeLayer(m)
      )
      markersRef.current = {}

      ngos.forEach((ngo) => {
        const available = getAvailableCapacity(ngo)
        const marker = L.circleMarker([ngo.latitude, ngo.longitude], {
          radius: 10,
          fillColor: '#22c55e',
          color: '#16a34a',
          fillOpacity: 0.8,
        })
          .on('click', () => onSelectNGO(ngo))
          .addTo(mapRef.current)

        if (selectedNGO?.id === ngo.id) marker.openPopup()
        markersRef.current[ngo.id] = marker
      })
    })()
  }, [ngos, userLocation, selectedNGO, onSelectNGO])

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
