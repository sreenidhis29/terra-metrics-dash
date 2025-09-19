import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Layers, Download, RefreshCw } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "@/contexts/LocationContext";

// Fix for Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface NDVIResult {
  id: number;
  bounding_box: {
    min_lat: number;
    min_lon: number;
    max_lat: number;
    max_lon: number;
  };
  ndvi_image: string;
  statistics: {
    mean: number;
    min: number;
    max: number;
    std: number;
    valid_pixels: number;
    total_pixels: number;
  };
  created_at: string;
}

interface GeocodeResult {
  address: string;
  latitude: number;
  longitude: number;
  bounding_box: string[];
  place_id: string;
}

// Component to handle map events and bounds tracking
const MapEventHandler = ({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) => {
  const map = useMap();

  useEffect(() => {
    const handleMoveEnd = () => {
      onBoundsChange(map.getBounds());
    };

    map.on('moveend', handleMoveEnd);
    // Set initial bounds
    onBoundsChange(map.getBounds());

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onBoundsChange]);

  return null;
};

// Component to handle map centering when location changes
const MapController = ({ center, zoom }: { center: [number, number] | null; zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const FieldMap = () => {
  // Location context
  const { selectedLocation, setSelectedLocation, isLocationLoading, setIsLocationLoading } = useLocation();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [ndviEnabled, setNdvIEnabled] = useState(false);
  const [ndviData, setNdvIData] = useState<NDVIResult | null>(null);
  const [isLoadingNDVI, setIsLoadingNDVI] = useState(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(13);

  // Geocode address
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setIsLocationLoading(true);
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Geocoding failed');

      const result: GeocodeResult = await response.json();

      // Update location context
      setSelectedLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.address,
        place_id: result.place_id,
        bounding_box: result.bounding_box
      });

      // Center map on found location
      setMapCenter([result.latitude, result.longitude]);
      setMapZoom(15);
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
      setIsLocationLoading(false);
    }
  }, [searchQuery, setSelectedLocation, setIsLocationLoading]);

  // Fetch NDVI data
  const fetchNDVIData = useCallback(async () => {
    if (!mapBounds) return;

    setIsLoadingNDVI(true);
    try {
      const southWest = mapBounds.getSouthWest();
      const northEast = mapBounds.getNorthEast();
      const response = await fetch(
        `/api/ndvi?min_lat=${southWest.lat}&min_lon=${southWest.lng}&max_lat=${northEast.lat}&max_lon=${northEast.lng}`
      );

      if (!response.ok) throw new Error('NDVI fetch failed');

      const result: NDVIResult = await response.json();
      setNdvIData(result);
    } catch (error) {
      console.error('NDVI fetch error:', error);
    } finally {
      setIsLoadingNDVI(false);
    }
  }, [mapBounds]);

  // Toggle NDVI overlay
  const toggleNDVI = useCallback((enabled: boolean) => {
    setNdvIEnabled(enabled);
    if (enabled && !ndviData) {
      fetchNDVIData();
    }
  }, [ndviData, fetchNDVIData]);

  // Handle keyboard search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="h-full min-h-[400px] overflow-hidden">
      <div className="relative h-full w-full">
        {/* Map container */}
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full"
          zoomControl={true}
        >
          {/* Event handlers */}
          <MapEventHandler onBoundsChange={setMapBounds} />
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Base layers */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />

          {/* Satellite layer (alternative) */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
            opacity={0}
            zIndex={1}
          />

          {/* Current location marker */}
          {selectedLocation && (
            <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
              <Popup>
                <b>{selectedLocation.address}</b>
              </Popup>
            </Marker>
          )}

          {/* NDVI overlay */}
          {ndviEnabled && ndviData && (
            <LayerGroup>
              <ImageOverlay
                url={`data:image/png;base64,${ndviData.ndvi_image}`}
                bounds={[
                  [ndviData.bounding_box.min_lat, ndviData.bounding_box.min_lon],
                  [ndviData.bounding_box.max_lat, ndviData.bounding_box.max_lon]
                ]}
                opacity={0.7}
                interactive={true}
              />
            </LayerGroup>
          )}
        </MapContainer>

        {/* Search overlay - Absolute position */}
        <div className="absolute top-4 left-4 z-20 w-80">
          <div className="bg-card/99 backdrop-blur-lg rounded-lg p-4 border border-border shadow-xl ring-1 ring-primary/30">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for an address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={isSearching}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                size="sm"
              >
                {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {selectedLocation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Selected Location</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {selectedLocation.address}
                </p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Lat: {selectedLocation.latitude.toFixed(4)}</span>
                  <span>Lng: {selectedLocation.longitude.toFixed(4)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map controls - Absolute position */}
        <div className="absolute top-4 right-4 z-20 space-y-2">
          {/* NDVI Controls */}
          <div className="bg-card/99 backdrop-blur-lg rounded-lg p-3 border border-border shadow-xl ring-1 ring-primary/30">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="ndvi-toggle" className="text-sm font-medium flex items-center gap-2">
                <Layers className="h-4 w-4" />
                NDVI Overlay
              </Label>
              <Switch
                id="ndvi-toggle"
                checked={ndviEnabled}
                onCheckedChange={toggleNDVI}
                disabled={isLoadingNDVI}
              />
            </div>

            <div className="space-y-2 text-xs">
              {ndviEnabled && ndviData ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mean NDVI:</span>
                    <Badge variant="secondary">
                      {ndviData.statistics.mean.toFixed(3)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Range:</span>
                    <span>{ndviData.statistics.min.toFixed(3)} - {ndviData.statistics.max.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Pixels:</span>
                    <span>{ndviData.statistics.valid_pixels.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  Toggle NDVI to see data
                </div>
              )}
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={fetchNDVIData}
                disabled={isLoadingNDVI}
              >
                {isLoadingNDVI ? (
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                Refresh NDVI
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-card/99 backdrop-blur-lg rounded-lg p-3 border border-border shadow-xl ring-1 ring-primary/30">
            <div className="text-xs font-medium mb-2 text-muted-foreground">NDVI Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs">Low (-1 to 0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs">Moderate (0 to 0.3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">High (0.3 to 1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading overlay - Absolute position */}
        {isLoadingNDVI && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
            <div className="bg-card rounded-lg p-4 flex items-center gap-2 shadow-xl">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading NDVI data...</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FieldMap;