import { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/auth';
import type { UserProfile } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      try {
        if (firebaseUser) {
          console.log('Fetching user profile for:', firebaseUser.uid);
          const userProfile = await getUserProfile(firebaseUser.uid);
          console.log('User profile fetched:', userProfile);
          setUser(userProfile);
        } else {
          console.log('No firebase user, setting user to null');
          setUser(null);
        }
      } catch (err: any) {
        console.error('Error in auth state change:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Add a method to check current auth state
  const checkAuthState = async () => {
    const currentUser = auth.currentUser;
    console.log('Current auth state:', currentUser?.email);
    if (currentUser && !user) {
      try {
        const userProfile = await getUserProfile(currentUser.uid);
        setUser(userProfile);
      } catch (err: any) {
        console.error('Error checking auth state:', err);
        setError(err.message);
      }
    }
  };

  // Check auth state when loading changes to false
  useEffect(() => {
    if (!loading && !user) {
      checkAuthState();
    }
  }, [loading]);

  return { user, loading, error };
};

export default useAuth; 