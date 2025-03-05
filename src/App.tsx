import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, CircularProgress, CssBaseline, PaletteMode } from '@mui/material';
import './App.css';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './components/dashboard/Dashboard';
import { MoodAnalyzer } from './components/MoodAnalyzer';
import { StudyBreakVideos } from './components/StudyBreakVideos';
import { MemeGallery } from './components/MemeGallery';
import { WeatherWellness } from './components/WeatherWellness';
import { AppointmentBooking } from './components/appointments/AppointmentBooking';
import { useAuthContext, AuthProvider } from './contexts/AuthContext';
import { ColorModeContext } from './contexts/ColorModeContext';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#5B8AF9' : '#7AA0FF', // Calming blue
      light: mode === 'light' ? '#83A8FF' : '#9CBDFF',
      dark: mode === 'light' ? '#3F6AD4' : '#5B8AF9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#FF8A65' : '#FFA78C', // Warm orange
      light: mode === 'light' ? '#FFA78C' : '#FFBEA8',
      dark: mode === 'light' ? '#E57254' : '#FF8A65',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#F8F9FF' : '#1A1A2E',
      paper: mode === 'light' ? '#FFFFFF' : '#262640',
    },
    success: {
      main: '#66BB6A', // Positive green
      light: '#81C784',
      dark: '#388E3C',
    },
    info: {
      main: '#64B5F6', // Soft blue
      light: '#90CAF9',
      dark: '#1E88E5',
    },
    warning: {
      main: '#FFC857', // Cheerful yellow
      light: '#FFD54F',
      dark: '#FFA000',
    },
    error: {
      main: '#EF6C6C', // Softer red
      light: '#FF8A80',
      dark: '#C62828',
    },
    text: {
      primary: mode === 'light' ? '#3A3A3A' : '#E0E0E0',
      secondary: mode === 'light' ? '#6B6B6B' : '#AEAEAE',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0 4px 20px rgba(0, 0, 0, 0.05)'
            : '0 4px 20px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#F8F9FF' : '#1A1A2E',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 1px 10px rgba(0, 0, 0, 0.1)'
            : '0 1px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>('light');
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<AppointmentBooking />} />
                <Route path="/mood" element={<MoodAnalyzer />} />
                <Route path="/videos" element={<StudyBreakVideos />} />
                <Route path="/memes" element={<MemeGallery />} />
                <Route path="/weather" element={<WeatherWellness />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* Default Routes */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ColorModeContext.Provider>
  );
};

export default App;