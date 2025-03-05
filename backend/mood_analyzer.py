from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

class MoodAnalyzer:
    def __init__(self):
        # Load sentiment analysis model
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="SamLowe/roberta-base-go_emotions",
            top_k=3
        )
        
        # Load conversation model
        self.conversation_model_name = "facebook/blenderbot-400M-distill"
        self.conversation_tokenizer = AutoTokenizer.from_pretrained(self.conversation_model_name)
        self.conversation_model = AutoModelForSequenceClassification.from_pretrained(self.conversation_model_name)
        
    def analyze_mood(self, text: str) -> dict:
        """Analyze the mood/emotion from the text."""
        results = self.sentiment_analyzer(text)
        
        # Map emotions to more general moods
        mood_mapping = {
            'admiration': 'Positive',
            'amusement': 'Happy',
            'anger': 'Angry',
            'annoyance': 'Irritated',
            'approval': 'Positive',
            'caring': 'Compassionate',
            'confusion': 'Confused',
            'curiosity': 'Interested',
            'desire': 'Excited',
            'disappointment': 'Sad',
            'disapproval': 'Negative',
            'disgust': 'Angry',
            'embarrassment': 'Anxious',
            'excitement': 'Excited',
            'fear': 'Anxious',
            'gratitude': 'Happy',
            'grief': 'Sad',
            'joy': 'Happy',
            'love': 'Happy',
            'nervousness': 'Anxious',
            'optimism': 'Positive',
            'pride': 'Happy',
            'realization': 'Neutral',
            'relief': 'Positive',
            'remorse': 'Sad',
            'sadness': 'Sad',
            'surprise': 'Surprised',
            'neutral': 'Neutral'
        }
        
        # Get the top emotion and its score
        top_emotion = results[0][0]
        emotion_score = results[0][1]
        
        # Map to general mood
        mood = mood_mapping.get(top_emotion['label'].lower(), 'Neutral')
        
        return {
            'mood': mood,
            'emotion': top_emotion['label'],
            'confidence': emotion_score,
            'all_emotions': [
                {'emotion': result['label'], 'score': result['score']}
                for result in results[0]
            ]
        }
    
    def generate_response(self, mood: str, emotion: str) -> str:
        """Generate an appropriate response based on the detected mood and emotion."""
        responses = {
            'Happy': [
                "I'm glad you're feeling happy! What's bringing joy to your day?",
                "That's wonderful! Would you like to share what's making you feel this way?",
                "Your happiness is contagious! What's the highlight of your day?"
            ],
            'Sad': [
                "I hear that you're feeling down. Would you like to talk about what's troubling you?",
                "It's okay to feel sad sometimes. I'm here to listen if you want to share.",
                "I'm sorry you're feeling sad. Is there something specific that's causing these feelings?"
            ],
            'Anxious': [
                "I notice you're feeling anxious. Remember to take deep breaths. Want to talk about what's on your mind?",
                "Anxiety can be overwhelming. Would you like to discuss what's making you feel this way?",
                "It's normal to feel anxious sometimes. Is there something specific that's causing your anxiety?"
            ],
            'Angry': [
                "I can sense that you're frustrated. Would you like to talk about what's bothering you?",
                "It's okay to feel angry. Would you like to share what triggered these feelings?",
                "I understand you're feeling angry. Let's talk about what's causing this emotion."
            ],
            'Positive': [
                "It's great to see you in such a positive mood! What's contributing to these good feelings?",
                "Your positive attitude is wonderful! Would you like to share what's going well?",
                "I'm glad you're feeling positive! What's making you feel this way?"
            ],
            'Neutral': [
                "How has your day been going so far?",
                "Would you like to talk about anything specific?",
                "I'm here to listen if you'd like to share your thoughts."
            ]
        }
        
        import random
        default_responses = responses['Neutral']
        mood_responses = responses.get(mood, default_responses)
        return random.choice(mood_responses)

    def track_mood_changes(self, current_mood: str, previous_moods: list) -> str:
        """Analyze mood changes and provide insights."""
        if not previous_moods:
            return "This is your first mood log. Keep sharing how you feel to track your emotional journey!"
        
        if len(previous_moods) >= 2:
            last_mood = previous_moods[-1]
            if current_mood == last_mood:
                return f"I notice you're still feeling {current_mood.lower()}. Would you like to talk about it?"
            else:
                return f"I notice your mood has changed from {last_mood.lower()} to {current_mood.lower()}. How do you feel about this change?"
        
        return "Thank you for sharing your feelings. Would you like to talk more about it?"
