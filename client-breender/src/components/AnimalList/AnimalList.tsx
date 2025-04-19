import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAnimals } from "../../api/animalApi";
import { useUser } from "../../context/UserContext";

export const AnimalList: React.FC = () => {
    const [animals, setAnimals] = useState<{ id: string; name: string; species: string; photoUrl?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const { userId, isLoading } = useUser();
    const navigate = useNavigate();

    // Filter state
    const [filters, setFilters] = useState({
        name: "",
        species: "",
        breed: "",
        sex: "",
        birthdateFrom: "",
        birthdateTo: "",
        latitude: "",
        longitude: "",
        radius: ""
    });

    // Handle filter input changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Load animals with filters
    const loadAnimals = async () => {
        try {
            if (isLoading) return;
            if (!userId) {
                navigate("/login");
                return;
            }
            // Only send non-empty filters
            const activeFilters: any = { userId };
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== "") {
                    // Convert to number for location fields
                    if (["latitude", "longitude", "radius"].includes(key)) {
                        activeFilters[key] = Number(value);
                    } else {
                        activeFilters[key] = value;
                    }
                }
            });
            const userAnimals = await getAnimals(activeFilters);
            setAnimals(userAnimals.data.map((animal: any) => ({
                id: animal.id,
                name: animal.name,
                species: animal.species,
                photoUrl: animal.photoUrl,
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
                                        src={animal.photoUrl || "/animal-placeholder.png"}
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
