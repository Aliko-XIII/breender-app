// src/components/AnimalMap/AnimalMap.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { AnimalMapInfo } from '../../types'; // Adjust path
import { getAnimals, getAnimalsForMap } from '../../api/animalApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './AnimalMap.css';

// Available tags constant (same as in AnimalProfile)
const AVAILABLE_TAGS = [
  'FRIENDLY', 'AGGRESSIVE', 'PLAYFUL', 'SHY', 'ENERGETIC', 'CALM',
  'INTELLIGENT', 'TRAINED', 'VOCAL', 'QUIET', 'CURIOUS', 'INDEPENDENT',
  'SOCIAL', 'PROTECTIVE', 'AFFECTIONATE', 'HUNTER', 'LAZY'
] as const;

// Available owner tags constant
const AVAILABLE_OWNER_TAGS = [
  'RESPONSIBLE', 'EXPERIENCED', 'FRIENDLY', 'COMMUNICATIVE', 'CARING', 'ORGANIZED',
  'TRUSTWORTHY', 'PATIENT', 'KNOWLEDGEABLE', 'ACTIVE', 'SUPPORTIVE', 'FLEXIBLE',
  'DEDICATED', 'PUNCTUAL', 'EDUCATED', 'SOCIAL', 'CALM', 'ENTHUSIASTIC', 'ADAPTIVE', 'HELPFUL'
] as const;

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

