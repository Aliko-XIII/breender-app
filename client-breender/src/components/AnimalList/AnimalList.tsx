import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAnimals } from "../../api/animalApi";
import { useUser } from "../../context/UserContext";
import './AnimalList.css';

export const AnimalList: React.FC = () => {
    const [animals, setAnimals] = useState<{ id: string; name: string; species: string; photoUrl?: string; pictureUrl?: string | null }[]>([]);
    const [loading, setLoading] = useState(true);
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
        isAvailable: "",
        tags: ""
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
    };

    // Load animals with filters
    const loadAnimals = async () => {
        try {
            if (isLoading) return;
            if (!userId) {
                navigate("/login");
                return;
            }            // Only send non-empty filters
            const activeFilters: Record<string, string | number | boolean | string[]> = { userId };
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== "") {
                    // Convert to number for location fields
                    if (["latitude", "longitude", "radius"].includes(key)) {
                        activeFilters[key] = Number(value);
                    } else if (key === "isSterilized" || key === "isAvailable") {
                        // Always send as string ("true" or "false")
                        activeFilters[key] = value;
                    } else if (key === "tags") {
                        // Split tags by comma and trim
                        activeFilters[key] = value.split(",").map(tag => tag.trim()).filter(tag => tag);
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
            isAvailable: "",
            tags: ""
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
            </div>
            {/* Filter Form */}
            <form className="mb-4" onSubmit={handleFilterSubmit}>
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
                    </div>                    <div className="col-md-2">
                        <input type="date" className="form-control animal-filter-input" name="birthdateTo" placeholder="Birthdate to" value={filters.birthdateTo} onChange={handleFilterChange} max="9999-12-31"
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control animal-filter-input" name="bio" placeholder="Bio (contains)" value={filters.bio} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                </div>
                <div className="row g-2 align-items-end mt-2">
                    <div className="col-md-2">
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
                    </div>
                    <div className="col-md-3">
                        <input type="text" className="form-control animal-filter-input" name="tags" placeholder="Tags (comma separated)" value={filters.tags} onChange={handleFilterChange}
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                        />
                    </div>                    <div className="col-md-3">
                        <small className="text-muted">Available tags: FRIENDLY, AGGRESSIVE, PLAYFUL, SHY, ENERGETIC, CALM, INTELLIGENT, TRAINED, VOCAL, QUIET, CURIOUS, INDEPENDENT, SOCIAL, PROTECTIVE, AFFECTIONATE, HUNTER, LAZY</small>
                    </div>
                    <div className="col-md-1">
                        <button type="submit" className="btn btn-primary w-100">Apply</button>
                    </div>
                    <div className="col-md-1">
                        <button type="button" className="btn btn-secondary w-100" onClick={handleClearFilters}>Clear</button>
                    </div>
                </div>
                <div className="row g-2 align-items-end mt-2">
                    <div className="col-md-2">
                        <button type="button" className="btn btn-secondary w-100" onClick={handleClearFilters}>Clear Filters</button>
                    </div>
                </div>
            </form>
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
