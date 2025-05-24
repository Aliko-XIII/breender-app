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
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Helper to get full profile picture URL
const getProfilePicUrl = (url?: string | null) => {
  if (!url) return '/animal-placeholder.png';
  if (url.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
  }
  return url;
};

export const AnimalPreview: React.FC<AnimalPreviewProps> = ({ animalId, myAnimalId, onClose }) => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [myAnimal, setMyAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [myAnimalOwners, setMyAnimalOwners] = useState<AnimalOwner[]>([]);
  const [animalOwners, setAnimalOwners] = useState<AnimalOwner[]>([]);  const navigate = useNavigate();

  // Helper to display formatted birth date
  const displayBirthDate = (dateString?: string): string => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid Date';
    }
  };

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
  );  if (loading) return (
    <div className="d-flex justify-content-center align-items-center p-5 rounded-3 shadow-sm" style={{ 
      minHeight: 300,
      background: 'var(--color-bg-secondary)',
      maxWidth: 900,
      margin: '2rem auto',
      border: '1px solid var(--color-border)'
    }}>
      <div className="text-center">
        <div className="spinner-border mb-3" role="status" style={{ width: '3rem', height: '3rem', color: 'var(--color-primary)' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <div style={{ color: 'var(--color-text-secondary)' }}>Loading animal information...</div>
      </div>
    </div>
  );
    if (error) return (
    <div className="alert d-flex align-items-center mx-auto shadow-sm" style={{ 
      maxWidth: 500,
      margin: '2rem auto',
      borderRadius: '15px',
      border: '1px solid #dc3545',
      background: 'var(--color-bg-secondary)',
      color: '#ff6b6b'
    }}>
      <span className="me-2" style={{ fontSize: '24px' }}>❌</span>
      <div>
        <strong>Error:</strong> {error}
      </div>
    </div>
  );
  if (!animal) return null;
  const sexBadge = (sex: string) => sex === "MALE"
    ? <span className="badge" style={{ background: 'var(--color-primary)', color: 'white' }}>♂ Male</span>
    : sex === "FEMALE"
      ? <span className="badge" style={{ background: '#ff6b6b', color: 'white' }}>♀ Female</span>
      : null;// Comparison section
  const comparisonSection = myAnimal && (
    <div className="mb-4">      <div className="text-center mb-4 p-3 rounded-3" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
        <h4 className="mb-2" style={{ 
          color: 'var(--color-primary)',
          fontWeight: '700',
          fontSize: '24px'
        }}>
          🐾 Animal Partnership Preview
        </h4>
        <p className="small mb-0" style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Compare your animal with a potential partner</p>
      </div>
      <div className="row g-4 justify-content-center" style={{ maxWidth: 750, margin: '0 auto' }}>        {/* Your Animal Profile */}
        <div className="col-12 col-md-5">
          <div className="card h-100 shadow-lg border-2" style={{ borderRadius: '15px', overflow: 'hidden', borderColor: 'var(--color-primary)', background: 'var(--color-bg-secondary)' }}>
            <div className="card-body text-center p-4" style={{ background: 'var(--color-bg-secondary)' }}>
              <div className="position-relative mb-3">
                <img 
                  src={getProfilePicUrl(myAnimal.profilePicUrl)} 
                  alt={myAnimal.name} 
                  className="rounded-circle border shadow" 
                  style={{ 
                    width: 130, 
                    height: 130, 
                    objectFit: 'cover', 
                    background: 'var(--color-bg)', 
                    borderWidth: 4, 
                    borderColor: 'var(--color-primary)' 
                  }} 
                />
                <div className="position-absolute top-0 end-0 text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: '14px', background: 'var(--color-primary)' }}>
                  👤
                </div>
              </div>
              <h5 className="card-title mb-2" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{myAnimal.name}</h5>
              <div className="mb-3">{sexBadge(myAnimal.sex)}</div>
              <div className="mb-3">
                <span className="badge me-2 px-3 py-1" style={{ fontSize: '11px', background: 'var(--color-accent)', color: 'var(--color-bg)' }}>{myAnimal.species || '-'}</span>
                <span className="badge px-3 py-1" style={{ fontSize: '11px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>{myAnimal.breed || '-'}</span>
              </div>
              <div className="mb-2 small" style={{ color: 'var(--color-text)' }}><strong>🎂 Birth Date:</strong> {displayBirthDate(myAnimal.birthDate)}</div>
              {myAnimal.latitude && myAnimal.longitude && (
                <div className="mb-2 small" style={{ color: 'var(--color-text)' }}><strong>📍 Location:</strong> {myAnimal.latitude.toFixed(4)}, {myAnimal.longitude.toFixed(4)}</div>
              )}
              {myAnimal.bio && <div className="mt-3 small p-2 rounded" style={{ whiteSpace: 'pre-line', background: 'rgba(0,0,0,0.3)', color: 'var(--color-text-secondary)' }}>{myAnimal.bio}</div>}
              {renderOwners(myAnimalOwners)}
              <div className="mt-3 fw-bold badge px-3 py-2" style={{ fontSize: '12px', background: 'rgba(58, 134, 255, 0.2)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>
                ✨ Your Animal
              </div>
            </div>
          </div>
        </div>        {/* Distance and location info in the middle */}
        <div className="col-12 col-md-2 d-flex flex-column align-items-center justify-content-center">
          {myAnimal && animal && myAnimal.latitude && myAnimal.longitude && animal.latitude && animal.longitude && (
            <div className="text-center p-3 rounded-3 shadow-sm" style={{ background: 'var(--color-bg-secondary)', border: '2px solid var(--color-accent)' }}>
              <div className="mb-2" style={{ fontSize: '24px' }}>📏</div>
              <div className="fw-bold" style={{ fontSize: '12px', letterSpacing: '0.5px', color: 'var(--color-accent)' }}>DISTANCE</div>
              <div className="fw-bold mt-1" style={{ fontSize: '18px', color: 'var(--color-accent)' }}>
                {(getDistanceInMeters(myAnimal.latitude, myAnimal.longitude, animal.latitude, animal.longitude) / 1000).toFixed(1)} km
              </div>
              <div className="small mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {getDistanceInMeters(myAnimal.latitude, myAnimal.longitude, animal.latitude, animal.longitude)} meters
              </div>
            </div>
          )}
          {(!myAnimal?.latitude || !myAnimal?.longitude || !animal?.latitude || !animal?.longitude) && (
            <div className="text-center p-3 rounded-3" style={{ background: 'var(--color-bg)', border: '2px dashed var(--color-border)' }}>
              <div className="mb-2" style={{ fontSize: '24px' }}>📍</div>
              <div className="small" style={{ color: 'var(--color-text-secondary)' }}>Location data<br />not available</div>
            </div>
          )}
        </div>        {/* Partnerable Animal Profile */}
        <div className="col-12 col-md-5">
          <div className="card h-100 shadow-lg border-2" style={{ borderRadius: '15px', overflow: 'hidden', borderColor: '#ff6b6b', background: 'var(--color-bg-secondary)' }}>
            <div className="card-body text-center p-4" style={{ background: 'var(--color-bg-secondary)' }}>
              <div className="position-relative mb-3">
                <img 
                  src={getProfilePicUrl(animal.profilePicUrl)} 
                  alt={animal.name} 
                  className="rounded-circle border shadow" 
                  style={{ 
                    width: 130, 
                    height: 130, 
                    objectFit: 'cover', 
                    background: 'var(--color-bg)', 
                    borderWidth: 4, 
                    borderColor: '#ff6b6b' 
                  }} 
                />
                <div className="position-absolute top-0 end-0 text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: '14px', background: '#ff6b6b' }}>
                  💕
                </div>
              </div>
              <h5 className="card-title mb-2" style={{ color: '#ff6b6b', fontWeight: '700' }}>{animal.name}</h5>
              <div className="mb-3">{sexBadge(animal.sex)}</div>
              <div className="mb-3">
                <span className="badge me-2 px-3 py-1" style={{ fontSize: '11px', background: 'var(--color-accent)', color: 'var(--color-bg)' }}>{animal.species || '-'}</span>
                <span className="badge px-3 py-1" style={{ fontSize: '11px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>{animal.breed || '-'}</span>
              </div>
              <div className="mb-2 small" style={{ color: 'var(--color-text)' }}><strong>🎂 Birth Date:</strong> {displayBirthDate(animal.birthDate)}</div>
              {animal.latitude && animal.longitude && (
                <div className="mb-2 small" style={{ color: 'var(--color-text)' }}><strong>📍 Location:</strong> {animal.latitude.toFixed(4)}, {animal.longitude.toFixed(4)}</div>
              )}
              {animal.bio && <div className="mt-3 small p-2 rounded" style={{ whiteSpace: 'pre-line', background: 'rgba(0,0,0,0.3)', color: 'var(--color-text-secondary)' }}>{animal.bio}</div>}
              {renderOwners(animalOwners)}
              <div className="mt-3 fw-bold badge px-3 py-2" style={{ fontSize: '12px', background: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b', border: '1px solid #ff6b6b' }}>
                💕 Available for Partnership
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  return (
    <div className="shadow-lg p-4 mt-4" style={{ 
      maxWidth: 900, 
      margin: "0 auto", 
      position: 'relative',
      background: 'var(--color-bg)',
      borderRadius: '20px',
      border: '1px solid var(--color-border)'
    }}>
      {/* Back button in top left */}
      {!onClose && (
        <button
          className="btn position-absolute shadow-sm"
          style={{ 
            top: 20, 
            left: 20, 
            zIndex: 2,
            borderRadius: '12px',
            borderWidth: '2px',
            fontWeight: '600',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            border: '2px solid var(--color-border)'
          }}
          onClick={() => navigate(-1)}
        >
          <span style={{ fontSize: '16px' }}>←</span> Back
        </button>
      )}
      {comparisonSection}      {requestSuccess ? (
        <div className="alert mt-4 mx-auto shadow-sm d-flex align-items-center justify-content-center" style={{ 
          maxWidth: 400,
          borderRadius: '15px',
          border: '1px solid #10b981',
          background: 'var(--color-bg-secondary)',
          color: '#10b981',
          fontWeight: '600'
        }}>
          <span className="me-2" style={{ fontSize: '20px' }}>✅</span>Partnership request sent successfully!
        </div>
      ) : (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn px-5 py-3 shadow-lg"            style={{ 
              minWidth: 280,
              borderRadius: '15px',
              background: 'var(--color-primary)',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              color: 'white'
            }}
            onClick={handleRequestPartnership}
            disabled={requesting || !myAnimalId}
            onMouseEnter={(e) => {
              if (!requesting && myAnimalId) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(58, 134, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            }}
          >
            {requesting ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Sending Request...
              </span>
            ) : (
              <span>
                <span style={{ fontSize: '18px' }}>💕</span> Request Partnership
              </span>
            )}
          </button>
        </div>
      )}      {requestError && (
        <div className="alert mt-3 mx-auto shadow-sm d-flex align-items-center" style={{ 
          maxWidth: 400,
          borderRadius: '15px',
          border: '1px solid #ff6b6b',
          background: 'var(--color-bg-secondary)',
          color: '#ff6b6b',
          fontWeight: '600'
        }}>
          <span className="me-2" style={{ fontSize: '18px' }}>❌</span>{requestError}
        </div>
      )}
    </div>
  );
};
