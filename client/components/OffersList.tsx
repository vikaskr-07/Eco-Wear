import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CouponDialog } from "@/components/CouponDialog";
import {
  Gift,
  Clock,
  Star,
  ShoppingBag,
  Check,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Offer } from "@shared/api";
import { cn } from "@/lib/utils";

interface OffersListProps {
  offers: Offer[];
  userPoints: number;
  onRedeemOffer?: (offerId: string) => void;
}

interface CouponData {
  offerId: string;
  offerTitle: string;
  couponCode: string;
  redemptionInstructions: string;
  pointsDeducted: number;
  expiresAt?: string;
}

export function OffersList({
  offers,
  userPoints,
  onRedeemOffer,
}: OffersListProps) {
  const [redeemingOffers, setRedeemingOffers] = useState<Set<string>>(
    new Set(),
  );
  const [redeemedOffers, setRedeemedOffers] = useState<Set<string>>(new Set());
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [showCouponDialog, setShowCouponDialog] = useState(false);

  const generateCouponCode = () => {
    const prefix = "ECO";
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${randomStr}`;
  };

  const getRedemptionInstructions = (category: string) => {
    switch (category.toLowerCase()) {
      case "discount":
        return "Apply this code at checkout on our partner websites. Valid for online purchases only.";
      case "eco-product":
        return "Present this code to claim your eco-product. Check your email for shipping details.";
      case "experience":
        return "Use this code to book your experience session. Visit our website to schedule.";
      default:
        return "Follow the instructions sent to your email to redeem this offer.";
    }
  };

  const handleRedeemClick = async (offerId: string) => {
    if (redeemingOffers.has(offerId) || redeemedOffers.has(offerId)) return;

    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    setRedeemingOffers((prev) => new Set(prev).add(offerId));

    try {
      await onRedeemOffer?.(offerId);

      // Generate coupon data
      const couponCode = generateCouponCode();
      const redemptionInstructions = getRedemptionInstructions(offer.category);

      setCouponData({
        offerId,
        offerTitle: offer.title,
        couponCode,
        redemptionInstructions,
        pointsDeducted: offer.pointsCost,
        expiresAt: offer.expiresAt,
      });

      setRedeemedOffers((prev) => new Set(prev).add(offerId));
      setShowCouponDialog(true);
    } catch (error) {
      console.error("Redemption failed:", error);
    } finally {
      setRedeemingOffers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(offerId);
        return newSet;
      });
    }
  };
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "discount":
        return ShoppingBag;
      case "eco-product":
        return Star;
      case "experience":
        return Gift;
      default:
        return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "discount":
        return "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30";
      case "eco-product":
        return "bg-gradient-to-br from-eco-500 to-eco-600 shadow-lg shadow-eco-500/30";
      case "experience":
        return "bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg shadow-gray-500/30";
    }
  };

  return (
    <>
      <CouponDialog
        isOpen={showCouponDialog}
        onClose={() => setShowCouponDialog(false)}
        offerTitle={couponData?.offerTitle || ""}
        couponCode={couponData?.couponCode || ""}
        redemptionInstructions={couponData?.redemptionInstructions || ""}
        pointsDeducted={couponData?.pointsDeducted || 0}
        expiresAt={couponData?.expiresAt}
      />

      <div className="space-y-6">
        {/* Header with animated points display */}
        <Card className="bg-gradient-to-r from-eco-50 via-eco-100 to-eco-50 border-eco-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-eco-500 to-eco-600 rounded-xl shadow-lg shadow-eco-500/30">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-eco-700 to-eco-900 bg-clip-text text-transparent">
                Rewards Marketplace
              </span>
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Sparkles className="w-5 h-5 text-eco-600 animate-pulse" />
              <p className="text-eco-700 font-medium">
                You have{" "}
                <span className="text-2xl font-bold text-eco-800 bg-eco-200 px-3 py-1 rounded-full">
                  {userPoints.toLocaleString()}
                </span>{" "}
                eco-points to spend
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Offers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {offers.length === 0 ? (
            <Card className="border-dashed border-2 border-eco-200">
              <CardContent className="text-center py-12">
                <div className="animate-bounce mb-4">
                  <Gift className="w-16 h-16 text-eco-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-eco-800 mb-2">
                  No offers available right now
                </h3>
                <p className="text-eco-600">
                  Keep earning points to unlock amazing eco-rewards!
                </p>
              </CardContent>
            </Card>
          ) : (
            offers.map((offer, index) => {
              const IconComponent = getCategoryIcon(offer.category);
              const canAfford = userPoints >= offer.pointsCost;
              const isRedeeming = redeemingOffers.has(offer.id);
              const isRedeemed = redeemedOffers.has(offer.id);

              return (
                <Card
                  key={offer.id}
                  className={cn(
                    "group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                    canAfford
                      ? "border-eco-200 hover:border-eco-400 hover:shadow-eco-200/50"
                      : "border-gray-200 hover:border-gray-300",
                    isRedeemed && "bg-eco-50 border-eco-300",
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {/* Redeemed badge */}
                  {isRedeemed && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-eco-500 text-white shadow-lg animate-pulse">
                        <Check className="w-3 h-3 mr-1" />
                        Redeemed
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon with enhanced styling */}
                      <div
                        className={cn(
                          "p-4 rounded-xl transition-all duration-300 group-hover:scale-110",
                          getCategoryColor(offer.category),
                        )}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-2">
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-eco-800 transition-colors">
                              {offer.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="capitalize font-medium"
                            >
                              {offer.category.replace("-", " ")}
                            </Badge>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-eco-500" />
                              <p className="text-2xl font-bold text-eco-600">
                                {offer.pointsCost.toLocaleString()}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">
                              eco-points
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {offer.description}
                        </p>

                        {/* Expiration */}
                        {offer.expiresAt && (
                          <div className="flex items-center gap-2 text-sm text-orange-600 mb-4 bg-orange-50 px-3 py-1 rounded-full w-fit">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">
                              Expires{" "}
                              {new Date(offer.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* Action Button */}
                        <Button
                          size="lg"
                          disabled={!canAfford || isRedeeming || isRedeemed}
                          onClick={() => handleRedeemClick(offer.id)}
                          className={cn(
                            "w-full font-semibold transition-all duration-300",
                            canAfford && !isRedeemed
                              ? "bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 shadow-lg hover:shadow-xl hover:shadow-eco-500/30 text-white"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed",
                            isRedeemed &&
                              "bg-eco-100 text-eco-700 border-eco-300",
                            isRedeeming && "animate-pulse",
                          )}
                        >
                          {isRedeeming ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </div>
                          ) : isRedeemed ? (
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Redeemed Successfully!
                            </div>
                          ) : canAfford ? (
                            <div className="flex items-center gap-2">
                              <Gift className="w-4 h-4" />
                              Redeem Now
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>
                                Need{" "}
                                {(
                                  offer.pointsCost - userPoints
                                ).toLocaleString()}{" "}
                                more points
                              </span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
