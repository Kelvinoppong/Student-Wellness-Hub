import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  WbSunny,
  Opacity,
  Air,
  Home,
  Refresh,
  LocationOn,
} from '@mui/icons-material';
import { getWeatherData, getWellnessSuggestions } from '../services/weather';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  cityName: string;
}

interface WellnessSuggestion {
  activity: string;
  description: string;
  indoor: boolean;
}

export const WeatherWellness: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState<WellnessSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = () => {
    setLoading(true);
    setError(null);

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const weatherData = await getWeatherData(
            position.coords.latitude,
            position.coords.longitude
          );
          setWeather(weatherData);
          setSuggestions(getWellnessSuggestions(weatherData));
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err: GeolocationPositionError) => {
        setError(`Location error: ${err.message}`);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {weather && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="div">
                  <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {weather.cityName}
                </Typography>
                <Tooltip title="Refresh weather">
                  <IconButton onClick={fetchWeatherData} size="small">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.condition}
                  style={{ width: 50, height: 50 }}
                />
                <Typography variant="h3" component="div" sx={{ ml: 2 }}>
                  {weather.temperature}°C
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box display="flex" alignItems="center">
                    <WbSunny sx={{ mr: 1 }} />
                    <Typography variant="body2">{weather.condition}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box display="flex" alignItems="center">
                    <Opacity sx={{ mr: 1 }} />
                    <Typography variant="body2">{weather.humidity}% Humidity</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box display="flex" alignItems="center">
                    <Air sx={{ mr: 1 }} />
                    <Typography variant="body2">{weather.windSpeed} m/s Wind</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom>
            Wellness Suggestions
          </Typography>

          <Grid container spacing={2}>
            {suggestions.map((suggestion, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h6" component="div">
                        {suggestion.activity}
                      </Typography>
                      <Chip
                        icon={<Home />}
                        label={suggestion.indoor ? 'Indoor' : 'Outdoor'}
                        size="small"
                        color={suggestion.indoor ? 'default' : 'primary'}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {suggestion.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}; 