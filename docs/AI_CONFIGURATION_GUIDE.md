# AI Configuration Guide

## 🎛️ Environment Variables

### Required Configuration

Add these variables to your `.env` file:

```env
# OpenAI API Key
VITE_OPENAI_API_KEY=sk-your-actual-key-here

# Enable/Disable AI Features
VITE_AI_ENABLED=true

# Cost Optimization
VITE_USE_LOW_COST_MODEL=true
```

## 📋 Configuration Options

### 1. VITE_OPENAI_API_KEY

**Purpose**: Your OpenAI API key for GPT-3.5-turbo access

**Values**:
- `sk-placeholder-replace-with-actual-key` - Default placeholder (uses mock responses)
- `sk-...` - Your actual OpenAI API key (enables real AI)

**Example**:
```env
VITE_OPENAI_API_KEY=sk-proj-abc123xyz...
```

**Getting an API Key**:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste into `.env`

**Security Warning**: 
- ⚠️ Never commit real API keys to version control
- ⚠️ This is client-side for demo only
- ⚠️ Use backend proxy in production

### 2. VITE_AI_ENABLED

**Purpose**: Master switch to enable/disable all AI features

**Values**:
- `true` - AI features enabled (default)
- `false` - AI features completely disabled

**Example**:
```env
VITE_AI_ENABLED=false
```

**When to Disable**:
- Testing without AI
- Reducing API costs
- Debugging other features
- Demo without AI dependency

**Effect When Disabled**:
- AI Assistant button hidden
- Smart Suggestions not shown
- AI Dashboard shows disabled state
- No API calls made

### 3. VITE_USE_LOW_COST_MODEL

**Purpose**: Optimize for cost by reducing token usage

**Values**:
- `true` - Cost-optimized (300 tokens max, recommended)
- `false` - Standard (500 tokens max)

**Example**:
```env
VITE_USE_LOW_COST_MODEL=true
```

**Cost Savings**:
- Reduces max tokens from 500 to 300
- ~40% reduction in token usage
- Same model quality (GPT-3.5-turbo)
- Shorter but still useful responses

**Recommended**: Keep this `true` for development and demos

## 💰 Cost Management

### Understanding OpenAI Pricing

**GPT-3.5-turbo Pricing** (as of 2024):
- Input: $0.0015 per 1K tokens
- Output: $0.002 per 1K tokens

**Example Costs**:
```
Standard mode (500 tokens):
- Average message: ~200 input + 400 output tokens
- Cost per message: ~$0.001 (0.1 cents)
- 1000 messages: ~$1.00

Low-cost mode (300 tokens):
- Average message: ~200 input + 250 output tokens
- Cost per message: ~$0.0008 (0.08 cents)
- 1000 messages: ~$0.80
```

### Built-in Cost Protection

**Rate Limiting**:
- Maximum 20 requests per minute
- 2-second delay between requests
- Prevents accidental API spam

**Token Limits**:
- Standard: 500 tokens max
- Low-cost: 300 tokens max
- Prevents runaway costs

**Error Handling**:
- Falls back to mock on errors
- Doesn't retry failed requests
- Shows clear error messages

### Monitoring Costs

