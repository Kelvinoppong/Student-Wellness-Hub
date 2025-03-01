# Student Wellness Hub - Project Setup Guide

## Initial Setup

1. Create a new React project:
```bash
npx create-react-app student-wellness-hub --template typescript
cd student-wellness-hub
```

2. Install required dependencies:
```bash
npm install firebase @firebase/auth @firebase/firestore
npm install axios dotenv
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom
```

3. Create a `.env` file in the root directory:
```plaintext
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# OpenAI API
REACT_APP_OPENAI_API_KEY=your_openai_api_key

# YouTube Data API
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key

# GIPHY API
REACT_APP_GIPHY_API_KEY=your_giphy_api_key

# OpenWeatherMap API
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key
```

4. Add `.env` to your `.gitignore` file to keep your API keys secure:
```plaintext
# environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Important Notes:
- Never commit your `.env` file to version control
- Keep your API keys secure and rotate them if they're ever exposed
- Make sure to enable the necessary services in your Firebase console
- Set up proper authentication and security rules in Firebase

## Getting Started

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## API Setup Requirements

1. **Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Copy your Firebase configuration to the `.env` file

2. **OpenAI API**
   - Get your API key from [OpenAI Platform](https://platform.openai.com/)
   - Add the key to your `.env` file

3. **YouTube Data API**
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable YouTube Data API v3
   - Create credentials and copy the API key

4. **GIPHY API**
   - Create an account at [GIPHY Developers](https://developers.giphy.com/)
   - Create a new app to get your API key

5. **OpenWeatherMap API**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your API key from your account dashboard 