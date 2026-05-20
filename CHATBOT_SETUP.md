# Chatbot Integration with OpenRouter

## Setup Instructions

### 1. Get OpenRouter API Key

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key

### 2. Configure Environment Variable

Add the API key to your server environment:

```bash
# In server/.env file
OPENROUTER_API_KEY=your_actual_api_key_here
```

Or update `server/.env.example` and create a `server/.env` file with your actual key.

### 3. Start the Backend Server

```bash
# From the project root
npm run dev:server
```

The server will run on port 3001 by default.

### 4. Start the Frontend Development Server

```bash
# From the project root
npm run dev
```

Or run both simultaneously:

```bash
npm run dev:all
```

### 5. Test the Chatbot

1. Open your browser to `http://localhost:5173`
2. Click the robot icon in the bottom-right corner
3. Ask questions about Pedro's skills, projects, or experience

## Model Information

- **Model**: meta-llama/llama-3.2-3b-instruct
- **Cost**: ~$0.15 per million input tokens, $0.60 per million output tokens
- **Why this model**: Very affordable and efficient for portfolio chatbot use case

## Features

- Multilingual support (PT, EN, DE, ZH, ES)
- Context-aware responses based on portfolio data
- Rate limiting to prevent abuse
- Modern, responsive UI with dark theme

## API Endpoint

```
POST /api/chat
Content-Type: application/json

{
  "message": "What are Pedro's main skills?",
  "language": "pt"
}
```

## Troubleshooting

### Chatbot not responding
- Check that the backend server is running on port 3001
- Verify that OPENROUTER_API_KEY is set correctly
- Check browser console for errors

### CORS errors
- Ensure FRONTEND_URL is set correctly in server/.env
- The default allows http://localhost:5173 and http://localhost:3000

### Rate limiting
- The chatbot has rate limiting enabled to prevent abuse
- If you hit limits, wait a moment before trying again
