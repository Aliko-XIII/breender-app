import React, { useEffect, useState } from 'react';
import { ApiResponse } from '../../types';
import { useParams } from 'react-router-dom';

interface AnimalProfileProps {
  getAnimal: (animalId: string) => Promise<ApiResponse>;
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
}

export const AnimalProfile: React.FC<AnimalProfileProps> = ({ getAnimal }) => {
  const { id: animalId } = useParams<{ id: string }>();
  const [animalData, setAnimalData] = useState<AnimalProfileData | null>(null);

  useEffect(() => {
    // Fetch animal profile data from your API (replace with actual API call)
    const fetchAnimalProfile = async () => {
      try {
        const response = await getAnimal(animalId as string);
        console.log(response);
        const data: AnimalProfileData = {
          name: response.data.name,
          sex: response.data.sex,
          breed: response.data.breed,
          species: response.data.species,
          bio: response.data.bio,
          birthDate: response.data.birthDate,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          owners: response.data.owners? response.data.owners.map((owner: any) => owner.owner.user.userProfile.name) : [],
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
      </div>
    </div>
  );
};
