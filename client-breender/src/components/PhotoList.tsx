import React, { useEffect, useState } from 'react';
import { fetchAnimalPhotos, fetchUserPhotos } from '../api/photoApi';

interface Photo {
  id: string;
  photoUrl: string;
  title?: string;
}

interface PhotoListProps {
  animalId?: string;
  userId?: string;
}

const API_BASE_URL = "http://localhost:3000";

const PhotoList: React.FC<PhotoListProps> = ({ animalId, userId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      setError('');
      let result;
      if (userId) {
        result = await fetchUserPhotos(userId);
      } else if (animalId) {
        result = await fetchAnimalPhotos(animalId);
      } else {
        setError('No animal or user specified.');
        setLoading(false);
        return;
      }
      if (result.status === 200) {
        setPhotos(result.data);
      } else {
        setError('Failed to load photos.');
      }
      setLoading(false);
    };
    if (userId || animalId) loadPhotos();
  }, [animalId, userId]);

  if (loading) return <div>Loading photos...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!photos.length) return <div>No photos found for this animal.</div>;

  return (
    <div className="row g-3">
      {photos.map(photo => (
        <div className="col-6 col-md-4 col-lg-3" key={photo.id}>
          <div className="card h-100">
            <img
              src={API_BASE_URL + photo.photoUrl}
              alt={photo.title || 'Animal photo'}
              className="card-img-top"
              style={{ objectFit: 'cover', height: 200 }}
            />
            {photo.title && (
              <div className="card-body p-2">
                <div className="card-title small text-center">{photo.title}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoList;
