import React, { useEffect, useState } from 'react';

interface AnimalProfileProps {
  animalId: string;
}

interface AnimalProfileData {
  name: string;
  sex: 'Male' | 'Female';
  breed: string;
  species: string;
  bio?: string;
  birthDate: string;
  latitude?: number;
  longitude?: number;
  owners: string[];
  vetAssignments: string[];
  animalDocuments: string[];
  animalPhotos: string[];
}

export const AnimalProfile: React.FC<AnimalProfileProps> = ({ animalId }) => {
  const [animalData, setAnimalData] = useState<AnimalProfileData | null>(null);

  useEffect(() => {
    // Fetch animal profile data from your API (replace with actual API call)
    const fetchAnimalProfile = async () => {
      try {
        // const response = await fetch(`/api/animals/${animalId}`);
        // const data: AnimalProfileData = await response.json();
        const data: AnimalProfileData = {
          name: "Fluffy",
          sex: "Male",
          breed: "Golden Retriever",
          species: "Dog",
          bio: "A friendly and energetic dog.",
          birthDate: "2018-05-20",
          latitude: 37.7749,
          longitude: -122.4194,
          owners: ["John Doe", "Jane Smith"],
          vetAssignments: ["Dr. Emily Johnson", "Dr. Michael Brown"],
          animalDocuments: ["Vaccination Record", "Adoption Certificate"],
          animalPhotos: []
        }
        setAnimalData(data);
      } catch (error) {
        console.error("Error fetching animal profile:", error);
      }
    };

    fetchAnimalProfile();
  }, [animalId]);

  if (!animalData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h1 className="text-center mb-4">{animalData.name}'s Profile</h1>

        <div className="text-center mb-3">
          {animalData.animalPhotos.length > 0 ? (
            <img
              src={animalData.animalPhotos[0]} // First photo as profile image
              alt="Animal"
              className="rounded"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          ) : (
            <div className="rounded" style={{ width: "200px", height: "200px", backgroundColor: "#ddd" }} />
          )}
        </div>

        <div className="mb-3">
          <strong>Sex:</strong>
          <p>{animalData.sex}</p>
        </div>

        <div className="mb-3">
          <strong>Breed:</strong>
          <p>{animalData.breed}</p>
        </div>

        <div className="mb-3">
          <strong>Species:</strong>
          <p>{animalData.species}</p>
        </div>

        <div className="mb-3">
          <strong>Birth Date:</strong>
          <p>{new Date(animalData.birthDate).toLocaleDateString()}</p>
        </div>

        <div className="mb-3">
          <strong>Bio:</strong>
          <p>{animalData.bio ? animalData.bio : "No bio available"}</p>
        </div>

        <div className="mb-3">
          <strong>Location:</strong>
          <p>{animalData.latitude ? `${animalData.latitude}, ${animalData.longitude}` : "Location not provided"}</p>
        </div>

        <div className="mb-3">
          <strong>Owners:</strong>
          <ul>
            {animalData.owners.length > 0 ? (
              animalData.owners.map((owner, index) => <li key={index}>{owner}</li>)
            ) : (
              <li>No owners assigned</li>
            )}
          </ul>
        </div>

        <div className="mb-3">
          <strong>Vet Assignments:</strong>
          <ul>
            {animalData.vetAssignments.length > 0 ? (
              animalData.vetAssignments.map((vet, index) => <li key={index}>{vet}</li>)
            ) : (
              <li>No vet assignments</li>
            )}
          </ul>
        </div>

        <div className="mb-3">
          <strong>Documents:</strong>
          <ul>
            {animalData.animalDocuments.length > 0 ? (
              animalData.animalDocuments.map((doc, index) => <li key={index}>{doc}</li>)
            ) : (
              <li>No documents</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
