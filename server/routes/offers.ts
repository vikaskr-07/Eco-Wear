import { RequestHandler } from "express";
import { OffersResponse, Offer } from "@shared/api";
import { getUserPoints, deductUserPoints } from "./eco-rewards";

// Mock offers database
const AVAILABLE_OFFERS: Offer[] = [
  {
    id: "eco_tshirt_discount",
    title: "20% Off Organic Cotton T-Shirt",
    description:
      "Get 20% off your next purchase of an organic cotton t-shirt from our sustainable fashion partners.",
    pointsCost: 500,
    category: "discount",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  },
  {
    id: "bamboo_fiber_discount",
    title: "Bamboo Fiber Clothing - 15% Off",
    description:
      "Sustainable bamboo fiber clothing with natural antibacterial properties.",
    pointsCost: 750,
    category: "discount",
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "eco_workshop",
    title: "Sustainable Fashion Workshop",
    description:
      "Join our online workshop on sustainable fashion choices and eco-friendly clothing care.",
    pointsCost: 300,
    category: "experience",
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "plant_tree",
    title: "Plant a Tree in Your Name",
    description:
      "We'll plant a tree in your name and send you a certificate with GPS coordinates.",
    pointsCost: 1000,
    category: "eco-product",
  },
  {
    id: "recycled_bag",
    title: "Recycled Ocean Plastic Tote Bag",
    description:
      "Stylish tote bag made from recycled ocean plastic. Free shipping included.",
    pointsCost: 800,
    category: "eco-product",
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "upcycling_kit",
    title: "DIY Upcycling Kit",
    description:
      "Complete kit with tools and instructions to upcycle your old clothing into new pieces.",
    pointsCost: 600,
    category: "eco-product",
  },
  {
    id: "sustainable_brand_voucher",
    title: "$25 Sustainable Fashion Voucher",
    description:
      "Voucher valid at any of our 50+ partner sustainable fashion brands.",
    pointsCost: 1200,
    category: "discount",
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "carbon_offset",
    title: "Carbon Offset - 1 Ton CO₂",
    description: "Offset 1 ton of CO₂ through verified reforestation projects.",
    pointsCost: 1500,
    category: "eco-product",
  },
];

export const handleOffers: RequestHandler = (req: any, res) => {
  try {
    // Check if user is authenticated
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userPoints = getUserPoints(userId);

    const response: OffersResponse = {
      availableOffers: AVAILABLE_OFFERS,
      userPoints,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

export const handleRedeemOffer: RequestHandler = (req: any, res) => {
  try {
    // Check if user is authenticated
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { offerId } = req.body;

    if (!offerId) {
      return res.status(400).json({ error: "Offer ID is required" });
    }

    // Find the offer
    const offer = AVAILABLE_OFFERS.find((o) => o.id === offerId);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Check if user has enough points
    const userPoints = getUserPoints(userId);
    if (userPoints < offer.pointsCost) {
      return res.status(400).json({
        error: "Insufficient points",
        required: offer.pointsCost,
        current: userPoints,
      });
    }

    // Deduct points
    const success = deductUserPoints(userId, offer.pointsCost);
    if (!success) {
      return res.status(500).json({ error: "Failed to deduct points" });
    }

    // In a real app, you would:
    // 1. Generate a voucher code
    // 2. Send email confirmation
    // 3. Update user's redeemed offers list
    // 4. Handle offer fulfillment

    res.json({
      success: true,
      message: `Successfully redeemed: ${offer.title}`,
      pointsDeducted: offer.pointsCost,
      remainingPoints: getUserPoints(userId),
      redemptionId: `redemption_${Date.now()}`,
    });
  } catch (error) {
    console.error("Error redeeming offer:", error);
    res.status(500).json({ error: "Failed to redeem offer" });
  }
};
