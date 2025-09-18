import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

// Sample data for the trend chart
const trendData = [
  { time: '00:00', soilMoisture: 65, temperature: 22, humidity: 68 },
  { time: '04:00', soilMoisture: 63, temperature: 20, humidity: 72 },
  { time: '08:00', soilMoisture: 68, temperature: 24, humidity: 65 },
  { time: '12:00', soilMoisture: 70, temperature: 28, humidity: 58 },
  { time: '16:00', soilMoisture: 66, temperature: 26, humidity: 62 },
  { time: '20:00', soilMoisture: 64, temperature: 23, humidity: 69 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{`Time: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'temperature' ? '°C' : entry.dataKey === 'soilMoisture' || entry.dataKey === 'humidity' ? '%' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TrendsChart = () => {
  return (
    <Card className="col-span-full card-gradient">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Temporal Trends</CardTitle>
          <Select defaultValue="soilMoisture">
            <SelectTrigger className="w-48 bg-secondary">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soilMoisture">Soil Moisture</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="humidity">Humidity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="soilMoisture" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary rounded"></div>
            <span className="text-muted-foreground">Soil Moisture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-warning rounded" style={{ background: 'repeating-linear-gradient(to right, hsl(var(--warning)) 0, hsl(var(--warning)) 5px, transparent 5px, transparent 10px)' }}></div>
            <span className="text-muted-foreground">Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-chart-2 rounded" style={{ background: 'repeating-linear-gradient(to right, hsl(var(--chart-2)) 0, hsl(var(--chart-2)) 3px, transparent 3px, transparent 6px)' }}></div>
            <span className="text-muted-foreground">Humidity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsChart;