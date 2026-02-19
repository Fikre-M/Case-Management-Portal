# AI Features Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Choose Your Mode

#### Option A: Demo Mode (No API Key Required) ⭐ Recommended for Testing

```bash
# Your .env file (default)
VITE_OPENAI_API_KEY=sk-placeholder-replace-with-actual-key
VITE_AI_ENABLED=true
VITE_USE_LOW_COST_MODEL=true
```

**Result**: AI works with intelligent mock responses, no costs!

#### Option B: Real AI Mode (Requires OpenAI API Key)

```bash
# Your .env file
VITE_OPENAI_API_KEY=sk-your-actual-openai-key-here
VITE_AI_ENABLED=true
VITE_USE_LOW_COST_MODEL=true
```

**Result**: Real GPT-3.5-turbo responses, minimal costs with optimization!

### Step 2: Start the Application

```bash
npm run dev
```

### Step 3: Try AI Features

1. **Click the floating 🤖 button** (bottom-right corner)
2. **Type a message** like "Help me with my cases"
3. **Get AI response** instantly!

## 🎯 Key Features to Try

### 1. AI Assistant Chat
- Click floating 🤖 button
- Ask questions about cases or appointments
- Get context-aware responses
- View conversation history

### 2. Smart Suggestions
- Go to Dashboard
- See AI-powered suggestions
- Click any suggestion for instant help
- Dismiss suggestions you don't need

### 3. Context-Aware Help
- Open a case detail page
- Click "Ask AI about this case"
- AI understands your case context
- Get specific, relevant advice

### 4. AI Dashboard
- Navigate to `/ai-dashboard`
- View usage statistics
- Manage conversation history
- Configure AI settings

## 💡 Quick Tips

### Cost Savings
- ✅ Keep `VITE_USE_LOW_COST_MODEL=true` (saves 40%)
- ✅ Use demo mode for development
- ✅ Only use real API for final testing
- ✅ Monitor usage at platform.openai.com

### Best Experience
- ✅ Provide context (open a case first)
- ✅ Ask specific questions
- ✅ Use quick action buttons
- ✅ Check smart suggestions

### Troubleshooting
- ❓ AI not responding? Check `.env` file
- ❓ Error messages? Read the error banner
- ❓ Rate limited? Wait 60 seconds
- ❓ High costs? Enable low-cost mode

## 📊 What to Expect

### Demo Mode (Mock Responses)
- ⚡ Instant responses
- 💰 Zero costs
- 🎯 Pattern-based intelligence
- ✅ Perfect for development

### Real AI Mode (OpenAI)
- 🤖 GPT-3.5-turbo responses
- 💰 ~$0.0008 per message (low-cost mode)
- 🎯 Context-aware intelligence
- ✅ Production-quality responses

## 🔧 Configuration Options

### Disable AI Completely
```env
VITE_AI_ENABLED=false
```
Hides all AI features, no API calls.

### Standard Mode (More Tokens)
```env
VITE_USE_LOW_COST_MODEL=false
```
500 tokens max instead of 300 (higher cost).

### Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Create API key
4. Add to `.env` file

## 📚 Learn More

- **Full Guide**: [AI Integration Complete Guide](AI_INTEGRATION_COMPLETE_GUIDE.md)
- **Configuration**: [AI Configuration Guide](AI_CONFIGURATION_GUIDE.md)
- **Examples**: [AI Usage Examples](AI_ASSISTANT_USAGE_EXAMPLES.md)
- **Quick Reference**: [AI Quick Reference](AI_QUICK_REFERENCE.md)

## 🎉 You're Ready!

Start the app and click the 🤖 button to begin using AI features!

```bash
npm run dev
# Open http://localhost:5001
# Click the 🤖 button
# Start chatting!
```