// netlify/functions/ai-proxy.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import jwt from 'jsonwebtoken';

// Rate limiting (in-memory for simplicity)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // per user per minute

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of rateLimitMap.entries()) {
    if (now - data.resetTime > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(userId);
    }
  }
}, RATE_LIMIT_WINDOW);

// Helper function to handle responses
const handleResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};

// Verify JWT token
const verifyToken = (event) => {
  const token = event.headers?.authorization?.replace("Bearer ", "");
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

  if (!token) {
    throw new Error("Access denied. No token provided.");
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Rate limiting check
const checkRateLimit = (userId) => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now - userLimit.resetTime > RATE_LIMIT_WINDOW) {
    // Reset or create new rate limit entry
    rateLimitMap.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      resetTime: userLimit.resetTime,
      retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
    };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - userLimit.count };
};

// Initialize Gemini client
let genAI = null;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (geminiApiKey && geminiApiKey.startsWith('AIza')) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
  console.log('✅ Gemini client initialized in ai-proxy');
} else {
  console.log('⚠️ No valid Gemini API key found in ai-proxy');
}

// System prompt for legal AI assistant
const SYSTEM_PROMPT = `You are a helpful AI assistant for a legal case management system. You specialize in:

1. Case Management: Analyzing cases, tracking deadlines, organizing documents
2. Appointment Scheduling: Managing calendars, scheduling meetings, sending reminders  
3. Document Drafting: Creating legal documents, letters, contracts, and correspondence
4. Legal Research: Finding relevant case law, statutes, and legal precedents
5. Client Communication: Drafting professional emails and letters

Provide helpful, professional responses that are relevant to legal practice. Keep responses concise but informative. Always maintain client confidentiality and professional standards.`;

// Main handler
export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleResponse(200, {});
  }

  if (event.httpMethod !== "POST") {
    return handleResponse(405, { error: "Method not allowed" });
  }

  try {
    // Verify authentication
    const user = verifyToken(event);

    // Check rate limiting
    const rateLimitResult = checkRateLimit(user.userId);
    if (!rateLimitResult.allowed) {
      return handleResponse(429, {
        error: "Rate limit exceeded",
        retryAfter: rateLimitResult.retryAfter,
      });
    }

    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const { messages, model: requestedModel = "gemini-1.5-flash", ...otherParams } = body;

    if (!messages || !Array.isArray(messages)) {
      return handleResponse(400, { error: "Messages array is required" });
    }

    // If no system message, add our default
    const hasSystemMessage = messages.some(msg => msg.role === "system");
    const finalMessages = hasSystemMessage 
      ? messages 
      : [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

    // Check if Gemini is available
    if (!genAI) {
      return handleResponse(503, { 
        error: "AI service unavailable - no valid API key configured" 
      });
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: otherParams.max_tokens || 1000,
        temperature: otherParams.temperature || 0.7,
      }
    });

    // Convert OpenAI-style messages to Gemini format
    let prompt = "";
    if (finalMessages.length > 0) {
      // If there's a system message, prepend it
      const systemMessage = finalMessages.find(msg => msg.role === "system");
      const userMessages = finalMessages.filter(msg => msg.role !== "system");
      
      prompt = systemMessage ? systemMessage.content + "\n\n" : "";
      
      // Add conversation history
      userMessages.forEach(msg => {
        if (msg.role === "user") {
          prompt += `User: ${msg.content}\n\n`;
        } else if (msg.role === "assistant") {
          prompt += `Assistant: ${msg.content}\n\n`;
        }
      });
      
      // Remove last newline if present
      prompt = prompt.trim();
    }

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Return response in OpenAI-compatible format
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
        "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
      },
      body: JSON.stringify({
        choices: [{
          message: {
            content: text,
            role: "assistant"
          }
        }],
        usage: {
          prompt_tokens: 0, // Gemini doesn't provide token counts
          completion_tokens: 0,
          total_tokens: 0,
          rateLimit: {
            limit: RATE_LIMIT_MAX_REQUESTS,
            remaining: rateLimitResult.remaining,
            resetIn: RATE_LIMIT_WINDOW,
          }
        }
      }),
    };

  } catch (error) {
    console.error("AI Proxy error:", error);
    
    // Handle specific Gemini errors
    if (error.message.includes("API_KEY_INVALID") || error.message.includes("invalid_api_key")) {
      return handleResponse(401, { error: "Invalid API key" });
    }
    
    if (error.message.includes("QUOTA_EXCEEDED") || error.message.includes("quota")) {
      return handleResponse(402, { error: "API quota exceeded" });
    }

    if (error.message.includes("RATE_LIMIT_EXCEEDED") || error.message.includes("rate_limit")) {
      return handleResponse(429, { error: "Rate limit exceeded" });
    }

    // Generic error
    return handleResponse(500, { 
      error: "Failed to process AI request",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
