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

  // Simulate location-based sensor data
  useEffect(() => {
    if (selectedLocation) {
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
    <Card className="card-gradient">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sensor Snapshot</CardTitle>
          {selectedLocation && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-24">{selectedLocation.address.split(',')[0]}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {sensorData.map((sensor) => (
            <div
              key={sensor.name}
              className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-smooth"
            >
              <div className={`p-2 rounded-lg bg-secondary ${getStatusColor(sensor.status)}`}>
                <sensor.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{sensor.value}</p>
                <p className="text-xs text-muted-foreground">{sensor.name}</p>
                <p className={`text-xs ${sensor.change.startsWith('+') ? 'text-success' : 'text-muted-foreground'}`}>
                  {sensor.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isLocationLoading && (
          <div className="mt-4 text-xs text-muted-foreground animate-pulse text-center">
            Loading sensor data for location...
          </div>
        )}

        {selectedLocation && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Real-time data for selected location
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SensorDataCard;