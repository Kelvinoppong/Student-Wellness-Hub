import axios from 'axios';

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

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(OPENWEATHER_API_URL, {
      params: {
        lat,
        lon,
        appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
        units: 'metric', // Use Celsius
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
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data. Please try again.');
  }
};

export const getWellnessSuggestions = (weatherData: WeatherData): WellnessSuggestion[] => {
  const { temperature, condition } = weatherData;
  const suggestions: WellnessSuggestion[] = [];

  // Temperature-based suggestions
  if (temperature < 10) {
    suggestions.push({
      activity: 'Indoor Yoga',
      description: 'Stay warm with some gentle indoor yoga exercises',
      indoor: true,
    });
  } else if (temperature > 25) {
    suggestions.push({
      activity: 'Stay Hydrated',
      description: 'Remember to drink plenty of water and avoid prolonged sun exposure',
      indoor: true,
    });
  }

  // Weather condition-based suggestions
  switch (condition.toLowerCase()) {
    case 'clear':
      suggestions.push({
        activity: 'Outdoor Meditation',
        description: 'Perfect weather for outdoor mindfulness practice',
        indoor: false,
      });
      break;
    case 'rain':
      suggestions.push({
        activity: 'Indoor Reading',
        description: 'Cozy up with a book and enjoy the rain sounds',
        indoor: true,
      });
      break;
    case 'clouds':
      suggestions.push({
        activity: 'Light Exercise',
        description: 'Good conditions for a brisk walk or light outdoor activity',
        indoor: false,
      });
      break;
    default:
      suggestions.push({
        activity: 'Stretching',
        description: 'Do some simple stretching exercises to stay active',
        indoor: true,
      });
  }

  // Add a general wellness suggestion
  suggestions.push({
    activity: 'Deep Breathing',
    description: 'Take a moment for deep breathing exercises',
    indoor: true,
  });

  return suggestions;
}; 