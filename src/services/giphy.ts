import axios from 'axios';

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

const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs';

export const fetchGifs = async (
  category: 'relaxing' | 'funny' | 'study' | 'motivation' = 'funny',
  limit: number = 12
): Promise<GiphyGif[]> => {
  try {
    const response = await axios.get(`${GIPHY_API_URL}/search`, {
      params: {
        api_key: process.env.REACT_APP_GIPHY_API_KEY,
        q: `${category} meme`,
        limit,
        rating: 'g', // G-rated content only
        lang: 'en',
      },
    });

    return response.data.data.map((gif: any) => ({
      id: gif.id,
      title: gif.title,
      url: gif.url,
      images: gif.images,
    }));
  } catch (error: any) {
    console.error('Error fetching GIFs:', error);
    throw new Error('Failed to fetch GIFs. Please try again.');
  }
}; 