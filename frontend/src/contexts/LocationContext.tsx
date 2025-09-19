import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocationData {
    latitude: number;
    longitude: number;
    address: string;
    place_id?: string;
    bounding_box?: string[];
}

interface LocationContextType {
    selectedLocation: LocationData | null;
    setSelectedLocation: (location: LocationData | null) => void;
    isLocationLoading: boolean;
    setIsLocationLoading: (loading: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

interface LocationProviderProps {
    children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    const [isLocationLoading, setIsLocationLoading] = useState(false);

    return (
        <LocationContext.Provider
            value={{
                selectedLocation,
                setSelectedLocation,
                isLocationLoading,
                setIsLocationLoading,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};
