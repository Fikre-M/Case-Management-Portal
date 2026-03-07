# AidFlow Backend Server

Secure backend server for AI features with MongoDB database integration.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally OR MongoDB Atlas account
- OpenAI API key

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database (choose one)
# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/aidflow

# Option B: MongoDB Atlas (recommended for production)
# Get this from your MongoDB Atlas dashboard
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aidflow

# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Database Setup

#### Option A: Local MongoDB (Easy Setup)

1. Install MongoDB locally:
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Mac**: `brew install mongodb-community`
   - **Linux**: Follow official docs

2. Start MongoDB:
   ```bash
   # Windows (in new terminal)
   mongod
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier is sufficient)
4. Create a database user
5. Get your connection string from "Connect" → "Connect your application"
6. Add your IP address to the whitelist (0.0.0.0/0 for development)

### 4. Start the Backend Server

```bash
npm run dev
```

The server should start on `http://localhost:5000`

### 5. Test the Backend

Open your browser and go to:
- Health check: http://localhost:5000/health
- Should see: `{"status":"OK","timestamp":"..."}`

## Frontend Configuration

Update your frontend `.env` file to connect to the backend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_ENABLED=true
```

## Security Features

✅ **JWT Authentication** - Secure user authentication  
✅ **API Key Protection** - OpenAI key stored securely on backend  
✅ **Rate Limiting** - Prevents API abuse  
✅ **Input Validation** - Sanitizes all inputs  
✅ **CORS Protection** - Controls cross-origin requests  
✅ **Helmet Security** - Sets security headers  

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### AI Features
- `POST /api/ai/chat` - Send message to AI
- `GET /api/ai/conversations` - Get user conversations
- `POST /api/ai/conversations` - Create new conversation
- `GET /api/ai/conversations/:id` - Get specific conversation
- `DELETE /api/ai/conversations/:id` - Delete conversation
- `GET /api/ai/usage` - Get usage statistics

## Development

```bash
# Start with auto-reload
npm run dev

# Start production mode
npm start

# Run tests
npm test
```

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aidflow
OPENAI_API_KEY=sk-production-key
JWT_SECRET=strong-random-secret-key
```

### Deployment Options

1. **Vercel** (Recommended for Node.js)
2. **Heroku**
3. **DigitalOcean**
4. **AWS EC2**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify IP whitelist for MongoDB Atlas

2. **OpenAI API Error**
   - Verify API key is correct and active
   - Check if you have sufficient credits

3. **CORS Error**
   - Ensure `FRONTEND_URL` matches your frontend URL
   - Check that frontend is making requests to correct backend URL

4. **JWT Error**
   - Clear browser localStorage
   - Check JWT_SECRET is set

### Logs

The server provides detailed logs for:
- Database connections
- API requests
- Authentication attempts
- AI service calls

Check the terminal output for debugging information.
