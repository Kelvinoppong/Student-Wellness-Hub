import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import { Send as SendIcon, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  text: string;
  isUser: boolean;
  mood?: string;
  emotion?: string;
  confidence?: number;
  allEmotions?: Array<{ emotion: string; score: number }>;
}

interface MoodAnalysis {
  mood: string;
  emotion: string;
  confidence: number;
  response: string;
  insight: string;
  all_emotions: Array<{ emotion: string; score: number }>;
}

export const MoodChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMessageIndex, setExpandedMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const userMessage: Message = {
      text: newMessage,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/analyze-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newMessage,
          user_id: currentUser.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze mood');
      }

      const data: MoodAnalysis = await response.json();

      const botMessage: Message = {
        text: `${data.response}\n\n${data.insight}`,
        isUser: false,
        mood: data.mood,
        emotion: data.emotion,
        confidence: data.confidence,
        allEmotions: data.all_emotions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error analyzing mood:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error while analyzing your mood. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const toggleDetails = (index: number) => {
    setExpandedMessageIndex(expandedMessageIndex === index ? null : index);
  };

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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto',
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                flexDirection: 'column',
                alignItems: message.isUser ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: message.isUser ? 'primary.light' : 'grey.100',
                  color: message.isUser ? 'white' : 'text.primary',
                }}
              >
                <ListItemText primary={message.text} />
                {!message.isUser && message.mood && (
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`Mood: ${message.mood}`}
                      sx={{
                        backgroundColor: getMoodColor(message.mood),
                        color: 'white',
                        mr: 1,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => toggleDetails(index)}
                      sx={{ ml: 1 }}
                    >
                      {expandedMessageIndex === index ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                    <Collapse in={expandedMessageIndex === index}>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Detected Emotion: {message.emotion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Confidence: {(message.confidence! * 100).toFixed(1)}%
                        </Typography>
                        {message.allEmotions && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Other detected emotions:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {message.allEmotions.slice(1).map((emotion, i) => (
                                <Chip
                                  key={i}
                                  label={`${emotion.emotion}: ${(emotion.score * 100).toFixed(1)}%`}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                )}
              </Paper>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share how you're feeling..."
          disabled={isLoading}
        />
        <Button
          variant="contained"
          endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          onClick={handleSend}
          disabled={isLoading || !newMessage.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
