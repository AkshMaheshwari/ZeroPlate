# ZeroPlate 🍽️

![ZeroPlate Banner](https://img.shields.io/badge/Hackathon-Ready-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

**Reducing food waste, one meal at a time**

An AI-powered food waste reduction and mess optimization system that helps mess halls reduce waste by up to 40% through data-driven insights and real-time student feedback.

## 🎯 Problem Statement

Mess halls waste tons of food daily due to:
- Poor demand forecasting
- Lack of student feedback
- No data-driven insights on meal preferences
- Environmental harm and resource inefficiency

## ✨ Solution

ZeroPlate collects real-time student feedback, analyzes meal preferences, and provides AI-powered actionable insights to mess administrators.

## 🚀 Features

- **📊 Real-time Analytics**: Track ratings, sentiment, and waste patterns instantly
- **🤖 AI Insights**: Smart recommendations powered by Gemini AI (integration ready)
- **📱 Easy Feedback**: Students submit feedback in seconds with emoji ratings
- **📉 Waste Reduction**: Optimize portions based on actual consumption data
- **💰 Cost Savings**: Reduce food costs by eliminating overproduction
- **🌱 Sustainability**: Contribute to environmental conservation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Charts**: Recharts
- **AI**: Ready for Gemini API integration

## 📁 Project Structure

```
ZeroPlate/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── feedback/page.tsx        # Student feedback form
│   ├── dashboard/page.tsx       # Admin dashboard
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── Header.tsx               # Navigation header
│   ├── OverviewCards.tsx        # Dashboard metrics cards
│   ├── AIInsights.tsx           # AI recommendations
│   ├── FeedbackTable.tsx        # Recent feedback table
│   └── charts/
│       ├── RatingsChart.tsx     # Ratings over time
│       └── SentimentChart.tsx   # Sentiment pie chart
├── lib/
│   └── firebase.ts              # Firebase configuration
└── package.json
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** and **Authentication** (Anonymous)
3. Copy your Firebase config credentials
4. Update `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages

### 1. Landing Page (`/`)
- Project overview and branding
- Problem and solution explanation
- CTA buttons to Feedback and Dashboard

### 2. Student Feedback (`/feedback`)
- Meal type selection (Breakfast/Lunch/Dinner/Snacks)
- Dish name input
- Emoji-based rating (😄 🙂 😐 😞)
- Optional voice feedback placeholder
- Submits to Firebase Firestore

### 3. Admin Dashboard (`/dashboard`)
- **Overview Cards**: Average rating, sentiment distribution, estimated waste
- **Charts**: Ratings over time (line chart), sentiment analysis (pie chart)
- **AI Insights**: Actionable recommendations (ready for Gemini API)
- **Feedback Table**: Recent student submissions with filters

## 🎯 Demo Flow (Under 2 Minutes)

1. **Landing Page** → Show problem statement and solution
2. **Give Feedback** → Submit a sample feedback (takes 20 seconds)
3. **Dashboard** → Show:
   - Real-time metrics updating
   - Charts visualizing trends
   - AI insights for waste reduction
   - Recent feedback table

## 🔮 Future Enhancements

- [ ] Integrate Gemini AI API for real-time insights
- [ ] Voice feedback recording and transcription
- [ ] Push notifications for admins
- [ ] Historical trend analysis (weekly/monthly)
- [ ] Multi-mess support with role-based access
- [ ] Export reports as PDF

## 👥 Team

**A² Labs**
- Aksh
- Aditi

## 📄 License

Built for hackathon purposes. Feel free to use and modify.

---

**Made with ❤️ to reduce food waste and save our planet 🌍**
