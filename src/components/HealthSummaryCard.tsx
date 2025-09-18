import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const HealthSummaryCard = () => {
  const healthScore = 87;
  const trend = 5.2; // percentage change

  return (
    <Card className="card-gradient">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Field Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <div className="text-4xl font-bold text-healthy">{healthScore}%</div>
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-healthy' : 'text-destructive'}`}>
            {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(trend)}%
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Compared to last week
        </p>
        
        {/* Health breakdown */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Healthy zones</span>
            <span className="text-healthy font-medium">68%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Moderate zones</span>
            <span className="text-moderate font-medium">19%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Stressed zones</span>
            <span className="text-stressed font-medium">8%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Critical zones</span>
            <span className="text-critical font-medium">5%</span>
          </div>
        </div>

        {/* Health gradient bar */}
        <div className="mt-4 h-2 w-full health-gradient rounded-full"></div>
      </CardContent>
    </Card>
  );
};

export default HealthSummaryCard;