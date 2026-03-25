import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

// Shared in-memory store (same instance as login within one function container)
const registeredUsers = new Map();

const handleResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleResponse(200, {});
  if (event.httpMethod !== "POST") return handleResponse(405, { error: "Method not allowed" });

  try {
    const { name, email, password } = JSON.parse(event.body || "{}");

    if (!name || !email || !password) {
      return handleResponse(400, { error: "Name, email, and password are required" });
    }

    if (password.length < 8) {
      return handleResponse(400, { error: "Password must be at least 8 characters" });
    }

    const key = email.toLowerCase();

    if (key === "demo@example.com" || registeredUsers.has(key)) {
      return handleResponse(409, { error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
      id: `user-${Date.now()}`,
      name,
      email: key,
      password: hashedPassword,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    registeredUsers.set(key, user);

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return handleResponse(201, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Register error:", error);
    return handleResponse(500, { error: "Registration failed" });
  }
};
