import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// In-memory storage for fallback
const conversations = [];

// Helper function to handle responses
const handleResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};

// Verify JWT token
const verifyToken = (event) => {
  const token = event.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new Error("Access denied. No token provided.");
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Create conversation handler
export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleResponse(200, {});
  }

  if (event.httpMethod === "POST") {
    try {
      const user = verifyToken(event);
      const { title, category } = JSON.parse(event.body);

      const conversation = {
        id: Date.now().toString(),
        userId: user.userId,
        title: title || "New Conversation",
        category: category || "general",
        messages: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      conversations.push(conversation);
      return handleResponse(201, conversation);
    } catch (error) {
      console.error("Create conversation error:", error);
      if (
        error.message.includes("Access denied") ||
        error.message.includes("Invalid token")
      ) {
        return handleResponse(401, { error: error.message });
      }
      return handleResponse(500, { error: "Failed to create conversation" });
    }
  }

  if (event.httpMethod === "GET") {
    try {
      const user = verifyToken(event);
      const userConversations = conversations.filter(
        (c) => c.userId === user.userId,
      );
      return handleResponse(200, userConversations);
    } catch (error) {
      console.error("Get conversations error:", error);
      if (
        error.message.includes("Access denied") ||
        error.message.includes("Invalid token")
      ) {
        return handleResponse(401, { error: error.message });
      }
      return handleResponse(500, { error: "Failed to get conversations" });
    }
  }

  return handleResponse(405, { error: "Method not allowed" });
};
