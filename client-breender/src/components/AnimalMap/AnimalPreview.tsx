import React, { useEffect, useState } from "react";
import { getAnimal, getAnimalOwners } from "../../api/animalApi";
import { requestPartnership } from "../../api/partnershipApi";
import { getUser } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { AnimalOwner } from "../../types/owner";
import { Animal } from "../../types/animal";
import { UserMention } from "../UserMention/UserMention";

interface AnimalPreviewProps {
  animalId: string;
  myAnimalId: string;
  onClose?: () => void;
}

// Helper to calculate distance in meters between two lat/lng points
function getDistanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lat2 - lat1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const AnimalPreview: React.FC<AnimalPreviewProps> = ({ animalId, myAnimalId, onClose }) => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [myAnimal, setMyAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [myAnimalOwners, setMyAnimalOwners] = useState<AnimalOwner[]>([]);
  const [animalOwners, setAnimalOwners] = useState<AnimalOwner[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAnimal(animalId)
      .then((res) => {
        if (res.status === 200) {
          setAnimal(res.data);
          setError(null);
          // Fetch owners for the animal
          getAnimalOwners(animalId).then(async (ownersRes) => {
            if (ownersRes.status === 200) {
              // Fetch profile for each owner
              const ownersWithProfile = await Promise.all(
                ownersRes.data.map(async (owner: AnimalOwner) => {
                  if (!owner.profile) {
                    const userRes = await getUser(owner.id, true);
                    if (userRes.status === 200 && userRes.data.profile) {
                      return { ...owner, profile: userRes.data.profile };
                    }
                  }
                  return owner;
                })
              );
              setAnimalOwners(ownersWithProfile);
            } else setAnimalOwners([]);
          });
        } else {
          setError("Could not load animal info.");
        }
      })
      .catch(() => setError("Could not load animal info."))
      .finally(() => setLoading(false));
  }, [animalId]);

  useEffect(() => {
    if (!myAnimalId) return;
    getAnimal(myAnimalId)
      .then((res) => {
        if (res.status === 200) {
          setMyAnimal(res.data);
          // Fetch owners for my animal
          getAnimalOwners(myAnimalId).then(async (ownersRes) => {
            if (ownersRes.status === 200) {
              const ownersWithProfile = await Promise.all(
                ownersRes.data.map(async (owner: AnimalOwner) => {
                  if (!owner.profile) {
                    const userRes = await getUser(owner.id, true);
                    if (userRes.status === 200 && userRes.data.profile) {
                      return { ...owner, profile: userRes.data.profile };
                    }
                  }
                  return owner;
                })
              );
              setMyAnimalOwners(ownersWithProfile);
            } else setMyAnimalOwners([]);
          });
        } else {
          setMyAnimal(null);
          setMyAnimalOwners([]);
        }
      })
      .catch(() => {
        setMyAnimal(null);
        setMyAnimalOwners([]);
      });
  }, [myAnimalId]);

  const handleRequestPartnership = async () => {
    setRequesting(true);
    setRequestError(null);
    try {
      const res = await requestPartnership({ requesterAnimalId: myAnimalId, recipientAnimalId: animalId });
      if (res.status === 201 || res.status === 200) {
        setRequestSuccess(true);
      } else {
        setRequestError("Failed to request partnership.");
      }
    } catch {
      setRequestError("Failed to request partnership.");
    } finally {
      setRequesting(false);
    }
  };

  // Helper to render owners' info
  const renderOwners = (owners: AnimalOwner[]) => (
    <div className="mt-2">
      <div className="fw-bold small mb-1">Owner{owners.length > 1 ? 's' : ''}:</div>
      {owners.length === 0 && <div className="small text-muted">No owner info</div>}
      {owners.map((owner, idx) => (
        <UserMention
          key={owner.id || idx}
          userId={owner.id}
          userName={owner.profile?.name || owner.email}
          userEmail={owner.email}
          userPictureUrl={owner.profile?.pictureUrl}
          clickable
        />
      ))}
    </div>
  );

  if (loading) return <div className="d-flex justify-content-center align-items-center p-5" style={{ minHeight: 300 }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger d-flex align-items-center"><span className="me-2">❌</span>{error}</div>;
  if (!animal) return null;

  const sexBadge = (sex: string) => sex === "MALE"
    ? <span className="badge bg-primary">♂ Male</span>
    : sex === "FEMALE"
      ? <span className="badge bg-pink" style={{ backgroundColor: '#e83e8c' }}>♀ Female</span>
      : null;

  // Comparison section
  const comparisonSection = myAnimal && (
    <div className="mb-4">
      <h4 className="text-center mb-4">Animal Comparison</h4>
      <div className="row g-4 justify-content-center" style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Your Animal Profile */}
        <div className="col-12 col-md-5">
          <div className="card h-100 shadow border-primary border-2">
            <div className="card-body text-center">
              <img src={myAnimal.photo || "/animal-placeholder.png"} alt={myAnimal.name} className="rounded-circle border mb-3" style={{ width: 120, height: 120, objectFit: 'cover', background: '#f8f9fa', borderWidth: 3, borderColor: '#0d6efd' }} />
              <h5 className="card-title mb-1">{myAnimal.name}</h5>
              <div className="mb-2">{sexBadge(myAnimal.sex)}</div>
              <div className="mb-2">
                <span className="badge bg-secondary me-1">{myAnimal.species || '-'}</span>
                <span className="badge bg-light text-dark border">{myAnimal.breed || '-'}</span>
              </div>
              <div className="mb-2"><strong>Birth Date:</strong> {myAnimal.birthDate ? new Date(myAnimal.birthDate).toLocaleDateString() : '-'}</div>
              {myAnimal.latitude && myAnimal.longitude && (
                <div className="mb-2"><strong>Location:</strong> Lat: {myAnimal.latitude.toFixed(4)}, Lng: {myAnimal.longitude.toFixed(4)}</div>
              )}
              {myAnimal.bio && <div className="mt-2 small text-muted" style={{ whiteSpace: 'pre-line' }}>{myAnimal.bio}</div>}
              {renderOwners(myAnimalOwners)}
              <div className="mt-2 text-primary fw-bold">Your Animal</div>
            </div>
          </div>
        </div>
        {/* Distance and location info in the middle */}
        <div className="col-12 col-md-2 d-flex flex-column align-items-center justify-content-center">
          {myAnimal && animal && myAnimal.latitude && myAnimal.longitude && animal.latitude && animal.longitude && (
            <>
              <div className="mb-2 text-center">
                <strong>Distance</strong>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0d6efd' }}>
                  {getDistanceInMeters(myAnimal.latitude, myAnimal.longitude, animal.latitude, animal.longitude)} m
                </div>
              </div>
            </>
          )}
        </div>
        {/* Partnerable Animal Profile */}
        <div className="col-12 col-md-5">
          <div className="card h-100 shadow border-danger border-2">
            <div className="card-body text-center">
              <img src={animal.photo || "/animal-placeholder.png"} alt={animal.name} className="rounded-circle border mb-3" style={{ width: 120, height: 120, objectFit: 'cover', background: '#f8f9fa', borderWidth: 3, borderColor: '#dc3545' }} />
              <h5 className="card-title mb-1">{animal.name}</h5>
              <div className="mb-2">{sexBadge(animal.sex)}</div>
              <div className="mb-2">
                <span className="badge bg-secondary me-1">{animal.species || '-'}</span>
                <span className="badge bg-light text-dark border">{animal.breed || '-'}</span>
              </div>
              <div className="mb-2"><strong>Birth Date:</strong> {animal.birthDate ? new Date(animal.birthDate).toLocaleDateString() : '-'}</div>
              {animal.latitude && animal.longitude && (
                <div className="mb-2"><strong>Location:</strong> Lat: {animal.latitude.toFixed(4)}, Lng: {animal.longitude.toFixed(4)}</div>
              )}
              {animal.bio && <div className="mt-2 small text-muted" style={{ whiteSpace: 'pre-line' }}>{animal.bio}</div>}
              {renderOwners(animalOwners)}
              <div className="mt-2 text-danger fw-bold">Partnerable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card shadow p-4 mt-4" style={{ maxWidth: 900, margin: "0 auto", position: 'relative' }}>
      {/* Back button in top left */}
      {!onClose && (
        <button
          className="btn btn-sm btn-outline-secondary position-absolute"
          style={{ top: 16, left: 16, zIndex: 2 }}
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>
      )}
      {comparisonSection}
      {requestSuccess ? (
        <div className="alert alert-success mt-3 d-flex align-items-center justify-content-center"><span className="me-2">✅</span>Partnership request sent!</div>
      ) : (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-primary px-4"
            style={{ minWidth: 220 }}
            onClick={handleRequestPartnership}
            disabled={requesting || !myAnimalId}
          >
            {requesting ? <span><span className="spinner-border spinner-border-sm me-2" role="status" />Requesting...</span> : "Request Partnership"}
          </button>
        </div>
      )}
      {requestError && <div className="alert alert-danger mt-2 d-flex align-items-center"><span className="me-2">❌</span>{requestError}</div>}
    </div>
  );
};
