import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateCsrf, corsHeaders } from "./utils/csrf.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

// Shared in-memory store (same instance as login within one function container)
const registeredUsers = new Map();

const handleResponse = (statusCode, body, requestOrigin = '') => ({
  statusCode,
  headers: corsHeaders(requestOrigin),
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const requestOrigin = event.headers['origin'] || event.headers['Origin'] || ''

  if (event.httpMethod === "OPTIONS") return handleResponse(200, {}, requestOrigin);
  if (event.httpMethod !== "POST") return handleResponse(405, { error: "Method not allowed" }, requestOrigin);

  const csrf = validateCsrf(event.headers)
  if (!csrf.ok) {
    console.warn("CSRF validation failed (register):", csrf.error)
    return handleResponse(403, { error: csrf.error }, requestOrigin)
  }

  try {
    const { name, email, password } = JSON.parse(event.body || "{}");

    if (!name || !email || !password) {
      return handleResponse(400, { error: "Name, email, and password are required" }, requestOrigin);
    }

    if (password.length < 8) {
      return handleResponse(400, { error: "Password must be at least 8 characters" }, requestOrigin);
    }

    const key = email.toLowerCase();

    if (key === "demo@example.com" || registeredUsers.has(key)) {
      return handleResponse(409, { error: "An account with this email already exists" }, requestOrigin);
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
    }, requestOrigin);
  } catch (error) {
    console.error("Register error:", error);
    return handleResponse(500, { error: "Registration failed" }, requestOrigin);
  }
};
