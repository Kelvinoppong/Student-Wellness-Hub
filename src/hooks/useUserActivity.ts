import { useState, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import {
  logMood,
  getMoodHistory,
  addToVideoHistory,
  getVideoHistory,
  saveMeme,
  removeSavedMeme,
  getSavedMemes,
  getUserStats,
} from '../services/userActivity';
import type { MoodLog, VideoHistory, SavedMeme } from '../services/userActivity';

export const useUserActivity = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    console.error('User activity error:', error);
    setError(error.message);
    setLoading(false);
  };

  // Mood logging
  const logUserMood = useCallback(async (moodData: Omit<MoodLog, 'timestamp'>) => {
    if (!user) return;
    setLoading(true);
    try {
      await logMood(user.uid, moodData);
      setError(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserMoodHistory = useCallback(async (limit?: number) => {
    if (!user) return [];
    setLoading(true);
    try {
      const history = await getMoodHistory(user.uid, limit);
      setError(null);
      return history;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Video history
  const addVideoToHistory = useCallback(async (videoData: Omit<VideoHistory, 'watchedAt'>) => {
    if (!user) return;
    setLoading(true);
    try {
      await addToVideoHistory(user.uid, videoData);
      setError(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserVideoHistory = useCallback(async (limit?: number) => {
    if (!user) return [];
    setLoading(true);
    try {
      const history = await getVideoHistory(user.uid, limit);
      setError(null);
      return history;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Saved memes
  const saveUserMeme = useCallback(async (memeData: Omit<SavedMeme, 'savedAt'>) => {
    if (!user) return;
    setLoading(true);
    try {
      await saveMeme(user.uid, memeData);
      setError(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeUserMeme = useCallback(async (memeId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await removeSavedMeme(user.uid, memeId);
      setError(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserSavedMemes = useCallback(async () => {
    if (!user) return [];
    setLoading(true);
    try {
      const memes = await getSavedMemes(user.uid);
      setError(null);
      return memes;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // User stats
  const getActivityStats = useCallback(async () => {
    if (!user) return null;
    setLoading(true);
    try {
      const stats = await getUserStats(user.uid);
      setError(null);
      return stats;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    logUserMood,
    getUserMoodHistory,
    addVideoToHistory,
    getUserVideoHistory,
    saveUserMeme,
    removeUserMeme,
    getUserSavedMemes,
    getActivityStats,
    loading,
    error,
  };
}; 