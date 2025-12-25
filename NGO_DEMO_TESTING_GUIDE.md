# 🎮 NGO Feature - Quick Demo & Testing Guide

## 🚀 Quick Start

### 1. Run the Application
```bash
npm run dev
```
Open: http://localhost:3000

### 2. Create Demo Accounts
Go to `/signup` and create:
- **Student Account**: `student@demo.com` / `password123` (Role: Student)
- **Admin Account**: `admin@demo.com` / `password123` (Role: Admin)

### 3. Access the NGO Feature

#### For Students:
1. Login with student account
2. Click **"🤝 Donate Food"** in header
3. Start donating food!

#### For Admins:
1. Login with admin account
2. Go to **Dashboard**
3. Scroll to see **"🤝 NGO Donations"** widget
4. Click **"View All"** or **"Start Donating Food"** button

---

## 🧪 Testing Scenarios

### Scenario 1: Find Nearby NGOs
**Expected**: Shows NGOs within 20km
```
1. Click "🤝 Donate Food" 
2. Should see list of 10 NGOs
3. Each showing: name, distance, capacity, rating
```

### Scenario 2: Filter by Distance
**Expected**: List updates dynamically
```
1. Adjust distance slider to 10km
2. Click "Apply Filters"
3. Count should reduce to closer NGOs
```

### Scenario 3: Filter by Capacity
**Expected**: Shows only NGOs with available capacity
```
1. Set "Min Available" to 200kg
2. Click "Apply Filters"
3. Only NGOs with 200kg+ free space shown
```

### Scenario 4: Filter by Food Type
**Expected**: Shows only NGOs accepting selected categories
```
1. Check "cooked" checkbox
2. Click "Apply Filters"
3. Only NGOs accepting cooked food shown
```

### Scenario 5: Select an NGO
**Expected**: Card appears with details
```
1. Click on any NGO in list
2. Blue donation card modal pops up
3. Shows NGO name, address, phone, email
```

### Scenario 6: Submit Donation
**Expected**: Confirmation shown
```
1. Click on an NGO
2. Fill form:
   - Quantity: 25
   - Food Type: Cooked Rice
   - Description: Fresh lunch waste
   - Pickup Time: Pick a future time
3. Click "Confirm Donation"
4. Success message appears
5. Auto-closes after 2 seconds
```

### Scenario 7: View Impact Metrics
**Expected**: Shows donation statistics
```
1. Click "🤝 Donate Food"
2. Switch to "📊 Impact Metrics" tab
3. Should see:
   - Food Donated: 1250kg
   - Meals Made: 4165
   - CO2 Saved: 3125kg
   - NGO Partners: 10
```

### Scenario 8: Direct Contact
**Expected**: Opens contact options
```
1. On any NGO card, you'll see 3 buttons:
   - 📞 Call: Opens phone dialer
   - 📧 Email: Opens default email
   - 💬 WhatsApp: Opens WhatsApp link
```

### Scenario 9: Dashboard Integration
**Expected**: NGO widget shows on admin dashboard
```
1. Login as Admin
2. Go to Dashboard
3. Scroll down to see "🤝 NGO Donations" widget
4. Shows:
   - Active Donations: 3
   - Total Donated: 1250kg
   - Top 3 NGO partners
```

### Scenario 10: Responsive Mobile
**Expected**: Works on phone screens
```
1. Open in mobile view (375px width)
2. All elements should be readable
3. Filters should stack vertically
4. NGO cards should be full width
5. Buttons should be touchable
```

---

## 📊 Mock Data Reference

### 10 Hardcoded NGOs:
1. **Hunger Free India** - Delhi, 500kg capacity, 4.8★
2. **Food For Change** - Delhi, 300kg capacity, 4.6★
3. **Annamitra Foundation** - South Delhi, 400kg capacity, 4.9★
4. **Seva Vihar** - North Delhi, 250kg capacity, 4.5★
5. **Roti Bank India** - East Delhi, 600kg capacity, 4.7★
6. **Akshaya Patra** - West Delhi, 800kg capacity, 4.8★
7. **Smile Foundation** - Central Delhi, 350kg capacity, 4.6★
8. **Midday Meal Scheme** - South Delhi, 700kg capacity, 4.9★
9. **Urban Food Bank** - North Delhi, 450kg capacity, 4.7★
10. **Compassion Kitchen** - East Delhi, 300kg capacity, 4.5★

