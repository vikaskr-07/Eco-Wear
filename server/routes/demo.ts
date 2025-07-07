import { RequestHandler } from "express";
import { ImageAnalysisResponse, ClothingItem } from "@shared/api";
import { updateUserStats } from "./eco-rewards";

// Mock clothing database for carbon footprint calculations
const CLOTHING_CARBON_DATABASE = {
  "t-shirt": { carbonPerItem: 5.0, type: "shirt" },
  "dress shirt": { carbonPerItem: 7.0, type: "shirt" },
  "polo shirt": { carbonPerItem: 5.5, type: "shirt" },
  jeans: { carbonPerItem: 10.0, type: "pants" },
  pants: { carbonPerItem: 8.0, type: "pants" },
  trousers: { carbonPerItem: 8.5, type: "pants" },
  dress: { carbonPerItem: 12.0, type: "dress" },
  skirt: { carbonPerItem: 6.0, type: "skirt" },
  sweater: { carbonPerItem: 9.0, type: "sweater" },
  hoodie: { carbonPerItem: 11.0, type: "sweater" },
  jacket: { carbonPerItem: 15.0, type: "outerwear" },
  coat: { carbonPerItem: 18.0, type: "outerwear" },
  blazer: { carbonPerItem: 13.0, type: "outerwear" },
  shorts: { carbonPerItem: 4.0, type: "shorts" },
  blouse: { carbonPerItem: 6.5, type: "shirt" },
};

// Mock image recognition function (simulates GPT-4 Vision or other AI model)
function mockImageRecognition(): ClothingItem[] {
  const possibleItems = Object.keys(CLOTHING_CARBON_DATABASE);
  const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
  const recognizedItems: ClothingItem[] = [];

  for (let i = 0; i < numItems; i++) {
    const randomItem =
      possibleItems[Math.floor(Math.random() * possibleItems.length)];
    const itemData = CLOTHING_CARBON_DATABASE[randomItem];

    // Add some variation to carbon footprint (±20%)
    const variation = 0.8 + Math.random() * 0.4;
    const carbonFootprint = itemData.carbonPerItem * variation;

    recognizedItems.push({
      id: `item_${i + 1}_${Date.now()}`,
      name: randomItem.charAt(0).toUpperCase() + randomItem.slice(1),
      type: itemData.type,
      carbonFootprint: parseFloat(carbonFootprint.toFixed(1)),
      confidence: 0.75 + Math.random() * 0.24, // 75-99% confidence
    });
  }

  return recognizedItems;
}

// This data is now managed in eco-rewards.ts

export const handleImageAnalysis: RequestHandler = (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: "Image data is required" });
    }

    // Simulate processing time
    setTimeout(() => {
      // Mock image recognition
      const recognizedItems = mockImageRecognition();

      // Calculate total carbon footprint
      const totalCarbonFootprint = recognizedItems.reduce(
        (sum, item) => sum + item.carbonFootprint,
        0,
      );

      // Calculate eco-reward points (more points for lower carbon footprint)
      const basePoints = recognizedItems.length * 50; // 50 points per item analyzed
      const carbonBonus = Math.max(0, (20 - totalCarbonFootprint) * 5); // Bonus for low carbon
      const ecoRewardPoints = Math.floor(basePoints + carbonBonus);

      // Update user stats in eco-rewards system
      updateUserStats(ecoRewardPoints, totalCarbonFootprint);

      const response: ImageAnalysisResponse = {
        items: recognizedItems,
        totalCarbonFootprint: parseFloat(totalCarbonFootprint.toFixed(1)),
        ecoRewardPoints,
        analysisId: `analysis_${Date.now()}`,
      };

      res.json(response);
    }, 1500); // Simulate API processing time
  } catch (error) {
    console.error("Error in image analysis:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
};
