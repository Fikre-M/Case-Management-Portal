# AI Integration Guide

## Overview

The AI Case Management System now supports real OpenAI integration alongside the existing mock responses. The system automatically detects whether a valid OpenAI API key is configured and switches between real AI responses and mock responses accordingly.

## Setup Instructions

### 1. Install Dependencies

The OpenAI SDK is already installed:
```bash
npm install openai
```

### 2. Configure API Key

Add your OpenAI API key to the `.env` file:
```env
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

**Security Note**: In production, never expose API keys in the frontend. Use a backend proxy instead.

### 3. Service Status

The AI service automatically detects the configuration:
- ✅ **OpenAI Mode**: Valid API key configured, uses GPT-3.5-turbo
- 🟡 **Demo Mode**: Placeholder/invalid key, uses mock responses

## Features

### AI Service (`src/services/aiService.js`)

- **Automatic Fallback**: Falls back to mock responses if OpenAI fails
- **Status Detection**: Provides service status information
- **Professional Prompts**: Optimized system prompt for legal assistance
- **Error Handling**: Graceful error handling with fallback responses

### Available Functions

```javascript
import { 
  sendMessage, 
  getSuggestedPrompts, 
  getQuickActions,
  isOpenAIAvailable,
  getServiceStatus 
} from './services/aiService'

// Send message to AI
const response = await sendMessage("Help me draft a contract")

// Check if OpenAI is available
const hasOpenAI = isOpenAIAvailable()

// Get service status
const status = getServiceStatus()
// Returns: { provider: 'OpenAI'|'Mock', available: boolean, model: string }
```

### UI Integration

The AI Chat page (`src/pages/ai/AiChatPage.jsx`) includes:
- Service status indicator (green dot for OpenAI, yellow for demo)
- Provider and model information display
- Seamless switching between real and mock responses

## Configuration Options

### Environment Variables

```env
# Required for OpenAI integration
VITE_OPENAI_API_KEY=sk-your-key-here

# Other AI-related settings
VITE_AI_SERVICE_URL=          # Reserved for future backend integration
VITE_ENABLE_ANALYTICS=false   # AI usage analytics
```

### OpenAI Settings

Current configuration in `aiService.js`:
- **Model**: `gpt-3.5-turbo`
- **Max Tokens**: 500
- **Temperature**: 0.7 (balanced creativity)
- **System Prompt**: Optimized for legal assistance

## Security Considerations

⚠️ **Important Security Notes**:

1. **Client-Side API Keys**: Currently uses `dangerouslyAllowBrowser: true` for demo purposes
2. **Production Setup**: Implement a backend proxy to hide API keys
3. **Rate Limiting**: Consider implementing rate limiting for API calls
4. **Data Privacy**: Ensure client data privacy when using external AI services

## Production Recommendations

For production deployment:

1. **Backend Proxy**: Create a backend endpoint that handles OpenAI calls
2. **Authentication**: Secure the AI endpoints with proper authentication
3. **Rate Limiting**: Implement per-user rate limiting
4. **Logging**: Add comprehensive logging for AI interactions
5. **Monitoring**: Monitor API usage and costs
6. **Fallback Strategy**: Always maintain mock responses as fallback

## Testing

The system can be tested in both modes:

1. **Demo Mode**: Use placeholder API key to test mock responses
2. **OpenAI Mode**: Add real API key to test actual AI integration
3. **Error Handling**: Test with invalid API key to verify fallback behavior

## Troubleshooting

### Common Issues

1. **API Key Not Working**: Ensure key starts with `sk-` and is valid
2. **CORS Errors**: Expected in production - use backend proxy
3. **Rate Limits**: OpenAI has rate limits - implement proper error handling
4. **Network Issues**: Service automatically falls back to mock responses

### Debug Information

Check browser console for:
- OpenAI client initialization status
- API call errors and fallback triggers
- Service status information

## Future Enhancements

Planned improvements:
- Backend proxy implementation
- Multiple AI provider support
- Conversation memory and context
- Custom model fine-tuning
- Advanced prompt engineering
- Usage analytics and monitoring