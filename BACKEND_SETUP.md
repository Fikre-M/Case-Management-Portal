# Secure Backend Setup for AI Features

## 🚨 Security Issue Fixed

Your current implementation exposes OpenAI API keys in the browser, which is a **major security vulnerability**. This guide helps you set up a secure backend.

## 📋 Quick Setup Steps

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Set Up Database (Choose One)

#### Option A: Local MongoDB (Easiest for Development)
1. Install MongoDB Community Server
2. Start MongoDB: `mongod`
3. Use connection string: `mongodb://localhost:27017/aidflow`

#### Option B: MongoDB Atlas (Cloud Database)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string from dashboard
4. Add IP to whitelist

### 3. Configure Environment
```bash
cd server
cp .env.example .env
```

Edit `.env` with:
```env
MONGODB_URI=mongodb://localhost:27017/aidflow
OPENAI_API_KEY=sk-your-actual-openai-key
JWT_SECRET=your-secret-key
```

### 4. Start Backend Server
```bash
npm run dev
```

### 5. Update Frontend
Add to your frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_ENABLED=true
```

### 6. Test Everything
1. Backend: http://localhost:5000/health
2. Frontend: Register/Login to use AI features

## 🔐 Security Benefits

✅ **API Keys Protected** - OpenAI keys never exposed to browser  
✅ **User Authentication** - JWT-based secure auth  
✅ **Rate Limiting** - Prevents abuse  
✅ **Data Persistence** - Conversations stored securely  
✅ **Usage Tracking** - Monitor API costs  

## 📁 What Was Created

### Backend Files
- `server/package.json` - Dependencies
- `server/server.js` - Main server
- `server/config/db.js` - Database setup
- `server/routes/auth.js` - Authentication
- `server/routes/ai.js` - AI features
- `server/.env.example` - Environment template

### Updated Frontend Files
- `src/services/aiService.js` - Now uses secure backend
- `src/services/authService.js` - Authentication service

## 🚀 Next Steps

1. **Get OpenAI API Key**: [platform.openai.com](https://platform.openai.com/api-keys)
2. **Choose Database**: Local MongoDB (easy) or MongoDB Atlas (cloud)
3. **Follow Setup Steps**: Above
4. **Test Features**: Register, login, try AI chat

## 📞 Need Help?

- Check `server/README.md` for detailed instructions
- Verify MongoDB is running before starting server
- Ensure all environment variables are set correctly

## ⚠️ Important

- **Never commit `.env` files** to version control
- **Use strong JWT secrets** in production
- **Monitor OpenAI usage** through the `/api/ai/usage` endpoint
- **Enable HTTPS** in production environments
