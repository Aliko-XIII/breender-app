import React, { useEffect, useState } from 'react';
import { ApiResponse } from '../../types'; // Adjust path as needed
import { Link, useParams } from 'react-router-dom';
// Import the updated UserMention component
import { UserMention } from '../UserMention/UserMention'; // Adjust path!
// Import useUser to ensure context is available
import { useUser } from '../../context/UserContext'; // Adjust path!

interface AnimalProfileProps {
  getAnimal: (animalId: string) => Promise<ApiResponse>;
}

// Interface for the owner information needed by UserMention
interface OwnerInfo {
  id: string;
  name: string;
  email: string;
  pictureUrl?: string | null;
}

// Main data interface for the animal profile
interface AnimalProfileData {
  name: string;
  sex: 'MALE' | 'FEMALE';
  breed: string;
  species: string;
  bio?: string;
  birthDate: string;
  latitude?: number;
  longitude?: number;
  owners: OwnerInfo[]; // Array of objects conforming to OwnerInfo
}

export const AnimalProfile: React.FC<AnimalProfileProps> = ({ getAnimal }) => {
  const { id: animalId } = useParams<{ id: string }>();
  const [animalData, setAnimalData] = useState<AnimalProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure UserContext is initialized for UserMention to use
  useUser();

  useEffect(() => {
    const fetchAnimalProfile = async () => {
      if (!animalId) {
        setError("No Animal ID provided in URL.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await getAnimal(animalId);

        if (response.status === 200 && response.data) {
          // --- CRITICAL DATA MAPPING ---
          // Adjust the paths below based on your ACTUAL API response structure.
          // This example assumes:
          // ID:       ownerRelation.owner.user.id
          // Name:     ownerRelation.owner.user.userProfile.name
          // Email:    ownerRelation.owner.user.email
          // Picture:  ownerRelation.owner.user.userProfile.pictureUrl
          const mappedOwners: OwnerInfo[] = response.data.owners ? response.data.owners.map(
            (ownerRelation: any) => { // Use a specific type from your API if available
              const user = ownerRelation?.owner?.user;
              const profile = user?.userProfile;

              const userId = user?.id;
              const userName = profile?.name;
              const userEmail = user?.email; // Extract email
              const userPictureUrl = profile?.pictureUrl; // Extract picture URL

              // Validate that required fields (id, name, email) are present
              if (userId && userName && userEmail) {
                return {
                  id: userId,
                  name: userName,
                  email: userEmail, // Include email
                  pictureUrl: userPictureUrl || null // Include pictureUrl (default to null if missing)
                };
              } else {
                // Log a warning if data for an owner is incomplete
                console.warn('Incomplete owner data received (missing id, name, or email):', ownerRelation);
                return null; // Mark this entry as invalid
              }
            }
          ).filter((owner: any): owner is OwnerInfo => owner !== null) // Filter out invalid entries and confirm type
            : []; // Default to an empty array if response.data.owners is null/undefined
          // --- End Critical Data Mapping ---

          // Structure the final animal data state
          const data: AnimalProfileData = {
            name: response.data.name,
            sex: response.data.sex,
            breed: response.data.breed,
            species: response.data.species,
            bio: response.data.bio,
            birthDate: response.data.birthDate,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            owners: mappedOwners, // Assign the processed owner data
          };
          setAnimalData(data);
        } else {
          // Handle non-200 responses
          setError(response.message || `Failed to fetch data. Status: ${response.status}`);
        }
      } catch (err) {
        // Handle network or other errors during fetch
        console.error("Error fetching animal profile:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        // Ensure loading state is turned off
        setIsLoading(false);
      }
    };

    fetchAnimalProfile();
  }, [animalId, getAnimal]); // Dependencies for useEffect

  // --- Render Logic ---

  // Loading State
  if (isLoading) {
    return <div className="container mt-5 text-center">Loading animal data...</div>;
  }

  // Error State
  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  // Data Not Found State
  if (!animalData) {
    return <div className="container mt-5">Could not load animal profile.</div>;
  }

  // --- Helper Functions --- (Optional but recommended)
  const displaySex = (sex: 'MALE' | 'FEMALE'): string => {
    switch (sex) {
      case 'MALE': return 'Male';
      case 'FEMALE': return 'Female';
      default: return 'N/A';
    }
  };

  const displayBirthDate = (dateString: string): string => {
    if (!dateString) return 'Not available';
    try {
      // Format date based on locale
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error("Error parsing birth date:", e);
      return 'Invalid Date';
    }
  };

  // --- JSX Output ---
  return (
    <div className="container mt-5">
  
      {/* --- Action Panel --- */}
      <div className="d-flex justify-content-end mb-3">
        <Link to={`/animals/${animalId}`} className="btn btn-outline-primary me-2">
          View Profile
        </Link>
        <Link to={`/animals/${animalId}/create-record`} className="btn btn-primary">
          Create Record
        </Link>
        <Link to={`/animals/${animalId}/create-reminder`} className="btn btn-primary">
          Create Reminder
        </Link>
        <Link to={`/animals/${animalId}/upload-photo`} className="btn btn-primary">
          Upload Photo
        </Link>
      </div>
  
      {/* --- Animal Profile Card --- */}
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px", width: "100%" }}>
        <h1 className="text-center mb-4">{animalData.name}'s Profile</h1>
  
        <div className="mb-3">
          <strong>Species:</strong> <span className="ms-2">{animalData.species}</span>
        </div>
        <div className="mb-3">
          <strong>Breed:</strong> <span className="ms-2">{animalData.breed}</span>
        </div>
        <div className="mb-3">
          <strong>Sex:</strong> <span className="ms-2">{displaySex(animalData.sex)}</span>
        </div>
        <div className="mb-3">
          <strong>Birth Date:</strong> <span className="ms-2">{displayBirthDate(animalData.birthDate)}</span>
        </div>
        <div className="mb-3">
          <strong>Bio:</strong>
          <p className="mt-1" style={{ whiteSpace: 'pre-wrap' }}>{animalData.bio || "No bio available."}</p>
        </div>
        <div className="mb-3">
          <strong>Location:</strong>
          <p>{animalData.latitude && animalData.longitude ? `${animalData.latitude}, ${animalData.longitude}` : "Location not provided."}</p>
        </div>
  
        {/* --- Owners Section --- */}
        <div className="mb-3">
          <strong className="d-block mb-2">Owners:</strong>
          {animalData.owners.length > 0 ? (
            <div>
              {animalData.owners.map((owner) => (
                <UserMention
                  key={owner.id}
                  userId={owner.id}
                  userName={owner.name}
                  userEmail={owner.email}
                  userPictureUrl={owner.pictureUrl}
                />
              ))}
            </div>
          ) : (
            <p className="ms-1">No owners assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
  
};
