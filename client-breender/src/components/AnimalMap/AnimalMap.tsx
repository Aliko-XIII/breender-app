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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

    // --- Filter State ---
    const [filters, setFilters] = useState({
        name: '',
        species: '',
        breed: '',
        sex: '',
        birthdateFrom: '',
        birthdateTo: '',
        latitude: '',
        longitude: '',
        radius: ''
    });

    // --- Handle filter input changes ---
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // --- Load Data from API (with filters) ---
    const loadAnimals = useCallback(() => {
        setIsLoading(true);
        // Only send non-empty filters
        const activeFilters: any = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '') {
                if (["latitude", "longitude", "radius"].includes(key)) {
                    activeFilters[key] = Number(value);
                } else {
                    activeFilters[key] = value;
                }
            }
        });
        getAnimals(activeFilters)
            .then((response) => {
                if (response.status === 200 && Array.isArray(response.data)) {
                    setAnimals(
                        response.data
                            .filter((animal: any) => typeof animal.latitude === 'number' && typeof animal.longitude === 'number')
                            .map((animal: any) => ({
                                id: animal.id,
                                name: animal.name,
                                species: animal.species,
                                latitude: animal.latitude,
                                longitude: animal.longitude,
                                canPartner: animal.canPartner,
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
    }, [filters]);

    useEffect(() => {
        loadAnimals();
    }, [loadAnimals]);

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

    // --- Google Maps API Key ---
    // !! IMPORTANT !! Replace with your actual key, preferably from environment variables
    const googleMapsApiKey = 'AIzaSyBC_pASKr9NaZ__W6JQGTFM5_5q9lRqE4g';

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
            {/* Filter Form */}
            <form className="mb-4" style={{ width: '100%', maxWidth: 800 }} onSubmit={e => { e.preventDefault(); loadAnimals(); }}>
                <div className="row g-2 align-items-end">
                    <div className="col-md-2">
                        <input type="text" className="form-control" name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control" name="species" placeholder="Species" value={filters.species} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control" name="breed" placeholder="Breed" value={filters.breed} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-2">
                        <select className="form-select" name="sex" value={filters.sex} onChange={handleFilterChange}>
                            <option value="">Sex</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="date" className="form-control" name="birthdateFrom" placeholder="Birthdate from" value={filters.birthdateFrom} onChange={handleFilterChange} max="9999-12-31" />
                    </div>
                    <div className="col-md-2">
                        <input type="date" className="form-control" name="birthdateTo" placeholder="Birthdate to" value={filters.birthdateTo} onChange={handleFilterChange} max="9999-12-31" />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control" name="latitude" placeholder="Latitude" value={filters.latitude} onChange={handleFilterChange} step="any" />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control" name="longitude" placeholder="Longitude" value={filters.longitude} onChange={handleFilterChange} step="any" />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control" name="radius" placeholder="Radius (km)" value={filters.radius} onChange={handleFilterChange} min="0" step="any" />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">Apply Filters</button>
                    </div>
                </div>
            </form>

            <h2>Animal Locations</h2>

            {isLoading && <p>Loading map and animal data...</p>}
            {error && <div className="alert alert-warning">{error}</div>}

            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter || initialCenter}
                    zoom={13} // Adjust zoom level as needed
                    options={{
                        streetViewControl: false, // Remove Pegman (Street View) button
                    }}
                >
                    {/* User's current location marker */}
                    {mapCenter && (
                        <Marker
                            position={mapCenter}
                            icon={{
                                url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="16,10 26,20 6,20" fill="orange" stroke="%23724c1e" stroke-width="2"/><rect x="10" y="20" width="12" height="8" fill="orange" stroke="%23724c1e" stroke-width="2"/><line x1="6" y1="20" x2="26" y2="20" stroke="%23724c1e" stroke-width="2"/><rect x="14" y="23" width="4" height="4" fill="blue"/></svg>',
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
                            title={animal.name}
                            onClick={() => handleMarkerClick(animal)}
                            icon={{
                                url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 27C12 23 4 17.5 4 12.5C4 9 7 6 10.5 6C12.5 6 14.5 7.5 16 9.5C17.5 7.5 19.5 6 21.5 6C25 6 28 9 28 12.5C28 17.5 20 23 16 27Z" fill="%23e53935" stroke="%238b1c1c" stroke-width="2"/></svg>',
                                scaledSize: new window.google.maps.Size(32, 32),
                                anchor: new window.google.maps.Point(16, 28),
                            }}
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
            {/* Legend */}
            <div style={{ display: 'flex', gap: '32px', marginTop: 16, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 32, height: 32 }}>
                        <img
                            src={`data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><polygon points='16,10 26,20 6,20' fill='orange' stroke='%23724c1e' stroke-width='2'/><rect x='10' y='20' width='12' height='8' fill='orange' stroke='%23724c1e' stroke-width='2'/><line x1='6' y1='20' x2='26' y2='20' stroke='%23724c1e' stroke-width='2'/><rect x='14' y='23' width='4' height='4' fill='blue'/></svg>`}
                            alt="Your location"
                            width={32}
                            height={32}
                        />
                    </span>
                    <span>Your Location</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 32, height: 32 }}>
                        <img
                            src={`data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M16 27C12 23 4 17.5 4 12.5C4 9 7 6 10.5 6C12.5 6 14.5 7.5 16 9.5C17.5 7.5 19.5 6 21.5 6C25 6 28 9 28 12.5C28 17.5 20 23 16 27Z' fill='%23e53935' stroke='%238b1c1c' stroke-width='2'/></svg>`}
                            alt="Partnerable animal"
                            width={32}
                            height={32}
                        />
                    </span>
                    <span>Partnerable Animal</span>
                </div>
            </div>
            {/* Animal List below the map */}
            <div style={{ width: '100%', maxWidth: 800, margin: '32px auto 0 auto' }}>
                <h3 className="mb-3">Animals List</h3>
                <ul className="list-group">
                    {animals.length === 0 ? (
                        <li className="list-group-item text-center">No animals found.</li>
                    ) : (
                        animals.map(animal => (
                            <li key={animal.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>
                                    <strong>{animal.name}</strong>
                                    {animal.species ? <span className="text-muted"> ({animal.species})</span> : null}
                                </span>
                                <span style={{ fontSize: 12, color: '#888' }}>
                                    Lat: {animal.latitude.toFixed(4)}, Lng: {animal.longitude.toFixed(4)}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};