import React, { useEffect, useState } from "react";
import { getAnimal } from "../../api/animalApi";
import { requestPartnership } from "../../api/partnershipApi";
import { useNavigate } from "react-router-dom";

interface AnimalPreviewProps {
  animalId: string;
  myAnimalId: string;
  onClose?: () => void;
}

export const AnimalPreview: React.FC<AnimalPreviewProps> = ({ animalId, myAnimalId, onClose }) => {
  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAnimal(animalId)
      .then((res) => {
        if (res.status === 200) {
          setAnimal(res.data);
          setError(null);
        } else {
          setError("Could not load animal info.");
        }
      })
      .catch(() => setError("Could not load animal info."))
      .finally(() => setLoading(false));
  }, [animalId]);

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
    } catch (e) {
      setRequestError("Failed to request partnership.");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!animal) return null;

  return (
    <div className="card shadow p-3 mt-4" style={{ maxWidth: 400, margin: "0 auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0">Animal Info</h4>
        {onClose && (
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>&times;</button>
        )}
      </div>
      {animal.photo && (
        <img src={animal.photo} alt={animal.name} className="mb-3 rounded" style={{ width: 120, height: 120, objectFit: "cover" }} />
      )}
      <div>
        <strong>Name:</strong> {animal.name}
      </div>
      <div>
        <strong>Species:</strong> {animal.species}
      </div>
      <div>
        <strong>Breed:</strong> {animal.breed}
      </div>
      <div>
        <strong>Sex:</strong> {animal.sex}
      </div>
      <div>
        <strong>Birth Date:</strong> {animal.birthDate ? new Date(animal.birthDate).toLocaleDateString() : "-"}
      </div>
      {animal.bio && (
        <div className="mt-2">
          <strong>Bio:</strong> <span className="text-muted">{animal.bio}</span>
        </div>
      )}
      {requestSuccess ? (
        <div className="alert alert-success mt-3">Partnership request sent!</div>
      ) : (
        <button
          className="btn btn-primary mt-3 w-100"
          onClick={handleRequestPartnership}
          disabled={requesting || !myAnimalId}
        >
          {requesting ? "Requesting..." : "Request Partnership"}
        </button>
      )}
      {requestError && <div className="alert alert-danger mt-2">{requestError}</div>}
    </div>
  );
};
