import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthTokens,
  TokenPayload,
} from "@shared/auth";

// In-memory user storage (replace with database in production)
const users: Map<string, User & { password: string }> = new Map();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "your-super-secret-refresh-key-change-in-production";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Helper function to generate tokens
const generateTokens = (user: User): AuthTokens => {
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

// Helper function to find user by email
const findUserByEmail = (email: string) => {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Validation
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      createdAt: new Date(),
    };

    // Store user (with hashed password)
    users.set(user.id, { ...user, password: hashedPassword });

    // Generate tokens
    const tokens = generateTokens(user);

    const response: AuthResponse = {
      user,
      tokens,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
        type: "validation",
      });
    }

    // Find user
    const userData = findUserByEmail(email.toLowerCase());
    if (!userData) {
      return res.status(404).json({
        error:
          "No account found with this email address. Would you like to create an account?",
        type: "user_not_found",
        suggestion: "signup",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Incorrect password. Please check your password and try again.",
        type: "wrong_password",
        suggestion: "reset_password",
      });
    }

    // Extract user without password
    const { password: _, ...user } = userData;

    // Generate tokens
    const tokens = generateTokens(user);

    const response: AuthResponse = {
      user,
      tokens,
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleRefreshToken: RequestHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET,
    ) as TokenPayload;

    // Find user
    const userData = users.get(decoded.userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract user without password
    const { password: _, ...user } = userData;

    // Generate new tokens
    const tokens = generateTokens(user);

    res.json({ tokens });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  // In a production app, you'd typically blacklist the token or remove it from storage
  // For now, we'll just send a success response
  res.json({ message: "Logged out successfully" });
};

export const handleMe: RequestHandler = async (req: any, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userData = users.get(userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract user without password
    const { password: _, ...user } = userData;

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
