import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

// Pre-hashed password for "password" (bcrypt, 12 rounds)
// Generated with: bcrypt.hashSync('password', 12)
const DEMO_PASSWORD_HASH =
  "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i";

// Seed demo user — always available regardless of cold starts
const DEMO_USER = {
  id: "demo-001",
  name: "Demo User",
  email: "demo@example.com",
  password: DEMO_PASSWORD_HASH,
  role: "admin",
};

// In-memory store for registered users (persists within a function instance)
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
    const { email, password } = JSON.parse(event.body || "{}");

    if (!email || !password) {
      return handleResponse(400, { error: "Email and password are required" });
    }

    // Look up user — demo user first, then registered users
    const user =
      email === DEMO_USER.email
        ? DEMO_USER
        : registeredUsers.get(email.toLowerCase());

    if (!user) {
      return handleResponse(401, { error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return handleResponse(401, { error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return handleResponse(200, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return handleResponse(500, { error: "Login failed" });
  }
};

// Export the store so auth-register-simple can share it
export { registeredUsers };
