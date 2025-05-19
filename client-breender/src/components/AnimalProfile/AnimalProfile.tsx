import React, { useEffect, useState } from 'react';
import { ApiResponse } from '../../types';
import { Link, useParams } from 'react-router-dom';
import { UserMention } from '../UserMention/UserMention';
import { useUser } from '../../context/UserContext';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { uploadAnimalProfilePic } from '../../api/animalApi';

interface AnimalProfileProps {
  getAnimal: (animalId: string) => Promise<ApiResponse>;
  updateAnimal: (animalId: string, data: Partial<AnimalProfileData>) => Promise<ApiResponse>;
}

interface OwnerInfo {
  id: string;
  name: string;
  email: string;
  pictureUrl?: string | null;
}

interface AnimalProfileData {
  name: string;
  sex: 'MALE' | 'FEMALE';
  breed: string;
  species: string;
  bio?: string;
  birthDate: string;
  latitude?: number;
  longitude?: number;
  owners: OwnerInfo[];
  pictureUrl?: string | null;
}

export const AnimalProfile: React.FC<AnimalProfileProps> = ({ getAnimal, updateAnimal }) => {
  const { id: animalId } = useParams<{ id: string }>();
  const [animalData, setAnimalData] = useState<AnimalProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<AnimalProfileData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { userId: currentUserId } = useUser();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const googleMapsApiKey = 'AIzaSyBC_pASKr9NaZ__W6JQGTFM5_5q9lRqE4g'; // Consider moving to env
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const getProfilePicUrl = (url?: string | null) => {
    if (!url) return '/animal-placeholder.png';
    if (url.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
    }
    return url;
  };

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
          const mappedOwners: OwnerInfo[] = response.data.owners
            ? response.data.owners.map((ownerRelation: any) => {
                const user = ownerRelation?.owner?.user;
                const profile = user?.userProfile;
                const userId = user?.id;
                const userName = profile?.name;
                const userEmail = user?.email;
                const userPictureUrl = profile?.pictureUrl;
                if (userId && userName && userEmail) {
                  return {
                    id: userId,
                    name: userName,
                    email: userEmail,
                    pictureUrl: userPictureUrl || null,
                  };
                } else {
                  console.warn('Incomplete owner data:', ownerRelation);
                  return null;
                }
              }).filter((owner: any): owner is OwnerInfo => owner !== null)
            : [];
          const data: AnimalProfileData = {
            name: response.data.name,
            sex: response.data.sex,
            breed: response.data.breed,
            species: response.data.species,
            bio: response.data.bio,
            birthDate: response.data.birthDate,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            owners: mappedOwners,
            pictureUrl: response.data.pictureUrl,
          };
          setAnimalData(data);
          setFormData(data);
        } else {
          setError(response.message || `Failed to fetch data. Status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching animal profile:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnimalProfile();
  }, [animalId, getAnimal]);

  useEffect(() => {
    if (animalData && animalData.latitude && animalData.longitude) {
      setMapCenter({ lat: animalData.latitude, lng: animalData.longitude });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setMapCenter({ lat: 45.35, lng: 28.83 })
      );
    } else {
      setMapCenter({ lat: 45.35, lng: 28.83 });
    }
  }, [animalData]);

  const isOwner = animalData?.owners.some(owner => owner.id === currentUserId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!animalId || !isOwner) return;
    try {
      setIsLoading(true);
      // Remove owners from data sent to backend
      const { owners, ...dataToSendRaw } = formData;
      const dataToSend = { ...dataToSendRaw };
      if (dataToSend.latitude !== undefined && dataToSend.latitude !== "") {
        dataToSend.latitude = Number(dataToSend.latitude);
      }
      if (dataToSend.longitude !== undefined && dataToSend.longitude !== "") {
        dataToSend.longitude = Number(dataToSend.longitude);
      }
      await updateAnimal(animalId, dataToSend);
      setAnimalData({ ...animalData!, ...dataToSend });
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update animal profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isEditing || !e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData({ ...formData, latitude: lat, longitude: lng });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPic = async () => {
    if (!selectedFile || !animalId) return;
    setUploading(true);
    try {
      const res = await uploadAnimalProfilePic(animalId, selectedFile);
      if ((res.status === 200 || res.status === 201) && res.data.url) {
        setAnimalData(prev => prev ? { ...prev, pictureUrl: res.data.url } : prev);
        setFormData(prev => ({ ...prev, pictureUrl: res.data.url }));
        setSelectedFile(null);
        alert('Profile picture updated!');
      } else {
        alert('Failed to upload profile picture.');
      }
    } catch {
      alert('Error uploading profile picture.');
    } finally {
      setUploading(false);
    }
  };

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
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (isLoading) return <div className="container mt-5 text-center">Loading animal data...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!animalData) return <div className="container mt-5">Could not load animal profile.</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-3 mb-4 mx-auto" style={{ maxWidth: "700px", width: "100%" }}>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
            <Link to="/animals" className="btn btn-outline-secondary">Back</Link>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
            <span className="fw-bold">Records:</span>
            <Link to={`/animals/${animalId}/records/create`} className="btn btn-primary">Create Record</Link>
            <Link to={`/animals/${animalId}/records`} className="btn btn-primary">Records</Link>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
            <span className="fw-bold">Reminders:</span>
            <Link to={`/animals/${animalId}/reminders/create`} className="btn btn-primary">Create Reminder</Link>
            <Link to={`/animals/${animalId}/reminders`} className="btn btn-primary">View Reminders</Link>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="fw-bold">Uploads:</span>
            <Link to={`/animals/${animalId}/upload-photo`} className="btn btn-primary">Upload Photo</Link>
            <Link to={`/animals/${animalId}/upload-document`} className="btn btn-primary">Upload Document</Link>
            <Link to={`/animals/${animalId}/photos`} className="btn btn-outline-primary">View Photos</Link>
          </div>
        </div>
      </div>

      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="text-center mb-3">
          <img
            src={getProfilePicUrl(animalData.pictureUrl)}
            alt="Animal Avatar"
            className="rounded-circle"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          {isEditing && isOwner && (
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button
                className="btn btn-outline-primary btn-sm ms-2"
                onClick={handleUploadPic}
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}
        </div>
        <h1 className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="form-control text-center"
              style={{ fontSize: "2rem", fontWeight: "bold" }}
              placeholder="Animal Name"
            />
          ) : (
            `${animalData.name}'s Profile`
          )}
        </h1>

        {/* Editable fields for owners */}
        <div className="mb-3">
          <label><strong>Name:</strong></label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Animal Name"
            />
          ) : (
            <span className="ms-2">{animalData.name}</span>
          )}
        </div>
        <div className="mb-3">
          <label><strong>Species:</strong></label>
          {isEditing ? (
            <input
              type="text"
              name="species"
              value={formData.species || ""}
              onChange={handleChange}
              className="form-control"
            />
          ) : (
            <span className="ms-2">{animalData.species}</span>
          )}
        </div>
        <div className="mb-3">
          <label><strong>Breed:</strong></label>
          {isEditing ? (
            <input
              type="text"
              name="breed"
              value={formData.breed || ""}
              onChange={handleChange}
              className="form-control"
            />
          ) : (
            <span className="ms-2">{animalData.breed}</span>
          )}
        </div>
        <div className="mb-3">
          <label><strong>Sex:</strong></label>
          {isEditing ? (
            <select
              name="sex"
              value={formData.sex || ""}
              onChange={handleChange}
              className="form-control"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          ) : (
            <span className="ms-2">{displaySex(animalData.sex)}</span>
          )}
        </div>
        <div className="mb-3">
          <label><strong>Birth Date:</strong></label>
          {isEditing ? (
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate ? formData.birthDate.slice(0, 10) : ""}
              onChange={handleChange}
              className="form-control"
            />
          ) : (
            <span className="ms-2">{displayBirthDate(animalData.birthDate)}</span>
          )}
        </div>
        <div className="mb-3">
          <label><strong>Bio:</strong></label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="No bio available."
            />
          ) : (
            <p className="mt-1" style={{ whiteSpace: 'pre-wrap' }}>{animalData.bio || "No bio available."}</p>
          )}
        </div>
        <div className="mb-3">
          <label><strong>Location:</strong></label>
          {isEditing ? (
            <>
              <div className="row mb-2">
                <div className="col">
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude ?? ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Latitude"
                    step="any"
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude ?? ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Longitude"
                    step="any"
                  />
                </div>
              </div>
              <div style={{ height: 300, width: '100%', marginBottom: 8 }}>
                <LoadScript googleMapsApiKey={googleMapsApiKey}>
                  <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={formData.latitude && formData.longitude ? { lat: Number(formData.latitude), lng: Number(formData.longitude) } : mapCenter || { lat: 45.35, lng: 28.83 }}
                    zoom={13}
                    onClick={handleMapClick}
                  >
                    {formData.latitude && formData.longitude && (
                      <Marker position={{ lat: Number(formData.latitude), lng: Number(formData.longitude) }} />
                    )}
                  </GoogleMap>
                </LoadScript>
              </div>
              <small>Click on the map to set the animal's location.</small>
            </>
          ) : (
            <>
              <p>{animalData.latitude && animalData.longitude ? `${animalData.latitude}, ${animalData.longitude}` : "Location not provided."}</p>
              {animalData.latitude && animalData.longitude && (
                <div style={{ height: 300, width: '100%' }}>
                  <LoadScript googleMapsApiKey={googleMapsApiKey}>
                    <GoogleMap
                      mapContainerStyle={{ height: '100%', width: '100%' }}
                      center={{ lat: animalData.latitude, lng: animalData.longitude }}
                      zoom={13}
                      options={{ streetViewControl: false }}
                    >
                      <Marker position={{ lat: animalData.latitude, lng: animalData.longitude }} />
                    </GoogleMap>
                  </LoadScript>
                </div>
              )}
            </>
          )}
        </div>

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

        {/* Edit/Save buttons for owners */}
        {isOwner && (
          <div className="mt-3">
            {isEditing ? (
              <>
                <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData(animalData); }}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
