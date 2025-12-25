# 🤝 NGO Donation Feature - Implementation Guide

## Overview
This document outlines the new NGO Donation feature added to ZeroPlate, enabling food donations from mess halls to nearby NGOs.

---

## 📁 New Files Created

### Core Utilities
- **[lib/ngo.ts](lib/ngo.ts)** - NGO data models and 10 mock NGOs
- **[lib/location.ts](lib/location.ts)** - Location utilities (haversine distance, filtering)

### Components
- **[components/NearbyNGOs.tsx](components/NearbyNGOs.tsx)** - NGO list with filtering
- **[components/NGOLocatorMap.tsx](components/NGOLocatorMap.tsx)** - Map visualization
- **[components/DonationCard.tsx](components/DonationCard.tsx)** - Donation submission form
- **[components/ImpactMetrics.tsx](components/ImpactMetrics.tsx)** - Impact dashboard
- **[components/NGODonationWidget.tsx](components/NGODonationWidget.tsx)** - Dashboard widget

### Pages
- **[app/donate-food/page.tsx](app/donate-food/page.tsx)** - Main NGO donation page

---

## 🎯 Features Implemented

### 1. **NGO Locator** 📍
- Find nearby NGOs within configurable distance (1-50km)
- Filter by food categories, minimum capacity, response time
- Sort by distance (nearest first)
- Real-time geolocation support (defaults to New Delhi for demo)

### 2. **Interactive Map**
- Simple SVG-based map showing NGO locations
- Visual indicators for capacity status
- Selected NGO info box
- Legend for capacity levels

### 3. **NGO Details Card**
- Name, address, phone, email
- Available capacity with visual progress bar
- Food categories accepted
- Response time
- Rating and description
- Direct contact buttons (Call, Email, WhatsApp)

### 4. **Donation Workflow**
- Select quantity of food to donate
- Choose food type (Cooked Rice, Dal, Vegetables, etc.)
- Add optional description
- Set preferred pickup time
- Confirmation modal with donation details

### 5. **Impact Metrics Dashboard**
- Total food donated (kg)
- Total donations count
- Estimated meals fed
- NGO partnerships
- Active donations today
- CO2 saved
- Environmental impact summary
- Achievement badges

---

## 🔧 Technical Details

### Distance Calculation
- **Algorithm**: Haversine formula (calculates great-circle distance)
- **Default location**: New Delhi (28.6139°N, 77.2090°E)
- **Fallback**: Browser geolocation with fallback to default

### Filtering Logic
```typescript
filterAndSortNGOs(ngos, userLocation, {
  maxDistance: 20,           // km
  foodCategories: [],         // accepts any
  minCapacity: 0,            // kg
  responseTimeMax: 120,      // minutes
  onlyActive: true           // show only active NGOs
})
```

### Mock Data
- **10 NGOs** with realistic names and locations in Delhi
- Capacity: 250-800 kg
- Response time: 20-60 minutes
- Food categories: cooked, raw, packaged, fruits, vegetables
- Ratings: 4.5-4.9 stars

---

## 🚀 How to Use

### For Students/Mess Hall Staff:

1. **Navigate to Donate Food**
   - Click "🤝 Donate Food" in header navigation
   - OR Go to `/donate-food` route

2. **Find NGOs**
   - Adjust distance slider (1-50km)
   - Filter by food categories
   - Set minimum available capacity
   - Click "Apply Filters"

3. **Select & Donate**
   - Click on any NGO card
   - Fill donation form:
     - Quantity (kg)
     - Food type
     - Description (optional)
     - Pickup time
   - Click "Confirm Donation"
   - Get confirmation with NGO contact details

4. **View Impact**
   - Switch to "📊 Impact Metrics" tab
   - See total donations, meals fed, CO2 saved
   - Track your contribution

### For Admins:

- **Dashboard Integration**: NGO widget shows:
  - Active donations today
  - Total food donated
  - Top 3 NGO partners
  - Quick link to full donation page

---

## 📊 NGO Data Model

```typescript
interface NGO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  email: string;
  capacity: number;              // Total capacity (kg)
  currentLoad: number;           // Currently held (kg)
  foodCategories: string[];      // Types accepted
  responseTime: number;          // Minutes
  isActive: boolean;
  description: string;
  image?: string;
  rating?: number;
}

interface Donation {
  id: string;
  ngoId: string;
  messId: string;
  quantity: number;              // kg
  foodType: string;
  description: string;
  pickupTime: Date;
  status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled';
  createdAt: Date;
  timestamp: number;
}
```

---

## 🔄 Integration Points

### Navigation Updates
- **Header.tsx**: Added "🤝 Donate Food" link for authenticated users
- Available for both Students and Admins

### Dashboard Updates
- **dashboard/page.tsx**: Integrated NGO Donation Widget
- Shows quick stats and top NGO partners

### Future Firestore Integration
When ready to connect to real database:

1. **Create Firestore Collections**:
   - `ngos/` - NGO listings and capacity
   - `donations/` - Track all donations
   - `ngo_ratings/` - Community ratings

2. **Update donation submission**:
   ```typescript
   // In donate-food/page.tsx
   await addDoc(collection(db, 'donations'), {
     ...formData,
     ngoId: selectedNGO.id,
     messId: currentUser.id,
     status: 'pending',
     createdAt: new Date(),
   })
   ```

---

## 🎨 UI/UX Features

- **Color Coding**: Capacity bars (green > 50%, yellow 25-50%, red < 25%)
- **Responsive Design**: Works on mobile, tablet, desktop
- **Accessibility**: Clear labels, large touch targets
- **Animations**: Smooth transitions and status updates
- **Dark Mode Ready**: Tailwind CSS classes support dark mode

---

## 📱 Responsive Breakpoints
- **Mobile**: Single column layout
- **Tablet**: 2-column layout
- **Desktop**: 3-column cards, 4-column grid

---

## 🚀 Next Steps for Production

1. **Connect to Firestore**:
   - Replace mock data with real NGO collection
   - Store donation history
   - Track real capacity updates

2. **Add Real Maps**:
   - Integrate Google Maps API
   - Show actual routes
   - Real-time directions

3. **Notifications**:
   - Email NGOs when donations submitted
   - SMS confirmations to staff
   - Pickup reminders

4. **Admin Features**:
   - NGO management panel
   - Donation analytics
   - Performance metrics

5. **Mobile App**:
   - React Native version
   - Offline support
   - Push notifications

---

## 🧪 Testing Checklist

- [x] Geolocation fallback (NYC for demo)
- [x] Filter by distance works
- [x] Filter by capacity works
- [x] Filter by food categories works
- [x] NGO list displays correctly
- [x] NGO cards are clickable
- [x] Donation form validates
- [x] Confirmation modal shows
- [x] Impact metrics calculate
- [x] Navigation links work
- [x] Responsive on mobile
- [x] Dashboard widget displays

---

## 📧 Contact & Support

For NGOs in the demo:
- All phone numbers are mock (+91-987654-XXXX format)
- Emails are formatted as contact@{ngo_name}.org
- WhatsApp links generate from phone numbers

---

## 🎓 Learning Resources

- **Geolocation API**: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- **Haversine Formula**: https://www.movable-type.co.uk/scripts/latlong.html
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Firebase Integration**: Check [lib/firebase.ts](lib/firebase.ts)

---

**Status**: ✅ Ready for Hackathon Demo
**Last Updated**: December 25, 2025
