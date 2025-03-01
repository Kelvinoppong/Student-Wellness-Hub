import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  CircularProgress,
  Dialog,
} from '@mui/material';
import { fetchGifs } from '../services/giphy';

interface GiphyGif {
  id: string;
  title: string;
  url: string;
  images: {
    fixed_height: {
      url: string;
      height: string;
      width: string;
    };
  };
}

export const MemeGallery: React.FC = () => {
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<'relaxing' | 'funny' | 'study' | 'motivation'>('funny');
  const [selectedGif, setSelectedGif] = useState<GiphyGif | null>(null);

  useEffect(() => {
    loadGifs();
  }, [category]);

  const loadGifs = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedGifs = await fetchGifs(category);
      setGifs(fetchedGifs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (
    _event: React.MouseEvent<HTMLElement>,
    newCategory: 'relaxing' | 'funny' | 'study' | 'motivation'
  ) => {
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Meme Gallery
        </Typography>

        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="meme category"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="funny">Funny</ToggleButton>
          <ToggleButton value="relaxing">Relaxing</ToggleButton>
          <ToggleButton value="study">Study</ToggleButton>
          <ToggleButton value="motivation">Motivation</ToggleButton>
        </ToggleButtonGroup>

        <Button variant="outlined" onClick={loadGifs} sx={{ mb: 2 }}>
          Load More Memes
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

      <Grid container spacing={2}>
        {gifs.map((gif) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={gif.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
              onClick={() => setSelectedGif(gif)}
            >
              <CardMedia
                component="img"
                image={gif.images.fixed_height.url}
                alt={gif.title}
                sx={{
                  height: 200,
                  objectFit: 'cover',
                }}
              />
              <CardContent>
                <Typography variant="body2" noWrap>
                  {gif.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedGif}
        onClose={() => setSelectedGif(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedGif && (
          <Box sx={{ p: 2 }}>
            <img
              src={selectedGif.images.fixed_height.url}
              alt={selectedGif.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
            <Typography variant="body1" align="center" sx={{ mt: 1 }}>
              {selectedGif.title}
            </Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}; 