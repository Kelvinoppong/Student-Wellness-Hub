import axios from 'axios';

const OPENAI_API_BASE_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

interface MoodAnalysis {
  mood: string;
  intensity: number;
  suggestions: string[];
  explanation: string;
}

const systemPrompt = `You are a wellness expert and mood analyzer. Analyze the user's input (text or emoji) and provide:
1. The primary mood (e.g., happy, sad, anxious)
2. Mood intensity on a scale of 1-10
3. 3 personalized wellness activities or suggestions
4. A brief, empathetic explanation of the mood analysis
Format the response as a JSON object with keys: mood, intensity, suggestions, explanation.`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const validateMoodAnalysis = (data: any): data is MoodAnalysis => {
  return (
    typeof data === 'object' &&
    typeof data.mood === 'string' &&
    typeof data.intensity === 'number' &&
    Array.isArray(data.suggestions) &&
    typeof data.explanation === 'string' &&
    data.intensity >= 1 &&
    data.intensity <= 10 &&
    data.suggestions.length > 0
  );
};

export const analyzeMood = async (input: string): Promise<MoodAnalysis> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await delay(RETRY_DELAY);
      }

      const response = await axios.post(
        OPENAI_API_BASE_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Please analyze this mood input: "${input}"`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Invalid response from OpenAI API');
      }

      let result;
      try {
        result = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        throw new Error('Failed to parse mood analysis result');
      }

      if (!validateMoodAnalysis(result)) {
        console.error('Invalid mood analysis result:', result);
        throw new Error('Invalid mood analysis format');
      }

      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      // Don't retry if it's a configuration error
      if (error.response?.status === 401) {
        throw new Error('OpenAI API key is invalid');
      }
      
      // Don't retry if it's a validation error
      if (error.message === 'Invalid mood analysis format' || 
          error.message === 'Failed to parse mood analysis result') {
        throw error;
      }

      // If it's the last attempt, throw the error
      if (attempt === MAX_RETRIES) {
        throw new Error(
          error.response?.data?.error?.message ||
          error.message ||
          'Failed to analyze mood'
        );
      }
    }
  }

  // This should never happen due to the throw in the loop
  throw lastError || new Error('Failed to analyze mood');
}; 