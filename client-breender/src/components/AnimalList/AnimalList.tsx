import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiResponse } from "../../types";
import { useUser } from "../../context/UserContext";

interface AnimalListProps {
    getUserAnimals: (userId: string) => Promise<ApiResponse>;
}

export const AnimalList: React.FC<AnimalListProps> = ({ getUserAnimals }) => {
    const [animals, setAnimals] = useState<{ id: string; name: string; species: string; photoUrl?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const { userId, isLoading } = useUser();
    const navigate = useNavigate();


    useEffect(() => {
        const loadAnimals = async () => {
            try {
                if (isLoading) return;

                if (!userId) {
                    navigate("/login");
                    return;
                }
                const userAnimals = await getUserAnimals(userId);
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

        loadAnimals();
    }, [getUserAnimals, userId, isLoading, navigate]);

    if (loading) return <div>Loading your animals...</div>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Your Animals</h1>
            <div className="text-center mb-4">
                <Link to="/animals/new" className="btn btn-success">Register New Animal</Link>
            </div>
            <div className="row">
                {animals.length > 0 ? (
                    animals.map((animal) => (
                        <div key={animal.id} className="col-md-4 mb-4">
                            <div className="card shadow-sm">
                                <img
                                    src={animal.photoUrl || "/animal-placeholder.png"}
                                    alt={animal.name}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
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
