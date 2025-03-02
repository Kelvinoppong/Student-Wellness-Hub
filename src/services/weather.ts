import axios from 'axios';

const OPENWEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  cityName: string;
}

export interface WellnessSuggestion {
  activity: string;
  description: string;
  indoor: boolean;
}

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${OPENWEATHER_API_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    return {
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      icon: response.data.weather[0].icon,
      cityName: response.data.name,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

export const getWellnessSuggestions = (weather: WeatherData): WellnessSuggestion[] => {
  const suggestions: WellnessSuggestion[] = [];

  // Temperature-based suggestions
  if (weather.temperature < 10) {
    suggestions.push({
      activity: 'Indoor Exercise',
      description: 'Stay warm with indoor yoga or stretching.',
      indoor: true,
    });
  } else if (weather.temperature > 25) {
    suggestions.push({
      activity: 'Stay Hydrated',
      description: 'Remember to drink plenty of water and stay in shade.',
      indoor: true,
    });
  } else {
    suggestions.push({
      activity: 'Outdoor Walk',
      description: 'Perfect temperature for a refreshing walk.',
      indoor: false,
    });
  }

  // Weather condition-based suggestions
  switch (weather.condition.toLowerCase()) {
    case 'clear':
      suggestions.push({
        activity: 'Outdoor Meditation',
        description: 'Take advantage of the clear weather with outdoor mindfulness.',
        indoor: false,
      });
      break;
    case 'rain':
      suggestions.push({
        activity: 'Reading Session',
        description: 'Perfect weather to cozy up with a good book.',
        indoor: true,
      });
      break;
    case 'clouds':
      suggestions.push({
        activity: 'Light Exercise',
        description: 'Good conditions for light outdoor exercise.',
        indoor: false,
      });
      break;
    default:
      suggestions.push({
        activity: 'Mindfulness Break',
        description: 'Take a moment for mindfulness and deep breathing.',
        indoor: true,
      });
  }

  return suggestions;
}; 