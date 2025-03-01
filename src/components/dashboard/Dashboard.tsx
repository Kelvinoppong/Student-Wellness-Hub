import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Mood,
  OndemandVideo,
  TagFaces,
  WbSunny,
  TrendingUp,
} from '@mui/icons-material';
import { useUserActivity } from '../../hooks/useUserActivity';
import { WeatherWellness } from '../WeatherWellness';
import { Link } from 'react-router-dom';

interface UserStats {
  totalMoodLogs: number;
  totalVideosWatched: number;
  totalSavedMemes: number;
  lastActive: Date | null;
}

export const Dashboard: React.FC = () => {
  const { getActivityStats, getUserMoodHistory, loading } = useUserActivity();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [lastMood, setLastMood] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      const [userStats, moodHistory] = await Promise.all([
        getActivityStats(),
        getUserMoodHistory(1),
      ]);
      setStats(userStats);
      if (moodHistory.length > 0) {
        setLastMood(moodHistory[0].mood);
      }
    };
    loadDashboardData();
  }, [getActivityStats, getUserMoodHistory]);

  const quickActions = [
    {
      title: 'Track Mood',
      icon: <Mood fontSize="large" />,
      path: '/mood',
      color: '#4CAF50',
    },
    {
      title: 'Take a Break',
      icon: <OndemandVideo fontSize="large" />,
      path: '/videos',
      color: '#2196F3',
    },
    {
      title: 'View Memes',
      icon: <TagFaces fontSize="large" />,
      path: '/memes',
      color: '#FF9800',
    },
    {
      title: 'Check Weather',
      icon: <WbSunny fontSize="large" />,
      path: '/weather',
      color: '#9C27B0',
    },
  ];

  if (loading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Quick Actions */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action) => (
            <Grid item xs={6} sm={3} key={action.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                component={Link}
                to={action.path}
              >
                <Box sx={{ color: action.color, mb: 1 }}>{action.icon}</Box>
                <Typography variant="subtitle1" align="center">
                  {action.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Activity Stats */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <TrendingUp sx={{ verticalAlign: 'middle', mr: 1 }} />
              Activity Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4">{stats?.totalMoodLogs || 0}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Mood Logs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4">{stats?.totalVideosWatched || 0}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Videos Watched
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4">{stats?.totalSavedMemes || 0}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Saved Memes
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Weather Widget */}
      <Grid item xs={12} md={4}>
        <WeatherWellness />
      </Grid>

      {/* Last Mood */}
      {lastMood && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Mood sx={{ verticalAlign: 'middle', mr: 1 }} />
                Last Recorded Mood
              </Typography>
              <Typography variant="h5" color="primary">
                {lastMood}
              </Typography>
              <Button
                component={Link}
                to="/mood"
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                Update Mood
              </Button>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}; 