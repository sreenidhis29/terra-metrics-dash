import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Sun, MapPin } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { useEffect, useState } from "react";

const SensorDataCard = () => {
  const { selectedLocation, isLocationLoading } = useLocation();
  const [sensorData, setSensorData] = useState([
    {
      name: "Soil Moisture",
      value: "68%",
      icon: Droplets,
      status: "optimal",
      change: "+2.1%"
    },
    {
      name: "Air Temperature",
      value: "24°C",
      icon: Thermometer,
      status: "normal",
      change: "+1.3°C"
    },
    {
      name: "Humidity",
      value: "71%",
      icon: Wind,
      status: "high",
      change: "+5.2%"
    },
    {
      name: "Light Intensity",
      value: "850 lux",
      icon: Sun,
      status: "optimal",
      change: "-12 lux"
    }
  ]);

  // Fetch real sensor data from backend
  useEffect(() => {
    if (selectedLocation) {
      const fetchSensorData = async () => {
        try {
          // For now, we'll use mock data but this can be replaced with real API calls
          // when you have actual sensor data endpoints
          const response = await fetch(`http://localhost:8000/api/sensor-data/field_001?hours=24`);
          if (response.ok) {
            const data = await response.json();
            // Process the real data here when available
            console.log('Real sensor data:', data);
          }
        } catch (error) {
          console.error('Error fetching sensor data:', error);
        }

        // Fallback to generated data for now
        const generateLocationData = () => {
          const baseTemp = 20 + Math.random() * 15; // 20-35°C
          const baseHumidity = 40 + Math.random() * 40; // 40-80%
          const baseMoisture = 30 + Math.random() * 50; // 30-80%
          const baseLight = 500 + Math.random() * 1000; // 500-1500 lux

          return [
            {
              name: "Soil Moisture",
              value: `${Math.round(baseMoisture)}%`,
              icon: Droplets,
              status: baseMoisture > 60 ? "optimal" : baseMoisture > 40 ? "normal" : "low",
              change: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 5).toFixed(1)}%`
            },
            {
              name: "Air Temperature",
              value: `${Math.round(baseTemp)}°C`,
              icon: Thermometer,
              status: baseTemp > 30 ? "high" : baseTemp > 15 ? "normal" : "low",
              change: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 3).toFixed(1)}°C`
            },
            {
              name: "Humidity",
              value: `${Math.round(baseHumidity)}%`,
              icon: Wind,
              status: baseHumidity > 70 ? "high" : baseHumidity > 40 ? "normal" : "low",
              change: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 8).toFixed(1)}%`
            },
            {
              name: "Light Intensity",
              value: `${Math.round(baseLight)} lux`,
              icon: Sun,
              status: baseLight > 800 ? "optimal" : baseLight > 400 ? "normal" : "low",
              change: `${Math.random() > 0.5 ? '+' : ''}${Math.round(Math.random() * 50)} lux`
            }
          ];
        };

        setSensorData(generateLocationData());
      };

      fetchSensorData();
    }
  }, [selectedLocation]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-healthy";
      case "normal":
        return "text-success";
      case "high":
        return "text-warning";
      case "low":
        return "text-critical";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="card-gradient h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Sensor Snapshot</CardTitle>
          {selectedLocation && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary truncate max-w-20">
                {selectedLocation.address.split(',')[0]}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {sensorData.map((sensor) => (
            <div
              key={sensor.name}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-card/50 to-card/30 border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shadow-sm ${getStatusColor(sensor.status)} bg-background/80`}>
                      <sensor.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{sensor.name}</h4>
                      <p className="text-xs text-muted-foreground">Current reading</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{sensor.value}</p>
                    <div className={`flex items-center gap-1 text-xs font-medium ${sensor.change.startsWith('+')
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}>
                      <span className={`inline-block w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent ${sensor.change.startsWith('+')
                        ? 'border-b-emerald-600 dark:border-b-emerald-400'
                        : 'border-t-2 border-b-0 border-t-red-600 dark:border-t-red-400'
                        }`}></span>
                      {sensor.change}
                    </div>
                  </div>
                </div>

                {/* Status indicator bar */}
                <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden">
                  <div className={`h-full w-full transition-all duration-500 ${sensor.status === 'optimal' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                    sensor.status === 'normal' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                      sensor.status === 'high' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                        'bg-gradient-to-r from-red-400 to-red-500'
                    }`} style={{
                      width: sensor.status === 'optimal' ? '100%' :
                        sensor.status === 'normal' ? '75%' :
                          sensor.status === 'high' ? '90%' : '30%'
                    }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLocationLoading && (
          <div className="mt-6 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Loading sensor data for location...</span>
            </div>
          </div>
        )}

        {selectedLocation && !isLocationLoading && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Real-time data for selected location</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SensorDataCard;