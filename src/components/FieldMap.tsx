import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

const FieldMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Placeholder for map integration - would use Mapbox GL JS here
  useEffect(() => {
    if (!mapRef.current) return;
    
    // This would be where Mapbox GL JS initialization happens
    // For now, we'll show a visual placeholder that looks like a field map
  }, []);

  return (
    <Card className="h-full min-h-[400px] overflow-hidden card-gradient">
      <div className="relative h-full w-full bg-gradient-to-br from-primary/10 to-accent/20 rounded-lg">
        {/* Map placeholder with field visualization */}
        <div ref={mapRef} className="absolute inset-0">
          {/* Field boundary simulation */}
          <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
            {/* Health zones simulation */}
            <div className="absolute top-4 left-4 w-1/3 h-1/2 bg-healthy/20 rounded border border-healthy/40"></div>
            <div className="absolute top-4 right-4 w-1/4 h-1/3 bg-moderate/20 rounded border border-moderate/40"></div>
            <div className="absolute bottom-4 left-1/3 w-1/3 h-1/3 bg-stressed/20 rounded border border-stressed/40"></div>
            <div className="absolute bottom-4 right-6 w-1/6 h-1/4 bg-critical/20 rounded border border-critical/40"></div>
          </div>
          
          {/* Control overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
              <div className="text-xs font-medium mb-2 text-muted-foreground">Health Map</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-healthy rounded"></div>
                  <span className="text-xs">Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-moderate rounded"></div>
                  <span className="text-xs">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-stressed rounded"></div>
                  <span className="text-xs">Stressed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-critical rounded"></div>
                  <span className="text-xs">Critical</span>
                </div>
              </div>
            </div>
          </div>

          {/* Field info overlay */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
            <div className="text-sm font-medium">North Field</div>
            <div className="text-xs text-muted-foreground">48.2 hectares</div>
            <div className="text-xs text-muted-foreground mt-1">Last updated: 2 hours ago</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FieldMap;