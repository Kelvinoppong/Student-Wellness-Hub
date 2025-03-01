import axios from 'axios';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
}

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const MAX_DURATION = 'PT5M'; // 5 minutes in ISO 8601 duration format

export const fetchStudyBreakVideos = async (
  category: 'yoga' | 'meditation' | 'stretching' = 'yoga',
  maxResults: number = 6
): Promise<YouTubeVideo[]> => {
  try {
    // Search for videos
    const searchResponse = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults,
        q: `5 minute ${category} break`,
        type: 'video',
        videoDuration: 'short', // Only short videos
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
      },
    });

    // Get video details including duration
    const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId).join(',');
    const videosResponse = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        part: 'contentDetails,snippet',
        id: videoIds,
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
      },
    });

    // Filter and format videos
    return videosResponse.data.items
      .filter((video: any) => {
        const duration = video.contentDetails.duration;
        return duration <= MAX_DURATION;
      })
      .map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
        duration: video.contentDetails.duration,
        channelTitle: video.snippet.channelTitle,
      }));
  } catch (error: any) {
    console.error('Error fetching YouTube videos:', error);
    throw new Error('Failed to fetch study break videos. Please try again.');
  }
}; 