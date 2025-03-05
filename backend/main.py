from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import json
import os
from mood_analyzer import MoodAnalyzer

app = FastAPI()
mood_analyzer = MoodAnalyzer()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str
    user_id: str

class MoodHistory(BaseModel):
    mood: str
    emotion: str
    timestamp: str
    message: str
    confidence: float

# Store mood history
MOOD_HISTORY_FILE = "mood_history.json"

def load_mood_history() -> Dict:
    if os.path.exists(MOOD_HISTORY_FILE):
        with open(MOOD_HISTORY_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_mood_history(history: Dict):
    with open(MOOD_HISTORY_FILE, 'w') as f:
        json.dump(history, f)

mood_history = load_mood_history()

@app.post("/analyze-mood")
async def analyze_mood(message: Message):
    try:
        # Analyze mood from message
        analysis = mood_analyzer.analyze_mood(message.text)
        
        # Generate response based on mood
        response = mood_analyzer.generate_response(analysis['mood'], analysis['emotion'])
        
        # Get previous moods for this user
        user_moods = mood_history.get(message.user_id, [])
        previous_moods = [entry['mood'] for entry in user_moods]
        
        # Get insight about mood changes
        mood_insight = mood_analyzer.track_mood_changes(analysis['mood'], previous_moods)
        
        # Store mood in history
        if message.user_id not in mood_history:
            mood_history[message.user_id] = []
            
        mood_history[message.user_id].append({
            'mood': analysis['mood'],
            'emotion': analysis['emotion'],
            'message': message.text,
            'confidence': analysis['confidence'],
            'timestamp': str(datetime.now())
        })
        save_mood_history(mood_history)
        
        return {
            'mood': analysis['mood'],
            'emotion': analysis['emotion'],
            'confidence': analysis['confidence'],
            'response': response,
            'insight': mood_insight,
            'all_emotions': analysis['all_emotions']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/mood-history/{user_id}")
async def get_mood_history(user_id: str, limit: Optional[int] = None):
    if user_id not in mood_history:
        return []
    history = mood_history[user_id]
    if limit:
        history = history[-limit:]
    return history

@app.get("/mood-stats/{user_id}")
async def get_mood_stats(user_id: str):
    if user_id not in mood_history:
        return {
            'total_entries': 0,
            'mood_distribution': {},
            'most_common_mood': None,
            'average_confidence': 0
        }
    
    history = mood_history[user_id]
    mood_counts = {}
    total_confidence = 0
    
    for entry in history:
        mood = entry['mood']
        mood_counts[mood] = mood_counts.get(mood, 0) + 1
        total_confidence += entry['confidence']
    
    most_common_mood = max(mood_counts.items(), key=lambda x: x[1])[0] if mood_counts else None
    
    return {
        'total_entries': len(history),
        'mood_distribution': mood_counts,
        'most_common_mood': most_common_mood,
        'average_confidence': total_confidence / len(history) if history else 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
