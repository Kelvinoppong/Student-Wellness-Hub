import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { fetchStudyBreakVideos, YouTubeVideo } from '../services/youtube';
import { useUserActivity } from '../hooks/useUserActivity';

const categories = [
  { value: 'study break meditation', label: 'Meditation' },
  { value: 'quick yoga routine', label: 'Yoga' },
  { value: '5 minute stretching', label: 'Stretching' },
  { value: 'desk exercises', label: 'Desk Exercises' },
];

export const StudyBreakVideos: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(categories[0].value);
  const { addVideoToHistory } = useUserActivity();

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedVideos = await fetchStudyBreakVideos(category);
      setVideos(fetchedVideos);
    } catch (err: any) {
      setError(err.message);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [category]);

  const handleVideoClick = async (video: YouTubeVideo) => {
    try {
      await addVideoToHistory({
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        category: category,
      });
      window.open(video.videoUrl, '_blank');
    } catch (err) {
      console.error('Error logging video history:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Study Break Videos
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Take a short break with these curated videos to help you relax and recharge.
        </Typography>
        
        <FormControl sx={{ minWidth: 200, mb: 3 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={loadVideos}>
                Try Again
              </Button>
            }
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                onClick={() => handleVideoClick(video)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={video.thumbnail}
                  alt={video.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {video.channelTitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!loading && videos.length === 0 && !error && (
            <Grid item xs={12}>
              <Alert severity="info">
                No videos found for this category. Try selecting a different category.
              </Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}; 