import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aidflow')
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// User schema for authentication
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
})

// AI Conversation schema
const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'general' },
  messages: [{
    type: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
})

// AI Usage tracking schema
const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestCount: { type: Number, default: 0 },
  tokensUsed: { type: Number, default: 0 },
  lastRequest: { type: Date, default: Date.now },
  date: { type: String, required: true } // YYYY-MM-DD format
})

export const User = mongoose.model('User', userSchema)
export const Conversation = mongoose.model('Conversation', conversationSchema)
export const Usage = mongoose.model('Usage', usageSchema)
