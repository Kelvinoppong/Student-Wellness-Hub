import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { Mood as MoodIcon, EmojiEmotions, SentimentSatisfied } from '@mui/icons-material';
import { analyzeMood } from '../services/openai';
import { logMood } from '../services/userActivity';
import { useAuthContext } from '../contexts/AuthContext';

interface MoodAnalysisResult {
  mood: string;
  intensity: number;
  suggestions: string[];
  explanation: string;
}

export const MoodAnalyzer: React.FC = () => {
  const { user } = useAuthContext();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MoodAnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    setLoading(true);
    setError(null);

    try {
      const analysis = await analyzeMood(input);
      setResult(analysis);
      // Log the mood for the authenticated user
      await logMood(user.uid, {
        mood: analysis.mood,
        intensity: analysis.intensity,
        activities: analysis.suggestions
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (intensity: number) => {
    if (intensity <= 3) return '#4CAF50'; // Green for low intensity
    if (intensity <= 7) return '#FFC107'; // Yellow for medium intensity
    return '#F44336'; // Red for high intensity
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Mood Analyzer
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="How are you feeling? (Use text or emojis)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            multiline
            rows={3}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !input.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Mood'}
          </Button>
        </form>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {result && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEmotions sx={{ mr: 1 }} />
              <Typography variant="h6">
                Mood: {result.mood}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MoodIcon sx={{ mr: 1 }} />
              <Typography>
                Intensity:{' '}
                <span style={{ color: getMoodColor(result.intensity) }}>
                  {result.intensity}/10
                </span>
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {result.explanation}
            </Typography>

            <Typography variant="h6" sx={{ mb: 1 }}>
              Suggested Activities:
            </Typography>
            <List>
              {result.suggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <SentimentSatisfied />
                  </ListItemIcon>
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}; 