// Add dark map style array
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#23272f' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#23272f' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#e0e0e0' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#444b58' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#23272f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#383c45' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#23272f' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2c313a' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#23272f' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#1a1e23' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d4852' }],
  },
];

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
    const dLng = toRad(lat2 - lng1);
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
    const [animalMarkerIcon, setAnimalMarkerIcon] = useState<any>(null);    const [myAnimals, setMyAnimals] = useState<{ id: string; name: string; species?: string }[]>([]);
    const [selectedMyAnimalId, setSelectedMyAnimalId] = useState<string>('');
    const { userId } = useUser();
    const [previewAnimalId, setPreviewAnimalId] = useState<string | null>(null);    const [showTagModal, setShowTagModal] = useState(false);
    const [showOwnerTagModal, setShowOwnerTagModal] = useState(false);    const [filters, setFilters] = useState({
        name: '',
        species: '',
        breed: '',
        sex: '',
        birthdateFrom: '',
        birthdateTo: '',
        radius: '10',
        bio: '',
        isSterilized: '',
        tags: [] as string[],
        ownerTags: [] as string[]
    });

    const navigate = useNavigate();    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            name: '',
            species: '',
            breed: '',
            sex: '',
            birthdateFrom: '',
            birthdateTo: '',
            radius: '10',
            bio: '',
            isSterilized: '',
            tags: [],
            ownerTags: []
        });
    };// Fetch animals for map (not owned by user)
    const loadAnimals = useCallback(() => {
        setIsLoading(true);
        const activeFilters: any = {};
        
        // Always filter for available animals
        activeFilters.isAvailable = "true";
          Object.entries(filters).forEach(([key, value]) => {
            if (key === "tags" || key === "ownerTags") {
                // Handle tags and ownerTags arrays
                if (Array.isArray(value) && value.length > 0) {
                    activeFilters[key] = value;
                }
            } else if (value !== '') {
                if (key === 'radius') {
                    const num = Number(value);
                    if (!isNaN(num) && value !== '' && mapCenter) {
                        activeFilters.radius = num;
                        activeFilters.latitude = mapCenter.lat;
                        activeFilters.longitude = mapCenter.lng;
                    }
                } else if (key === "isSterilized") {
                    // Always send as string ("true" or "false")
                    activeFilters[key] = value;
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
        <div className="animal-map-container my-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-bg-primary)', color: 'var(--color-text)', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.18)', padding: 24 }}>
            <div className="mb-3" style={{ width: '100%', maxWidth: 800 }}>
                <label htmlFor="my-animal-select" className="form-label fw-bold" style={{ color: 'var(--color-text)' }}>Choose your animal to find a partner for:</label>
                <select
                    id="my-animal-select"
                    className="form-select bg-dark text-light border-secondary"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                    value={selectedMyAnimalId}
                    onChange={e => setSelectedMyAnimalId(e.target.value)}
                >
                    <option value="">-- Select your animal --</option>
                    {myAnimals.map(animal => (
                        <option key={animal.id} value={animal.id} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}>
                            {animal.name}{animal.species ? ` (${animal.species})` : ''}
                        </option>
                    ))}
                </select>
            </div>
            {!selectedMyAnimalId && (
                <div className="alert alert-warning mb-3" style={{ width: '100%', maxWidth: 800, background: 'var(--color-bg-secondary)', color: 'var(--color-warning)', border: '1px solid var(--color-border)' }}>
                    Please select your animal before proceeding.
                </div>
            )}            <form className="mb-4" style={{ width: '100%', maxWidth: 800, background: 'var(--color-bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--color-border)' }} onSubmit={e => { e.preventDefault(); loadAnimals(); }}>
                {/* First Row - Basic filters */}
                <div className="row g-2 align-items-end">
                    <div className="col-md-2">
                        <input type="text" className="form-control bg-dark text-light border-secondary" name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control bg-dark text-light border-secondary" name="species" placeholder="Species" value={filters.species} onChange={handleFilterChange} style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control bg-dark text-light border-secondary" name="breed" placeholder="Breed" value={filters.breed} onChange={handleFilterChange} style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div className="col-md-2">
                        <select className="form-select bg-dark text-light border-secondary" name="sex" value={filters.sex} onChange={handleFilterChange} style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                            <option value="">Sex</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="date" className="form-control bg-dark text-light border-secondary" name="birthdateFrom" placeholder="Birthdate from" value={filters.birthdateFrom} onChange={handleFilterChange} max="9999-12-31" style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div className="col-md-2">
                        <input type="date" className="form-control bg-dark text-light border-secondary" name="birthdateTo" placeholder="Birthdate to" value={filters.birthdateTo} onChange={handleFilterChange} max="9999-12-31" style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
                    </div>
                </div>
                  {/* Second Row - Additional filters */}
                <div className="row g-2 align-items-end mt-2">
                    <div className="col-md-2">
                        <input type="text" className="form-control bg-dark text-light border-secondary" name="bio" placeholder="Bio (contains)" value={filters.bio} onChange={handleFilterChange} style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div className="col-md-2">
                        <select className="form-select bg-dark text-light border-secondary" name="isSterilized" value={filters.isSterilized} onChange={handleFilterChange} style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                            <option value="">Sterilized</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control bg-dark text-light border-secondary" name="radius" placeholder="Radius (km)" value={filters.radius} onChange={handleFilterChange} min="0" step="any" style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div className="col-md-3">
                        <button
                            type="button"
                            className="btn btn-outline-primary w-100"
                            onClick={() => setShowTagModal(true)}
                            style={{
                                background: 'var(--color-bg-secondary)',
                                color: 'var(--color-text)',
                                border: '1px solid var(--color-border)',
                                position: 'relative'
                            }}
                        >
                            🏷️ Tags {filters.tags.length > 0 && (
                                <span className="badge bg-primary ms-2">{filters.tags.length}</span>
                            )}
                        </button>
                    </div>
                    <div className="col-md-3">
                        <button
                            type="button"
                            className="btn btn-info w-100"
                            onClick={() => setShowOwnerTagModal(true)}
                            style={{
                                background: 'var(--color-bg-secondary)',
                                color: 'var(--color-text)',
                                border: '1px solid var(--color-border)',
                                position: 'relative'
                            }}
                        >
                            👥 Owner Tags {filters.ownerTags.length > 0 && (
                                <span className="badge bg-info ms-2">{filters.ownerTags.length}</span>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Third Row - Action buttons */}
                <div className="row g-2 align-items-end mt-2">
                    <div className="col-md-8"></div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">Apply</button>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-secondary w-100" onClick={handleClearFilters}>Clear</button>
                    </div>
                </div>
                  {/* Tag filter preview - show selected tags */}
                {filters.tags.length > 0 && (
                    <div className="row mt-2">
                        <div className="col-12">
                            <div className="p-2 rounded" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                                <small className="text-muted">Selected tags: </small>
                                <span style={{ color: 'var(--color-text)', fontWeight: '500', fontSize: '0.9rem' }}>
                                    {filters.tags.map(tag => tag.charAt(0) + tag.slice(1).toLowerCase()).join(', ')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Owner tag filter preview - show selected owner tags */}
                {filters.ownerTags.length > 0 && (
                    <div className="row mt-2">
                        <div className="col-12">
                            <div className="p-2 rounded" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                                <small className="text-muted">Selected owner tags: </small>
                                <span style={{ color: 'var(--color-text)', fontWeight: '500', fontSize: '0.9rem' }}>
                                    {filters.ownerTags.map(tag => tag.charAt(0) + tag.slice(1).toLowerCase()).join(', ')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}</form>            {/* Tag Selection Modal */}
            {showTagModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text)', border: '2px solid var(--color-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                            <div className="modal-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <h5 className="modal-title">🏷️ Select Animal Tags</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowTagModal(false)}
                                    style={{ filter: 'invert(1)' }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-3 text-muted small">Select tags to filter animals by their characteristics:</p>
                                <div className="row g-2">
                                    {AVAILABLE_TAGS.map((tag) => {
                                        const isSelected = filters.tags.includes(tag);
                                        return (
                                            <div key={tag} className="col-6 col-sm-4 col-md-3">
                                                <button
                                                    type="button"
                                                    className={`btn w-100 btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                    onClick={() => {
                                                        const newTags = isSelected
                                                            ? filters.tags.filter(t => t !== tag)
                                                            : [...filters.tags, tag];
                                                        setFilters({ ...filters, tags: newTags });
                                                    }}
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        padding: '0.375rem 0.5rem',
                                                        transition: 'all 0.2s ease',
                                                        background: isSelected ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                                                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                                                        color: isSelected ? 'white' : 'var(--color-text)'
                                                    }}
                                                >
                                                    {isSelected && '✓ '}
                                                    {tag.charAt(0) + tag.slice(1).toLowerCase()}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                {filters.tags.length > 0 && (
                                    <div className="mt-3 p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                                        <strong className="text-muted">Selected ({filters.tags.length}): </strong>
                                        <span style={{ color: 'var(--color-text)', fontWeight: '500' }}>
                                            {filters.tags.map(tag => tag.charAt(0) + tag.slice(1).toLowerCase()).join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setFilters({ ...filters, tags: [] });
                                    }}
                                >
                                    Clear All
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowTagModal(false)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Owner Tag Selection Modal */}
            {showOwnerTagModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text)', border: '2px solid var(--color-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                            <div className="modal-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <h5 className="modal-title">👥 Select Owner Tags</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowOwnerTagModal(false)}
                                    style={{ filter: 'invert(1)' }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-3 text-muted small">Select tags to filter animal owners by their characteristics:</p>
                                <div className="row g-2">
                                    {AVAILABLE_OWNER_TAGS.map((tag) => {
                                        const isSelected = filters.ownerTags.includes(tag);
                                        return (
                                            <div key={tag} className="col-6 col-sm-4 col-md-3">
                                                <button
                                                    type="button"
                                                    className={`btn w-100 btn-sm ${isSelected ? 'btn-info' : 'btn-outline-secondary'}`}
                                                    onClick={() => {
                                                        const newOwnerTags = isSelected
                                                            ? filters.ownerTags.filter(t => t !== tag)
                                                            : [...filters.ownerTags, tag];
                                                        setFilters({ ...filters, ownerTags: newOwnerTags });
                                                    }}
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        padding: '0.375rem 0.5rem',
                                                        transition: 'all 0.2s ease',
                                                        background: isSelected ? 'var(--color-info)' : 'var(--color-bg-secondary)',
                                                        borderColor: isSelected ? 'var(--color-info)' : 'var(--color-border)',
                                                        color: isSelected ? 'white' : 'var(--color-text)'
                                                    }}
                                                >
                                                    {isSelected && '✓ '}
                                                    {tag.charAt(0) + tag.slice(1).toLowerCase()}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                {filters.ownerTags.length > 0 && (
                                    <div className="mt-3 p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                                        <strong className="text-muted">Selected ({filters.ownerTags.length}): </strong>
                                        <span style={{ color: 'var(--color-text)', fontWeight: '500' }}>
                                            {filters.ownerTags.map(tag => tag.charAt(0) + tag.slice(1).toLowerCase()).join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setFilters({ ...filters, ownerTags: [] });
                                    }}
                                >
                                    Clear All
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-info"
                                    onClick={() => setShowOwnerTagModal(false)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-start w-100" style={{ maxWidth: 800, color: 'var(--color-text)' }}>Animal Locations</h2>

            {isLoading && <p style={{ color: 'var(--color-text)' }}>Loading map and animal data...</p>}
            {error && <div className="alert alert-warning" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-warning)', border: '1px solid var(--color-border)' }}>{error}</div>}

            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter || initialCenter}
                    zoom={13}
                    options={{
                        streetViewControl: false,
                        styles: darkMapStyle,
                        backgroundColor: '#23272f',
                        disableDefaultUI: false,
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
                            options={{
                                pixelOffset: new window.google.maps.Size(0, -30),
                            }}
                        >
                            <div style={{ minWidth: 180, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', borderRadius: 8, padding: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    <img
                                        src={resolveAnimalPictureUrl(selectedAnimal)}
                                        alt={selectedAnimal.name}
                                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', border: '1px solid #888' }}
                                        onError={e => { (e.target as HTMLImageElement).src = '/animal-placeholder.png'; }}
                                    />
                                    <div>
                                        <h5 style={{ margin: 0, color: 'var(--color-text)' }}>{selectedAnimal.name}</h5>
                                        {selectedAnimal.species && <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Species: {selectedAnimal.species}</div>}
                                    </div>
                                </div>
                                <p style={{ fontSize: 12, margin: 0, color: 'var(--color-text-secondary)' }}><small>Lat: {selectedAnimal.latitude.toFixed(4)}, Lng: {selectedAnimal.longitude.toFixed(4)}</small></p>
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
                            style={{ filter: 'brightness(0.9)' }}
                        />
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>Your Location</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 32, height: 32 }}>
                        <img
                            src={`data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M16 27C12 23 4 17.5 4 12.5C4 9 7 6 10.5 6C12.5 6 14.5 7.5 16 9.5C17.5 7.5 19.5 6 21.5 6C25 6 28 9 28 12.5C28 17.5 20 23 16 27Z' fill='%23e53935' stroke='%238b1c1c' stroke-width='2'/></svg>`}
                            alt="Partnerable animal"
                            width={32}
                            height={32}
                            style={{ filter: 'brightness(0.9)' }}
                        />
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>Partnerable Animal</span>
                </div>
            </div>
            <div style={{ width: '100%', maxWidth: 800, margin: '32px auto 0 auto' }}>
                <h3 className="mb-3" style={{ color: 'var(--color-text)' }}>Animals List</h3>
                <ul className="list-group" style={{ background: 'var(--color-bg-secondary)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                    {animals.length === 0 ? (
                        <li className="list-group-item text-center" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', border: 'none' }}>No animals found.</li>
                    ) : (
                        animals.map(animal => (
                            <li key={animal.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ cursor: selectedMyAnimalId ? 'pointer' : 'not-allowed', opacity: selectedMyAnimalId ? 1 : 0.5, background: 'var(--color-bg-primary)', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }} onClick={() => handleAnimalSelect(animal)}>
                                <span className="d-flex align-items-center" style={{ gap: 8 }}>
                                    <img
                                        src={resolveAnimalPictureUrl(animal)}
                                        alt={animal.name}
                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%', marginRight: 8, border: '1px solid #888' }}
                                        onError={e => { (e.target as HTMLImageElement).src = '/animal-placeholder.png'; }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong style={{ color: 'var(--color-text)' }}>{animal.name}</strong>
                                        {animal.species ? <span className="text-muted" style={{ color: 'var(--color-text-secondary)' }}>({animal.species})</span> : null}
                                        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                                            {animal.breed && <span>Breed: {animal.breed} </span>}
                                            {animal.sex && <span>Sex: {animal.sex} </span>}
                                            {animal.birthdate && <span>Age: {getAge(animal.birthdate)} </span>}
                                        </span>
                                    </div>
                                </span>
                                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
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