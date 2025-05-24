import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAnimals } from "../../api/animalApi";
import { useUser } from "../../context/UserContext";
import './AnimalList.css';

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

export const AnimalList: React.FC = () => {
    const [animals, setAnimals] = useState<{ id: string; name: string; species: string; photoUrl?: string; pictureUrl?: string | null }[]>([]);    const [loading, setLoading] = useState(true);
    const [showTagModal, setShowTagModal] = useState(false);
    const [showOwnerTagModal, setShowOwnerTagModal] = useState(false);
    const { userId, isLoading } = useUser();
    const navigate = useNavigate();    // Filter state
    const [filters, setFilters] = useState({
        name: "",
        species: "",
        breed: "",
        sex: "",
        birthdateFrom: "",
        birthdateTo: "",
        latitude: "",
        longitude: "",
        radius: "",
        bio: "",
        isSterilized: "",
        isAvailable: "", // Add as customizable filter
        tags: [] as string[], // Changed to array
        ownerTags: [] as string[] // Added owner tags
    });

    // Handle filter input changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const getProfilePicUrl = (url?: string | null) => {
        if (!url) return '/animal-placeholder.png';
        if (url.startsWith('/uploads/')) {
            return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
        }
        return url;
    };    // Load animals with filters
    const loadAnimals = async () => {
        try {
            if (isLoading) return;
            if (!userId) {
                navigate("/login");
                return;
            }

            // Only send non-empty filters
            const activeFilters: Record<string, string | number | boolean | string[]> = { 
                userId // Only filter by userId for AnimalList (user's own animals)
            };
            Object.entries(filters).forEach(([key, value]) => {
                if (key === "tags" || key === "ownerTags") {
                    // Handle tags and ownerTags arrays
                    if (Array.isArray(value) && value.length > 0) {
                        activeFilters[key] = value;
                    }
                } else if (value !== "") {
                    // Convert to number for location fields
                    if (["latitude", "longitude", "radius"].includes(key)) {
                        activeFilters[key] = Number(value);
                    } else if (key === "isSterilized") {
                        // Always send as string ("true" or "false")
                        activeFilters[key] = value;
                    } else {
                        activeFilters[key] = value;
                    }
                }
            });
            const userAnimals = await getAnimals(activeFilters);
            setAnimals(userAnimals.data.map((animal: { id: string; name: string; species: string; pictureUrl?: string; profilePicUrl?: string }) => ({
                id: animal.id,
                name: animal.name,
                species: animal.species,
                pictureUrl: animal.pictureUrl || animal.profilePicUrl || null,
            })));
        } catch (error) {
            console.error("Failed to fetch animals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnimals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, isLoading]);

    // Filter form submit
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        loadAnimals();
    };    // Clear all filters
    const handleClearFilters = async () => {
        const clearedFilters = {
            name: "",
            species: "",
            breed: "",
            sex: "",
            birthdateFrom: "",
            birthdateTo: "",
            latitude: "",
            longitude: "",
            radius: "",
            bio: "",
            isSterilized: "",
            isAvailable: "", // Add availability filter
            tags: [] as string[], // Changed to array
            ownerTags: [] as string[] // Added owner tags
        };
        setFilters(clearedFilters);
        
        // Load animals with cleared filters
        try {
            setLoading(true);
            if (!userId) {
                navigate("/login");
                return;
            }
            const activeFilters: Record<string, string | number | boolean | string[]> = { userId };
            const userAnimals = await getAnimals(activeFilters);
            setAnimals(userAnimals.data.map((animal: { id: string; name: string; species: string; pictureUrl?: string; profilePicUrl?: string }) => ({
                id: animal.id,
                name: animal.name,
                species: animal.species,
                pictureUrl: animal.pictureUrl || animal.profilePicUrl || null,
            })));
        } catch (error) {
            console.error("Failed to fetch animals:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading your animals...</div>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Your Animals</h1>
            <div className="text-center mb-4">
                <Link to="/animals/new" className="btn btn-success">Register New Animal</Link>
            </div>            {/* Filter Form */}
            <form className="mb-4" onSubmit={handleFilterSubmit}>
                {/* First Row - Basic filters */}
                <div className="row g-2 align-items-end">
                    <div className="col-md-2">
                        <input type="text" className="form-control animal-filter-input" name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control animal-filter-input" name="species" placeholder="Species" value={filters.species} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control animal-filter-input" name="breed" placeholder="Breed" value={filters.breed} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div className="col-md-2">
                        <select className="form-select animal-filter-input" name="sex" value={filters.sex} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        >
                            <option value="" style={{ color: '#b0b3b8' }}>Sex</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="date" className="form-control animal-filter-input" name="birthdateFrom" placeholder="Birthdate from" value={filters.birthdateFrom} onChange={handleFilterChange} max="9999-12-31"
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div className="col-md-2">
                        <input type="date" className="form-control animal-filter-input" name="birthdateTo" placeholder="Birthdate to" value={filters.birthdateTo} onChange={handleFilterChange} max="9999-12-31"
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                </div>
                
                {/* Second Row - Additional filters and actions */}
                <div className="row g-2 align-items-end mt-2">
                    <div className="col-md-2">
                        <input type="text" className="form-control animal-filter-input" name="bio" placeholder="Bio (contains)" value={filters.bio} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>                    <div className="col-md-2">
                        <select className="form-select animal-filter-input" name="isSterilized" value={filters.isSterilized} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        >
                            <option value="" style={{ color: '#b0b3b8' }}>Sterilized</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select className="form-select animal-filter-input" name="isAvailable" value={filters.isAvailable} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        >
                            <option value="" style={{ color: '#b0b3b8' }}>Available</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn btn-outline-info w-100"
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
                    <div className="col-md-2">
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
                    <div className="col-md-1">
                        <button type="submit" className="btn btn-primary w-100">Apply</button>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-secondary w-100" onClick={handleClearFilters}>Clear</button>
                    </div>
                </div>
                
                {/* Tag filter preview - show selected tags */}                {filters.tags.length > 0 && (
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
                
                {/* Owner Tag filter preview - show selected owner tags */}
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
                )}
            </form>            {/* Tag Selection Modal */}
            {showTagModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgb(0, 0, 0, 0.9)' }}>
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
                                </button>                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Owner Tag Selection Modal */}
            {showOwnerTagModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgb(0, 0, 0, 0.9)' }}>
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
                                <p className="mb-3 text-muted small">Select tags to filter animals by their owners' characteristics:</p>
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
                                                        background: isSelected ? '#0dcaf0' : 'var(--color-bg-secondary)',
                                                        borderColor: isSelected ? '#0dcaf0' : 'var(--color-border)',
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
            <div className="row">
                {animals.length > 0 ? (
                    animals.map((animal) => (
                        <div key={animal.id} className="col-md-4 mb-4 d-flex justify-content-center">
                            <div
                                className="card shadow-sm"
                                style={{
                                    borderRadius: "1.5rem",
                                    maxWidth: "350px",
                                    margin: "0 auto",
                                    overflow: "hidden",
                                    paddingLeft: "20px",
                                    paddingRight: "20px"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        paddingTop: "16px",
                                        paddingBottom: "16px"
                                    }}
                                >
                                    <img
                                        src={getProfilePicUrl(animal.pictureUrl)}
                                        alt={animal.name}
                                        className="card-img-top"
                                        style={{
                                            height: "160px",
                                            width: "160px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                            backgroundColor: "transparent",
                                            borderRadius: "50%",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                                        }}
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <h5 className="card-title">{animal.name}</h5>
                                    <p className="card-text text-muted">{animal.species}</p>
                                    <Link to={`/animals/${animal.id}`} className="btn btn-primary btn-sm">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>You don't have any animals yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
