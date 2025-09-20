import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Trash2, AlertTriangle, TrendingUp } from "lucide-react";

interface Field {
    id: string;
    name: string;
    area: number;
    health: number;
    status: string;
    location: {
        lat: number;
        lng: number;
    };
    last_updated: string;
    alerts: number;
}

const FieldManager = () => {
    const [fields, setFields] = useState<Field[]>([]);
    const [selectedField, setSelectedField] = useState<Field | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch fields from backend
    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/fields');
                if (response.ok) {
                    const data = await response.json();
                    setFields(data);
                }
            } catch (error) {
                console.error('Error fetching fields:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFields();
    }, []);

    const getHealthColor = (health: number) => {
        if (health >= 85) return "text-green-600";
        if (health >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "healthy":
                return "bg-green-100 text-green-800";
            case "moderate":
                return "bg-yellow-100 text-yellow-800";
            case "stressed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Fields</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    My Fields ({fields.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {fields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No fields yet</p>
                        <p className="text-sm">Search for a location on the map and save it as a field to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {fields.map((field) => (
                            <div
                                key={field.id}
                                className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${selectedField?.id === field.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                                onClick={() => setSelectedField(field)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm">{field.name}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {field.area} hectares • Updated {new Date(field.last_updated).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(field.status)}>
                                        {field.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            <span className={getHealthColor(field.health)}>
                                                {field.health}% health
                                            </span>
                                        </div>
                                        {field.alerts > 0 && (
                                            <div className="flex items-center gap-1 text-red-600">
                                                <AlertTriangle className="h-3 w-3" />
                                                <span>{field.alerts} alerts</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 px-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // TODO: Implement view field details
                                            }}
                                        >
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 px-2 text-red-600 hover:text-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // TODO: Implement delete field
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FieldManager;
