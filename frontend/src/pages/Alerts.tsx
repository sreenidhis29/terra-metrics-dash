import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bug, Droplets, Thermometer, Wind, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { useState } from "react";

const alertsData = [
  {
    id: 1,
    type: "Pest Risk",
    severity: "High",
    field: "North Farm - Plot A",
    zone: "Zone 3A",
    description: "Potential pest outbreak detected in northern section",
    detected: "2025-01-15 10:30 AM",
    icon: Bug,
    status: "active",
    confidence: 91,
  },
  {
    id: 2, 
    type: "Water Stress",
    severity: "Medium",
    field: "South Field",
    zone: "Zone 2B",
    description: "Soil moisture levels dropping below optimal range",
    detected: "2025-01-15 09:15 AM",
    icon: Droplets,
    status: "active",
    confidence: 87,
  },
  {
    id: 3,
    type: "Temperature Anomaly", 
    severity: "Low",
    field: "East Field",
    zone: "Zone 1C",
    description: "Unusual temperature pattern detected in crop canopy",
    detected: "2025-01-15 08:45 AM", 
    icon: Thermometer,
    status: "investigating",
    confidence: 73,
  },
  {
    id: 4,
    type: "Wind Damage",
    severity: "High",
    field: "West Pasture", 
    zone: "Zone 4A",
    description: "Potential crop lodging from strong wind exposure",
    detected: "2025-01-14 16:20 PM",
    icon: Wind,
    status: "resolved",
    confidence: 95,
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High": return "bg-critical text-critical-foreground";
    case "Medium": return "bg-moderate text-moderate-foreground";
    case "Low": return "bg-warning text-warning-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-destructive text-destructive-foreground";
    case "investigating": return "bg-warning text-warning-foreground"; 
    case "resolved": return "bg-healthy text-healthy-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const Alerts = () => {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  if (selectedAlert) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedAlert(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Alerts
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">
            Alert Detail: {selectedAlert.type} ({selectedAlert.zone})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zone Detail Map Placeholder */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <selectedAlert.icon className="h-5 w-5" />
                {selectedAlert.zone.toUpperCase()} DETAIL MAP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/20 rounded-lg relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
                  <div className="absolute top-4 left-4 w-1/3 h-1/2 bg-healthy/20 rounded border border-healthy/40"></div>
                  <div className="absolute bottom-4 right-6 w-1/4 h-1/3 bg-critical/40 rounded border border-critical/60"></div>
                </div>
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-xs font-medium">NDVI | Chlorophyll Index</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Summary */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>ALERT SUMMARY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.type} ({selectedAlert.severity})
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span className="text-sm">{selectedAlert.zone} ({selectedAlert.field})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Severity:</span>
                  <Badge variant="destructive">Requires Immediate Action</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Detected On:</span>
                  <span className="text-sm">{selectedAlert.detected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Confidence:</span>
                  <span className="text-sm">{selectedAlert.confidence}%</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {selectedAlert.description}. Root cause analysis indicates high humidity, pest pressure and 
                  environmental stress factors contributing to current conditions.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Mark as Resolved</Button>
                <Button variant="outline">Share Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Temporal Trends */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>TEMPORAL TRENDS FOR {selectedAlert.zone.toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-r from-chart-1/20 to-chart-2/20 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive trend chart would be rendered here</p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>RECOMMENDED ACTIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                • Apply targeted pest control measures in affected zone
              </p>
              <p className="text-sm">
                • Increase monitoring frequency for early detection
              </p>
              <p className="text-sm">
                • Consider preventive treatments in adjacent areas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Monitor field conditions and respond to critical events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Mark All Read</Button>
          <Button size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            Resolve All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {alertsData.filter(alert => alert.status === "active").map((alert) => (
            <Card key={alert.id} className="card-gradient cursor-pointer hover:bg-accent/50 transition-colors" 
                  onClick={() => setSelectedAlert(alert)}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-destructive/20 rounded-lg">
                      <alert.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold">{alert.type}</h3>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">
                            {alert.field}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.detected}
                        </div>
                        <span className="hidden sm:block">•</span>
                        <span>Zone: {alert.zone}</span>
                        <span className="hidden sm:block">•</span>
                        <span>Confidence: {alert.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      Investigate
                    </Button>
                    <Button size="sm" className="flex-1 sm:flex-none">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Resolve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="investigating" className="space-y-4">
          {alertsData.filter(alert => alert.status === "investigating").map((alert) => (
            <Card key={alert.id} className="card-gradient cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedAlert(alert)}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-warning/20 rounded-lg">
                      <alert.icon className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold">{alert.type}</h3>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            Investigating
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="text-xs text-muted-foreground">
                        {alert.detected} • Zone: {alert.zone}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {alertsData.filter(alert => alert.status === "resolved").map((alert) => (
            <Card key={alert.id} className="card-gradient opacity-75">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-healthy/20 rounded-lg">
                    <alert.icon className="h-5 w-5 text-healthy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold">{alert.type}</h3>
                      <div className="flex gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Resolved
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="text-xs text-muted-foreground">
                      {alert.detected} • Zone: {alert.zone}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;