# Backend Implementation Examples

## Overview

This document provides complete backend implementation examples for the AidFlow application using different technologies.

## Node.js + Express Example

### Setup

```bash
mkdir aidflow-backend
cd aidflow-backend
npm init -y
npm install express cors dotenv bcrypt jsonwebtoken mongoose
```

### Basic Server

```javascript
// server.js
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/appointments', require('./routes/appointments'))
app.use('/api/cases', require('./routes/cases'))

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: { 
      message: err.message,
      code: 'INTERNAL_ERROR'
    } 
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Appointments Routes

```javascript
// routes/appointments.js
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// In-memory storage (use database in production)
let appointments = []

// Get all appointments
router.get('/', auth, async (req, res) => {
  try {
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Get single appointment
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === parseInt(req.params.id))
    if (!appointment) {
      return res.status(404).json({ 
        error: { message: 'Appointment not found' } 
      })
    }
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const newAppointment = {
      id: appointments.length + 1,
      ...req.body,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    appointments.push(newAppointment)
    res.status(201).json(newAppointment)
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const index = appointments.findIndex(a => a.id === parseInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ 
        error: { message: 'Appointment not found' } 
      })
    }
    
    appointments[index] = {
      ...appointments[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    }
    
    res.json(appointments[index])
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Delete appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const index = appointments.findIndex(a => a.id === parseInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ 
        error: { message: 'Appointment not found' } 
      })
    }
    
    appointments.splice(index, 1)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

module.exports = router
```

### Authentication Routes

```javascript
// routes/auth.js
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// In-memory storage (use database in production)
let users = []

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ 
        error: { message: 'User already exists' } 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    users.push(user)

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({ 
        error: { message: 'Invalid credentials' } 
      })
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ 
        error: { message: 'Invalid credentials' } 
      })
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Get current user
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id)
    if (!user) {
      return res.status(404).json({ 
        error: { message: 'User not found' } 
      })
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

module.exports = router
```

### Authentication Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ 
      error: { message: 'No token, authorization denied' } 
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ 
      error: { message: 'Token is not valid' } 
    })
  }
}
```

### Environment Variables

```bash
# .env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=mongodb://localhost:27017/aidflow
```

## Python + Flask Example

### Setup

```bash
pip install flask flask-cors flask-jwt-extended bcrypt
```

### Basic Server

```python
# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import datetime

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
CORS(app)
jwt = JWTManager(app)

# In-memory storage
users = []
appointments = []

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if user exists
    if any(u['email'] == data['email'] for u in users):
        return jsonify({'error': {'message': 'User already exists'}}), 400
    
    # Hash password
    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    user = {
        'id': len(users) + 1,
        'name': data['name'],
        'email': data['email'],
        'password': hashed,
        'createdAt': datetime.now().isoformat()
    }
    users.append(user)
    
    # Create token
    token = create_access_token(identity=user['id'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email']
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    
    # Find user
    user = next((u for u in users if u['email'] == data['email']), None)
    if not user:
        return jsonify({'error': {'message': 'Invalid credentials'}}), 401
    
    # Check password
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        return jsonify({'error': {'message': 'Invalid credentials'}}), 401
    
    # Create token
    token = create_access_token(identity=user['id'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email']
        }
    })

# Appointments routes
@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    return jsonify(appointments)

@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.json
    user_id = get_jwt_identity()
    
    appointment = {
        'id': len(appointments) + 1,
        **data,
        'userId': user_id,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    appointments.append(appointment)
    
    return jsonify(appointment), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## Database Integration (MongoDB)

### Mongoose Models

```javascript
// models/Appointment.js
const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: String,
  type: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  notes: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Appointment', appointmentSchema)
```

### Using Models

```javascript
// routes/appointments.js with MongoDB
const Appointment = require('../models/Appointment')

router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      userId: req.user.id,
    })
    await appointment.save()
    res.status(201).json(appointment)
  } catch (error) {
    res.status(500).json({ error: { message: error.message } })
  }
})
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Summary

Complete backend examples provided for:

✅ **Node.js + Express** - Full REST API
✅ **Python + Flask** - Alternative implementation
✅ **Authentication** - JWT-based auth
✅ **Database** - MongoDB integration
✅ **Docker** - Containerization
✅ **Error handling** - Consistent error responses
✅ **Middleware** - Auth middleware
✅ **CRUD operations** - All endpoints

Choose the stack that fits your needs and deploy!
