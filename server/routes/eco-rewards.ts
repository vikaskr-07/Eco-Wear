import { RequestHandler } from "express";
import { EcoRewardsResponse } from "@shared/api";

// User-specific data storage (replace with database in production)
const userStatsDatabase = new Map<
  string,
  {
    totalPoints: number;
    totalCarbonSaved: number;
    analysesCount: number;
  }
>();

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

function getUserStats(userId: string) {
  if (!userStatsDatabase.has(userId)) {
    // Initialize new user with starting values
    userStatsDatabase.set(userId, {
      totalPoints: 0,
      totalCarbonSaved: 0,
      analysesCount: 0,
    });
  }
  return userStatsDatabase.get(userId)!;
}

export const handleEcoRewards: RequestHandler = (req: any, res) => {
  try {
    // Check if user is authenticated
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userStats = getUserStats(userId);
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
export function updateUserStats(
  userId: string,
  pointsEarned: number,
  carbonSaved: number,
) {
  if (!userId) return; // Don't update stats for non-authenticated users

  const userStats = getUserStats(userId);
  userStats.totalPoints += pointsEarned;
  userStats.totalCarbonSaved += carbonSaved;
  userStats.analysesCount += 1;
}

export function getUserPoints(userId: string): number {
  if (!userId) return 0;
  const userStats = getUserStats(userId);
  return userStats.totalPoints;
}

export function deductUserPoints(userId: string, points: number): boolean {
  if (!userId) return false;

  const userStats = getUserStats(userId);
  if (userStats.totalPoints >= points) {
    userStats.totalPoints -= points;
    return true;
  }
  return false;
}
