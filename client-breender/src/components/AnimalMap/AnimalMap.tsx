// src/components/AnimalMap/AnimalMap.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { AnimalMapInfo } from '../../types'; // Adjust path
import { getAnimals, getAnimalsForMap } from '../../api/animalApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface AnimalMapProps {
    // Props for filtering or API fetching can be added later
}

// Extend AnimalMapInfo for UI display
interface AnimalMapListInfo extends AnimalMapInfo {
    breed?: string;
    sex?: string;
    birthdate?: string;
}

const containerStyle = {
  width: '100%',
  height: '400px',
  maxWidth: '800px',
  margin: '0 auto',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
};

const initialCenter = {
  lat: 45.35,
  lng: 28.83
};

// Helper to resolve animal profile picture URL
const resolveAnimalPictureUrl = (animal: AnimalMapListInfo & { pictureUrl?: string; profilePicUrl?: string; photo?: string }) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    // Try all possible fields for backward compatibility
    const url = animal.pictureUrl || animal.profilePicUrl || animal.photo;
    if (url) {
        if (url.startsWith('http')) return url;
        if (url.startsWith('/uploads/')) return apiBase + url;
        return url;
    }
    return '/animal-placeholder.png';
};

// Helper to calculate age from birthdate
function getAge(birthdate: string) {
    const birth = new Date(birthdate);
    if (isNaN(birth.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age + ' yrs';
}

// Helper to calculate distance in meters between two lat/lng points
function getDistanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

export const AnimalMap: React.FC<AnimalMapProps> = () => {
    const [animals, setAnimals] = useState<AnimalMapListInfo[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalMapListInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [userMarkerIcon, setUserMarkerIcon] = useState<any>(null);
    const [animalMarkerIcon, setAnimalMarkerIcon] = useState<any>(null);

    const [myAnimals, setMyAnimals] = useState<{ id: string; name: string; species?: string }[]>([]);
    const [selectedMyAnimalId, setSelectedMyAnimalId] = useState<string>('');
    const { userId } = useUser();
    const [previewAnimalId, setPreviewAnimalId] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        name: '',
        species: '',
        breed: '',
        sex: '',
        birthdateFrom: '',
        birthdateTo: '',
        radius: '10'
    });

    const navigate = useNavigate();

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Fetch animals for map (not owned by user)
    const loadAnimals = useCallback(() => {
        setIsLoading(true);
        const activeFilters: any = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '') {
                if (key === 'radius') {
                    const num = Number(value);
                    if (!isNaN(num) && value !== '' && mapCenter) {
                        activeFilters.radius = num;
                        activeFilters.latitude = mapCenter.lat;
                        activeFilters.longitude = mapCenter.lng;
                    }
                } else {
                    activeFilters[key] = value;
                }
            }
        });
        getAnimalsForMap(activeFilters)
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
                                breed: animal.breed,
                                sex: animal.sex,
                                birthdate: animal.birthdate,
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
    }, [filters, mapCenter]);

    useEffect(() => {
        loadAnimals();
    }, [loadAnimals]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    setMapCenter(initialCenter);
                }
            );
        } else {
            setMapCenter(initialCenter);
        }
    }, []);

    // Fetch user's own animals for dropdown
    useEffect(() => {
        if (!userId) return;
        getAnimals({ userId })
            .then((response) => {
                if (response.status === 200 && Array.isArray(response.data)) {
                    setMyAnimals(
                        response.data.map((animal: any) => ({
                            id: animal.id,
                            name: animal.name,
                            species: animal.species,
                        }))
                    );
                }
            })
            .catch(() => {
                setMyAnimals([]);
            });
    }, [userId]);

    const handleMarkerClick = useCallback((animal: AnimalMapListInfo) => {
        if (!selectedMyAnimalId) {
            alert('Please select your animal before previewing or partnering with another animal.');
            return;
        }
        setSelectedAnimal(animal);
    }, [selectedMyAnimalId]);

    const handleInfoWindowClose = useCallback(() => {
        setSelectedAnimal(null);
    }, []);

    const handleAnimalSelect = (animal: AnimalMapListInfo) => {
        if (!selectedMyAnimalId) {
            alert('Please select your animal before previewing or partnering with another animal.');
            return;
        }
        setPreviewAnimalId(animal.id);
        navigate(`/animals/${animal.id}/preview?myAnimalId=${selectedMyAnimalId}`);
    };

    const googleMapsApiKey = 'AIzaSyBC_pASKr9NaZ__W6JQGTFM5_5q9lRqE4g';

    const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
        if (window.google && window.google.maps) {
            setUserMarkerIcon({
                url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="16,10 26,20 6,20" fill="orange" stroke="%23724c1e" stroke-width="2"/><rect x="10" y="20" width="12" height="8" fill="orange" stroke="%23724c1e" stroke-width="2"/><line x1="6" y1="20" x2="26" y2="20" stroke="%23724c1e" stroke-width="2"/><rect x="14" y="23" width="4" height="4" fill="blue"/></svg>',
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(16, 28),
            });
            setAnimalMarkerIcon({
                url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 27C12 23 4 17.5 4 12.5C4 9 7 6 10.5 6C12.5 6 14.5 7.5 16 9.5C17.5 7.5 19.5 6 21.5 6C25 6 28 9 28 12.5C28 17.5 20 23 16 27Z" fill="%23e53935" stroke="%238b1c1c" stroke-width="2"/></svg>',
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 28),
            });
        }
    }, []);

    if (!googleMapsApiKey) {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> Google Maps API key is missing. Please configure it in your environment variables (e.g., REACT_APP_Maps_API_KEY).
            </div>
        );
    }

    return (
        <div className="animal-map-container my-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="mb-3" style={{ width: '100%', maxWidth: 800 }}>
                <label htmlFor="my-animal-select" className="form-label fw-bold">Choose your animal to find a partner for:</label>
                <select
                    id="my-animal-select"
                    className="form-select"
                    value={selectedMyAnimalId}
                    onChange={e => setSelectedMyAnimalId(e.target.value)}
                >
                    <option value="">-- Select your animal --</option>
                    {myAnimals.map(animal => (
                        <option key={animal.id} value={animal.id}>
                            {animal.name}{animal.species ? ` (${animal.species})` : ''}
                        </option>
                    ))}
                </select>
            </div>
            {!selectedMyAnimalId && (
                <div className="alert alert-warning mb-3" style={{ width: '100%', maxWidth: 800 }}>
                    Please select your animal before proceeding.
                </div>
            )}

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
                        <input type="number" className="form-control" name="radius" placeholder="Radius (km)" value={filters.radius} onChange={handleFilterChange} min="0" step="any" />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">Apply Filters</button>
                    </div>
                </div>
            </form>

            <h2 className="text-start w-100" style={{ maxWidth: 800 }}>Animal Locations</h2>

            {isLoading && <p>Loading map and animal data...</p>}
            {error && <div className="alert alert-warning">{error}</div>}

            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter || initialCenter}
                    zoom={13}
                    options={{
                        streetViewControl: false,
                    }}
                    onLoad={handleMapLoad}
                >
                    {mapCenter && userMarkerIcon && (
                        <Marker
                            position={mapCenter}
                            icon={userMarkerIcon}
                            title="Your Location"
                            zIndex={999}
                        />
                    )}
                    {!isLoading && animalMarkerIcon && animals.map((animal) => (
                        <Marker
                            key={animal.id}
                            position={{ lat: animal.latitude, lng: animal.longitude }}
                            title={animal.name}
                            onClick={() => handleMarkerClick(animal)}
                            icon={animalMarkerIcon}
                            clickable={true}
                        />
                    ))}

                    {selectedAnimal && (
                        <InfoWindow
                            position={{ lat: selectedAnimal.latitude, lng: selectedAnimal.longitude }}
                            onCloseClick={handleInfoWindowClose}
                        >
                            <div style={{ minWidth: 180 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    <img
                                        src={resolveAnimalPictureUrl(selectedAnimal)}
                                        alt={selectedAnimal.name}
                                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', border: '1px solid #eee' }}
                                        onError={e => { (e.target as HTMLImageElement).src = '/animal-placeholder.png'; }}
                                    />
                                    <div>
                                        <h5 style={{ margin: 0 }}>{selectedAnimal.name}</h5>
                                        {selectedAnimal.species && <div style={{ fontSize: 13, color: '#666' }}>Species: {selectedAnimal.species}</div>}
                                    </div>
                                </div>
                                <p style={{ fontSize: 12, margin: 0 }}><small>Lat: {selectedAnimal.latitude.toFixed(4)}, Lng: {selectedAnimal.longitude.toFixed(4)}</small></p>
                                <button className="btn btn-primary btn-sm mt-2" onClick={() => handleAnimalSelect(selectedAnimal)} disabled={!selectedMyAnimalId}>
                                    Preview & Partner
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
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
            <div style={{ width: '100%', maxWidth: 800, margin: '32px auto 0 auto' }}>
                <h3 className="mb-3">Animals List</h3>
                <ul className="list-group">
                    {animals.length === 0 ? (
                        <li className="list-group-item text-center">No animals found.</li>
                    ) : (
                        animals.map(animal => (
                            <li key={animal.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ cursor: selectedMyAnimalId ? 'pointer' : 'not-allowed', opacity: selectedMyAnimalId ? 1 : 0.5 }} onClick={() => handleAnimalSelect(animal)}>
                                <span className="d-flex align-items-center" style={{ gap: 8 }}>
                                    <img
                                        src={resolveAnimalPictureUrl(animal)}
                                        alt={animal.name}
                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%', marginRight: 8, border: '1px solid #eee' }}
                                        onError={e => { (e.target as HTMLImageElement).src = '/animal-placeholder.png'; }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong>{animal.name}</strong>
                                        {animal.species ? <span className="text-muted">({animal.species})</span> : null}
                                        <span style={{ fontSize: 12, color: '#888' }}>
                                            {animal.breed && <span>Breed: {animal.breed} </span>}
                                            {animal.sex && <span>Sex: {animal.sex} </span>}
                                            {animal.birthdate && <span>Age: {getAge(animal.birthdate)} </span>}
                                        </span>
                                    </div>
                                </span>
                                <span style={{ fontSize: 12, color: '#888' }}>
                                    Lat: {animal.latitude.toFixed(4)}, Lng: {animal.longitude.toFixed(4)}
                                    {mapCenter && (
                                        <>
                                            {' | '}<b>{getDistanceInMeters(mapCenter.lat, mapCenter.lng, animal.latitude, animal.longitude)} m</b>
                                        </>
                                    )}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};