import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Zap } from "lucide-react";
import { ClothingItem } from "@shared/api";

interface CarbonScoreProps {
  items: ClothingItem[];
  totalCarbonFootprint: number;
  ecoRewardPoints: number;
}

export function CarbonScore({
  items,
  totalCarbonFootprint,
  ecoRewardPoints,
}: CarbonScoreProps) {
  const getCarbonImpactLevel = (carbon: number) => {
    if (carbon <= 5) return { level: "Low", color: "bg-eco-500", icon: Leaf };
    if (carbon <= 15)
      return { level: "Medium", color: "bg-yellow-500", icon: TreePine };
    return { level: "High", color: "bg-orange-500", icon: Zap };
  };

  const impact = getCarbonImpactLevel(totalCarbonFootprint);
  const IconComponent = impact.icon;

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="w-5 h-5 text-eco-600" />
            Carbon Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {totalCarbonFootprint.toFixed(1)} kg
              </p>
              <p className="text-sm text-muted-foreground">
                Total CO₂ footprint
              </p>
            </div>
            <Badge className={`${impact.color} text-white`}>
              {impact.level} Impact
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-eco-50 rounded-lg border border-eco-200">
            <div>
              <p className="font-semibold text-eco-800">
                +{ecoRewardPoints} Points
              </p>
              <p className="text-sm text-eco-600">Eco-rewards earned</p>
            </div>
            <Leaf className="w-8 h-8 text-eco-500" />
          </div>
        </CardContent>
      </Card>

      {/* Individual Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Detected Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-card border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.type} • {Math.round(item.confidence * 100)}%
                    confidence
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {item.carbonFootprint.toFixed(1)} kg
                  </p>
                  <p className="text-xs text-muted-foreground">CO₂</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Context */}
      <Card className="bg-eco-50 border-eco-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <TreePine className="w-6 h-6 text-eco-600 mt-1" />
            <div>
              <p className="font-medium text-eco-800">Environmental Impact</p>
              <p className="text-sm text-eco-700 mt-1">
                The fashion industry accounts for ~10% of global carbon
                emissions. By tracking your clothing's carbon footprint, you're
                taking a step towards more sustainable choices!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
