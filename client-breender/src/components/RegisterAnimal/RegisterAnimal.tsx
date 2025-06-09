import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiResponse, SPECIES_OPTIONS, BREED_OPTIONS } from "../../types";

interface NewAnimalData {
    name: string;
    sex: "MALE" | "FEMALE";
    breed: string;
    species: string;
    bio?: string;
    birthDate: string;
}

interface RegisterAnimalProps {
    createAnimal: (animalData: NewAnimalData) => Promise<ApiResponse>;
}

export const RegisterAnimal: React.FC<RegisterAnimalProps> = ({ createAnimal }) => {
    const [formData, setFormData] = useState<NewAnimalData>({
        name: "",
        sex: "MALE",
        breed: "",
        species: "",
        bio: "",
        birthDate: ""
    });
    const [selectedSpecies, setSelectedSpecies] = useState<string>("");
    const [customSpecies, setCustomSpecies] = useState<string>("");
    const [selectedBreed, setSelectedBreed] = useState<string>("");
    const [customBreed, setCustomBreed] = useState<string>("");
    const [speciesSuggestions, setSpeciesSuggestions] = useState<string[]>([]);
    const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);
    const speciesInputRef = useRef<HTMLInputElement>(null);
    const breedInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSpeciesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, species: value });
        setSelectedSpecies("");
        setCustomSpecies("");
        if (value.length > 0) {
            setSpeciesSuggestions(
                SPECIES_OPTIONS.filter(opt => opt.toLowerCase().includes(value.toLowerCase()))
            );
        } else {
            setSpeciesSuggestions([]);
        }
    };

    const handleBreedInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, breed: value });
        setSelectedBreed("");
        setCustomBreed("");
        if (formData.species && BREED_OPTIONS[formData.species]) {
            setBreedSuggestions(
                BREED_OPTIONS[formData.species].filter(opt => opt.toLowerCase().includes(value.toLowerCase()))
            );
        } else {
            setBreedSuggestions([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convert birthDate to ISO string for backend compatibility
            const isoBirthDate = formData.birthDate ? new Date(formData.birthDate).toISOString() : "";
            await createAnimal({ ...formData, bio: formData.bio ?? "", birthDate: isoBirthDate });
            alert("Animal created successfully!");
            navigate("/animals");
        } catch (error) {
            console.error("Failed to create animal:", error);
            alert("Error creating animal.");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh", paddingTop: "40px", paddingBottom: "40px" }}
        >
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h1 className="text-center mb-4">Register New Animal</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                            className="form-control bg-dark text-light border-secondary"
                            style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                            required />
                    </div>

                    <div className="mb-3">
                        <label>Sex:</label>
                        <select name="sex" value={formData.sex} onChange={handleChange}
                            className="form-control bg-dark text-light border-secondary"
                            style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                        </select>
                    </div>

                    <div className="mb-3 position-relative">
                        <label>Species:</label>
                        <input
                            type="text"
                            name="species"
                            value={formData.species}
                            onChange={handleSpeciesInput}
                            autoComplete="off"
                            ref={speciesInputRef}
                            className="form-control bg-dark text-light border-secondary"
                            style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                            required
                            placeholder="Enter or select species"
                        />
                        {speciesSuggestions.length > 0 && (
                            <ul className="list-group position-absolute w-100" style={{ zIndex: 10, top: '100%' }}>
                                {speciesSuggestions.map(s => (
                                    <li
                                        key={s}
                                        className="list-group-item list-group-item-action bg-dark text-light border-secondary"
                                        style={{ cursor: 'pointer', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                                        onClick={() => {
                                            setFormData({ ...formData, species: s });
                                            setSpeciesSuggestions([]);
                                            speciesInputRef.current?.blur();
                                        }}
                                    >
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="mb-3 position-relative">
                        <label>Breed:</label>
                        <input
                            type="text"
                            name="breed"
                            value={formData.breed}
                            onChange={handleBreedInput}
                            autoComplete="off"
                            ref={breedInputRef}
                            className="form-control bg-dark text-light border-secondary"
                            style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                            required
                            placeholder="Enter or select breed"
                        />
                        {breedSuggestions.length > 0 && (
                            <ul className="list-group position-absolute w-100" style={{ zIndex: 10, top: '100%' }}>
                                {breedSuggestions.map(b => (
                                    <li
                                        key={b}
                                        className="list-group-item list-group-item-action bg-dark text-light border-secondary"
                                        style={{ cursor: 'pointer', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                                        onClick={() => {
                                            setFormData({ ...formData, breed: b });
                                            setBreedSuggestions([]);
                                            breedInputRef.current?.blur();
                                        }}
                                    >
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-3">
                        <label>Bio:</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange}
                            className="form-control bg-dark text-light border-secondary"
                            style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                            placeholder="Optional" />
                    </div>
                    <div className="mb-3">
                        <label>Birth Date:</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                            className="form-control bg-dark text-light border-secondary"
                            style={{ background: 'var(--color-bg-input)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                            required />
                    </div>

                    <button type="submit" className="btn btn-success w-100">Create Animal</button>
                </form>
            </div>
        </div>
    );
};
