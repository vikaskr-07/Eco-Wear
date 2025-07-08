import express from "express";
import cors from "cors";
import { handleImageAnalysis } from "./routes/demo";
import { handleEcoRewards } from "./routes/eco-rewards";
import { handleOffers, handleRedeemOffer } from "./routes/offers";
import {
  handleRegister,
  handleLogin,
  handleRefreshToken,
  handleLogout,
  handleMe,
} from "./routes/auth";
import { authenticateToken, optionalAuth } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Increased limit for image data
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "EcoWear API is running!" });
  });

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/refresh", handleRefreshToken);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/me", authenticateToken, handleMe);

  // Image analysis endpoint (optional auth to track user progress)
  app.post("/api/analyze-image", optionalAuth, handleImageAnalysis);

  // Eco rewards endpoints (require auth for user-specific data)
  app.get("/api/eco-rewards", authenticateToken, handleEcoRewards);

  // Offers endpoints (require auth for user-specific data)
  app.get("/api/offers", authenticateToken, handleOffers);
  app.post("/api/redeem-offer", authenticateToken, handleRedeemOffer);

  return app;
}
