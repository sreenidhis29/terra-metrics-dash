import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit, Trash2, BarChart3 } from "lucide-react";

const fieldsData = [
  {
    id: 1,
    name: "North Farm - Plot A",
    area: "48.2 ha",
    health: 92,
    status: "Healthy",
    location: "40.7128° N, 74.0060° W",
    lastUpdated: "2 hours ago",
    alerts: 2,
  },
  {
    id: 2,
    name: "South Field",
    area: "32.1 ha", 
    health: 78,
    status: "Moderate",
    location: "40.7580° N, 73.9855° W",
    lastUpdated: "1 hour ago",
    alerts: 5,
  },
  {
    id: 3,
    name: "East Field",
    area: "56.8 ha",
    health: 65,
    status: "Stressed",
    location: "40.7614° N, 73.9776° W", 
    lastUpdated: "3 hours ago",
    alerts: 8,
  },
  {
    id: 4,
    name: "West Pasture",
    area: "24.5 ha",
    health: 89,
    status: "Healthy",
    location: "40.7505° N, 73.9934° W",
    lastUpdated: "30 minutes ago", 
    alerts: 0,
  },
];

const getHealthColor = (health: number) => {
  if (health >= 85) return "bg-healthy text-healthy-foreground";
  if (health >= 70) return "bg-moderate text-moderate-foreground"; 
  if (health >= 50) return "bg-stressed text-stressed-foreground";
  return "bg-critical text-critical-foreground";
};

const Fields = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Fields</h1>
          <p className="text-muted-foreground">Manage and monitor your agricultural fields</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Field
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {fieldsData.map((field) => (
          <Card key={field.id} className="card-gradient">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{field.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{field.area}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${getHealthColor(field.health)} text-xs`}>
                    {field.health}% {field.status}
                  </Badge>
                  {field.alerts > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {field.alerts} alerts
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-mono text-xs">{field.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{field.lastUpdated}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-muted-foreground">Total Fields</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">161.6</div>
            <div className="text-sm text-muted-foreground">Total Area (ha)</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">81%</div>
            <div className="text-sm text-muted-foreground">Avg Health</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">15</div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Fields;