/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface ClothingItem {
  id: string;
  name: string;
  type: string;
  carbonFootprint: number; // kg CO2
  confidence: number; // 0-1
}

export interface ImageAnalysisResponse {
  items: ClothingItem[];
  totalCarbonFootprint: number;
  ecoRewardPoints: number;
  analysisId: string;
  message?: string; // Optional message for when no clothing is detected
}

export interface EcoRewardsResponse {
  totalPoints: number;
  totalCarbonSaved: number;
  level: string;
  nextLevelPoints: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  expiresAt?: string;
}

export interface OffersResponse {
  availableOffers: Offer[];
  userPoints: number;
}
