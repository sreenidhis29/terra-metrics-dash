import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Sun } from "lucide-react";

const sensorData = [
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
];

const SensorDataCard = () => {
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
        <CardTitle>Sensor Snapshot</CardTitle>
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
      </CardContent>
    </Card>
  );
};

export default SensorDataCard;