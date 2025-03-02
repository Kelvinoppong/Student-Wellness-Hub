import axios from 'axios';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, config: any, retries = MAX_RETRIES): Promise<any> => {
  try {
    return await axios.get(url, config);
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 403) {
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, config, retries - 1);
    }
    throw error;
  }
};

export const fetchStudyBreakVideos = async (
  category: string = 'study break meditation',
  maxResults: number = 10
): Promise<YouTubeVideo[]> => {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured');
    }

    const response = await fetchWithRetry(
      `${YOUTUBE_API_BASE_URL}/search`,
      {
        params: {
          part: 'snippet',
          q: category,
          type: 'video',
          maxResults,
          key: YOUTUBE_API_KEY,
          videoDuration: 'short',
          videoEmbeddable: true,
          safeSearch: 'strict',
        },
      }
    );

    if (!response.data?.items?.length) {
      return [];
    }

    return response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error: any) {
    console.error('Error fetching YouTube videos:', error);
    if (error.response?.status === 403) {
      throw new Error('YouTube API access denied. Please check your API key configuration.');
    }
    throw new Error('Failed to fetch YouTube videos. Please try again later.');
  }
}; 