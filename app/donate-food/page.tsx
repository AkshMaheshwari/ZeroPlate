'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Package, UtensilsCrossed, TrendingUp, Map, List, Search } from 'lucide-react'
import { onAuthChange } from '@/lib/auth'
import { MOCK_NGOS, NGO } from '@/lib/ngo'
import { getUserLocation, filterAndSortNGOs, FilterCriteria } from '@/lib/location'
import InteractiveMap from '@/components/InteractiveMap'
import NearbyNGOs from '@/components/NearbyNGOs'
import DonationCard from '@/components/DonationCard'
import ImpactMetricsComponent from '@/components/ImpactMetrics'

export default function DonateFoodPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
    const [filteredNGOs, setFilteredNGOs] = useState<(NGO & { distance?: number })[]>([])
    const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null)
    const [showDonationCard, setShowDonationCard] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userAuthenticated, setUserAuthenticated] = useState(false)

    const [maxDistance, setMaxDistance] = useState(20)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [minCapacity, setMinCapacity] = useState(0)
    const [activeTab, setActiveTab] = useState<'list' | 'impact'>('list')

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!mounted) return
        const unsubscribe = onAuthChange((user) => {
            if (!user) router.push('/login')
            else setUserAuthenticated(true)
        })
        return () => unsubscribe()
    }, [router, mounted])

    useEffect(() => {
        if (!mounted || !userAuthenticated) return
        const initializeLocation = async () => {
            const location = await getUserLocation()
            setUserLocation(location)
            if (location) {
                const ngosByDistance = MOCK_NGOS.map((ngo) => {
                    const dist = Math.sqrt(Math.pow(ngo.latitude - location.lat, 2) + Math.pow(ngo.longitude - location.lon, 2)) * 111;
                    return { ...ngo, distance: dist }
                }).sort((a, b) => (a.distance || 0) - (b.distance || 0))
                setFilteredNGOs(ngosByDistance)
            } else {
                setFilteredNGOs(MOCK_NGOS as any)
            }
            setLoading(false)
        }
        initializeLocation()
    }, [userAuthenticated, mounted])

    const handleFilterChange = () => {
        if (userLocation) {
            let filtered = MOCK_NGOS.map((ngo) => {
                const dist = Math.sqrt(Math.pow(ngo.latitude - userLocation.lat, 2) + Math.pow(ngo.longitude - userLocation.lon, 2)) * 111;
                return { ...ngo, distance: dist }
            })
            filtered = filtered.filter((ngo) => (ngo.distance || 0) <= maxDistance)
            filtered = filtered.filter((ngo) => ngo.capacity - ngo.currentLoad >= minCapacity)
            if (selectedCategories.length > 0) {
                filtered = filtered.filter((ngo) => selectedCategories.some((cat) => ngo.foodCategories.includes(cat)))
            }
            setFilteredNGOs(filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0)))
        }
    }

    const handleSelectNGO = (ngo: NGO) => {
        setSelectedNGO(ngo)
        setShowDonationCard(true)
    }

    const allFoodCategories = ['cooked', 'raw', 'packaged', 'fruits', 'vegetables']

    if (!mounted || !userAuthenticated || loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center"><div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
    }

    return (
        <div className="relative min-h-screen bg-[#f1f5f9] overflow-x-hidden">
            {/* --- DOODLE BACKGROUND --- */}
            <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none select-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="heavy-doodle" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
                        <path d="M40 40 L70 40 L55 70 Z" stroke="#059669" strokeWidth="3" fill="none" />
                        <path d="M120 50 q15 -20 30 0 v10 h-30 Z" stroke="#0f172a" strokeWidth="3" fill="none"/>
                        <path d="M40 120 h25 v20 q0 8 -8 8 h-9 q-8 0 -8 -8 Z" stroke="#0f172a" strokeWidth="3" fill="none" />
                        <path d="M130 120 l20 20 M150 120 l-20 20" stroke="#059669" strokeWidth="3" />
                        <circle cx="90" cy="90" r="3" fill="#059669"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#heavy-doodle)" />
                </svg>
            </div>

            {/* Header */}
            <div className="relative z-10 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
                        Find <span className="text-emerald-600">NGOs</span> Nearby
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Make an impact with your surplus food</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
                {/* Custom Tabs */}
                <div className="flex justify-center gap-2 mb-10">
                    {[ { id: 'list', label: 'Find NGOs', icon: Map }, { id: 'impact', label: 'Our Impact', icon: TrendingUp } ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 border-2 ${
                                activeTab === tab.id 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' 
                                : 'bg-white text-slate-400 border-white hover:border-slate-200'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'list' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar - Bento Style Filters */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white sticky top-8">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Search className="w-4 h-4" /></div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filters</h3>
                                </div>

                                <div className="space-y-8">
                                    {/* Distance */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Radius: {maxDistance}km</label>
                                        <input type="range" min="1" max="50" value={maxDistance} onChange={(e) => { setMaxDistance(parseInt(e.target.value)); handleFilterChange(); }} className="w-full accent-emerald-500" />
                                    </div>

                                    {/* Capacity */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min Capacity: {minCapacity}kg</label>
                                        <input type="range" min="0" max="500" step="50" value={minCapacity} onChange={(e) => { setMinCapacity(parseInt(e.target.value)); handleFilterChange(); }} className="w-full accent-emerald-500" />
                                    </div>

                                    {/* Food Categories */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Food Types</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {allFoodCategories.map((cat) => (
                                                <label key={cat} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedCategories.includes(cat) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>
                                                    <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat)} onChange={(e) => {
                                                        const newCats = e.target.checked ? [...selectedCategories, cat] : selectedCategories.filter(c => c !== cat);
                                                        setSelectedCategories(newCats); handleFilterChange();
                                                    }} />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="bg-slate-900 rounded-2xl p-4 text-center">
                                            <p className="text-white text-2xl font-black">{filteredNGOs.length}</p>
                                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">NGOs Found</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Section */}
                        <div className="lg:col-span-3 space-y-8">
                            {!showDonationCard && (
                                <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-white overflow-hidden h-[400px]">
                                    <InteractiveMap 
                                        ngos={filteredNGOs} 
                                        userLocation={userLocation || undefined} 
                                        onSelectNGO={handleSelectNGO} 
                                        selectedNGO={selectedNGO} 
                                    />
                                </div>
                            )}

                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight ml-4 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-emerald-500 rounded-full"></div> Nearby Partners
                                </h3>
                                <NearbyNGOs ngos={filteredNGOs} onSelectNGO={handleSelectNGO} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'impact' && (
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white">
                        <ImpactMetricsComponent loading={false} />
                    </div>
                )}
            </div>

            {/* Donation Modal */}
            {showDonationCard && selectedNGO && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden border-4 border-white">
                        <DonationCard
                            ngo={selectedNGO}
                            onClose={() => { setShowDonationCard(false); setSelectedNGO(null); }}
                            onSubmit={async (data) => {
                                await new Promise(r => setTimeout(r, 1500));
                                setShowDonationCard(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}