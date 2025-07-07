import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Award, TrendingUp } from "lucide-react";
import { EcoRewardsResponse } from "@shared/api";

interface EcoRewardsProps {
  rewards: EcoRewardsResponse;
}

export function EcoRewards({ rewards }: EcoRewardsProps) {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "bronze":
        return "bg-amber-600";
      case "silver":
        return "bg-gray-400";
      case "gold":
        return "bg-yellow-500";
      case "platinum":
        return "bg-purple-600";
      default:
        return "bg-eco-500";
    }
  };

  const progress =
    ((rewards.totalPoints % 1000) /
      (rewards.nextLevelPoints -
        (rewards.totalPoints - (rewards.totalPoints % 1000)))) *
    100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-eco-600" />
          Your Eco Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className={`${getLevelColor(rewards.level)} text-white`}>
                {rewards.level}
              </Badge>
              <span className="text-lg font-semibold">Level</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Keep earning points to reach the next level!
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-eco-600">
              {rewards.totalPoints.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
        </div>

        {/* Progress to Next Level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next level</span>
            <span>
              {rewards.totalPoints % 1000} /{" "}
              {rewards.nextLevelPoints -
                (rewards.totalPoints - (rewards.totalPoints % 1000))}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-eco-50 rounded-lg border border-eco-200">
            <Leaf className="w-8 h-8 text-eco-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-eco-800">
              {rewards.totalCarbonSaved.toFixed(1)}
            </p>
            <p className="text-sm text-eco-600">kg CO₂ Saved</p>
          </div>

          <div className="text-center p-4 bg-eco-50 rounded-lg border border-eco-200">
            <TrendingUp className="w-8 h-8 text-eco-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-eco-800">
              {Math.ceil(rewards.totalCarbonSaved / 5)}
            </p>
            <p className="text-sm text-eco-600">Analyses Done</p>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="p-4 bg-gradient-to-r from-eco-100 to-eco-50 rounded-lg border border-eco-200">
          <h4 className="font-semibold text-eco-800 mb-2">
            Your Environmental Impact
          </h4>
          <p className="text-sm text-eco-700">
            Equivalent to planting{" "}
            <span className="font-semibold">
              {Math.ceil(rewards.totalCarbonSaved / 21.7)}
            </span>{" "}
            trees or driving{" "}
            <span className="font-semibold">
              {Math.ceil(rewards.totalCarbonSaved * 2.31)}
            </span>{" "}
            fewer miles!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