**OpenAI Dashboard**:
1. Go to [platform.openai.com/usage](https://platform.openai.com/usage)
2. View real-time usage
3. Set spending limits
4. Get usage alerts

**Set Spending Limits**:
1. Go to Settings → Billing
2. Set monthly budget limit
3. Enable email notifications
4. Hard limit prevents overages

**Recommended Limits for Testing**:
- Start with $5/month limit
- Monitor for first week
- Adjust based on usage
- Use low-cost mode

## 🛡️ Rate Limiting

### Built-in Protection

**Local Rate Limits**:
```javascript
// Configured in aiService.js
const RATE_LIMIT_DELAY = 2000 // 2 seconds between requests
const MAX_REQUESTS_PER_MINUTE = 20 // Max 20 per minute
```

**How It Works**:
1. Tracks request timestamps
2. Enforces minimum delay
3. Counts requests per minute
4. Shows friendly error if exceeded

**User Experience**:
- Automatic delay between requests
- Clear error message if too fast
- Suggests waiting time
- Falls back to mock mode

### OpenAI Rate Limits

**Free Tier**:
- 3 requests per minute
- 200 requests per day

**Paid Tier** (Tier 1):
- 3,500 requests per minute
- 10,000 requests per day

**Handling Rate Limits**:
- Service automatically detects 429 errors
- Shows user-friendly message
- Suggests retry time
- Falls back to mock responses

## 🔧 Error Handling

### Error Types

**1. Invalid API Key**
```
Error: Invalid API key. Please check your OpenAI API key configuration.
```
**Solution**: Verify API key in `.env` file

**2. Rate Limit Exceeded**
```
Error: You've reached the API rate limit. Please wait a moment and try again.
```
**Solution**: Wait 60 seconds, then retry

**3. Insufficient Quota**
```
Error: OpenAI API quota exceeded. Please check your billing or use mock mode.
```
**Solution**: Add credits to OpenAI account or use mock mode

**4. Network Error**
```
Error: Network error. Please check your internet connection and try again.
```
**Solution**: Check internet connection, retry

**5. Local Rate Limit**
```
Error: Please slow down. You can send up to 20 messages per minute.
```
**Solution**: Wait a moment between messages

### Graceful Degradation

**Automatic Fallback**:
- API errors → Mock responses
- Network issues → Mock responses
- Rate limits → Mock responses
- Invalid key → Mock responses

**User Experience**:
- Clear error messages
- Continues working in mock mode
- No broken functionality
- Helpful suggestions

## 🧪 Testing Configurations

### Development Setup

**Recommended for Development**:
```env
VITE_OPENAI_API_KEY=sk-placeholder-replace-with-actual-key
VITE_AI_ENABLED=true
VITE_USE_LOW_COST_MODEL=true
```
**Result**: Uses mock responses, no API costs

### Testing with Real API

**For Testing Real AI**:
```env
VITE_OPENAI_API_KEY=sk-your-actual-key
VITE_AI_ENABLED=true
VITE_USE_LOW_COST_MODEL=true
```
**Result**: Real AI with cost optimization

### Disabling AI Completely

**For Non-AI Testing**:
```env
VITE_OPENAI_API_KEY=sk-placeholder-replace-with-actual-key
VITE_AI_ENABLED=false
VITE_USE_LOW_COST_MODEL=true
```
**Result**: AI features hidden, no API calls

### Production Setup

**For Production** (with backend proxy):
```env
# Frontend .env (no API key!)
VITE_AI_ENABLED=true
VITE_USE_LOW_COST_MODEL=false

# Backend .env (secure)
OPENAI_API_KEY=sk-your-actual-key
```
**Result**: Secure, production-ready

## 📊 Monitoring & Debugging

### Service Status

**Check in Browser Console**:
```javascript
// On app load, you'll see:
✅ OpenAI client initialized successfully
// or
ℹ️ Using mock AI responses (no API key configured)
// or
ℹ️ AI features disabled via VITE_AI_ENABLED
```

### Rate Limit Status

**Available in Code**:
```javascript
import { getRateLimitStatus } from './services/aiService'

const status = getRateLimitStatus()
console.log(status)
// {
//   requestCount: 5,
//   maxRequests: 20,
//   remaining: 15,
//   resetIn: 45000 // ms
// }
```

### Debug Mode

**Enable Verbose Logging**:
```javascript
// In aiService.js, uncomment debug logs
console.log('Sending message:', message)
console.log('Using model:', model)
console.log('Response:', response)
```

## 🚀 Best Practices

### For Development

1. **Use Mock Mode by Default**
   - Keep placeholder API key
   - No costs during development
   - Fast responses

2. **Test with Real API Occasionally**
   - Add real key temporarily
   - Test actual AI behavior
   - Remove key after testing

3. **Enable Low-Cost Mode**
   - Always use `VITE_USE_LOW_COST_MODEL=true`
   - Reduces token usage
   - Saves money

4. **Monitor Usage**
   - Check OpenAI dashboard weekly
   - Set spending limits
   - Track costs

### For Production

1. **Never Expose API Key**
   - Use backend proxy
   - Keep key on server
   - Validate requests

2. **Implement Rate Limiting**
   - Server-side limits
   - Per-user quotas
   - Abuse prevention

3. **Add Authentication**
   - Require user login
   - Track usage per user
   - Prevent abuse

4. **Monitor Costs**
   - Real-time alerts
   - Usage dashboards
   - Budget controls

## 🔒 Security Checklist

- [ ] API key not in version control
- [ ] `.env` in `.gitignore`
- [ ] Using placeholder key for development
- [ ] Real key only for testing
- [ ] Backend proxy planned for production
- [ ] Rate limiting enabled
- [ ] Error handling implemented
- [ ] Cost monitoring set up
- [ ] Spending limits configured
- [ ] Team aware of costs

## 📞 Troubleshooting

### AI Not Working

**Check**:
1. Is `VITE_AI_ENABLED=true`?
2. Is API key valid (starts with `sk-`)?
3. Is API key not the placeholder?
4. Check browser console for errors
5. Verify internet connection

### High Costs

**Solutions**:
1. Enable `VITE_USE_LOW_COST_MODEL=true`
2. Set OpenAI spending limits
3. Use mock mode for development
4. Implement stricter rate limiting
5. Monitor usage dashboard

### Rate Limit Errors

**Solutions**:
1. Wait 60 seconds between bursts
2. Reduce requests per minute
3. Upgrade OpenAI tier
4. Use mock mode temporarily

### Mock Mode Not Working

**Check**:
1. Is `VITE_AI_ENABLED=true`?
2. Check browser console
3. Verify component rendering
4. Check for JavaScript errors

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [Rate Limits Guide](https://platform.openai.com/docs/guides/rate-limits)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

## 🎯 Quick Reference

```env
# Development (No Costs)
VITE_OPENAI_API_KEY=sk-placeholder-replace-with-actual-key
VITE_AI_ENABLED=true
VITE_USE_LOW_COST_MODEL=true

# Testing (Low Costs)
VITE_OPENAI_API_KEY=sk-your-actual-key
VITE_AI_ENABLED=true
VITE_USE_LOW_COST_MODEL=true

# Disabled (No AI)
VITE_AI_ENABLED=false

# Production (Backend Proxy)
VITE_AI_ENABLED=true
# No API key in frontend!
```