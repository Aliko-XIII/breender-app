// src/components/AnimalMap/AnimalMap.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { AnimalMapInfo } from '../../types'; // Adjust path
import { getAnimals } from '../../api/animalApi';

// --- Component Props (Optional for now) ---
interface AnimalMapProps {
    // Props for filtering or API fetching can be added later
}

// --- Map Styling ---
const containerStyle = {
  width: '100%',
  height: '400px', // Reduced height for a less intrusive map
  maxWidth: '800px', // Optional: limit max width
  margin: '0 auto', // Center the map horizontally
  borderRadius: '16px', // Optional: rounded corners
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)' // Optional: subtle shadow
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
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

    // --- Google Maps API Key ---
    // !! IMPORTANT !! Replace with your actual key, preferably from environment variables
    const googleMapsApiKey = 'AIzaSyBC_pASKr9NaZ__W6JQGTFM5_5q9lRqE4g';

    // --- Load Data from API ---
    useEffect(() => {
        setIsLoading(true);
        getAnimals()
            .then((response) => {
                if (response.status === 200 && Array.isArray(response.data)) {
                    // Only include animals with valid latitude and longitude
                    setAnimals(
                        response.data
                            .filter((animal: any) => typeof animal.latitude === 'number' && typeof animal.longitude === 'number')
                            .map((animal: any) => ({
                                id: animal.id,
                                name: animal.name,
                                species: animal.species,
                                latitude: animal.latitude,
                                longitude: animal.longitude,
                            }))
                    );
                    setError(null);
                } else {
                    setError('Failed to fetch animal data.');
                }
            })
            .catch((err) => {
                setError('Failed to load animal data.');
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // Fetch once on mount

    useEffect(() => {
        // Try to get user's geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    // If denied or failed, fallback to default
                    setMapCenter(initialCenter);
                }
            );
        } else {
            setMapCenter(initialCenter);
        }
    }, []);

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
        <div className="animal-map-container my-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             {/* Consider adding filtering controls here later */}
             <h2>Animal Locations</h2>

            {isLoading && <p>Loading map and animal data...</p>}
            {error && <div className="alert alert-warning">{error}</div>}

            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter || initialCenter}
                    zoom={13} // Adjust zoom level as needed
                >
                    {/* User's current location marker */}
                    {mapCenter && (
                        <Marker
                            position={mapCenter}
                            icon={{
                                url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="16,10 26,20 6,20" fill="orange" stroke="black" stroke-width="2"/><rect x="10" y="20" width="12" height="8" fill="orange" stroke="black" stroke-width="2"/><line x1="6" y1="20" x2="26" y2="20" stroke="black" stroke-width="2"/><rect x="14" y="23" width="4" height="4" fill="blue"/></svg>',
                                scaledSize: new window.google.maps.Size(40, 40),
                                anchor: new window.google.maps.Point(16, 28),
                            }}
                            title="Your Location"
                            zIndex={999}
                        />
                    )}
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