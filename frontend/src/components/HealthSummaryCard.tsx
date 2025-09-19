import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { useEffect, useState } from "react";

const HealthSummaryCard = () => {
  const { selectedLocation, isLocationLoading } = useLocation();
  const [healthData, setHealthData] = useState({
    healthScore: 87,
    trend: 5.2,
    zones: {
      healthy: 68,
      moderate: 19,
      stressed: 8,
      critical: 5
    }
  });

  // Simulate location-based health data fetching
  useEffect(() => {
    if (selectedLocation) {
      // Simulate different health data based on location
      const locationBasedHealth = {
        healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
        trend: (Math.random() - 0.5) * 10, // -5 to +5
        zones: {
          healthy: Math.floor(Math.random() * 40) + 50, // 50-90
          moderate: Math.floor(Math.random() * 20) + 10, // 10-30
          stressed: Math.floor(Math.random() * 15) + 5, // 5-20
          critical: Math.floor(Math.random() * 10) + 2 // 2-12
        }
      };
      setHealthData(locationBasedHealth);
    }
  }, [selectedLocation]);

  return (
    <Card className="card-gradient">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Field Health</CardTitle>
          {selectedLocation && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-24">{selectedLocation.address.split(',')[0]}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <div className="text-4xl font-bold text-healthy">{healthData.healthScore}%</div>
          <div className={`flex items-center gap-1 text-sm ${healthData.trend > 0 ? 'text-healthy' : 'text-destructive'}`}>
            {healthData.trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(healthData.trend).toFixed(1)}%
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {selectedLocation ? 'Location-specific data' : 'Default data - select a location'}
        </p>

        {/* Health breakdown */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Healthy zones</span>
            <span className="text-healthy font-medium">{healthData.zones.healthy}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Moderate zones</span>
            <span className="text-moderate font-medium">{healthData.zones.moderate}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Stressed zones</span>
            <span className="text-stressed font-medium">{healthData.zones.stressed}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Critical zones</span>
            <span className="text-critical font-medium">{healthData.zones.critical}%</span>
          </div>
        </div>

        {/* Health gradient bar */}
        <div className="mt-4 h-2 w-full health-gradient rounded-full"></div>

        {isLocationLoading && (
          <div className="mt-2 text-xs text-muted-foreground animate-pulse">
            Loading location data...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthSummaryCard;