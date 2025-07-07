import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, Star, ShoppingBag } from "lucide-react";
import { Offer } from "@shared/api";

interface OffersListProps {
  offers: Offer[];
  userPoints: number;
  onRedeemOffer?: (offerId: string) => void;
}

export function OffersList({
  offers,
  userPoints,
  onRedeemOffer,
}: OffersListProps) {
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
        return "bg-blue-500";
      case "eco-product":
        return "bg-eco-500";
      case "experience":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-eco-600" />
          Available Offers
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          You have{" "}
          <span className="font-semibold text-eco-600">
            {userPoints.toLocaleString()}
          </span>{" "}
          points available
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {offers.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No offers available at the moment
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep earning points to unlock amazing rewards!
              </p>
            </div>
          ) : (
            offers.map((offer) => {
              const IconComponent = getCategoryIcon(offer.category);
              const canAfford = userPoints >= offer.pointsCost;

              return (
                <Card key={offer.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${getCategoryColor(
                          offer.category,
                        )}`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-base">
                              {offer.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="mt-1 capitalize"
                            >
                              {offer.category.replace("-", " ")}
                            </Badge>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-eco-600">
                              {offer.pointsCost.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              points
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {offer.description}
                        </p>

                        {offer.expiresAt && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                            <Clock className="w-3 h-3" />
                            Expires{" "}
                            {new Date(offer.expiresAt).toLocaleDateString()}
                          </div>
                        )}

                        <Button
                          size="sm"
                          disabled={!canAfford}
                          onClick={() => onRedeemOffer?.(offer.id)}
                          className={
                            canAfford ? "" : "opacity-50 cursor-not-allowed"
                          }
                        >
                          {canAfford ? "Redeem" : "Not enough points"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