### Food Types Available:
- Cooked Rice
- Cooked Vegetables
- Bread/Roti
- Dal/Curry
- Packaged Snacks
- Fruits
- Raw Vegetables
- Mixed Meal
- Other

---

## 🎯 Key Test Points

✅ **Geolocation**
- [ ] Default location is New Delhi (28.6139, 77.2090)
- [ ] Fallback works if geolocation denied

✅ **Distance Calculation**
- [ ] Haversine formula working (check browser console)
- [ ] Distances displayed in km
- [ ] Sorted by nearest first

✅ **Filtering**
- [ ] Distance slider works (1-50km)
- [ ] Capacity slider works (0-500kg)
- [ ] Food categories checkboxes work
- [ ] Filters combine correctly (AND logic)

✅ **UI/UX**
- [ ] Colors load properly (green/yellow/red capacity bars)
- [ ] Images/emojis display
- [ ] Buttons are clickable
- [ ] Forms validate input

✅ **Mobile Responsive**
- [ ] Layout stacks properly
- [ ] Touch targets are 44px minimum
- [ ] Text readable at 375px width
- [ ] No horizontal scrolling

---

## 🔍 Browser Console Debugging

### Check distances:
```javascript
// Open browser DevTools (F12)
// Check for distance calculations in logs
console.log(filteredNGOs)
```

### Check geolocation:
```javascript
// Will log: {"lat": 28.6139, "lon": 77.2090}
```

### Check filters:
```javascript
// Verify filter criteria applied
console.log('Filters applied:', {maxDistance, selectedCategories, minCapacity})
```

---

## 📱 Device Testing

### Desktop (1920px)
- [ ] All 3 columns visible
- [ ] Sidebar fixed on scroll
- [ ] Hover effects work

### Tablet (768px)
- [ ] 2 columns for cards
- [ ] Sidebar moves to top
- [ ] Map readable

### Mobile (375px)
- [ ] Single column
- [ ] Full width cards
- [ ] Filters in drawer/collapse
- [ ] Touch-friendly buttons

---

## 🎬 Demo Script (3 minutes)

1. **Login** (15 sec)
   - Show login page
   - Use student account

2. **Navigate to Feature** (10 sec)
   - Click "🤝 Donate Food"
   - Show map and NGO list

3. **Demo Filtering** (30 sec)
   - Adjust distance to 10km
   - Show results reduce
   - Filter by "cooked" category
   - Results narrow further

4. **Select & Donate** (45 sec)
   - Click on top NGO
   - Show donation form
   - Fill in details
   - Show confirmation

5. **Show Impact** (30 sec)
   - Switch to "📊 Impact Metrics" tab
   - Highlight key numbers
   - Show environmental impact

6. **Show Dashboard** (30 sec)
   - Go to admin dashboard
   - Scroll to NGO widget
   - Show quick stats

7. **Q&A** (30 sec)

**Total: ~3 minutes**

---

## 🐛 Troubleshooting

### Issue: NGOs not showing
- **Solution**: Check browser console for errors, ensure geolocation permission

### Issue: Filters not working
- **Solution**: Click "Apply Filters" button after changing values

### Issue: Mobile layout broken
- **Solution**: Clear browser cache, check responsive view mode

### Issue: Donation form not submitting
- **Solution**: Ensure all required fields filled, check browser console for errors

---

## 📸 Screenshots to Capture

1. NGO list view
2. Map with legend
3. Donation form filled
4. Confirmation modal
5. Impact metrics dashboard
6. Dashboard widget
7. Mobile view
8. Filter options

---

## ✨ Impressive Features to Highlight

1. **Smart Filtering** - Multiple criteria working together
2. **Visual Indicators** - Color-coded capacity bars
3. **Direct Contact** - One-tap to call/email/WhatsApp
4. **Impact Metrics** - Shows environmental impact
5. **Responsive Design** - Works perfectly on mobile
6. **No API Calls** - All runs locally (hackathon ready!)

---

**Status**: Ready for Hackathon Demo ✅
**Time to Demo**: 3-5 minutes
**Features**: Complete & Tested
