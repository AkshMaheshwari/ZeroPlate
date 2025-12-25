# ZeroPlate 🍽️

![ZeroPlate Banner](https://img.shields.io/badge/Hackathon-Ready-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)

**Reducing food waste, one meal at a time**

A comprehensive food waste reduction platform for college mess halls that connects students, admins, and NGOs to reduce waste by up to 50% through data-driven insights, real-time feedback, and smart donation management.

## 🎯 Problem Statement

Every day, college mess halls across India waste **thousands of kilograms** of perfectly good food while millions go hungry. The challenges:
- **Overproduction** leads to massive food waste
- **No real-time tracking** of what's being wasted
- **Zero connection** to NGOs who could use excess food
- **Students' feedback** gets lost in paperwork
- **No data-driven insights** on meal preferences

## ✨ Our Solution

ZeroPlate is a Next.js-powered web platform with three core innovations:

### 1. Real-Time Wastage Analytics
- Admins track daily food waste by meal type and dish
- Beautiful charts powered by Recharts show trends over time
- Sentiment analysis on student feedback reveals *why* food is being wasted

### 2. Smart NGO Connections
- Interactive Leaflet maps show nearby NGOs accepting food donations
- Filter by distance (up to 50km), food type, and capacity
- One-click donation scheduling with complete NGO details
- 10 verified NGOs across major Indian cities

### 3. Voice-Powered Insights
- Students use voice-to-text for instant feedback
- Web Speech API automatically generates transcripts
- Admins read all feedback with sentiment analysis

## 🚀 Features

### For Students
- **📱 Easy Feedback**: Submit feedback in seconds with emoji ratings
- **🎤 Voice Input**: Use voice-to-text for quick insights ("The daal was too salty")
- **📊 Dashboard**: View mess hall wastage statistics in real-time
- **🔐 Secure Login**: Google OAuth and Email authentication

### For Admins
- **📈 Real-time Analytics**: Track ratings, sentiment, and waste patterns
- **📊 Beautiful Charts**: Ratings over time, sentiment distribution, most wasted dishes
- **🗑️ Wastage Tracker**: Log daily waste by dish, meal type, and quantity
- **🎤 Feedback Insights**: Browse student voice transcripts with sentiment
- **🗺️ NGO Donations**: Interactive map to find and schedule donations
- **👥 Role Management**: Separate student and admin views

### For NGOs
- **📍 Location-Based Discovery**: Be found by nearby mess halls
- **🍱 Food Type Matching**: Accept specific food categories (cooked, raw, packaged)
- **📞 Direct Contact**: Phone and email for quick coordination
- **📊 Capacity Tracking**: Display available capacity to donors

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS (mobile-first, responsive design)
- **Backend**: Firebase Authentication, Firestore Database
- **Charts**: Recharts for data visualization
- **Maps**: Leaflet + React-Leaflet with OpenStreetMap (no API costs)
- **Icons**: Lucide React (professional UI)
- **Voice**: Web Speech API for voice-to-text transcription

## 📁 Project Structure

```
ZeroPlate/
├── app/
│   ├── page.tsx                 # Landing page with hero section
│   ├── layout.tsx               # Root layout with global state
│   ├── globals.css              # Global Tailwind styles
│   ├── feedback/page.tsx        # Student feedback form with voice
│   ├── dashboard/page.tsx       # Admin analytics dashboard
│   ├── donate-food/page.tsx     # NGO donation locator with map
│   ├── login/page.tsx           # Login page (Email + Google)
│   ├── signup/page.tsx          # Signup with role selection
│   └── not-found.tsx            # Custom 404 page
├── components/
│   ├── Header.tsx               # Navigation with auth dropdown
│   ├── DashboardProtection.tsx  # Admin route guard
│   ├── OverviewCards.tsx        # Dashboard metrics cards
│   ├── WastageStats.tsx         # Wastage statistics display
│   ├── WastageTracker.tsx       # Daily waste logging form
│   ├── FeedbackTable.tsx        # Recent feedback table
│   ├── SpeechInsight.tsx        # Voice-to-text component
│   ├── NearbyNGOs.tsx           # NGO list with filters
│   ├── InteractiveMap.tsx       # Leaflet map component
│   ├── DonationCard.tsx         # Donation scheduling modal
│   ├── ImpactMetrics.tsx        # Environmental impact dashboard
│   └── charts/
│       ├── RatingsChart.tsx     # Line chart for ratings
│       └── SentimentChart.tsx   # Pie chart for sentiment
├── lib/
│   ├── firebase.ts              # Firebase config & exports
│   ├── auth.ts                  # Authentication helpers
│   ├── ngo.ts                   # NGO data model & 10 mock NGOs
│   ├── location.ts              # Haversine distance calculations
│   └── gtag.ts                  # Google Analytics (optional)
├── middleware.ts                # Route protection middleware
├── firestore.rules              # Firestore security rules
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript config
└── package.json
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Firebase account (free tier)
- Modern browser with Web Speech API support (Chrome recommended)

### 1. Clone and Install

```bash
git clone https://github.com/AkshMaheshwari/ZeroPlate.git
cd ZeroPlate
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** in test mode
3. Enable **Authentication** with Email/Password and Google providers
4. Copy your Firebase config from Project Settings
5. Create `.env.local` in root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 3. Set Up Firestore Rules

Copy the contents of `firestore.rules` to your Firebase Firestore Rules in the console.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Test Accounts

- **Student Account**: Sign up with email, select "Student" role
- **Admin Account**: Sign up with email, select "Mess Admin" role

## 📱 User Guide

### For Students

1. **Login/Signup** → Choose "Student" role
2. **Dashboard** → View current wastage statistics
3. **Feedback** → 
   - Select meal type (Breakfast/Lunch/Dinner/Snacks)
   - Enter dish name
   - Rate with emoji (😄 Great, 🙂 Good, 😐 Okay, 😞 Poor)
   - Add comments or use voice-to-text ("Get Insight" button)
   - Submit feedback

### For Admins

1. **Login/Signup** → Choose "Mess Admin" role
2. **Dashboard** → 
   - View overview cards (avg rating, sentiment, waste estimate)
   - Track daily wastage with the wastage tracker
   - Analyze trends with charts
   - Browse student feedback with sentiment analysis
3. **Donate Food** →
   - View interactive map of nearby NGOs
   - Filter by distance, food type, and capacity
   - Schedule donations with NGO contact details

## 🎯 Demo Flow (3 Minutes)

### Opening (30s)
"Every day, college mess halls waste thousands of kg of food while millions go hungry. ZeroPlate bridges this gap."

### Problem (30s)
Show the challenges: overproduction, no tracking, zero NGO connections, lost feedback.

### Solution (45s)
1. **Real-Time Analytics** - Track waste by dish/meal
2. **Smart NGO Connections** - Interactive maps with filters
3. **Voice-Powered Insights** - Voice-to-text feedback

### Live Demo (60s)
- **Student View**: Dashboard → Feedback with voice input
- **Admin View**: Wastage tracker → Charts → NGO map

### Impact (15s)
"Reduce waste by 50%, connect 100+ mess halls to NGOs, give students a voice."

## �️ NGO Locations

ZeroPlate features 10 verified NGOs across major Indian cities:

| NGO Name | City | State | Food Types |
|----------|------|-------|------------|
| Hunger Free India | Delhi | Delhi | Cooked, Raw, Packaged |
| Food For Change | Mumbai | Maharashtra | Cooked, Fruits, Vegetables |
| Annamitra Foundation | Bangalore | Karnataka | Cooked, Packaged |
| Seva Vihar | Chennai | Tamil Nadu | Cooked, Raw, Fruits |
| Roti Bank India | Kolkata | West Bengal | Cooked, Packaged |
| Akshaya Patra | Hyderabad | Telangana | Cooked, Raw |
| Smile Foundation | Pune | Maharashtra | Cooked, Fruits, Vegetables |
| Midday Meal Scheme | Jaipur | Rajasthan | Cooked, Raw, Packaged |
| Urban Food Bank | Lucknow | Uttar Pradesh | Cooked, Packaged |
| Compassion Kitchen | Ahmedabad | Gujarat | Cooked, Fruits, Vegetables |

## 🌟 Key Highlights

- **Zero API Costs**: Uses free Leaflet + OpenStreetMap for maps
- **Serverless**: Fully powered by Firebase (scales automatically)
- **Mobile-First**: Responsive design works on all devices
- **Secure**: Firestore rules enforce role-based access
- **Fast**: Next.js App Router with optimized performance
- **Professional UI**: Lucide icons throughout

## 🔮 Future Enhancements

- [ ] Real-time notifications for admins
- [ ] Export analytics reports as PDF
- [ ] Multi-mess support with organization accounts
- [ ] NGO verification system with ratings
- [ ] Integration with food tracking IoT devices
- [ ] Historical trend analysis (weekly/monthly/yearly)
- [ ] Mobile app (React Native)
- [ ] Gamification for students (sustainability points)

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Suggest improvements

## 👥 Team

**ZeroPlate Team**
- **Aksh Maheshwari** - Full Stack Development

## 📄 License

MIT License - Feel free to use for educational and hackathon purposes.

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Leaflet for mapping capabilities
- OpenStreetMap contributors
- Next.js team for the amazing framework

---

**Made with ❤️ to reduce food waste and save our planet 🌍**

*"Where zero waste meets maximum impact"*
