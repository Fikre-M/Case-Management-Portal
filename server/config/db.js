import mongoose from 'mongoose'

// In-memory storage for when MongoDB is not available
const memoryStorage = {
  users: [],
  conversations: [],
  usage: []
}

export const connectDB = async () => {
  try {
    // Only connect to MongoDB if URI is provided and not placeholder
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri || mongoUri === 'mongodb://localhost:27017/aidflow') {
      console.log('⚠️ MongoDB not configured - using in-memory storage')
      return false
    }

    const conn = await mongoose.connect(mongoUri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, using in-memory storage:', error.message)
    // Don't exit process, continue without MongoDB
    return false
  }
}

// Mock models for in-memory storage
const createMockModels = () => {
  return {
    User: {
      findOne: async (query) => {
        const user = memoryStorage.users.find(u => u.email === query.email)
        return user || null
      },
      create: async (data) => {
        const user = { 
          ...data, 
          _id: Date.now().toString(),
          createdAt: new Date(),
          role: data.role || 'user'
        }
        memoryStorage.users.push(user)
        return user
      }
    },
    
    Conversation: {
      findByIdAndUpdate: async (id, update) => {
        const conv = memoryStorage.conversations.find(c => c._id === id)
        if (conv && update.$push) {
          conv.messages.push(...update.$push.messages)
          conv.lastUpdated = new Date()
        }
        return conv || null
      },
      create: async (data) => {
        const conv = { 
          ...data, 
          _id: Date.now().toString(),
          createdAt: new Date(),
          lastUpdated: new Date(),
          messages: data.messages || []
        }
        memoryStorage.conversations.push(conv)
        return conv
      },
      find: async (query) => {
        return memoryStorage.conversations.filter(c => c.userId === query.userId)
      },
      findOne: async (query) => {
        return memoryStorage.conversations.find(c => c._id === query.id) || null
      },
      deleteOne: async (query) => {
        const index = memoryStorage.conversations.findIndex(c => c._id === query._id)
        if (index > -1) {
          memoryStorage.conversations.splice(index, 1)
          return { deletedCount: 1 }
        }
        return { deletedCount: 0 }
      }
    },
    
    Usage: {
      findOneAndUpdate: async (query, update, options = {}) => {
        const existing = memoryStorage.usage.find(u => u.userId === query.userId && u.date === query.date)
        if (existing && update.$inc) {
          Object.keys(update.$inc).forEach(key => {
            existing[key] = (existing[key] || 0) + update.$inc[key]
          })
          if (update.$set) {
            Object.assign(existing, update.$set)
          }
          return existing
        } else if (!existing && options.upsert) {
          const usage = { 
            userId: query.userId, 
            date: query.date,
            requestCount: 0,
            tokensUsed: 0,
            lastRequest: new Date(),
            ...update.$set,
            ...(update.$inc || {})
          }
          memoryStorage.usage.push(usage)
          return usage
        }
        return existing || null
      },
      find: async (query) => {
        return memoryStorage.usage.filter(u => u.userId === query.userId)
      }
    }
  }
}

// Create real Mongoose models or mock models
let User, Conversation, Usage
let isUsingMongoDB = false

export const getModels = async () => {
  if (isUsingMongoDB) {
    return { User, Conversation, Usage }
  }
  
  const mongoConnected = await connectDB()
  
  if (mongoConnected) {
    // Real MongoDB models
    const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      createdAt: { type: Date, default: Date.now }
    })

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

    const usageSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      requestCount: { type: Number, default: 0 },
      tokensUsed: { type: Number, default: 0 },
      lastRequest: { type: Date, default: Date.now },
      date: { type: String, required: true }
    })

    User = mongoose.model('User', userSchema)
    Conversation = mongoose.model('Conversation', conversationSchema)
    Usage = mongoose.model('Usage', usageSchema)
    isUsingMongoDB = true
    
    console.log('✅ Using MongoDB models')
    return { User, Conversation, Usage }
  } else {
    // Mock models for in-memory storage
    const mockModels = createMockModels()
    User = mockModels.User
    Conversation = mockModels.Conversation
    Usage = mockModels.Usage
    
    console.log('✅ Using in-memory models')
    return { User, Conversation, Usage }
  }
}

// Initialize models immediately
const models = await getModels()
export { User, Conversation, Usage }
