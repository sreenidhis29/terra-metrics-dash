import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileText, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const reportsData = [
  {
    id: 1,
    title: "Weekly Field Health Report",
    field: "North Farm - Plot A",
    type: "Health Analysis",
    generated: "2025-01-15",
    period: "Jan 8-15, 2025",
    status: "Ready",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Pest Risk Assessment",
    field: "All Fields",
    type: "Risk Analysis", 
    generated: "2025-01-14",
    period: "Jan 1-14, 2025",
    status: "Ready",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Monthly Yield Prediction",
    field: "South Field",
    type: "Yield Forecast",
    generated: "2025-01-13",
    period: "December 2024",
    status: "Processing",
    size: "--",
  },
  {
    id: 4,
    title: "Environmental Impact Report",
    field: "East Field", 
    type: "Environmental",
    generated: "2025-01-12",
    period: "Q4 2024",
    status: "Ready",
    size: "3.2 MB",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready": return "bg-healthy text-healthy-foreground";
    case "Processing": return "bg-warning text-warning-foreground";
    case "Failed": return "bg-critical text-critical-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Health Analysis": return BarChart3;
    case "Risk Analysis": return AlertTriangle;
    case "Yield Forecast": return TrendingUp;
    case "Environmental": return CheckCircle;
    default: return FileText;
  }
};

const Reports = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download detailed field reports</p>
        </div>
        <Button className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Report Filters */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select defaultValue="all-fields">
              <SelectTrigger>
                <SelectValue placeholder="Select Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-fields">All Fields</SelectItem>
                <SelectItem value="north-farm">North Farm - Plot A</SelectItem>
                <SelectItem value="south-field">South Field</SelectItem>
                <SelectItem value="east-field">East Field</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-types">
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="health">Health Analysis</SelectItem>
                <SelectItem value="risk">Risk Analysis</SelectItem>
                <SelectItem value="yield">Yield Forecast</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="last-30-days">
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {reportsData.map((report) => {
          const TypeIcon = getTypeIcon(report.type);
          
          return (
            <Card key={report.id} className="card-gradient">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                          <span><strong>Field:</strong> {report.field}</span>
                          <span><strong>Type:</strong> {report.type}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                          <span><strong>Period:</strong> {report.period}</span>
                          <span><strong>Generated:</strong> {report.generated}</span>
                          {report.size !== "--" && <span><strong>Size:</strong> {report.size}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full lg:w-auto">
                    {report.status === "Ready" && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                          <FileText className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button size="sm" className="flex-1 lg:flex-none">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </>
                    )}
                    {report.status === "Processing" && (
                      <Button variant="outline" size="sm" disabled className="w-full lg:w-auto">
                        Processing...
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">18</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">156.8</div>
            <div className="text-sm text-muted-foreground">MB Downloaded</div>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;