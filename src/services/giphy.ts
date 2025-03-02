import axios from 'axios';

const GIPHY_API_BASE_URL = 'https://api.giphy.com/v1/gifs';
const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

export interface GiphyGif {
  id: string;
  title: string;
  url: string;
  images: {
    original: {
      url: string;
    };
    fixed_height: {
      url: string;
    };
  };
}

export const fetchGifs = async (query: string = 'happy', limit: number = 20): Promise<GiphyGif[]> => {
  try {
    const response = await axios.get(`${GIPHY_API_BASE_URL}/search`, {
      params: {
        api_key: GIPHY_API_KEY,
        q: query,
        limit,
        rating: 'g',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching GIFs:', error);
    throw new Error('Failed to fetch GIFs');
  }
}; 