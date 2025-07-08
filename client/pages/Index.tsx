import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageUpload } from "@/components/ImageUpload";
import { CarbonScore } from "@/components/CarbonScore";
import { EcoRewards } from "@/components/EcoRewards";
import { OffersList } from "@/components/OffersList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import {
  Leaf,
  Camera,
  Award,
  Gift,
  Sparkles,
  Brain,
  Zap,
  User,
  LogOut,
} from "lucide-react";
import {
  ImageAnalysisResponse,
  EcoRewardsResponse,
  OffersResponse,
} from "@shared/api";

export default function Index() {
  const { user, isAuthenticated, logout } = useAuth();
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

  const getAuthHeaders = () => {
    const tokens = localStorage.getItem("auth_tokens");
    if (tokens) {
      const { accessToken } = JSON.parse(tokens);
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return {
      "Content-Type": "application/json",
    };
  };

  const handleImageCapture = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: getAuthHeaders(),
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
      const response = await fetch("/api/eco-rewards", {
        headers: getAuthHeaders(),
      });
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
      const response = await fetch("/api/offers", {
        headers: getAuthHeaders(),
      });
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
        headers: getAuthHeaders(),
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
              <div className="p-3 bg-gradient-to-br from-eco-500 to-eco-600 dark:from-eco-400 dark:to-eco-500 rounded-xl shadow-lg shadow-eco-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-eco-700 to-eco-900 dark:from-eco-300 dark:to-eco-100 bg-clip-text text-transparent">
                  EcoWear
                </h1>
                <p className="text-eco-600 dark:text-eco-400 font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Carbon footprint tracker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              {isAuthenticated && ecoRewards && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-eco-100 to-eco-200 dark:from-eco-800/50 dark:to-eco-700/50 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[160px]">
                  <Sparkles className="w-5 h-5 text-eco-600 dark:text-eco-400 animate-pulse" />
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-eco-800 dark:text-eco-200 leading-tight">
                      {ecoRewards.totalPoints.toLocaleString()}
                    </span>
                    <span className="text-xs text-eco-600 dark:text-eco-400 font-medium -mt-1">
                      eco-points
                    </span>
                  </div>
                </div>
              )}

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-eco-500 to-eco-600 text-white">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 text-white"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-eco-200 dark:border-eco-700 shadow-lg rounded-xl p-2">
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
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-eco-700 via-eco-800 to-eco-900 dark:from-eco-300 dark:via-eco-200 dark:to-eco-100 bg-clip-text text-transparent">
                    Carbon Footprint Analysis
                  </h2>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-eco-400 via-eco-500 to-eco-600 rounded-full animate-pulse" />
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  Instantly recognize clothing items and calculate their
                  environmental impact. Earn{" "}
                  <span className="font-semibold text-eco-600 dark:text-eco-400">
                    eco-reward points
                  </span>{" "}
                  for sustainable clothing choices and discover your wardrobe's
                  carbon footprint.
                </p>

                {/* AI Features showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-eco-200/50 dark:border-eco-700/50">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                        Smart Recognition
                      </p>
                      <p className="text-xs text-muted-foreground">
                        AI identifies clothing types
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-eco-200/50 dark:border-eco-700/50">
                    <div className="p-2 bg-gradient-to-br from-eco-500 to-eco-600 rounded-lg">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                        Carbon Analysis
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Instant footprint calculation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-eco-200/50 dark:border-eco-700/50">
                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                        Reward System
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Earn points for sustainability
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                {isAuthenticated ? (
                  <ImageUpload
                    onImageCapture={handleImageCapture}
                    isAnalyzing={isAnalyzing}
                  />
                ) : (
                  // Login required message for non-authenticated users
                  <div className="w-full max-w-md mx-auto">
                    <div className="bg-gradient-to-br from-white to-eco-50/30 dark:from-gray-900 dark:to-eco-900/20 backdrop-blur-sm border-2 border-eco-200 dark:border-eco-700 rounded-xl shadow-2xl p-8 text-center">
                      <div className="mb-6">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-eco-100 to-eco-200 dark:from-eco-800 dark:to-eco-700 rounded-full flex items-center justify-center mb-4">
                          <User className="w-10 h-10 text-eco-600 dark:text-eco-400" />
                        </div>
                        <h3 className="text-xl font-bold text-eco-800 dark:text-eco-200 mb-2">
                          Sign In Required
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Create an account to start analyzing your clothing's
                          carbon footprint and earning eco-rewards.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Link to="/signup">
                          <Button className="w-full bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 text-white">
                            Create Account
                          </Button>
                        </Link>
                        <Link to="/login">
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                      </div>

                      <div className="mt-6 p-4 bg-eco-50 dark:bg-eco-900/30 rounded-lg border border-eco-200 dark:border-eco-700">
                        <p className="text-xs text-eco-700 dark:text-eco-300">
                          <strong>Why sign up?</strong> Track your progress,
                          earn rewards, and contribute to a more sustainable
                          future!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {analysisResult ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                      Analysis Results
                    </h2>
                    {analysisResult.items.length > 0 ? (
                      <p className="text-muted-foreground">
                        Here's the carbon footprint of your clothing items
                      </p>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                          No Clothing Detected
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                          {analysisResult.message ||
                            "Please try uploading an image with clothing items like shirts, pants, dresses, or jackets."}
                        </p>
                      </div>
                    )}
                  </div>

                  {analysisResult.items.length > 0 ? (
                    <CarbonScore
                      items={analysisResult.items}
                      totalCarbonFootprint={analysisResult.totalCarbonFootprint}
                      ecoRewardPoints={analysisResult.ecoRewardPoints}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Try a Different Image
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                        Our AI specializes in detecting clothing items like
                        shirts, pants, dresses, jackets, and sweaters. Make sure
                        your image clearly shows clothing for the best results.
                      </p>
                      <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 max-w-lg mx-auto">
                        <strong>
                          You still earned {analysisResult.ecoRewardPoints}{" "}
                          eco-points
                        </strong>{" "}
                        for trying to make more sustainable choices!
                      </div>
                    </div>
                  )}

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
              {isAuthenticated ? (
                ecoRewards ? (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">
                        Your Eco Impact
                      </h2>
                      <p className="text-muted-foreground">
                        Track your environmental contributions and level
                        progress
                      </p>
                    </div>
                    <EcoRewards rewards={ecoRewards} />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Loading...</h3>
                  </div>
                )
              ) : (
                // Login required for rewards
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-800 dark:to-orange-700 rounded-full flex items-center justify-center mb-6">
                    <Award className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    Sign In to View Your Rewards
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Track your eco-points, level progress, and environmental
                    impact by creating an account.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/login">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="offers" className="space-y-6">
              {isAuthenticated ? (
                offers ? (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">
                        Redeem Rewards
                      </h2>
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
                )
              ) : (
                // Login required for offers
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-800 dark:to-pink-700 rounded-full flex items-center justify-center mb-6">
                    <Gift className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    Sign In to View Offers
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Earn eco-points by analyzing clothing and redeem them for
                    sustainable rewards and discounts.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/login">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
