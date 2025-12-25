// Location and distance calculation utilities
import { NGO } from './ngo';

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Filter and sort NGOs based on criteria
export interface FilterCriteria {
    maxDistance?: number; // km
    foodCategories?: string[];
    minCapacity?: number; // kg available
    responseTimeMax?: number; // minutes
    onlyActive?: boolean;
}

export function filterAndSortNGOs(
    ngos: NGO[],
    userLocation: { lat: number; lon: number },
    criteria: FilterCriteria = {}
): NGO[] {
    const {
        maxDistance = 20,
        foodCategories = [],
        minCapacity = 0,
        responseTimeMax = 120,
        onlyActive = true,
    } = criteria;

    return ngos
        .map((ngo) => {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lon,
                ngo.latitude,
                ngo.longitude
            );
            return { ...ngo, distance };
        })
        .filter((ngo) => {
            // Filter by distance
            if (ngo.distance > maxDistance) return false;

            // Filter by active status
            if (onlyActive && !ngo.isActive) return false;

            // Filter by available capacity
            const availableCapacity = ngo.capacity - ngo.currentLoad;
            if (availableCapacity < minCapacity) return false;

            // Filter by food categories
            if (
                foodCategories.length > 0 &&
                !foodCategories.some((cat) => ngo.foodCategories.includes(cat))
            ) {
                return false;
            }

            // Filter by response time
            if (ngo.responseTime > responseTimeMax) return false;

            return true;
        })
        .sort((a, b) => a.distance - b.distance);
}

// Get current user location
export async function getUserLocation(): Promise<{
    lat: number;
    lon: number;
} | null> {
    // Check if running in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        // Default to New Delhi for SSR/demo
        return { lat: 28.6139, lon: 77.209 };
    }

    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn('Geolocation not supported');
            // Default to New Delhi for demo
            resolve({ lat: 28.6139, lon: 77.209 });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                console.warn('Geolocation error:', error);
                // Default to New Delhi for demo/fallback
                resolve({ lat: 28.6139, lon: 77.209 });
            }
        );
    });
}

// Format distance for display
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
}

// Get available capacity for NGO
export function getAvailableCapacity(ngo: NGO): number {
    return ngo.capacity - ngo.currentLoad;
}

// Calculate meals that can be fed (assuming 300g per meal)
export function estimateMealsFed(foodQuantityKg: number): number {
    const mealsPerKg = 3.33; // 300g per meal
    return Math.floor(foodQuantityKg * mealsPerKg);
}

// Calculate CO2 saved (assuming 2.5kg CO2 saved per kg of food not wasted)
export function calculateCO2Saved(foodQuantityKg: number): number {
    return Number((foodQuantityKg * 2.5).toFixed(2));
}
