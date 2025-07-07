import express from "express";
import cors from "cors";
import { handleImageAnalysis } from "./routes/demo";
import { handleEcoRewards } from "./routes/eco-rewards";
import { handleOffers, handleRedeemOffer } from "./routes/offers";

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

  // Image analysis endpoint
  app.post("/api/analyze-image", handleImageAnalysis);

  // Eco rewards endpoints
  app.get("/api/eco-rewards", handleEcoRewards);

  // Offers endpoints
  app.get("/api/offers", handleOffers);
  app.post("/api/redeem-offer", handleRedeemOffer);

  return app;
}
