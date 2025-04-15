// src/components/AnimalMap/AnimalMap.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { AnimalMapInfo } from '../../types'; // Adjust path

// --- Component Props (Optional for now) ---
interface AnimalMapProps {
    // Props for filtering or API fetching can be added later
}

// --- Map Styling ---
const containerStyle = {
  width: '100%',
  height: '600px' // Adjust height as needed
};

// --- Initial Map Center (Izmail, Ukraine) ---
const initialCenter = {
  lat: 45.35,
  lng: 28.83
};

export const AnimalMap: React.FC<AnimalMapProps> = () => {
    const [animals, setAnimals] = useState<AnimalMapInfo[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalMapInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // For future API loading
    const [error, setError] = useState<string | null>(null); // For future API errors

    // --- Google Maps API Key ---
    // !! IMPORTANT !! Replace with your actual key, preferably from environment variables
    const googleMapsApiKey = 'AIzaSyBC_pASKr9NaZ__W6JQGTFM5_5q9lRqE4g';

    // --- Load Mock Data ---
    useEffect(() => {
        setIsLoading(true);
        // Simulate fetching data
        const timer = setTimeout(() => {
            try {
                setAnimals(mockMapAnimals);
                setError(null);
            } catch (err) {
                setError("Failed to load animal data.");
                console.error(err);
            } finally {
                 setIsLoading(false);
            }
        }, 300); // Short delay to mimic loading

        return () => clearTimeout(timer); // Cleanup timer
    }, []); // Empty dependency array means run once on mount

    // --- Marker Click Handler ---
    const handleMarkerClick = useCallback((animal: AnimalMapInfo) => {
        setSelectedAnimal(animal);
    }, []);

    // --- InfoWindow Close Handler ---
    const handleInfoWindowClose = useCallback(() => {
        setSelectedAnimal(null);
    }, []);

    // --- Check for API Key ---
    if (!googleMapsApiKey) {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> Google Maps API key is missing. Please configure it in your environment variables (e.g., REACT_APP_Maps_API_KEY).
            </div>
        );
    }

    // --- Render Logic ---
    return (
        <div className="animal-map-container my-4">
             {/* Consider adding filtering controls here later */}
             <h2>Animal Locations</h2>

            {isLoading && <p>Loading map and animal data...</p>}
            {error && <div className="alert alert-warning">{error}</div>}

            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={initialCenter}
                    zoom={13} // Adjust zoom level as needed
                >
                    {/* Render markers for each animal */}
                    {!isLoading && animals.map((animal) => (
                        <Marker
                            key={animal.id}
                            position={{ lat: animal.latitude, lng: animal.longitude }}
                            title={animal.name} // Tooltip on hover
                            onClick={() => handleMarkerClick(animal)}
                            // You can customize the marker icon here if needed
                        />
                    ))}

                    {/* Show InfoWindow when a marker is selected */}
                    {selectedAnimal && (
                        <InfoWindow
                            position={{ lat: selectedAnimal.latitude, lng: selectedAnimal.longitude }}
                            onCloseClick={handleInfoWindowClose}
                        >
                            <div>
                                <h5>{selectedAnimal.name}</h5>
                                {selectedAnimal.species && <p>Species: {selectedAnimal.species}</p>}
                                <p><small>Lat: {selectedAnimal.latitude.toFixed(4)}, Lng: {selectedAnimal.longitude.toFixed(4)}</small></p>
                                {/* Add more details or a link to the animal's page */}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};