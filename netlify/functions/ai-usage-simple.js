import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// In-memory storage for fallback
const usage = [];

// Helper function to handle responses
const handleResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
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

// Get usage statistics handler
export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleResponse(200, {});
  }

  if (event.httpMethod !== "GET") {
    return handleResponse(405, { error: "Method not allowed" });
  }

  try {
    const user = verifyToken(event);

    const userUsage = usage
      .filter((u) => u.userId === user.userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);

    const totalRequests = userUsage.reduce((sum, u) => sum + u.requestCount, 0);
    const totalTokens = userUsage.reduce((sum, u) => sum + u.tokensUsed, 0);

    return handleResponse(200, {
      totalRequests,
      totalTokens,
      dailyUsage: userUsage,
    });
  } catch (error) {
    console.error("Get usage error:", error);
    if (
      error.message.includes("Access denied") ||
      error.message.includes("Invalid token")
    ) {
      return handleResponse(401, { error: error.message });
    }
    return handleResponse(500, { error: "Failed to get usage statistics" });
  }
};
