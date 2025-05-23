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
  isSterilized?: boolean;
  isAvailable?: boolean;
  customData?: Record<string, string>;
}

interface CustomField {
  id: string;
  key: string;
  value: string;
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
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#212121' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { featureType: 'poi.park', elementType: 'labels.text.stroke', stylers: [{ color: '#1b1b1b' }] },
    { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
    { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#4e4e4e' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f2f2f' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] }
  ];

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
            : [];          const data: AnimalProfileData = {
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
            isSterilized: response.data.isSterilized,
            isAvailable: response.data.isAvailable,
            customData: (() => {
              const cd = response.data.customData;
              if (!cd) return {};
              if (typeof cd === 'string') {
                try {
                  return JSON.parse(cd);
                } catch {
                  return {};
                }
              }
              return cd;
            })(),
          };setAnimalData(data);
          setFormData(data);
          
          // Initialize custom fields array
          const fieldsArray: CustomField[] = Object.entries(data.customData || {}).map(([key, value]) => ({
            id: `${Date.now()}-${Math.random()}`,
            key,
            value: String(value)
          }));
          setCustomFields(fieldsArray);
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

  // Helper function to convert custom fields array to object
  const customFieldsToObject = (fields: CustomField[]): Record<string, string> => {
    const result: Record<string, string> = {};
    fields.forEach(field => {
      if (field.key.trim()) {
        result[field.key] = field.value;
      }
    });
    return result;
  };

  // Helper function to update custom fields in formData
  const updateCustomFieldsInFormData = (fields: CustomField[]) => {
    const customDataObject = customFieldsToObject(fields);
    setFormData(prev => ({ ...prev, customData: customDataObject }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Skip handling isAvailable here as it has its own onChange handler
    if (e.target.name === 'isAvailable') return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!animalId || !isOwner) return;
    try {
      setIsLoading(true);
      // Remove owners from data sent to backend
      const { owners, ...dataToSendRaw } = formData;
      // Map pictureUrl to profilePicUrl if present
      const dataToSend = { ...dataToSendRaw } as any;
      if (dataToSend.pictureUrl !== undefined) {
        dataToSend.profilePicUrl = dataToSend.pictureUrl;
        delete dataToSend.pictureUrl;
      }
      if (dataToSend.latitude !== undefined) {
        dataToSend.latitude = Number(dataToSend.latitude);
      }
      if (dataToSend.longitude !== undefined) {
        dataToSend.longitude = Number(dataToSend.longitude);
      }
      // Stringify customData if present
      if (dataToSend.customData && typeof dataToSend.customData === 'object') {
        dataToSend.customData = JSON.stringify(dataToSend.customData);
      }
      await updateAnimal(animalId, dataToSend);
      // Ensure customData is always an object in UI state
      let updatedCustomData = dataToSend.customData;
      if (typeof updatedCustomData === 'string') {
        try {
          updatedCustomData = JSON.parse(updatedCustomData);
        } catch {
          updatedCustomData = {};
        }
      }
      setAnimalData({ ...animalData!, ...dataToSend, customData: updatedCustomData });
      setFormData({ ...formData, ...dataToSend, customData: updatedCustomData });
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

  return (    <div className="container mt-5">
      <div className="card shadow-lg p-3 mb-4 mx-auto" style={{ maxWidth: "800px", width: "100%" }}>
        <div className="row g-3">
          {/* Navigation Section */}
          <div className="col-12">
            <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
              <Link to="/animals" className="btn btn-outline-secondary">
                ← Back to Animals
              </Link>
            </div>
          </div>

          {/* Records Section */}
          <div className="col-md-6 col-lg-4">
            <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
              <h6 className="mb-2 fw-bold" style={{ color: 'var(--color-primary)' }}>
                📋 Records
              </h6>
              <div className="d-flex flex-column gap-1">
                <Link to={`/animals/${animalId}/records`} className="btn btn-sm btn-primary">
                  View Records
                </Link>
                <Link to={`/animals/${animalId}/records/create`} className="btn btn-sm btn-outline-primary">
                  + Create Record
                </Link>
              </div>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="col-md-6 col-lg-4">
            <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
              <h6 className="mb-2 fw-bold" style={{ color: 'var(--color-primary)' }}>
                ⏰ Reminders
              </h6>
              <div className="d-flex flex-column gap-1">
                <Link to={`/animals/${animalId}/reminders`} className="btn btn-sm btn-warning">
                  View Reminders
                </Link>
                <Link to={`/animals/${animalId}/reminders/create`} className="btn btn-sm btn-outline-warning">
                  + Create Reminder
                </Link>
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="col-md-6 col-lg-4">
            <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
              <h6 className="mb-2 fw-bold" style={{ color: 'var(--color-primary)' }}>
                📁 Media & Files
              </h6>
              <div className="d-flex flex-column gap-1">
                <Link to={`/animals/${animalId}/photos`} className="btn btn-sm btn-success">
                  View Photos
                </Link>
                <Link to={`/animals/${animalId}/documents`} className="btn btn-sm btn-info">
                  View Documents
                </Link>
              </div>
            </div>
          </div>

          {/* Upload Section - Only show if user is owner */}
          {isOwner && (
            <div className="col-md-6 col-lg-4">
              <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                <h6 className="mb-2 fw-bold" style={{ color: 'var(--color-primary)' }}>
                  ⬆️ Upload
                </h6>
                <div className="d-flex flex-column gap-1">
                  <Link to={`/animals/${animalId}/upload-photo`} className="btn btn-sm btn-outline-success">
                    + Upload Photo
                  </Link>
                  <Link to={`/animals/${animalId}/upload-document`} className="btn btn-sm btn-outline-info">
                    + Upload Document
                  </Link>
                </div>
              </div>
            </div>
          )}

          
        </div>
      </div><div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px", width: "100%" }}>
        {/* Profile Picture Section */}
        <div className="text-center mb-4">
          <img
            src={getProfilePicUrl(animalData.pictureUrl)}
            alt="Animal Avatar"
            className="rounded-circle mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          
          {isEditing && isOwner && (
            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
              <label htmlFor="animalPicUpload" className="btn btn-outline-primary btn-sm mb-0">
                Choose File
              </label>
              <input
                id="animalPicUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {selectedFile && (
                <span className="text-secondary small">
                  {selectedFile.name}
                </span>
              )}
              <button
                className="btn btn-primary btn-sm"
                onClick={handleUploadPic}
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="form-control text-center"
              style={{ 
                fontSize: "2rem", 
                fontWeight: "bold", 
                background: 'var(--color-bg-secondary)', 
                color: 'var(--color-text)', 
                border: '1px solid var(--color-border)' 
              }}
              placeholder="Animal Name"
            />
          ) : (
            <h1 className="mb-0">{animalData.name}'s Profile</h1>
          )}
        </div>        {/* Basic Information Section */}
        <div className="mb-4">
          <h5 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Basic Information</h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="form-control"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                  placeholder="Animal Name"
                />              ) : (
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{animalData.name}</p>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                Species
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="species"
                  value={formData.species || ""}
                  onChange={handleChange}
                  className="form-control"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                />              ) : (
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{animalData.species}</p>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                Breed
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="breed"
                  value={formData.breed || ""}
                  onChange={handleChange}
                  className="form-control"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                />
              ) : (
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{animalData.breed}</p>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                Sex
              </label>
              {isEditing ? (
                <select
                  name="sex"
                  value={formData.sex || ""}
                  onChange={handleChange}
                  className="form-control"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>              ) : (
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{displaySex(animalData.sex)}</p>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                Birth Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate ? formData.birthDate.slice(0, 10) : ""}
                  onChange={handleChange}
                  className="form-control"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                />
              ) : (
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{displayBirthDate(animalData.birthDate)}</p>
              )}
            </div>            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                Sterilized
              </label>
              {isEditing ? (
                <select
                  name="isSterilized"
                  value={formData.isSterilized === undefined ? '' : formData.isSterilized ? 'true' : 'false'}
                  onChange={e => setFormData({ ...formData, isSterilized: e.target.value === 'true' })}
                  className="form-control"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                >
                  <option value="">Select...</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>              ) : (
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{animalData.isSterilized === undefined ? 'Not specified' : animalData.isSterilized ? 'Yes' : 'No'}</p>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                Available for Partnership
              </label>
              {isEditing ? (
                <select
                  name="isAvailable"
                  value={formData.isAvailable === undefined ? '' : formData.isAvailable ? 'true' : 'false'}
                  onChange={e => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                  className="form-control"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                >
                  <option value="">Select...</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>              ) : (
                <p className="mb-0" style={{ color: 'var(--color-text)', fontWeight: '500' }}>{animalData.isAvailable === undefined ? 'Not specified' : animalData.isAvailable ? 'Yes' : 'No'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-4">
          <h5 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Biography</h5>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="form-control"
              rows={4}
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
              placeholder="Tell us about this animal..."
            />          ) : (
            <div className="p-3 rounded" style={{ background: 'var(--color-bg-secondary)', minHeight: '60px' }}>
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', lineHeight: '1.6' }}>
                {animalData.bio || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No biography available.</span>}
              </p>
            </div>
          )}
        </div>        {/* Location Section */}
        <div className="mb-4">
          <h5 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Location</h5>
          {isEditing ? (
            <>              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude ?? ""}
                    onChange={handleChange}
                    className="form-control"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                    placeholder="Latitude"
                    step="any"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude ?? ""}
                    onChange={handleChange}
                    className="form-control"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                    placeholder="Longitude"
                    step="any"
                  />
                </div>
              </div>
              <div className="rounded overflow-hidden mb-2" style={{ height: 300, width: '100%' }}>
                <LoadScript googleMapsApiKey={googleMapsApiKey}>
                  <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={formData.latitude && formData.longitude ? { lat: Number(formData.latitude), lng: Number(formData.longitude) } : mapCenter || { lat: 45.35, lng: 28.83 }}
                    zoom={13}
                    onClick={handleMapClick}
                    options={{ styles: darkMapStyle, streetViewControl: false }}
                  >
                    {formData.latitude && formData.longitude && (
                      <Marker position={{ lat: Number(formData.latitude), lng: Number(formData.longitude) }} />
                    )}
                  </GoogleMap>                </LoadScript>
              </div>
              <small style={{ color: 'var(--color-text-muted)' }}>💡 Click on the map to set the animal's location</small>
            </>
          ) : (
            <>
              {animalData.latitude && animalData.longitude ? (
                <>                  <div className="mb-3 p-3 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                    <div className="row g-2">
                      <div className="col-sm-6">
                        <strong style={{ color: 'var(--color-text)' }}>Latitude:</strong> <span style={{ color: 'var(--color-text)', fontWeight: '500' }}>{animalData.latitude}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong style={{ color: 'var(--color-text)' }}>Longitude:</strong> <span style={{ color: 'var(--color-text)', fontWeight: '500' }}>{animalData.longitude}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded overflow-hidden" style={{ height: 300, width: '100%' }}>
                    <LoadScript googleMapsApiKey={googleMapsApiKey}>
                      <GoogleMap
                        mapContainerStyle={{ height: '100%', width: '100%' }}
                        center={{ lat: animalData.latitude, lng: animalData.longitude }}
                        zoom={13}
                        options={{ styles: darkMapStyle, streetViewControl: false }}
                      >
                        <Marker position={{ lat: animalData.latitude, lng: animalData.longitude }} />
                      </GoogleMap>
                    </LoadScript>
                  </div>
                </>              ) : (
                <div className="text-center p-4 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                  <i style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>📍 Location not provided</i>
                </div>
              )}
            </>
          )}
        </div>        {/* Custom Fields Section */}
        <div className="mb-4">
          <h5 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Custom Fields</h5>
          {isEditing ? (
            <>
              {customFields.map((field, idx) => (
                <div className="card mb-3 border-0" key={field.id} style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="card-body p-3">                    <div className="row g-2">
                      <div className="col-md-5">
                        <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Field Name</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                          placeholder="e.g., Microchip ID"
                          value={field.key}
                          onChange={e => {
                            const updatedFields = [...customFields];
                            updatedFields[idx] = { ...field, key: e.target.value };
                            setCustomFields(updatedFields);
                            updateCustomFieldsInFormData(updatedFields);
                          }}
                        />
                      </div>                      <div className="col-md-5">
                        <label className="form-label fw-semibold" style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>Value</label>
                        <textarea
                          className="form-control"
                          style={{ 
                            background: 'var(--color-bg)', 
                            color: 'var(--color-text)', 
                            border: '1px solid var(--color-border)',
                            minHeight: '38px',
                            resize: 'vertical'
                          }}
                          placeholder="Enter value..."
                          value={field.value}
                          rows={1}
                          onChange={e => {
                            const updatedFields = [...customFields];
                            updatedFields[idx] = { ...field, value: e.target.value };
                            setCustomFields(updatedFields);
                            updateCustomFieldsInFormData(updatedFields);
                          }}
                          onInput={(e) => {
                            // Auto-resize textarea based on content
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.max(38, target.scrollHeight) + 'px';
                          }}
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        <button
                          className="btn btn-outline-danger w-100"
                          type="button"
                          onClick={() => {
                            const updatedFields = customFields.filter((_, i) => i !== idx);
                            setCustomFields(updatedFields);
                            updateCustomFieldsInFormData(updatedFields);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => {
                  const newField: CustomField = {
                    id: `${Date.now()}-${Math.random()}`,
                    key: "",
                    value: ""
                  };
                  const updatedFields = [...customFields, newField];
                  setCustomFields(updatedFields);
                  updateCustomFieldsInFormData(updatedFields);
                }}
              >
                + Add Custom Field
              </button>
            </>
          ) : (
            <>
              {animalData.customData && Object.keys(animalData.customData).length > 0 ? (
                <div className="row g-3">
                  {Object.entries(animalData.customData).map(([key, value]) => (
                    <div className="col-12" key={key}>
                      <div className="card border-0 h-100" style={{ background: 'var(--color-bg-secondary)' }}>
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">                              <h6 className="card-title mb-1 text-uppercase small fw-bold" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                                {key}
                              </h6>                              <p className="card-text mb-0" style={{ 
                                color: 'var(--color-text)', 
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.5',
                                maxWidth: '100%',
                                fontWeight: '500'
                              }}>
                                {String(value)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>              ) : (
                <div className="text-center p-4 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                  <i style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>🏷️ No custom fields added</i>
                </div>
              )}
            </>
          )}
        </div>        {/* Owners Section */}
        <div className="mb-4">
          <h5 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Owners</h5>
          {animalData.owners.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {animalData.owners.map((owner) => (
                <UserMention
                  key={owner.id}
                  userId={owner.id}
                  userName={owner.name}
                  userEmail={owner.email}
                  userPictureUrl={owner.pictureUrl}
                />
              ))}
            </div>          ) : (
            <div className="text-center p-4 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
              <i style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>👤 No owners assigned</i>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isOwner && (
          <div className="d-flex justify-content-center gap-2 pt-3 border-top">
            {isEditing ? (
              <>
                <button 
                  className="btn btn-success px-4" 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="btn btn-outline-secondary px-4" 
                  onClick={() => { 
                    setIsEditing(false); 
                    setFormData(animalData);
                    // Reset custom fields array when canceling
                    const fieldsArray: CustomField[] = Object.entries(animalData?.customData || {}).map(([key, value]) => ({
                      id: `${Date.now()}-${Math.random()}`,
                      key,
                      value: String(value)
                    }));
                    setCustomFields(fieldsArray);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                className="btn btn-primary px-4" 
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
