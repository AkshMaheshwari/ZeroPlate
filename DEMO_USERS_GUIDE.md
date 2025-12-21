# Creating Demo Users Guide

Since the demo credentials section has been removed from the login page, here's how to create test users for your hackathon demo:

## Option 1: Create Users via Signup Page (Recommended)

1. **Start your dev server**: `npm run dev`
2. **Go to signup page**: http://localhost:3000/signup
3. **Create a Student account**:
   - Email: `student@test.com`
   - Password: `password123` (or any password you prefer)
   - Role: Click the "Student 🎓" button
   - Click "Create Account"
   
4. **Create an Admin account** (repeat process):
   - Email: `admin@test.com`
   - Password: `password123`
   - Role: Click the "Admin 👨‍💼" button
   - Click "Create Account"

## Option 2: Create Users via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Authentication"** in left sidebar
4. Click **"Add user"** button
5. Enter email and password
6. Click **"Add user"**
7. **IMPORTANT**: After creating the user, you must also create their user document:
   - Go to **"Firestore Database"**
   - Click the `users` collection (create if it doesn't exist)
   - Click **"Add document"**
   - Set Document ID to the **UID from Authentication**
   - Add these fields:
     - `email`: (string) the user's email
     - `role`: (string) either "student" or "admin"
     - `createdAt`: (timestamp) current time
   - Click **"Save"**

## Why Demo Credentials Don't Work Initially

The demo credentials shown before (`student@test.com` / `admin@test.com`) don't exist until you **actually create them**. Firebase Authentication requires users to be registered before they can sign in.

## Quick Test Credentials for Hackathon

Create these accounts for easy demo:

**Student Account:**
- Email: `demo.student@zeroplate.com`
- Password: `hackathon2024`
- Role: student

**Admin Account:**
- Email: `demo.admin@zeroplate.com`  
- Password: `hackathon2024`
- Role: admin

## Verifying Users Were Created

After creating users, verify they exist:

1. **Check Authentication**:
   - Firebase Console → Authentication → Users
   - You should see both emails listed

2. **Check Firestore**:
   - Firebase Console → Firestore Database
   - Open `users` collection
   - Each user should have a document with their UID

3. **Test Login**:
   - Go to http://localhost:3000/login
   - Try logging in with one of the accounts
   - Should redirect based on role:
     - Student → `/feedback`
     - Admin → `/dashboard`

## For Hackathon Judges

When demoing to judges, create clean demo accounts beforehand:
- Use professional looking emails
- Make sure both student and admin accounts work
- Pre-submit some feedback data as a student
- Show the admin dashboard with that data

This makes your demo smooth and professional! 🎯
