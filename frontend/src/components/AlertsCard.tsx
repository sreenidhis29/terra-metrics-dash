import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Droplets, Thermometer, Bug } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "critical",
    icon: AlertTriangle,
    title: "Low soil moisture detected",
    location: "Zone B-12",
    time: "2 hours ago",
    severity: "High"
  },
  {
    id: 2,
    type: "warning",
    icon: Thermometer,
    title: "Temperature stress warning",
    location: "Zone A-8",
    time: "4 hours ago",
    severity: "Medium"
  },
  {
    id: 3,
    type: "info",
    icon: Droplets,
    title: "Irrigation scheduled",
    location: "Zone C-3",
    time: "6 hours ago",
    severity: "Low"
  },
  {
    id: 4,
    type: "warning",
    icon: Bug,
    title: "Pest activity increase",
    location: "Zone D-15",
    time: "8 hours ago",
    severity: "Medium"
  }
];

const AlertsCard = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-critical text-critical-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-critical";
      case "warning":
        return "text-warning";
      case "info":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Alerts</span>
          <Badge variant="outline" className="text-xs">
            {alerts.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent/70 transition-smooth"
          >
            <alert.icon className={`h-4 w-4 mt-0.5 ${getIconColor(alert.type)}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-tight">{alert.title}</p>
                <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{alert.location}</p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertsCard;