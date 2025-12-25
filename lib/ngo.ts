// NGO Data Model and Utilities
export interface NGO {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    phone: string;
    email: string;
    capacity: number; // kg of food they can accept
    currentLoad: number; // kg currently being held
    foodCategories: string[]; // ['cooked', 'raw', 'packaged', 'fruits', 'vegetables']
    responseTime: number; // minutes to respond/pickup
    isActive: boolean;
    description: string;
    image?: string;
    rating?: number;
    distance?: number; // optional: computed distance in km for UI sorting
}

export interface Donation {
    id: string;
    ngoId: string;
    messId: string;
    quantity: number; // kg
    foodType: string;
    description: string;
    pickupTime: Date;
    status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled';
    createdAt: Date;
    timestamp: number;
}

export interface ImpactMetrics {
    totalFoodDonated: number; // kg
    totalDonations: number;
    estimatedMealsFed: number;
    ngoPartnershipsCount: number;
    activeDonationsToday: number;
    estimatedCO2Saved: number; // kg
}

// Mock NGO Data for Hackathon - Across Multiple Indian States
export const MOCK_NGOS: NGO[] = [
    {
        id: 'ngo_1',
        name: 'Hunger Free India',
        latitude: 28.6139,
        longitude: 77.2090,
        address: '123 Main St, New Delhi, Delhi',
        phone: '+91-98765-43210',
        email: 'contact@hungerfree.org',
        capacity: 500,
        currentLoad: 150,
        foodCategories: ['cooked', 'raw', 'packaged'],
        responseTime: 30,
        isActive: true,
        description: 'Distributes food to underprivileged children and families',
        rating: 4.8,
    },
    {
        id: 'ngo_2',
        name: 'Food For Change',
        latitude: 19.0760,
        longitude: 72.8777,
        address: '456 Marine Drive, Mumbai, Maharashtra',
        phone: '+91-98765-43211',
        email: 'info@foodforchange.in',
        capacity: 300,
        currentLoad: 80,
        foodCategories: ['cooked', 'packaged'],
        responseTime: 45,
        isActive: true,
        description: 'Community kitchen serving meals daily in coastal regions',
        rating: 4.6,
    },
    {
        id: 'ngo_3',
        name: 'Annamitra Foundation',
        latitude: 12.9716,
        longitude: 77.5946,
        address: '789 Green Rd, Bangalore, Karnataka',
        phone: '+91-98765-43212',
        email: 'hello@annamitra.org',
        capacity: 400,
        currentLoad: 200,
        foodCategories: ['cooked', 'raw', 'fruits', 'vegetables'],
        responseTime: 20,
        isActive: true,
        description: 'Focuses on nutrition for school children and families',
        rating: 4.9,
    },
    {
        id: 'ngo_4',
        name: 'Seva Vihar',
        latitude: 13.0827,
        longitude: 80.2707,
        address: '321 Peace Lane, Chennai, Tamil Nadu',
        phone: '+91-98765-43213',
        email: 'contact@sevavihar.com',
        capacity: 250,
        currentLoad: 50,
        foodCategories: ['cooked', 'packaged'],
        responseTime: 60,
        isActive: true,
        description: 'Serving elderly and disabled populations in South India',
        rating: 4.5,
    },
    {
        id: 'ngo_5',
        name: 'Roti Bank India',
        latitude: 22.5726,
        longitude: 88.3639,
        address: '555 Unity St, Kolkata, West Bengal',
        phone: '+91-98765-43214',
        email: 'team@rotibank.org',
        capacity: 600,
        currentLoad: 300,
        foodCategories: ['cooked', 'packaged', 'vegetables'],
        responseTime: 25,
        isActive: true,
        description: 'Network of food banks across Eastern India',
        rating: 4.7,
    },
    {
        id: 'ngo_6',
        name: 'Akshaya Patra',
        latitude: 17.3850,
        longitude: 78.4867,
        address: '999 Hope Circle, Hyderabad, Telangana',
        phone: '+91-98765-43215',
        email: 'support@akshayapatra.org',
        capacity: 800,
        currentLoad: 400,
        foodCategories: ['cooked', 'raw', 'packaged', 'fruits'],
        responseTime: 35,
        isActive: true,
        description: 'Large-scale meal program for underprivileged communities across South',
        rating: 4.8,
    },
    {
        id: 'ngo_7',
        name: 'Smile Foundation',
        latitude: 18.5204,
        longitude: 73.8567,
        address: '111 Joy Ave, Pune, Maharashtra',
        phone: '+91-98765-43216',
        email: 'hello@smilefoundation.org',
        capacity: 350,
        currentLoad: 100,
        foodCategories: ['cooked', 'packaged'],
        responseTime: 40,
        isActive: true,
        description: 'Welfare programs for marginalized communities in Western India',
        rating: 4.6,
    },
    {
        id: 'ngo_8',
        name: 'Midday Meal Scheme',
        latitude: 26.9124,
        longitude: 75.7873,
        address: '222 Education St, Jaipur, Rajasthan',
        phone: '+91-98765-43217',
        email: 'contact@mms.org',
        capacity: 700,
        currentLoad: 350,
        foodCategories: ['cooked', 'packaged'],
        responseTime: 30,
        isActive: true,
        description: 'School meal program for underprivileged children across Rajasthan',
        rating: 4.9,
    },
    {
        id: 'ngo_9',
        name: 'Urban Food Bank',
        latitude: 26.8467,
        longitude: 80.9462,
        address: '333 Community Ln, Lucknow, Uttar Pradesh',
        phone: '+91-98765-43218',
        email: 'info@urbanfoodbank.in',
        capacity: 450,
        currentLoad: 180,
        foodCategories: ['cooked', 'raw', 'packaged', 'fruits', 'vegetables'],
        responseTime: 50,
        isActive: true,
        description: 'Urban solutions for food insecurity in North-Central India',
        rating: 4.7,
    },
    {
        id: 'ngo_10',
        name: 'Compassion Kitchen',
        latitude: 23.0225,
        longitude: 72.5714,
        address: '444 Care Rd, Ahmedabad, Gujarat',
        phone: '+91-98765-43219',
        email: 'support@compassionkitchen.org',
        capacity: 300,
        currentLoad: 120,
        foodCategories: ['cooked', 'packaged'],
        responseTime: 45,
        isActive: true,
        description: 'Meal preparation for disaster relief and emergencies in Western India',
        rating: 4.5,
    },
];
