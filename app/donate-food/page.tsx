'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Package, UtensilsCrossed, TrendingUp, Map, List } from 'lucide-react'
import { onAuthChange } from '@/lib/auth'
import { MOCK_NGOS, NGO } from '@/lib/ngo'
import { getUserLocation, filterAndSortNGOs, FilterCriteria } from '@/lib/location'
import InteractiveMap from '@/components/InteractiveMap'
import NearbyNGOs from '@/components/NearbyNGOs'
import DonationCard from '@/components/DonationCard'
import ImpactMetricsComponent from '@/components/ImpactMetrics'

export default function DonateFoodPage() {
    const router = useRouter()
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
    const [filteredNGOs, setFilteredNGOs] = useState<(NGO & { distance?: number })[]>([])
    const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null)
    const [showDonationCard, setShowDonationCard] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userAuthenticated, setUserAuthenticated] = useState(false)

    // Filter states
    const [maxDistance, setMaxDistance] = useState(20)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [minCapacity, setMinCapacity] = useState(0)
    const [activeTab, setActiveTab] = useState<'list' | 'impact'>('list')

    // Auth check
    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            if (!user) {
                router.push('/login')
            } else {
                setUserAuthenticated(true)
            }
        })
        return () => unsubscribe()
    }, [router])

    // Get user location and filter NGOs
    useEffect(() => {
        const initializeLocation = async () => {
            // Get user location
            const location = await getUserLocation()
            setUserLocation(location)
            console.log('User location:', location)
            console.log('Mock NGOs count:', MOCK_NGOS.length)

            // Show all NGOs initially with distance calculations
            if (location) {
                const ngosByDistance = MOCK_NGOS.map((ngo) => {
                    const dist = Math.sqrt(
                        Math.pow(ngo.latitude - location.lat, 2) +
                        Math.pow(ngo.longitude - location.lon, 2)
                    ) * 111; // Rough conversion to km
                    return { ...ngo, distance: dist }
                }).sort((a, b) => (a.distance || 0) - (b.distance || 0))
                
                console.log('NGOs with distances:', ngosByDistance)
                setFilteredNGOs(ngosByDistance)
            } else {
                // Fallback: show all NGOs without distance
                setFilteredNGOs(MOCK_NGOS as any)
            }
            setLoading(false)
        }

        if (userAuthenticated) {
            initializeLocation()
        }
    }, [userAuthenticated])

    // Apply filters
    const applyFilters = (
        location: { lat: number; lon: number },
        criteria: FilterCriteria
    ) => {
        const filtered = filterAndSortNGOs(MOCK_NGOS, location, {
            ...criteria,
            onlyActive: true,
        })
        setFilteredNGOs(filtered)
    }

    const handleFilterChange = () => {
        if (userLocation) {
            // Filter NGOs based on criteria
            let filtered = MOCK_NGOS.map((ngo) => {
                const dist = Math.sqrt(
                    Math.pow(ngo.latitude - userLocation.lat, 2) +
                    Math.pow(ngo.longitude - userLocation.lon, 2)
                ) * 111; // Rough conversion to km
                return { ...ngo, distance: dist }
            })

            // Apply distance filter
            filtered = filtered.filter((ngo) => (ngo.distance || 0) <= maxDistance)

            // Apply capacity filter
            filtered = filtered.filter(
                (ngo) => ngo.capacity - ngo.currentLoad >= minCapacity
            )

            // Apply food category filter
            if (selectedCategories.length > 0) {
                filtered = filtered.filter((ngo) =>
                    selectedCategories.some((cat) =>
                        ngo.foodCategories.includes(cat)
                    )
                )
            }

            // Sort by distance
            filtered = filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0))

            console.log('Filtered result:', filtered.length, 'NGOs')
            setFilteredNGOs(filtered)
        }
    }

    const handleSelectNGO = (ngo: NGO) => {
        setSelectedNGO(ngo)
        setShowDonationCard(true)
    }

    const handleDonationSubmit = async (data: any) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log('Donation submitted:', data)
        // In real app, save to Firestore
    }

    const allFoodCategories = [
        'cooked',
        'raw',
        'packaged',
        'fruits',
        'vegetables',
    ]

    if (!userAuthenticated || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-4"><TrendingUp className="w-12 h-12 animate-spin text-primary-600 mx-auto" /></div>
                    <p className="text-gray-600">Loading nearby NGOs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-green-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">Connect with NGOs</h1>
                    <p className="text-lg text-white/90">
                        Donate excess food to nearby NGOs and make a difference
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-6 py-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'list'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Map className="w-5 h-5" />Find NGOs
                    </button>
                    <button
                        onClick={() => setActiveTab('impact')}
                        className={`px-6 py-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'impact'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <TrendingUp className="w-5 h-5" />Impact Metrics
                    </button>
                </div>

                {/* List Tab */}
                {activeTab === 'list' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar - Filters */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 Filters</h3>

                                {/* Distance Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />Distance: {maxDistance}km
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={maxDistance}
                                        onChange={(e) => {
                                            setMaxDistance(parseInt(e.target.value))
                                            handleFilterChange()
                                        }}
                                        className="w-full"
                                    />
                                </div>

                                {/* Capacity Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Package className="w-4 h-4" />Min Available: {minCapacity}kg
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        step="50"
                                        value={minCapacity}
                                        onChange={(e) => {
                                            setMinCapacity(parseInt(e.target.value))
                                            handleFilterChange()
                                        }}
                                        className="w-full"
                                    />
                                </div>

                                {/* Food Categories */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <UtensilsCrossed className="w-4 h-4" />Food Types
                                    </label>
                                    <div className="space-y-2">
                                        {allFoodCategories.map((category) => (
                                            <label key={category} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={(e) => {
                                                        const newCategories = e.target.checked
                                                            ? [...selectedCategories, category]
                                                            : selectedCategories.filter((c) => c !== category)
                                                        setSelectedCategories(newCategories)
                                                    }}
                                                    className="rounded"
                                                />
                                                <span className="text-sm text-gray-700 capitalize">
                                                    {category}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <button
                                    onClick={handleFilterChange}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Apply Filters
                                </button>

                                {/* Stats */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" />Found:</p>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {filteredNGOs.length}
                                    </p>
                                    <p className="text-xs text-gray-600">NGOs nearby</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Map - Hidden when form is shown */}
                            {!showDonationCard && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Map className="w-6 h-6" />Interactive Map</h3>
                                    <InteractiveMap
                                        ngos={filteredNGOs}
                                        userLocation={userLocation || undefined}
                                        onSelectNGO={handleSelectNGO}
                                        selectedNGO={selectedNGO}
                                    />
                                </div>
                            )}

                            {/* NGO List */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <List className="w-6 h-6" />Nearby NGOs ({filteredNGOs.length})
                                </h3>
                                <NearbyNGOs
                                    ngos={filteredNGOs}
                                    onSelectNGO={handleSelectNGO}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Impact Tab */}
                {activeTab === 'impact' && (
                    <div>
                        <ImpactMetricsComponent loading={false} />
                    </div>
                )}
            </div>

            {/* Donation Modal */}
            {showDonationCard && selectedNGO && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <DonationCard
                        ngo={selectedNGO}
                        onClose={() => {
                            setShowDonationCard(false)
                            setSelectedNGO(null)
                        }}
                        onSubmit={handleDonationSubmit}
                    />
                </div>
            )}
        </div>
    )
}
