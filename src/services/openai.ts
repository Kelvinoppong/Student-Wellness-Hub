import axios from 'axios';

interface MoodAnalysis {
  mood: string;
  intensity: number;
  suggestions: string[];
  explanation: string;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const systemPrompt = `You are a wellness expert and mood analyzer. Analyze the user's input (text or emoji) and provide:
1. The primary mood (e.g., happy, sad, anxious)
2. Mood intensity on a scale of 1-10
3. 3 personalized wellness activities or suggestions
4. A brief, empathetic explanation of the mood analysis
Format the response as a JSON object with keys: mood, intensity, suggestions, explanation.`;

export const analyzeMood = async (input: string): Promise<MoodAnalysis> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
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
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);
    return result as MoodAnalysis;
  } catch (error: any) {
    console.error('Error analyzing mood:', error);
    throw new Error('Failed to analyze mood. Please try again.');
  }
}; 