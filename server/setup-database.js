// Database Setup Script for AidFlow
import { MongoClient } from 'mongodb'

const mongoUri = 'mongodb://127.0.0.1:27017'
const dbName = 'aidflow'

async function setupDatabase() {
  const client = new MongoClient(mongoUri)
  
  try {
    console.log('🔄 Connecting to MongoDB...')
    await client.connect()
    console.log('✅ Connected to MongoDB successfully!')
    
    const db = client.db(dbName)
    
    // Create collections with validation
    console.log('📊 Creating collections...')
    
    // Users collection
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: { bsonType: 'string', minLength: 3 },
            email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' },
            password: { bsonType: 'string', minLength: 6 },
            role: { enum: ['user', 'admin'] },
            createdAt: { bsonType: 'date' }
          }
        }
      }
    })
    
    // Conversations collection
    await db.createCollection('conversations', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'title', 'messages'],
          properties: {
            userId: { bsonType: 'objectId' },
            title: { bsonType: 'string', minLength: 1 },
            category: { bsonType: 'string' },
            messages: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['type', 'content', 'timestamp'],
                properties: {
                  type: { enum: ['user', 'assistant'] },
                  content: { bsonType: 'string', minLength: 1 },
                  timestamp: { bsonType: 'date' }
                }
              }
            },
            createdAt: { bsonType: 'date' },
            lastUpdated: { bsonType: 'date' }
          }
        }
      }
    })
    
    // Usage collection
    await db.createCollection('usage', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'date', 'requestCount', 'tokensUsed'],
          properties: {
            userId: { bsonType: 'objectId' },
            date: { bsonType: 'string', pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' },
            requestCount: { bsonType: 'int', minimum: 0 },
            tokensUsed: { bsonType: 'int', minimum: 0 },
            lastRequest: { bsonType: 'date' }
          }
        }
      }
    })
    
    // Create indexes for better performance
    console.log('🔍 Creating indexes...')
    
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('users').createIndex({ username: 1 }, { unique: true })
    
    // Conversations indexes
    await db.collection('conversations').createIndex({ userId: 1 })
    await db.collection('conversations').createIndex({ userId: 1, lastUpdated: -1 })
    
    // Usage indexes
    await db.collection('usage').createIndex({ userId: 1, date: 1 }, { unique: true })
    await db.collection('usage').createIndex({ userId: 1, date: -1 })
    
    console.log('✅ Database setup completed successfully!')
    console.log(`📊 Database '${dbName}' is ready with collections:`)
    console.log('   - users (with email/username indexes)')
    console.log('   - conversations (with user indexes)')
    console.log('   - usage (with user/date indexes)')
    
    // Test the connection
    const testDoc = { test: true, timestamp: new Date() }
    const result = await db.collection('users').insertOne(testDoc)
    await db.collection('users').deleteOne({ _id: result.insertedId })
    console.log('✅ Database connection test passed!')
    
  } catch (error) {
    if (error.code === 48) {
      console.log('ℹ️ Collections already exist, skipping creation...')
    } else {
      console.error('❌ Database setup failed:', error.message)
      throw error
    }
  } finally {
    await client.close()
    console.log('🔌 Disconnected from MongoDB')
  }
}

// Run the setup
setupDatabase().catch(console.error)
