import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timeline,
  InsertEmoticon,
  ShowChart,
  Psychology,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface MoodStats {
  total_entries: number;
  mood_distribution: { [key: string]: number };
  most_common_mood: string;
  average_confidence: number;
}

export const MoodStats: React.FC = () => {
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch(
          `http://localhost:8000/mood-stats/${currentUser.uid}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch mood stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching mood stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      Happy: '#4CAF50',
      Sad: '#2196F3',
      Anxious: '#FFC107',
      Angry: '#f44336',
      Positive: '#8BC34A',
      Neutral: '#9E9E9E',
    };
    return colors[mood] || '#9E9E9E';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Typography color="text.secondary" align="center">
        No mood data available yet. Start chatting to track your moods!
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Timeline sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Total Entries</Typography>
            </Box>
            <Typography variant="h3" align="center" color="primary">
              {stats.total_entries}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <InsertEmoticon sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="h6">Most Common Mood</Typography>
            </Box>
            <Typography
              variant="h4"
              align="center"
              sx={{ color: getMoodColor(stats.most_common_mood) }}
            >
              {stats.most_common_mood || 'N/A'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <ShowChart sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6">Mood Distribution</Typography>
            </Box>
            <Grid container spacing={2}>
              {Object.entries(stats.mood_distribution).map(([mood, count]) => (
                <Grid item xs={6} sm={4} md={3} key={mood}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      backgroundColor: getMoodColor(mood),
                      color: 'white',
                    }}
                  >
                    <Typography variant="h6">{mood}</Typography>
                    <Typography variant="h4">{count}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Psychology sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6">Analysis Confidence</Typography>
            </Box>
            <Typography variant="h4" align="center" color="success.main">
              {(stats.average_confidence * 100).toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
