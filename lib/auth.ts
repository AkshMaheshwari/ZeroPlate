// Authentication helper functions for Firebase
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

export type UserRole = 'student' | 'admin';

export interface UserData {
    uid: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}
// --- ADD THIS NEW FUNCTION BELOW ---
export async function signInWithGoogle(): Promise<UserData> {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create new record for first-time Google users
            const userData: UserData = {
                uid: user.uid,
                email: user.email || '',
                role: 'student', // Default role
                createdAt: new Date()
            };
            await setDoc(doc(db, 'users', user.uid), userData);
            return userData;
        }

        return userDoc.data() as UserData;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign in with Google');
    }
}

// Sign up new user with role
export async function signUpUser(
    email: string,
    password: string,
    role: UserRole
): Promise<UserData> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Store user role in Firestore
        const userData: UserData = {
            uid: userCredential.user.uid,
            email: email,
            role: role,
            createdAt: new Date()
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), userData);

        return userData;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign up');
    }
}

// Sign in existing user
export async function signInUser(
    email: string,
    password: string
): Promise<UserData> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

        if (!userDoc.exists()) {
            throw new Error('User data not found');
        }

        return userDoc.data() as UserData;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign in');
    }
}

// Sign out current user
export async function signOut(): Promise<void> {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign out');
    }
}

// Get current user's role
export async function getUserRole(uid: string): Promise<UserRole | null> {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));

        if (!userDoc.exists()) {
            return null;
        }

        return userDoc.data().role as UserRole;
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
}

// Get current user data
export async function getCurrentUserData(): Promise<UserData | null> {
    const user = auth.currentUser;

    if (!user) {
        return null;
    }

    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            return null;
        }

        return userDoc.data() as UserData;
    } catch (error) {
        console.error('Error fetching current user data:', error);
        return null;
    }
}

// Auth state observer
export function onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
    const userData = await getCurrentUserData();
    return userData?.role === 'admin';
}

// Check if user is student
export async function isStudent(): Promise<boolean> {
    const userData = await getCurrentUserData();
    return userData?.role === 'student';
}
