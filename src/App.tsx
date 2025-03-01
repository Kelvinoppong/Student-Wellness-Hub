import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { MoodAnalyzer } from './components/MoodAnalyzer';
import { StudyBreakVideos } from './components/StudyBreakVideos';
import { MemeGallery } from './components/MemeGallery';
import { WeatherWellness } from './components/WeatherWellness';
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF4081',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mood" element={<MoodAnalyzer />} />
              <Route path="/videos" element={<StudyBreakVideos />} />
              <Route path="/memes" element={<MemeGallery />} />
              <Route path="/weather" element={<WeatherWellness />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 