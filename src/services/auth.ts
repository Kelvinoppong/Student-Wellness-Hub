import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    wellnessGoals?: string[];
  };
}

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUserProfile(user);
    return await getUserProfile(user.uid);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await getUserProfile(userCredential.user.uid);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await createUserProfile(user);
    return await getUserProfile(user.uid);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Create user profile in Firestore
const createUserProfile = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      preferences: {
        theme: 'light',
        notifications: true,
        wellnessGoals: [],
      },
    };

    await setDoc(userRef, userData);
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  } else {
    throw new Error('User profile not found');
  }
};

// Update user preferences
export const updateUserPreferences = async (
  uid: string,
  preferences: UserProfile['preferences']
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { preferences }, { merge: true });
  } catch (error: any) {
    throw new Error(error.message);
  }
}; 