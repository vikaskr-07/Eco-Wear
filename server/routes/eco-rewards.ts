import { RequestHandler } from "express";
import { EcoRewardsResponse } from "@shared/api";

// In-memory user data (replace with database in production)
let userStats = {
  totalPoints: 1250,
  totalCarbonSaved: 45.7,
  analysesCount: 9,
};

function getUserLevel(points: number): string {
  if (points < 500) return "Bronze";
  if (points < 1500) return "Silver";
  if (points < 3000) return "Gold";
  return "Platinum";
}

function getNextLevelPoints(points: number): number {
  if (points < 500) return 500;
  if (points < 1500) return 1500;
  if (points < 3000) return 3000;
  return points + 2000; // Platinum users get next milestone
}

export const handleEcoRewards: RequestHandler = (_req, res) => {
  try {
    const level = getUserLevel(userStats.totalPoints);
    const nextLevelPoints = getNextLevelPoints(userStats.totalPoints);

    const response: EcoRewardsResponse = {
      totalPoints: userStats.totalPoints,
      totalCarbonSaved: userStats.totalCarbonSaved,
      level,
      nextLevelPoints,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching eco rewards:", error);
    res.status(500).json({ error: "Failed to fetch eco rewards" });
  }
};

// Function to update user stats (called from image analysis)
export function updateUserStats(pointsEarned: number, carbonSaved: number) {
  userStats.totalPoints += pointsEarned;
  userStats.totalCarbonSaved += carbonSaved;
  userStats.analysesCount += 1;
}

export function getUserPoints(): number {
  return userStats.totalPoints;
}

export function deductUserPoints(points: number): boolean {
  if (userStats.totalPoints >= points) {
    userStats.totalPoints -= points;
    return true;
  }
  return false;
}
