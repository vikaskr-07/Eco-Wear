import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";
import { CarbonScore } from "@/components/CarbonScore";
import { EcoRewards } from "@/components/EcoRewards";
import { OffersList } from "@/components/OffersList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Leaf, Camera, Award, Gift, Sparkles, Brain, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-background to-eco-100 dark:from-gray-900 dark:via-gray-800 dark:to-eco-900/20 relative overflow-hidden transition-colors duration-500">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-eco-200/20 dark:bg-eco-400/10 rounded-full animate-pulse" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-eco-300/20 dark:bg-eco-500/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-20 h-20 bg-eco-400/20 dark:bg-eco-300/10 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-40 w-28 h-28 bg-eco-200/20 dark:bg-eco-400/10 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />

        {/* AI-themed background elements */}
        <div
          className="absolute top-60 left-1/2 w-16 h-16 bg-blue-300/20 dark:bg-blue-400/10 rounded-full animate-pulse"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-80 right-1/3 w-12 h-12 bg-purple-300/20 dark:bg-purple-400/10 rounded-full animate-bounce"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      {/* Enhanced Header with AI branding */}
      <div className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-eco-100/20 dark:shadow-gray-900/20 transition-colors duration-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-eco-500 to-eco-600 dark:from-eco-400 dark:to-eco-500 rounded-xl shadow-lg shadow-eco-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                {/* AI indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-eco-700 to-eco-900 dark:from-eco-300 dark:to-eco-100 bg-clip-text text-transparent">
                  EcoWear AI
                </h1>
                <p className="text-eco-600 dark:text-eco-400 font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AI-Powered Carbon Tracker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              {ecoRewards && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-eco-100 to-eco-200 dark:from-eco-800/50 dark:to-eco-700/50 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Sparkles className="w-5 h-5 text-eco-600 dark:text-eco-400 animate-pulse" />
                  <span className="text-xl font-bold text-eco-800 dark:text-eco-200">
                    {ecoRewards.totalPoints.toLocaleString()}
                  </span>
                  <span className="text-eco-600 dark:text-eco-400 font-medium">
                    eco-points
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm border shadow-lg rounded-xl p-2">
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-eco-500 data-[state=active]:to-eco-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!analysisResult}
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-eco-500 data-[state=active]:to-eco-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg disabled:opacity-50"
            >
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-eco-500 data-[state=active]:to-eco-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger
              value="offers"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-eco-500 data-[state=active]:to-eco-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
            >
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Offers</span>
            </TabsTrigger>
          </TabsList>

          <div className="max-w-4xl mx-auto">
            <TabsContent
              value="upload"
              className="space-y-8 animate-in fade-in-50 duration-500"
            >
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-eco-700 via-eco-800 to-eco-900 bg-clip-text text-transparent">
                    Track Your Clothing's Carbon Footprint
                  </h2>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-eco-400 to-eco-600 rounded-full" />
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  Upload or capture an image of your clothing items to discover
                  their environmental impact and earn{" "}
                  <span className="font-semibold text-eco-600">
                    eco-reward points
                  </span>{" "}
                  for sustainable choices.
                </p>
              </div>
              <div className="relative">
                <ImageUpload
                  onImageCapture={handleImageCapture}
                  isAnalyzing={isAnalyzing}
                />
              </div>
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
