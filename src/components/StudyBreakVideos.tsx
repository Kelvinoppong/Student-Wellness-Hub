import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { fetchStudyBreakVideos } from '../services/youtube';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
}

export const StudyBreakVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [category, setCategory] = useState<'yoga' | 'meditation' | 'stretching'>('yoga');

  useEffect(() => {
    loadVideos();
  }, [category]);

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedVideos = await fetchStudyBreakVideos(category);
      setVideos(fetchedVideos);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (
    _event: React.MouseEvent<HTMLElement>,
    newCategory: 'yoga' | 'meditation' | 'stretching'
  ) => {
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Study Break Videos
        </Typography>
        
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="video category"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="yoga">Yoga</ToggleButton>
          <ToggleButton value="meditation">Meditation</ToggleButton>
          <ToggleButton value="stretching">Stretching</ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="outlined"
          onClick={() => loadVideos()}
          sx={{ mb: 2 }}
        >
          Refresh Videos
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={video.thumbnail}
                alt={video.title}
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedVideo(video.id)}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.channelTitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        fullWidth
        maxWidth="md"
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
            onClick={() => setSelectedVideo(null)}
          >
            <CloseIcon />
          </IconButton>
          {selectedVideo && (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}; 