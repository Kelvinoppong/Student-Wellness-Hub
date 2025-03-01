import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface MoodLog {
  mood: string;
  intensity: number;
  timestamp: Date;
  activities: string[];
  notes?: string;
}

export interface VideoHistory {
  videoId: string;
  title: string;
  thumbnail: string;
  category: string;
  watchedAt: Date;
}

export interface SavedMeme {
  id: string;
  url: string;
  title: string;
  savedAt: Date;
}

// Mood Logging Functions
export const logMood = async (userId: string, moodData: Omit<MoodLog, 'timestamp'>) => {
  try {
    const moodLogRef = collection(db, 'users', userId, 'moodLogs');
    await addDoc(moodLogRef, {
      ...moodData,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error logging mood:', error);
    throw new Error('Failed to log mood');
  }
};

export const getMoodHistory = async (userId: string, limit: number = 10): Promise<MoodLog[]> => {
  try {
    const moodLogsRef = collection(db, 'users', userId, 'moodLogs');
    const q = query(moodLogsRef, orderBy('timestamp', 'desc'), firestoreLimit(limit));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as MoodLog[];
  } catch (error) {
    console.error('Error fetching mood history:', error);
    throw new Error('Failed to fetch mood history');
  }
};

// Video History Functions
export const addToVideoHistory = async (userId: string, videoData: Omit<VideoHistory, 'watchedAt'>) => {
  try {
    const videoHistoryRef = collection(db, 'users', userId, 'videoHistory');
    await addDoc(videoHistoryRef, {
      ...videoData,
      watchedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error adding video to history:', error);
    throw new Error('Failed to add video to history');
  }
};

export const getVideoHistory = async (userId: string, limit: number = 20): Promise<VideoHistory[]> => {
  try {
    const videoHistoryRef = collection(db, 'users', userId, 'videoHistory');
    const q = query(videoHistoryRef, orderBy('watchedAt', 'desc'), firestoreLimit(limit));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      watchedAt: doc.data().watchedAt.toDate(),
    })) as VideoHistory[];
  } catch (error) {
    console.error('Error fetching video history:', error);
    throw new Error('Failed to fetch video history');
  }
};

// Saved Memes Functions
export const saveMeme = async (userId: string, memeData: Omit<SavedMeme, 'savedAt'>) => {
  try {
    const memesRef = collection(db, 'users', userId, 'savedMemes');
    await setDoc(doc(memesRef, memeData.id), {
      ...memeData,
      savedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving meme:', error);
    throw new Error('Failed to save meme');
  }
};

export const removeSavedMeme = async (userId: string, memeId: string) => {
  try {
    await setDoc(doc(db, 'users', userId, 'savedMemes', memeId), {
      deleted: true,
      deletedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error removing saved meme:', error);
    throw new Error('Failed to remove saved meme');
  }
};

export const getSavedMemes = async (userId: string): Promise<SavedMeme[]> => {
  try {
    const memesRef = collection(db, 'users', userId, 'savedMemes');
    const q = query(memesRef, where('deleted', '!=', true), orderBy('savedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      savedAt: doc.data().savedAt.toDate(),
    })) as SavedMeme[];
  } catch (error) {
    console.error('Error fetching saved memes:', error);
    throw new Error('Failed to fetch saved memes');
  }
};

// User Stats Functions
export const getUserStats = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const statsDoc = await getDoc(userRef);
    
    if (!statsDoc.exists()) {
      return {
        totalMoodLogs: 0,
        totalVideosWatched: 0,
        totalSavedMemes: 0,
        lastActive: null,
      };
    }

    return statsDoc.data().stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw new Error('Failed to fetch user stats');
  }
};

// Update user stats (called internally after activities)
export const updateUserStats = async (userId: string, statsUpdate: Partial<{
  totalMoodLogs: number;
  totalVideosWatched: number;
  totalSavedMemes: number;
}>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      stats: {
        ...statsUpdate,
        lastActive: Timestamp.now(),
      },
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw new Error('Failed to update user stats');
  }
}; 