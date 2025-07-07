import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";
import { CarbonScore } from "@/components/CarbonScore";
import { EcoRewards } from "@/components/EcoRewards";
import { OffersList } from "@/components/OffersList";
import { Leaf, Camera, Award, Gift, Sparkles } from "lucide-react";
import {
  ImageAnalysisResponse,
  EcoRewardsResponse,
  OffersResponse,
} from "@shared/api";

export default function Index() {
  const [analysisResult, setAnalysisResult] =
    useState<ImageAnalysisResponse | null>(null);
  const [ecoRewards, setEcoRewards] = useState<EcoRewardsResponse | null>(null);
  const [offers, setOffers] = useState<OffersResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  // Load user data on mount
  useEffect(() => {
    fetchEcoRewards();
    fetchOffers();
  }, []);

  const handleImageCapture = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result: ImageAnalysisResponse = await response.json();
      setAnalysisResult(result);
      setActiveTab("results");

      // Refresh eco rewards after analysis
      await fetchEcoRewards();
      await fetchOffers();
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchEcoRewards = async () => {
    try {
      const response = await fetch("/api/eco-rewards");
      if (response.ok) {
        const data: EcoRewardsResponse = await response.json();
        setEcoRewards(data);
      }
    } catch (error) {
      console.error("Error fetching eco rewards:", error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers");
      if (response.ok) {
        const data: OffersResponse = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const handleRedeemOffer = async (offerId: string) => {
    try {
      const response = await fetch("/api/redeem-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offerId }),
      });

      if (response.ok) {
        // Refresh offers and rewards after redemption
        await fetchOffers();
        await fetchEcoRewards();
      }
    } catch (error) {
      console.error("Error redeeming offer:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-eco-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-eco-500 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-eco-800">EcoWear</h1>
                <p className="text-sm text-eco-600">Carbon footprint tracker</p>
              </div>
            </div>
            {ecoRewards && (
              <div className="flex items-center gap-2 bg-eco-100 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-eco-600" />
                <span className="font-semibold text-eco-800">
                  {ecoRewards.totalPoints.toLocaleString()}
                </span>
                <span className="text-sm text-eco-600">pts</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!analysisResult}
              className="flex items-center gap-2"
            >
              <Leaf className="w-4 h-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Offers
            </TabsTrigger>
          </TabsList>

          <div className="max-w-4xl mx-auto">
            <TabsContent value="upload" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Track Your Clothing's Carbon Footprint
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Upload or capture an image of your clothing items to discover
                  their environmental impact and earn eco-reward points for
                  sustainable choices.
                </p>
              </div>
              <ImageUpload
                onImageCapture={handleImageCapture}
                isAnalyzing={isAnalyzing}
              />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {analysisResult ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                      Analysis Results
                    </h2>
                    <p className="text-muted-foreground">
                      Here's the carbon footprint of your clothing items
                    </p>
                  </div>
                  <CarbonScore
                    items={analysisResult.items}
                    totalCarbonFootprint={analysisResult.totalCarbonFootprint}
                    ecoRewardPoints={analysisResult.ecoRewardPoints}
                  />
                  <div className="text-center">
                    <Button onClick={() => setActiveTab("upload")}>
                      Analyze Another Item
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload an image to see your carbon footprint analysis
                  </p>
                  <Button onClick={() => setActiveTab("upload")}>
                    Start Analysis
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              {ecoRewards ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Your Eco Impact</h2>
                    <p className="text-muted-foreground">
                      Track your environmental contributions and level progress
                    </p>
                  </div>
                  <EcoRewards rewards={ecoRewards} />
                </>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Loading...</h3>
                </div>
              )}
            </TabsContent>

            <TabsContent value="offers" className="space-y-6">
              {offers ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Redeem Rewards</h2>
                    <p className="text-muted-foreground">
                      Use your eco-points to unlock sustainable rewards and
                      discounts
                    </p>
                  </div>
                  <OffersList
                    offers={offers.availableOffers}
                    userPoints={offers.userPoints}
                    onRedeemOffer={handleRedeemOffer}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Loading...</h3>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
